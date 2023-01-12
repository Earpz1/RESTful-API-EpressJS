import express from 'express'
import { pipeline } from 'stream'
import { getPosts } from '../../lib/fs-funcs.js'

import { getPDFReadableStream } from '../../lib/pdf-tools.js'

const filesRouter = express.Router()

filesRouter.get('/pdf', async (request, response, next) => {
  response.setHeader('Content-Disposition', 'attachment; filename=test.pdf')

  const posts = await getPosts()

  console.log(posts)
  const source = getPDFReadableStream(posts)
  const destination = response
  pipeline(source, destination, (error) => {
    if (error) console.log(error)
  })
})

filesRouter.get('/pdf/post/:id', async (request, response, next) => {
  response.setHeader('Content-Disposition', 'attachment; filename=test.pdf')

  const id = request.params.id
  const posts = await getPosts()
  const singlePost = posts.find((post) => post._id === id)

  console.log(posts)
  const source = getPDFReadableStream(singlePost)
  const destination = response
  pipeline(source, destination, (error) => {
    if (error) console.log(error)
  })
})

export default filesRouter
