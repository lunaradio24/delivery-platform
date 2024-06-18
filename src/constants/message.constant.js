import { MIN_PASSWORD_LENGTH } from './auth.constant.js';

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
    READ_ME: {
      SUCCEED: '내 정보 조회에 성공했습니다.',
    },
  },
  ORDER: {
    NODATA: '주문이 존재하지 않습니다',
    CREATED: {
      SUCCEED: '주문이 접수되었습니다.',
      NOORDER: '메뉴는 1개 이상 주문해주세요.',
    },
    CANCEL: {
      SUCCEED: '주문 취소 요청 되었습니다.',
      CANCEL_SAME: '이미 취소된 주문입니다.',
    },
    LIST: {
      SUCCEED: '주문내역 조회에 성공하였습니다.',
    },
    DETAIL: {
      SUCCEED: '주문내역 상세 조회에 성공하였습니다.',
    },
    STATUS_UPDATE: {
      SUCCEED: '주문 상태가 변경되었습니다.',
      STATUS_SAME: '현재 상태와 동일합니다.',
    },
    NO_WALLET: '잔액이 부족합니다.',
  },
};
