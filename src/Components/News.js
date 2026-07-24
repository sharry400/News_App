import React, { Component } from 'react'
import NewItems from './NewItems'
import Spinner from './Spinner';
import PropTypes from 'prop-types'

export default class News extends Component {
  static defaultProps = {
    country: 'us',
    pageSize: 8,
    category: 'general'
  }

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
  }

  CapFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0
    }
    this.sentinelRef = React.createRef();
    document.title = `${this.CapFirstLetter(this.props.category)} - NewsMonkey`
  }

  async updateNews(page = this.state.page) {
    const totalPages = Math.ceil(this.state.totalResults / this.props.pageSize) || 1;

    if (page > totalPages && page !== 1) {
      return;
    }

    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=57ac4597395240879203fe891d6298a3&page=${page}&pageSize=${this.props.pageSize}`
    this.setState({ loading: true })

    let data = await fetch(url)
    let parseddata = await data.json()
    console.log("API Response:", parseddata)

    this.setState((prevState) => ({
      articles: page === 1 ? parseddata.articles : prevState.articles.concat(parseddata.articles),
      totalResults: parseddata.totalResults,
      loading: false,
      page: page
    }))
  }

  async componentDidMount() {
    this.updateNews(1);

    if (this.sentinelRef.current) {
      this.observer = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !this.state.loading) {
          this.fetchMoreData();
        }
      }, {
        root: null,
        threshold: 0.1
      });

      this.observer.observe(this.sentinelRef.current);
    }
  }

  componentWillUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  fetchMoreData = async () => {
    if (this.state.loading) {
      return;
    }

    const totalPages = Math.ceil(this.state.totalResults / this.props.pageSize);
    if (this.state.page >= totalPages) {
      return;
    }

    const nextPage = this.state.page + 1;
    this.updateNews(nextPage);
  }

  render() {
    return (
      <div className="container my-3">
        <h1 className='my-3 text-center' style={{ margin: '35px 0px' }}>NewsMonkey - Top Headlines on {this.CapFirstLetter(this.props.category)}</h1>
        <div className='container'>
          <div className='row'>
            {this.state.articles?.map((element) => {
              return <div className="col-md-4" key={element.url}>
                <NewItems
                  imageurl={element.urlToImage}
                  title={element.title ? element.title.slice(0, 45) : ""}
                  description={element.description ? element.description.slice(0, 88) : ""}
                  newsurl={element.url} author={element.author} date={element.publishedAt}
                  source={element.source.name}
                />
              </div>
            })}
          </div>

          {this.state.loading ? <Spinner /> : null}
          <div ref={this.sentinelRef} style={{ height: '1px' }}></div>
        </div>
      </div>
    )
  }
}