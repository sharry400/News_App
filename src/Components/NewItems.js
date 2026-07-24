import React, { Component } from 'react'

export default class NewItems extends Component {
  render() {
    let { title, description, imageurl, newsurl, author, date, source } = this.props;
    return (
      <div className="news-card-wrapper">
        <div className="card news-card h-100">
          <span className="badge rounded-pill bg-danger news-badge">{source}</span>
          <img src={!imageurl ? "https://investorplace.com/wp-content/uploads/2025/07/stock-chart-buy.png" : imageurl} className="card-img-top" alt="..." />
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
}
