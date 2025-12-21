import axios from 'axios'
import React, { useEffect, useState } from 'react'
import axiosInstance from '../../axiosinstancs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const Dashboard = () => {
  const[ticker,setTicker]=useState('')
  const[error,setError]=useState()
  const[loading,setLoading]=useState(false)
  const[plot,setPlot]=useState()
  const[ma100,setMA100]=useState()
  const[ma200,setMA200]=useState()
  const[pred,setPred]=useState()
  const[mse,setMse]=useState()
  const[rmse,setRMse]=useState()
  const[r2,setR2]=useState()
    useEffect(()=>{
        const fetchProtectedData=async ()=>{
            try{
            const response = await axiosInstance.get('/protected-view/')
            console.log('Success:',response.data);
          
            }catch(error){
                console.error('Error Fetching Data',error)
            }
        }
        fetchProtectedData();
    },[])
    const handleSubmit=async(e)=>{
      e.preventDefault();
      setLoading(true)
      try{
         const response=await axiosInstance.post('/predict/',{
          ticker : ticker
         });
         console.log(response.data);
          //Set Plot
          const backendRoot=import.meta.env.VITE_BACKEND_ROOT
          const plotURL=`${backendRoot}${response.data.plot_img}`
          const ma100URL=`${backendRoot}${response.data.plot_100_dma}`
          const ma200URL=`${backendRoot}${response.data.plot_200_dma}`
          const predictionURL=`${backendRoot}${response.data.plot_prediction}`
          // console.log(plotURL);
          setPlot(plotURL);
          setMA100(ma100URL);
          setMA200(ma200URL);
          setPred(predictionURL);
          setMse(response.data.mse);
          setRMse(response.data.rmse);
          setR2(response.data.r2);
          
           if(response.data.error){
              setError(response.data.error)
            }
      }
      catch(error){
        console.error("ERROR",error);
        

      }finally{
        setLoading(false)
      }

    }
  return (
   <>
  <div className="container">
    <div className="row justify-content-center">
      <div className="col-md-8">
        <form onSubmit={handleSubmit}>
          
          <div className="input-group google-search">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Stock Ticker"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
            />
            <button className="btn btn-info" type="submit">
             {loading ? (
                      <span><FontAwesomeIcon icon={faSpinner} spin /> Loading in..</span>
                    )
                    :'See Prediction'} 
            </button>
          </div>

          {error && (
            <small className="text-danger d-block mt-1">
              {error}
            </small>
          )}

        </form>
      </div>
      {/* {%print Prediction PLot%} */}
      {pred && (
           <div className="prediction mt-5">
        <div className="p-3">
          {plot && (
            <img src={plot} alt="" style={{maxWidth:'100%'}} />
          )}
        </div>
        <div className="p-3">
          {ma100 && (
             <img src={ma100} alt="" style={{maxWidth:'100%'}} />
          )}
        </div>
        <div className="p-3">
          {ma100 && (
             <img src={ma200} alt="" style={{maxWidth:'100%'}} />
          )}
        </div>
        <div className="p-3">
          {ma100 && (
             <img src={pred} alt="" style={{maxWidth:'100%'}} />
          )}
        </div>
        <div className="text-light p-3">
         <h4>Model Evaluation</h4>
         <p>Means Squared Error (MSE): {mse}</p>
         <p>ROOT Means Squared Error (RMSE): {rmse}</p>
         <p>R Squared Error (R2): {r2}</p>
        </div>
      </div>
      )}
    
    </div>
  </div>
</>


  )
}

export default Dashboard