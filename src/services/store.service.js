import { MESSAGES } from '../constants/message.constant.js';
import { HttpError } from '../errors/http.error.js';

class StoreService {
  constructor(storeRepository) {
    this.storeRepository = storeRepository;
  }

  createStore = async (ownerId, category, name, image, address, contactNumber, description, openingHours) => {
    const existingStore = await this.storeRepository.getStoreByOwnerId(ownerId);
    if (existingStore) throw new HttpError.Conflict(MESSAGES.STORES.CREATE.DUPLICATED);
    const createdStore = await this.storeRepository.createStore(
      ownerId,
      category,
      name,
      image,
      address,
      contactNumber,
      description,
      openingHours,
    );

    return createdStore;
  };

  updateStore = async (storeId, category, name, image, address, contactNumber, description, openingHours) => {
    const updatedStore = await this.storeRepository.updateStore(
      storeId,
      category,
      name,
      image,
      address,
      contactNumber,
      description,
      openingHours,
    );

    return updatedStore;
  };

  deleteStore = async (storeId) => {
    const deletedStore = await this.storeRepository.deleteStore(storeId);
    return deletedStore.id;
  };

  userImageUpload = async (storeId, imageUrl) => {
    const existingStore = await this.storeRepository.findById(storeId);
    if (!existingStore){
      throw new HttpError.NotFound(MESSAGES.STORES.IMAGE.NOT_FOUND);
    }

    const updateImageUpload = await this.storeRepository.uploadImage(storeId, imageUrl)

    return updateImageUpload
  }
}

export default StoreService;
