/*
	@class Router
*/
class Router {

	http = require('http')
	routes = { GET : [], POST : [] }
	requestCounter = 0

	constructor() {
		// pass
	}

	register(method, url, callback) {
		const route = { url, callback }
		this.routes[method].push(route)
	}

	get(url, callback) { this.register('GET', url, callback) }
	post(url, callback) { this.register('POST', url, callback) }

	async parseUrl(req, res) {
		let routeFound = this.routes[req.method].filter( route => route.url === req.url ).shift()
		if (routeFound) return routeFound.callback(req, res)

		await this.routes[req.method].forEach( route => {
			const routeFolders = route.url.split('/')
			const requestFolders = req.url.split('/')
			if (routeFolders.length === requestFolders.length && route.url.includes(':')) {
				const result = this.tryTheSameLengthWithParams(route.url, req.url)
				if (result.status) {
					req.params = result.params
					routeFound = route
					req.on('data', chunk => req.body = JSON.parse(chunk.toString()))
				}
			}
		})

		console.log('Request accepted')
		console.log('Url\t:', req.url)
		console.log('Method\t:', req.method)
		console.log('Params\t:', req.params)
		console.log('Body\t:', req.body)
		console.log('Route\t:', routeFound)
		console.log('Request responded')
		return routeFound ? routeFound.callback(req, res) : res.end('Route not found!')
	}

	tryTheSameLengthWithParams(routeUrl, reqUrl) {
		const routeFoldersArray = routeUrl.split('/').slice(1)
		const requestFoldersArray = reqUrl.split('/').slice(1)

		const parsedRoute = {}
		const params = {}
		let error = false
		routeFoldersArray.forEach( (routeFolder, x) => {
			if (routeFolder !== requestFoldersArray[x] && !routeFolder.includes(':')) error = true
			if (routeFolder.includes(':')) params[routeFolder.replace(':', '')] = requestFoldersArray[x]
			parsedRoute[routeFolder.replace(':', '')] = requestFoldersArray[x]
		})

		return { status : !error ? true : false, params }
	}

	listen(port, serverCallbackStatus) {
		this.http.createServer( async (req, res) => {
			this.requestCounter ++
			if (req.url === '/favicon.ico') return 1
			await this.parseUrl(req, res)
			console.log('Waiting for the next request ...', this.requestCounter)
			for (let x = 0; x < process.stdout.columns; x++) process.stdout.write('-')
		}).listen(port, serverCallbackStatus)
	}

}

module.exports = new Router()