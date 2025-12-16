import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_BASE_API
const axiosInstance = axios.create({
    baseURL:baseURL,
    headers:{
        "Content-Type":'application/json',
    }
})

//request interceptor
axiosInstance.interceptors.request.use(function(config){
    const accessToken=localStorage.getItem('accessToken')
    if(accessToken){
        config.headers['Authorization']=`Bearer ${accessToken}`
    }
    console.log(config);
    
    return config;
},

    function(error){
        return Promise.reject(error);
    })
//response interceptr
axiosInstance.interceptors.response.use(
    function(response){
         return response;
        
        },
    async function(error){
        const orignalrequest = error.config
        if(error.response.status === 401 && !orignalrequest.retry){
            orignalrequest.retry=true
             const refreshToken =localStorage.getItem('refreshToken')  
            try{
              const response =await axiosInstance.post('/token/refresh/',{refresh:refreshToken})
                 localStorage.setItem('accessToken',response.data.access)
                 orignalrequest.headers['Authorization']=`Bearer ${response.data.access}`
                 return axiosInstance(orignalrequest)                            
             }
            catch(error){
              localStorage.removeItem('refreshToken')
              localStorage.removeItem('accessToken')

            }
        }
        return Promise.reject(error)
    }
)
export default axiosInstance