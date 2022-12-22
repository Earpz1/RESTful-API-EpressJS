import express from 'express'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import uniqid from 'uniqid'
import httpErrors from 'http-errors'
import { nextTick } from 'process'

const { NotFound, BadRequest } = httpErrors

const blogsJSONFile = join(
  dirname(fileURLToPath(import.meta.url)),
  'posts.json',
)

const blogPosts = () => {
  return JSON.parse(fs.readFileSync(blogsJSONFile))
}

const blogPostsRouter = express.Router()

//Get posts

blogPostsRouter.get('/', (request, response, next) => {
  try {
    const data = blogPosts()
    response.send(data)
  } catch (error) {
    next(error)
  }
})

//Create new Post

blogPostsRouter.post('/', (request, response) => {
  const newPost = { ...request.body, _id: uniqid() }
  const data = blogPosts()

  data.push(newPost)
  fs.writeFileSync(blogsJSONFile, JSON.stringify(data))
  response.status(201).send(newPost)
})

// Delete post by ID
blogPostsRouter.delete('/:id', (request, response) => {
  const data = blogPosts()
  const id = request.params.id

  const removePost = data.filter((posts) => posts._id !== id)

  fs.writeFileSync(blogsJSONFile, JSON.stringify(removePost))

  response.status(204).send()
})

//Get a post by ID
blogPostsRouter.get('/:id', (request, response, next) => {
  try {
    const data = blogPosts()
    const id = request.params.id

    const singlePost = data.find((post) => post._id === id)

    if (singlePost) {
      response.send(singlePost)
    } else {
      next(NotFound('There was no record with that ID'))
    }
  } catch (error) {
    next(error)
  }
})

export default blogPostsRouter
