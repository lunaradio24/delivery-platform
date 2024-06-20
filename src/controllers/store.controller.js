import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

class StoreController {
  constructor(storeService) {
    this.storeService = storeService;
  }

  createStore = async (req, res, next) => {
    try {
      const { category, name, image, address, contactNumber, description, openingHours } = req.body;

      const user = req.user;
      const ownerId = user.id;
      req.file = image
      console.log(req.file)

      const createdStore = await this.storeService.createStore(
        ownerId,
        category,
        name,
        image,
        address,
        contactNumber,
        description,
        openingHours,
      );


      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.STORES.CREATE.SUCCEED,
        data: createdStore,
      });
    } catch (error) {
      next(error);
    }
  };

  getStoreList = async (req, res, next) => {
    try {
      const { category, sort, orderBy } = req.query;
      const stores = await this.storeService.getStoreList(category, sort, orderBy);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.STORES.READ_LIST.SUCCEED,
        data: stores,
      });
    } catch (error) {
      next(error);
    }
  };

  getStoreDetail = async (req, res, next) => {
    try {
      const { storeId } = req.params;

      const store = await this.storeService.getStoreDetail(storeId);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.STORES.READ_DETAIL.SUCCEED,
        data: store,
      });
    } catch (error) {
      next(error);
    }
  };

  updateStore = async (req, res, next) => {
    try {
      const { id: ownerId } = req.user;
      const { storeId } = req.params;
      const { category, name, image, address, contactNumber, description, openingHours } = req.body;
      const updatedStore = await this.storeService.updateStore(
        ownerId,
        storeId,
        category,
        name,
        image,
        address,
        contactNumber,
        description,
        openingHours,
      );

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.STORES.UPDATE.SUCCEED,
        data: updatedStore,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteStore = async (req, res, next) => {
    try {
      const { id: ownerId } = req.user;
      const { storeId } = req.params;
      const deletedStore = await this.storeService.deleteStore(ownerId, storeId);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.STORES.DELETE.SUCCEED,
        data: deletedStore,
      });
    } catch (error) {
      next(error);
    }
  };

  storeImageUpload = async (req, res, next) => {
    try {
      const imageUrl = req.file.location
      const { storeId } = req.params.storeId

      const storeImageUpload = await this.userService.storeImageUpload(imageUrl, storeId)

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.STORES.IMAGE.SUCCEED,
        imageUrl
      })
    }catch(error){
      next(error)
    }
  }

}
export default StoreController;
