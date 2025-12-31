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
    <div className="min-h-screen flex flex-col items-center justify-start px-4">

  {/* FORM SECTION */}
  <form
    onSubmit={fetchtopStock}
    className="w-full max-w-xl mt-24 text-center"
  >
    <h1 className="text-3xl font-bold text-gray-400 mb-6">
      Enter Number (MAX = 200) for Top Active Stock
    </h1>

    <div className="flex items-center gap-2 justify-center">
      <input
        type="number"
        min="1"
        className="w-full px-4 py-2 text-gray-400 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Enter Numeric Value to Get top stock"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
      />

      <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        {loading ? (
          <>
            <FontAwesomeIcon icon={faSpinner} spin /> Loading..
          </>
        ) : (
          "Go"
        )}
      </button>
    </div>
  </form>

  {/* RESULT SECTION */}
  <div className="w-full max-w-6xl mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">

    {topglobal && (
      <div className="bg-gray-400 text-white p-4 rounded min-h-96">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Top {number} Most Active Stocks (Global)
        </h1>

        {error && <p className="text-red-600">{error}</p>}

        <ul className="text-gray-900 space-y-2 overflow-y-auto max-h-96">
          {topstock.map((stock, index) => (
            <li key={index} className="bg-white rounded p-2">
              <b>{index + 1}. {stock.symbol}</b> — {stock.name}
              <div>Price: {stock.price}</div>
              <div>Change: {stock.change_percent?.toFixed(2)}%</div>
            </li>
          ))}
        </ul>
      </div>
    )}

    {topind && (
      <div className="bg-gray-400 text-white p-4 rounded min-h-96">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Top {number} Most Active Stocks (India)
        </h1>

        {error && <p className="text-red-600">{error}</p>}

        <ul className="text-gray-900 space-y-2 overflow-y-auto max-h-96">
          {indtopstock.map((stock, index) => (
            <li key={index} className="bg-white rounded p-2">
              <b>{index + 1}. {stock.symbol}</b> — {stock.name}
              <div>Price: {stock.price}</div>
              <div>Change: {stock.change_percent?.toFixed(2)}%</div>
            </li>
          ))}
        </ul>
      </div>
    )}

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
