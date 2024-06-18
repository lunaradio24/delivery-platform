import { MIN_PASSWORD_LENGTH } from './auth.constant.js';
import { MAX_REVIEW_LENGTH } from './review.constant.js';

export const MESSAGES = {
  AUTH: {
    COMMON: {
      EMAIL: {
        REQUIRED: '이메일을 입력해 주세요.',
        INVALID_FORMAT: '이메일 형식이 올바르지 않습니다.',
        DUPLICATED: '이미 가입 된 사용자입니다.',
      },
      PASSWORD: {
        REQUIRED: '비밀번호를 입력해 주세요.',
        MIN_LENGTH: `비밀번호는 ${MIN_PASSWORD_LENGTH}자리 이상이어야 합니다.`,
      },
      PASSWORD_CONFIRM: {
        REQUIRED: '비밀번호 확인을 입력해 주세요.',
        NOT_MATCHED_WITH_PASSWORD: '입력 한 두 비밀번호가 일치하지 않습니다.',
      },
      NICKNAME: {
        REQUIRED: '닉네임을 입력해 주세요.',
      },
      CONTACT_NUMBER: {
        REQUIRED: '휴대폰 번호를 입력해 주세요',
        INVALID_FORMAT: '휴대폰 번호 형식이 올바르지 않습니다.',
      },
      UNAUTHORIZED: '인증 정보가 유효하지 않습니다.',
      JWT: {
        NO_TOKEN: '인증 정보가 없습니다.',
        NOT_SUPPORTED_TYPE: '지원하지 않는 인증 방식입니다.',
        EXPIRED: '인증 정보가 만료되었습니다.',
        NO_USER: '인증 정보와 일치하는 사용자가 없습니다.',
        INVALID: '인증 정보가 유효하지 않습니다.',
      },
      ROLE: {
        NO_ACCESS_RIGHT: '접근 권한이 없습니다.',
      },
    },
    SIGN_UP: {
      SUCCEED: '회원가입에 성공했습니다.',
    },
    SIGN_IN: {
      SUCCEED: '로그인에 성공했습니다.',
    },
    SIGN_OUT: {
      SUCCEED: '로그아웃에 성공했습니다.',
    },
    RENEW_TOKENS: {
      SUCCEED: '토큰 재발급에 성공했습니다.',
    },
  },
  USERS: {
    COMMON: {
      NOT_FOUND: '해당 사용자가 존재하지 않습니다.',
      NO_ACCESS_RIGHT: '접근 권한이 없습니다.',
    },
    READ_ME: {
      SUCCEED: '내 정보 조회에 성공했습니다.',
    },
    UPDATE: {
      SUCCEED: '내 정보 수정에 성공했습니다.',
    },
  },
  STORES: {
    COMMON: {
      NOT_FOUND: '해당 가게가 존재하지 않습니다.',
      NO_ACCESS_RIGHT: '접근 권한이 없습니다.',
    },
    CREATE: {
      SUCCEED: '가게 등록에 성공했습니다.',
    },
    READ_LIST: {
      SUCCEED: '가게 목록 조회에 성공했습니다.',
    },
    READ_DETAIL: {
      SUCCEED: '가게 상세 조회에 성공했습니다.',
    },
    UPDATE: {
      SUCCEED: '가게 정보 수정에 성공했습니다.',
    },
    DELETE: {
      SUCCEED: '가게 정보 삭제에 성공했습니다.',
    },
  },
  MENUS: {
    COMMON: {
      NOT_FOUND: '해당 메뉴가 존재하지 않습니다.',
      NO_ACCESS_RIGHT: '접근 권한이 없습니다.',
    },
    CREATE: {
      SUCCEED: '메뉴 생성에 성공했습니다.',
    },
    READ_LIST: {
      SUCCEED: '메뉴 목록 조회에 성공했습니다.',
    },
    UPDATE: {
      SUCCEED: '메뉴 수정에 성공했습니다.',
    },
    DELETE: {
      SUCCEED: '메뉴 삭제에 성공했습니다.',
    },
  },
  CARTS: {
    COMMON: {
      NOT_FOUND: '해당 장바구니가 존재하지 않습니다.',
      NO_ACCESS_RIGHT: '접근 권한이 없습니다.',
    },
    CREATE: {
      SUCCEED: '장바구니에 담기를 성공했습니다.',
    },
    READ_LIST: {
      SUCCEED: '장바구니 목록 조회에 성공했습니다.',
    },
    UPDATE: {
      SUCCEED: '장바구니 아이템 정보 수정에 성공했습니다.',
    },
    DELETE: {
      SUCCEED: '장바구니 아이템 삭제에 성공했습니다.',
    },
  },
  ORDERS: {
    COMMON: {
      NOT_FOUND: '해당 주문이 존재하지 않습니다.',
      NO_ACCESS_RIGHT: '접근 권한이 없습니다.',
    },
    CREATE: {
      SUCCEED: '주문 요청에 성공했습니다.',
    },
    READ_LIST: {
      SUCCEED: '주문 내역 목록 조회에 성공했습니다.',
    },
    READ_DETAIL: {
      SUCCEED: '주문 내역 상세 조회에 성공했습니다.',
    },
    UPDATE_STATUS: {
      SUCCEED: '주문 상태 변경에 성공했습니다.',
    },
    CANCEL: {
      SUCCEED: '주문 취소에 성공했습니다.',
    },
  },
  REVIEWS: {
    COMMON: {
      STORE_ID: {
        REQUIRED: '가게 ID를 입력해주세요',
      },
      ORDER_ID: {
        REQUIRED: '주문 ID를 입력해주세요',
      },
      RATING: {
        REQUIRED: '별점을 입력해주세요',
      },
      CONTENT: {
        MAX_LENGTH: `리뷰 내용은 최대 ${MAX_REVIEW_LENGTH}자 까지 작성가능합니다.`,
      },
      NOT_FOUND: '해당 리뷰가 존재하지 않습니다.',
      NO_ACCESS_RIGHT: '접근 권한이 없습니다.',
    },
    CREATE: {
      SUCCEED: '리뷰 생성에 성공했습니다.',
      NO_BODY_DATA: '작성 할 정보를 입력해 주세요.',
      DUPLICATED: '이미 리뷰가 작성 된 주문입니다.',
    },
    READ_LIST: {
      SUCCEED: '리뷰 목록 조회에 성공했습니다.',
    },
    READ_MY: {
      SUCCEED: '내 리뷰 목록 조회에 성공했습니다.',
    },
    READ_DETAIL: {
      SUCCEED: '리뷰 상세 조회에 성공했습니다.',
    },
    UPDATE: {
      SUCCEED: '리뷰 수정에 성공했습니다.',
      NO_BODY_DATA: '수정 할 정보를 입력해 주세요.',
    },
    DELETE: {
      SUCCEED: '리뷰 삭제에 성공했습니다.',
    },
  },
  LIKES: {
    CREATE: {
      SUCCEED: '',
    },
  },
};
