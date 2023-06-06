import axios from 'axios';

class Server{
    constructor(baseURL,token){
        this.instance = axios.create({
            baseURL,
            timeout: 3000,
            headers: token ? {'Authorization': `Bearer ${token}`} : null
          });
          this.instance.interceptors.response.use((response) => {
            return response.data
          },(error) => {
            return Promise.reject(error);
          })
    }
    searchTags(fullName){
        return this.instance.get(`/repos/${fullName}/tags`,{per_page:100})
    }
    
}

export default Server;