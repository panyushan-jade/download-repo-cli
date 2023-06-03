import axios from 'axios';

class Server{
    constructor(baseURL,token){
        this.instance = axios.create({
            baseURL,
            timeout: 3000,
            headers: {'Authorization': `Bearer ${token}`}
          });
          this.instance.interceptors.response.use((response) => {
            return response.data
          },(error) => {
            return Promise.reject(error);
          })
    }
    
}

export default Server;