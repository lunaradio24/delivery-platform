import express from 'express'
import { imageUploader } from '../utils/image-uploader.util.js'
import { imageController } from '../di/dependency-injected-instances.js'

const imageRouter = express.Router()

imageRouter.post('/', imageUploader.single('image'), imageController.imageUpload)

export { imageRouter }