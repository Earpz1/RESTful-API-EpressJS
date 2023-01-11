import express from 'express'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import uniqid from 'uniqid'
import multer from 'multer'
import { getAuthors, writeAuthor, saveAvatarPhoto } from '../../lib/fs-funcs.js'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { v2 as cloudinary } from 'cloudinary'

const authorsRouter = express.Router()

const avatarPhoto = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'StriveBlog',
    },
  }),
}).single('avatar')

//This endpoint is for GETTING all the authors from the JSON file

authorsRouter.get('/', async (request, response) => {
  const fileData = await getAuthors()
  response.send(fileData)
})

// This endpoint is for POSTING new data to the JSON file

authorsRouter.post('/', async (request, response) => {
  const authors = await getAuthors()
  const newAuthor = { ...request.body, ID: uniqid() }

  authors.push(newAuthor)
  await writeAuthor(authors)
  response.status(201).send({ newAuthor })
})

//This endpoint is for DELETING a specific user by ID
authorsRouter.delete('/:id', async (request, response) => {
  const fileData = await getAuthors()

  const id = request.params.id // Get the ID from the request

  const filterData = fileData.filter((authors) => authors.ID !== id) //Filter the array, removing the object with the ID from the request

  await writeAuthor(filterData)

  response.status(204).send() //Send 204 response back
})

//This endpoint is for GETTING a user by ID
authorsRouter.get('/:id', async (request, response) => {
  const fileData = await getAuthors()
  const id = request.params.id // Get the ID from the request

  const singleAuthor = fileData.find((author) => author.ID === id) //Find the object with the ID passed in the request

  response.send(singleAuthor) //Send back the single object
})

//This endpoint is for editing a user with a specific ID using PUT
authorsRouter.put('/:id', async (request, response) => {
  const fileData = await getAuthors()
  const id = request.params.id // Get the ID from the request

  const index = fileData.findIndex((author) => author.ID === id) //Find the index of the array with the ID
  const author = fileData[index] // Set the current author to the selected object

  const updatedAuthor = { ...author, ...request.body } //Update the author with the current information, editing anything that was sent in the request body

  fileData[index] = updatedAuthor //Overwrite the index of the array with the updated object

  await writeAuthor(fileData)

  response.send(updatedAuthor) //Send back the updated object as a response
})

authorsRouter.post('/:checkEmail', async (request, response) => {
  const fileData = await getAuthors()
  const email = request.params.checkEmail
  const newAuthor = request.body

  const filterData = fileData.filter((author) => author.email === email)

  if (filterData.length === 0) {
    fileData.push(newAuthor)
    await writeAuthor(fileData)
    response.status(201).send(newAuthor)
  } else {
    response.status(400).send('Unable to edit user: Email already exists')
  }
})

authorsRouter.post(
  '/:id/uploadAvatar',
  avatarPhoto,
  async (request, response, next) => {
    try {
      console.log(request.file)

      const url = request.file.path

      const authors = await getAuthors()

      const authorIndex = authors.findIndex(
        (author) => author.ID === request.params.id,
      )

      console.log(authorIndex)

      if (authorIndex !== -1) {
        const author = authors[authorIndex]
        const newAuthor = { ...author, avatar: url }

        authors[authorIndex] = newAuthor
        await writeAuthor(authors)
      }

      response.send('Avatar uploaded!')
    } catch (error) {
      next()
    }
  },
)

export default authorsRouter
