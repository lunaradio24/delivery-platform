import { MESSAGES } from '../constants/message.constant.js';
import { HttpError } from '../errors/http.error.js';

class StoreService {
  constructor(storeRepository) {
    this.storeRepository = storeRepository;
  }

  createStore = async (ownerId, category, name, image, address, contactNumber, description, openingHours) => {
    const existingStore = await this.storeRepository.findByOwnerId(ownerId);
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

  getStoreList = async (category, sort, orderBy) => {
    // sort 값이 'asc'인 경우 제외하고 'desc' (내림차순) 정렬
    sort = sort && sort.toLowerCase() === 'asc' ? 'asc' : 'desc';

    // orderBy 값이 없는 경우 'totalSales' (매출액) 기준 정렬
    let orderOption;
    if (orderBy?.toLowerCase() === 'totalreviews') {
      orderOption = { totalReviews: sort };
    } else if (orderBy?.toLowerCase() === 'averagerating') {
      orderOption = { averageRating: sort };
    } else {
      orderOption = { totalSales: sort };
    }
    // Store Repository에 DB 조회 요청
    const storeList = await this.storeRepository.findStoreList(category, orderOption);

    return storeList;
  };

  getStoreDetail = async (storeId) => {
    const store = await this.storeRepository.findByStoreId(storeId);
    return store;
  };

  updateStore = async (ownerId, storeId, category, name, image, address, contactNumber, description, openingHours) => {
    // 해당 가게의 사장이 맞는지 확인
    const store = await this.storeRepository.findByStoreId(storeId);
    if (!store || (store && store.ownerId !== ownerId)) {
      throw new HttpError.Forbidden(MESSAGES.STORES.COMMON.NO_ACCESS_RIGHT);
    }

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

  deleteStore = async (ownerId, storeId) => {
    // 해당 가게의 사장이 맞는지 확인
    const store = await this.storeRepository.findByStoreId(storeId);
    if (!store || (store && store.ownerId !== ownerId)) {
      throw new HttpError.Forbidden(MESSAGES.STORES.COMMON.NO_ACCESS_RIGHT);
    }

    const deletedStore = await this.storeRepository.deleteStore(storeId);
    return deletedStore.id;
  };


}

export default StoreService;
