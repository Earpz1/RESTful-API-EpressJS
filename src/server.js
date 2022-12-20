import express from 'express'
import authorsRouter from './blog/index.js'
import listEndPoints from 'express-list-endpoints'

const server = express()
const port = 3001

server.get('/', (request, response) => {
  response.send('Successful sss')
})

server.use(express.json())

server.use('/authors', authorsRouter)

server.listen(port, () => {
  console.log('The server is running on port', port)
})
