import React, { useCallback, useEffect, useRef, useState } from 'react'
import NewItems from './NewItems'
import Spinner from './Spinner'
import PropTypes from 'prop-types'

const News = (props) => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const sentinelRef = useRef(null)
  const observerRef = useRef(null)

  const capFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const updateNews = useCallback(
    async (pageNumber = 1) => {
      const totalPages = Math.max(1, Math.ceil(totalResults / props.pageSize))

      if (pageNumber > totalPages && pageNumber !== 1) {
        return
      }

      const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apikey}&page=${pageNumber}&pageSize=${props.pageSize}`
      setLoading(true)

      const data = await fetch(url)
      const parsedData = await data.json()
      console.log('API Response:', parsedData)

      setArticles((prevArticles) =>
        pageNumber === 1 ? parsedData.articles : prevArticles.concat(parsedData.articles)
      )
      setTotalResults(parsedData.totalResults)
      setLoading(false)
      setPage(pageNumber)
    },
    [props.category, props.country, props.pageSize, props.apikey, totalResults]
  )

  const fetchMoreData = useCallback(() => {
    if (loading) {
      return
    }

    const totalPages = Math.max(1, Math.ceil(totalResults / props.pageSize))
    if (page >= totalPages) {
      return
    }

    updateNews(page + 1)
  }, [loading, totalResults, page, props.pageSize, updateNews])

  useEffect(() => {
    updateNews(1)
  }, [updateNews])

  // Debug: expose loaded count in console when articles change
  useEffect(() => {
    console.log(`Loaded articles: ${articles.length} / ${totalResults}`)
  }, [articles.length, totalResults])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting) {
          console.log('IntersectionObserver: sentinel is visible', { loading })
        }
        if (entry.isIntersecting && !loading) {
          console.log('IntersectionObserver: triggering fetchMoreData()')
          fetchMoreData()
        }
      },
      {
        root: null,
        threshold: 0.1,
      }
    )

    observer.observe(sentinel)
    observerRef.current = observer

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [fetchMoreData, loading])

  return (
    <div className="container my-3">
      <h1 className="my-3 text-center" style={{ margin: '55px 0px' }}>
        NewsMonkey - Top Headlines on {capFirstLetter(props.category)}
      </h1>
      <div className="text-center mb-2" aria-live="polite">
        <small className="text-muted">Showing {articles.length} of {totalResults} results</small>
      </div>
      <div className="container">
        <div className="row">
          {articles?.map((element) => {
            return (
              <div className="col-sm-12 col-md-6 col-lg-4 mb-3" key={element.url}>
                <NewItems
                  imageurl={element.urlToImage}
                  title={element.title ? element.title.slice(0, 45) : ''}
                  description={element.description ? element.description.slice(0, 88) : ''}
                  newsurl={element.url}
                  author={element.author}
                  date={element.publishedAt}
                  source={element.source.name}
                />
              </div>
            )
          })}
        </div>

        {loading ? <Spinner /> : null}
        <div ref={sentinelRef} style={{ height: '1px' }}></div>
      </div>
    </div>
  )
}

News.defaultProps = {
  country: 'us',
  pageSize: 8,
  category: 'general',
}

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
  apikey: PropTypes.string,
}

export default News