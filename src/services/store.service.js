import StoreRepository from '../repositories/store.repository.js';

const storeRepository = new StoreRepository()

class StoreService {
  constructor(storeRepository) {
    this.storeRepository = storeRepository;
  }
  createStore = async (
    data, ownerId
  ) => {
    const createStore = await storeRepository.createStore( data, ownerId )
    
    return createStore
  }
  
  updateStore = async (
    storeId,
    category,
    name,
    image,
    address,
    contactNumber,
    description,
    openingHours
  ) => {
    const updateStore = await storeRepository.updateStore(
      storeId,
      category,
      name,
      image,
      address,
      contactNumber,
      description,
      openingHours
    )
    
    return updateStore
  }

  deleteStore = async ( storeId ) => {
    const deleteStore = await storeRepository.deleteStore(
      storeId
    )
    return deleteStore.id
  }

}

export default StoreService;
