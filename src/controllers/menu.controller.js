import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { MenuRepository } from '../repositories/menu.repository.js';
import { MenuService } from '../services/menu.service.js';

const menuService = new MenuService()
const menuRepository = new MenuRepository()

export class MenuController {
  createMenu = async (req, res, next) => {
    try{
      const storeId = req.params
      const data = req.body


      const createMenu = await menuService.createMenu( storeId, data )


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
