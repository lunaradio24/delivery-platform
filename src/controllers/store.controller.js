import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

class StoreController {
  constructor(storeService, storeRepository) {
    this.storeService = storeService;
    this.storeRepository = storeRepository;
  }

  createStore = async (req, res, next) => {
    try {
      const { category, name, image, address, contactNumber, description, openingHours } = req.body;

      const user = req.user;
      const ownerId = user.id;

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

  getStore = async (req, res, next) => {
    try {
      const { categoryId } = req.query;
      const getStore = await this.storeRepository.getStore(categoryId);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.STORES.READ_LIST.SUCCEED,
        data: getStore,
      });
    } catch (error) {
      next(error);
    }
  };

  getStoreOne = async (req, res, next) => {
    try {
      const { storeId } = req.params;

      const getStoreOne = await this.storeRepository.getStoreOne(storeId);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.STORES.READ_DETAIL.SUCCEED,
        data: getStoreOne,
      });
    } catch (error) {
      next(error);
    }
  };

  updateStore = async (req, res, next) => {
    try {
      const { storeId } = req.params;
      const { category, name, image, address, contactNumber, description, openingHours } = req.body;
      const updatedStore = await this.storeService.updateStore(
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
      const { storeId } = req.params;
      const deletedStore = await this.storeService.deleteStore(storeId);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.STORES.DELETE.SUCCEED,
        data: deletedStore,
      });
    } catch (error) {
      next(error);
    }
  };
}
export default StoreController;
