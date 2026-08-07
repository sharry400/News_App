import React from 'react'

const NewItems = (props) => {
    let { title, description, imageurl, newsurl, author, date, source } = props;
    return (
      <div className="news-card-wrapper">
        <div className="card news-card h-100">
            <span className="badge rounded-pill bg-danger news-badge">{source}</span>
            <div className="news-image-wrapper">
                            {(() => {
                const defaultImg = "https://investorplace.com/wp-content/uploads/2025/07/stock-chart-buy.png";
                return (
                  <img
                    src={imageurl || defaultImg}
                    className="card-img-top img-fluid"
                    alt={title || 'news'}
                    loading="lazy"
                    onError={(e) => {
                      if (e && e.target) {
                        // prevent infinite loop if default image also fails
                        if (e.target.src !== defaultImg) {
                          e.target.onerror = null
                          e.target.src = defaultImg
                        }
                      }
                    }}
                  />
                )
              })()}
            </div>
          <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <p className="card-text">{description}...</p>
            <p className="card-text"><small className="text-body-secondary">By {!author ? "Unknown" : author} on {new Date(date).toGMTString()}</small></p>
            <a href={newsurl} target='blank' className="btn btn-sm btn-dark">Read More</a>
          </div>
        </div>
      </div>
    )
}
export default NewItems
