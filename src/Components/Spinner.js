import React, { Component } from 'react'
import spinner from './808.gif'

export class Spinner extends Component {
  render() {
    return (
      <div className="text-center">
        <img src={spinner} alt='808'/>
      </div>
    )
  }
}

export default Spinner