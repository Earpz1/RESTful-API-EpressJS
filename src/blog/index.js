import express from 'express'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import uniqid from 'uniqid'

const authorsJSONFile = join(
  dirname(fileURLToPath(import.meta.url)),
  'authors.json',
) //This gets the directory of the current file and then finds the file name within that directory

const authorsRouter = express.Router()

//This endpoint is for GETTING all the authors from the JSON file

authorsRouter.get('/', (request, response) => {
  const fileData = JSON.parse(fs.readFileSync(authorsJSONFile))
  response.send(fileData)
})

// This endpoint is for POSTING new data to the JSON file

authorsRouter.post('/', (request, response) => {
  const newAuthor = { ...request.body, ID: uniqid() } //Get the body of what was sent in the response
  const fileData = JSON.parse(fs.readFileSync(authorsJSONFile)) //Read the data from the authors file

  fileData.push(newAuthor) //Push the body into the array
  fs.writeFileSync(authorsJSONFile, JSON.stringify(fileData)) //Stringify the array before writing it back to the file, overwriting everything
  response.status(201).send({ name: newAuthor.name })
})

//This endpoint is for DELETING a specific user by ID
authorsRouter.delete('/:id', (request, response) => {
  const fileData = JSON.parse(fs.readFileSync(authorsJSONFile)) //Read the data from the authors file

  const id = request.params.id // Get the ID from the request

  const filterData = fileData.filter((authors) => authors.ID !== id) //Filter the array, removing the object with the ID from the request

  fs.writeFileSync(authorsJSONFile, JSON.stringify(filterData)) //Stringify the data and overwrite the file

  response.status(204).send() //Send 204 response back
})

//This endpoint is for GETTING a user by ID
authorsRouter.get('/:id', (request, response) => {
  const fileData = JSON.parse(fs.readFileSync(authorsJSONFile)) //Get the data from the JSON file
  const id = request.params.id // Get the ID from the request

  const singleAuthor = fileData.find((author) => author.ID === id) //Find the object with the ID passed in the request

  response.send(singleAuthor) //Send back the single object
})

//This endpoint is for editing a user with a specific ID using PUT
authorsRouter.put('/:id', (request, response) => {
  const fileData = JSON.parse(fs.readFileSync(authorsJSONFile)) //Read the data from the authors file
  const id = request.params.id // Get the ID from the request

  const index = fileData.findIndex((author) => author.ID === id) //Find the index of the array with the ID
  const author = fileData[index] // Set the current author to the selected object

  const updatedAuthor = { ...author, ...request.body } //Update the author with the current information, editing anything that was sent in the request body

  fileData[index] = updatedAuthor //Overwrite the index of the array with the updated object

  fs.writeFileSync(authorsJSONFile, JSON.stringify(fileData)) //Stringfy the data and overwrite the authors file

  response.send(updatedAuthor) //Send back the updated object as a response
})

authorsRouter.post('/:checkEmail', (request, response) => {
  const fileData = JSON.parse(fs.readFileSync(authorsJSONFile)) //Read the data from the file
  const email = request.params.checkEmail
  const newAuthor = request.body

  const filterData = fileData.filter((author) => author.email === email)

  if (filterData.length === 0) {
    fileData.push(newAuthor)
    fs.writeFileSync(authorsJSONFile, JSON.stringify(fileData))
    response.status(201).send(newAuthor)
  } else {
    response.status(400).send('Unable to edit user: Email already exists')
  }
})

export default authorsRouter
