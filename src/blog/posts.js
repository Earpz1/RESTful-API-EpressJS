import express from 'express'
import fs from 'fs'
import uniqid from 'uniqid'
import httpErrors from 'http-errors'
import { getPosts, writePosts, saveBlogCover } from '../../lib/fs-funcs.js'
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { v2 as cloudinary } from 'cloudinary'

const { NotFound, BadRequest } = httpErrors

const blogCoverPhoto = multer({
  storage: new cloudinary({
    cloudinary,
    params: {
      folder: 'StriveBlog',
    },
  }),
}).single('cover')

const blogPostsRouter = express.Router()

//Get posts

blogPostsRouter.get('/', async (request, response, next) => {
  try {
    const data = await getPosts()
    response.send(data)
  } catch (error) {
    next(error)
  }
})

//Create new Post

blogPostsRouter.post('/', async (request, response, next) => {
  try {
    const newPost = { ...request.body, _id: uniqid() }

    const postArray = await getPosts()

    postArray.push(newPost)
    await writePosts(postArray)
    response.status(201).send(newPost)
  } catch (error) {
    next(error)
  }
})

// Delete post by ID
blogPostsRouter.delete('/:id', async (request, response) => {
  const data = await getPosts()
  const id = request.params.id

  const removePost = data.filter((posts) => posts._id !== id)

  fs.writeFileSync(blogsJSONFile, JSON.stringify(removePost))

  response.status(204).send()
})

//Get a post by ID
blogPostsRouter.get('/:id', async (request, response, next) => {
  try {
    const data = await getPosts()
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

//Add a blog cover photo
blogPostsRouter.post(
  '/:id/uploadCover',
  blogCoverPhoto,
  async (request, response, next) => {
    try {
      const fileName = request.params.id + '.gif'
      await saveBlogCover(fileName, request.file.buffer)

      const url = 'http://localhost:3001/img/blog_covers/' + fileName

      const postData = await getPosts()
      const postIndex = postData.findIndex(
        (post) => post._id === request.params.id,
      )

      if (postIndex !== -1) {
        const post = postData[postIndex]
        const newPost = { ...post, cover: url }

        postData[postIndex] = newPost

        await writePosts(postData)
      }

      response.send('File uploaded!')
    } catch (error) {
      next(error)
    }
  },
)

export default blogPostsRouter
