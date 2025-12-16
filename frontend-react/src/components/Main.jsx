import React from 'react'
import Button from './Button'
import Header from './Header'
import Footer from './Footer'
const Main = () => {
  return (
    <>
    <div className="container">
    <div className="p-5 text-center bg-light-dark rounded snake-border mt-5">
        <h1 className=' text-light'>StockForecast Portal</h1>
        <h2 className=' text-light'>"Predicting stocks with smart analytics"</h2>
        <p className='text-light lead'>
          StockForecast is an AI-powered platform that provides real-time stock market predictions and insights. By analyzing historical data and market trends, it helps users make smarter, data-driven investment decisions with confidence and ease. It simplifies investing, guiding both beginners and experienced traders to maximize their financial potential.
          StockForecast also empowers investors to make informed decisions quickly, minimizing risks while maximizing potential returns. By combining cutting-edge AI technology with practical financial insights, it bridges the gap between complex stock market data and actionable investment strategies.
        </p>
          <Button text='Explore Now' class='btn-outline-info' url="/dashboard" />
    </div>
    </div>
    
    </>
  )
}

export default Main