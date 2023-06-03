import Server from './index.js';


class Github extends Server {
    constructor(token){
        super('https://api.github.com',token)
    }
    searchRepositories(params){
        return this.instance.get('/search/repositories',{params})
    }
    searchTags(fullName){
        return this.instance.get(`/repos/${fullName}/tags`,{per_page:100})
    }
}

export default Github;