import React, { useState, useEffect } from "react";
import Button from "./Button";
import axiosInstance from "../axiosinstancs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
const Main = () => {
  const [topstock, setTopStock] = useState([]);
  const [indtopstock, setIndTopStock] = useState([]);
  const [number, setNumber] = useState();
  const[loading,setLoading]=useState(false)
  const[topglobal,setTopGlobal]=useState(false)
  const[topind,setTopInd]=useState(false)
  const [error, setError] = useState(null);

    const fetchtopStock = async (e) => {
     e.preventDefault();
     if(!number){
      setError('Please Enter Number');
      return;
     }
      try {
        setLoading(true)
        setError(null)
        const res = await axiosInstance.get("/top-stocks/",{
          params:{
            number:number,
          }
        });
        setTopStock(res.data.top100_worldwide);
        console.log(res.data);
        setIndTopStock(res.data.Indiatop20);
        setTopGlobal(true)
        setTopInd(true)
      } catch (error) {
        setError("Failed to load due to server error");
      }
      finally{
        setLoading(false)
      }
    };
  return (
    <>
      <div className="container mb-11">
        <div className="p-5 text-center bg-light-dark rounded snake-border mt-5">
          <h1 className=" text-light">StockForecast Portal</h1>
          <h2 className=" text-light">
            "Predicting stocks with smart analytics"
          </h2>
          <p className="text-light lead">
            StockForecast is an AI-powered platform that provides real-time
            stock market predictions and insights. By analyzing historical data
            and market trends, it helps users make smarter, data-driven
            investment decisions with confidence and ease. It simplifies
            investing, guiding both beginners and experienced traders to
            maximize their financial potential. StockForecast also empowers
            investors to make informed decisions quickly, minimizing risks while
            maximizing potential returns. By combining cutting-edge AI
            technology with practical financial insights, it bridges the gap
            between complex stock market data and actionable investment
            strategies.
          </p>
          <Button
            text="Explore Now"
            class="btn-outline-info"
            url="/dashboard"
          />
        </div>
      </div>
                    <div className="w-fit items-center ml-72">
      <form onSubmit={fetchtopStock} >
        <h1 className="text-center text-3xl font-bold text-gray-400 mt-80">Enter Number(MAX=200) for Top Active Stock</h1>
          <div className="input-group google-search">
          <input
            type="number"
            min="1"
            className=" form-control "
            placeholder="Enter Numeric Value to Get top stock"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
          {loading ? (
            <button type="submit" className="btn btn-info ">
              <FontAwesomeIcon icon={faSpinner} spin /> Loading ..
            </button>
          ) : (
            <button type="submit"  className="btn btn-info  ">
              Go
            </button>
          )}
        </div>
      </form>
        <div className="flex gap-4 p-4">
      {topglobal ? (
        <div className="flex-1 bg-gray-400 text-white text-center p-4 rounded min-h-96">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 ">
            Top {number} Most Active Stocks (Global)
          </h1>
          {error && <p className="text-red-600">{error}</p>}
          <ul className="text-left text-gray-900 space-y-2 overflow-y-scroll max-h-100">
            {topstock.map((stock, index) => (
              <li key={index} className="bg-white rounded p-2">
                <b>
                  {index + 1}. {stock.symbol}
                </b>{" "}
                — {stock.name}
                <div>Price: {stock.price}</div>
                <div>Change: {stock.change_percent?.toFixed(2)}%</div>
              </li>
            ))}
          </ul>
        </div>
        )
      :
        (<div className="text-red">{error}</div> )}
   
{topind ? (
        <div className="flex-1 bg-gray-400 text-white text-center p-4 rounded">
          <h1 className="text-4xl font-bold text-gray-900 leading-tight tracking-tight mb-4">
            Top {number} Stock Most Acitve Stock India
          </h1>
          {error && <p className="text-red-600">{error}</p>}
          <ul className="text-left text-gray-900 space-y-2 overflow-y-scroll max-h-100">
            {indtopstock.map((stock, index) => (
              <li key={index} className="bg-white rounded p-2">
                <b>
                  {index + 1}. {stock.symbol}
                </b>{" "}
                — {stock.name}
                <div>Price: {stock.price}</div>
                <div>Change: {stock.change_percent?.toFixed(2)}%</div>
              </li>
            ))}
          </ul>
        </div>
          ): 
        (<div className="text-red">{error}</div> )}
        </div>
        </div>
      <div className="p-5 text-center bg-light-dark rounded  mt-5 text-white">
        TRENDY NEWS <hr />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam qui
        facilis ut nulla fuga, suscipit quidem saepe magnam eveniet. Nemo
        dolorem consequatur nisi voluptatem. Ea dolor qui quis commodi unde
        voluptatum iure sunt dolorum quaerat, veniam iusto nam enim cum
        cupiditate accusamus laboriosam molestiae, vitae iste quia perspiciatis.
        Omnis pariatur quidem temporibus reiciendis laudantium exercitationem
        delectus culpa, consequuntur architecto quas aut quos in impedit quis. A
        qui maiores quod temporibus dolores quam rerum ratione ipsum, labore
        dignissimos amet saepe tempora doloribus incidunt quisquam, sequi natus!
        Exercitationem, officiis? Tempora quasi dolore itaque illo, quaerat sit
        placeat culpa sed nesciunt totam incidunt nihil officiis fugit. Quod eos
        mollitia optio excepturi qui consequatur consectetur ex possimus!
        Aliquam culpa dolorem sunt minus maxime dicta quis, blanditiis
        perspiciatis quam libero dignissimos corporis vero sit, soluta inventore
        eum tempora consequatur! Facere ut reiciendis sequi quae, harum
        recusandae?5
      </div>
    </>
  );
};

export default Main;
