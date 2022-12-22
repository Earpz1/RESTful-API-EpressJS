import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs-extra'

const { readJSON, writeJSON, writeFile } = fs

const dataFolder = join(dirname(fileURLToPath(import.meta.url)), '../data')
const avatarFolder = join(process.cwd(), './public/img/avatars/')
const blogCoverFolder = join(process.cwd(), './public/img/blog_covers/')

const postsJsonFile = join(dataFolder, 'posts.json')
const authorsJsonFile = join(dataFolder, 'authors.json')

export const getPosts = () => readJSON(postsJsonFile)
export const writePosts = (postArray) => writeJSON(postsJsonFile, postArray)
export const getAuthors = () => readJSON(authorsJsonFile)
export const writeAuthor = (authorArray) =>
  writeJSON(authorsJsonFile, authorArray)

export const saveBlogCover = (fileName, buffer) =>
  writeFile(join(blogCoverFolder, fileName), buffer)

export const saveAvatarPhoto = (fileName, buffer) =>
  writeFile(join(avatarFolder, fileName), buffer)
