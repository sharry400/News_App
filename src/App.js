import './App.css';
import Navbar from './Components/Navbar.js';
import News from './Components/News.js';

import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
  const pageSize = 15;
  const apikey = process.env.REACT_APP_NEWS_API;

  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<News key="general" pageSize={pageSize} apikey={apikey} country="us" category='general'/>} />
          <Route path='/business' element={<News key="business" pageSize={pageSize} apikey={apikey} country="us" category='business'/>} />
          <Route path='/entertainment' element={<News key="entertainment" pageSize={pageSize} apikey={apikey} country="us" category='entertainment'/>} />
          <Route path='/general' element={<News key="general" pageSize={pageSize} apikey={apikey} country="us" category='general'/>} />
          <Route path='/health' element={<News key="health" pageSize={pageSize} apikey={apikey} country="us" category='health'/>} />
          <Route path='/science' element={<News key="science" pageSize={pageSize} apikey={apikey} country="us" category='science'/>} />
          <Route path='/sports' element={<News key="sports" pageSize={pageSize} apikey={apikey} country="us" category='sports'/>} />
          <Route path='/technology' element={<News key="technology" pageSize={pageSize} apikey={apikey} country="us" category='technology'/>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App