import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

class StoreController {
  constructor(storeService, storeRepository) {
    this.storeService = storeService
    this.storeRepository = storeRepository
  }
  
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

    const createStore = await this.storeService.createStore(
      category,
      name,
      image,
      address,
      contactNumber,
      description,
      openingHours,
      ownerId
    )

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
      const categoryId = url.category
      const getStore = await this.storeRepository.getStore( categoryId )

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.STORES.READ_LIST.SUCCEED,
        getStore
      })

    }catch(error){
      next(error)
    }
  }

  getStoreOne = async (req, res, next) => {
    try{
      const storeId = req.params
      
      const getStoreOne = await this.storeRepository.getStoreOne( storeId )

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.STORES.READ_DETAIL.SUCCEED,
        getStoreOne
      })
    }catch(error){
      next(error)
    }
  }

  updateStore = async (req, res, next) => {
    try{
      const storeId = req.params
      const {
        category,
        name,
        image,
        address,
        contactNumber,
        description,
        openingHours
      } = req.body
      const updateStore = await this.storeService.updateStore( 
        storeId,
        category,
        name,
        image,
        address,
        contactNumber,
        description,
        openingHours )

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.STORES.UPDATE.SUCCEED,
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
      const deleteStore = await this.storeService.deleteStore( authorId )

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
export default StoreController;
