import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { StoreService } from '../services/store.service.js';
import { StoreRepository } from '../repositories/store.repository.js';

const storeService = new StoreService()
const storeRepository = new StoreRepository()

export class StoreController {

  createStore = async (req, res, next) => {
    try{
    const { 
      category,
      name,
      image,
      address,
      contactNumber,
      description,
      openingHours 
    } = req.body

    const user = req.user
    const ownerId = user.id
    const userRole = user.role

    const data = { 
      category,
      name,
      image,
      address,
      contactNumber,
      description,
      openingHours
    }

    if(userRole != 1){
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: MESSAGES,
      })
    }

    const createStore = await storeService.createStore( data, ownerId )

    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES,
      createStore
    })
    }catch(error){
      next(error)
    }
  }

  getStore = async (req, res, next) => {
    try{
      const url = req.query
      const categoryId = URLSearchParams.values(url)
      const getStore = await storeRepository.getStore( categoryId )

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES,
        getStore
      })

    }catch(error){
      next(error)
    }
  }

  getStoreOne = async (req, res, next) => {
    try{
      const storeId = req.params
      
      const getStoreOne = await storeRepository.getStoreOne( storeId )

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES,
        getStoreOne
      })
    }catch(error){
      next(error)
    }
  }

  updateStore = async (req, res, next) => {
    try{
      const user = req.user
      const authorId = user.id
      const updateStore = await storeService.updateStore( authorId )

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES,
        updateStore
      })

    }catch(error){
      next(error)
    }
  }

  deleteStore = async (req, res, next) => {
    try{
      const user = req.user
      const authorId = user.id
      const deleteStore = await storeService.deleteStore( authorId )

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES,
        deleteStore
      })

    }catch(error){
      next(error)
    }
  }
}
