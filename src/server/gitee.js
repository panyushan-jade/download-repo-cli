import Server from './index.js';


class Gitee extends Server {
    constructor(token){
        super('https://gitee.com/api/v5',token)
    }
    searchRepositories(params){
        return this.instance.get('/search/repositories',{params})
    }
}

export default Gitee;