import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';
import { StoreRepository } from '../repositories/store.repository.js';

export class StoreService {
  storeRepository = new StoreRepository()

  createStore = async (
    category,
    name,
    image,
    address,
    contactNumber,
    description,
    openingHours
  ) => {
    const createStore = await this.storeRepository.createStore(
      category,
      name,
      image,
      address,
      contactNumber,
      description,
      openingHours
    )
    return createStore
  }
  
  getStore = async ( categoryIndex ) => {
    const data = await this.storeRepository.getStore(
      categoryIndex
    )
    
    return data
  }

  updateStore = async () => {
    const updateStore = await this.storeRepository.updateStore(
      
    )
    return updateStore
  }

  deleteStore = async ( storeId ) => {
    const deleteStore = await this.storeRepository.deleteStore(
      storeId
    )
    return deleteStore
  }
}
