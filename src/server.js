import express from 'express'
import authorsRouter from './blog/authors.js'
import blogPostsRouter from './blog/posts.js'
import cors from 'cors'
import { genericError, NotFoundError } from './errors.js'

const server = express()
const port = 3001

const logger = (request, response, next) => {
  console.log(`Request Method ${request.method}`)
  next()
}

server.get('/', (request, response) => {
  response.send('Successful connection')
})

//Middleware

server.use(cors())
server.use(logger)
server.use(express.json())

//Endpoints

server.use('/authors', authorsRouter)
server.use('/posts', blogPostsRouter)

//Error handlers

server.use(NotFoundError)
server.use(genericError)

server.listen(port, () => {
  console.log('The server is running on port', port)
})
