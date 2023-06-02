import Server from './index.js';


class Gitee extends Server {
    constructor(token){
        super('https://api.github.com',token)
    }
    searchRepositories(params){
        return this.instance.get({url:'/search/repositories',params})
    }
}

export default Gitee;