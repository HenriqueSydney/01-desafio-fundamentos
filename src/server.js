import http from 'node:http'

import { json } from './middlewares/json.js'
import { routes } from './routes.js'
import { ApiError } from './utils/ApiError.js'
import { extractQueryParams } from './utils/extract-route-params.js'


const server = http.createServer(async(req, res) => {
    const { method, url } = req   
    await json(req,res);
    const route = routes.find(route => {        
        return route.method === method && route.path.test(url)
    })
   
    if (route) {
        try {
            const routeParams = req.url.match(route.path)

            const { query, ...params } = routeParams.groups
            req.params =  params
            req.query = query ? extractQueryParams(query) : {}
    
            return route.handler(req, res)
        } catch (error) {
            console.log(error)
            const isApiError = error instanceof ApiError;

            const message = isApiError ? error.message : 'Algum problema ocorreu ao tentar realizar a operação. Tente novamente mais tarde.';
            const statusCode = isApiError ? 400 : 500;

            return res.writeHead(statusCode).end(JSON.stringify( {message: message}));
        }
        
    }
    
    return res.writeHead(404).end();
})

server.listen(3333);