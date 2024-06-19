import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import menuRepository from '../repositories/menu.repository.js';
import menuService from '../services/menu.service.js';


class MenuController {
  createMenu = async (req, res, next) => {
    try{
      const storeId = req.params
      const { 
        name,
        price,
        image,
        description
       } = req.body

      const createMenu = await menuService.createMenu( 
        storeId,
        name,
        price,
        image,
        description
      )


      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES,
        createMenu
      })
  }catch(error){
    next(error)
  }
  }
  
  getMenu = async (req, res, next) => {
    try{
        const storeId = req.params
        const getMenu = await menuRepository.getMenu( storeId )


    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES,
      getMenu
    })
  }catch(error){
    next(error)
  }
  }

  updateMenu = async (req, res, next) => {
    try{
        const menuId = req.params
        const data = req.body
        const updateMenu = await menuService.updateMenu( menuId, data )


    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES,
      updateMenu
    })
  }catch(error){
    next(error)
  }
  }

  deleteMenu = async (req, res, next) => {
    try{
        const menuId = req.params
        const user = req.user
        const ownerId = user.id
        
        const deleteMenu = await menuService.deleteMenu( menuId, ownerId )


    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES,
      deleteMenu
    })
  }catch(error){
    next(error)
  }
  }
}

const menuController = new MenuController()
export default menuController