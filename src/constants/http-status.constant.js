export const HTTP_STATUS = {
  OK: 200, // 호출 성공
  CREATED: 201, // 생성 성공
  BAD_REQUEST: 400, // 사용자가 잘못 요청 (예: 입력값 빠뜨림)
  UNAUTHORIZED: 401, // 인증 실패 unauthenticated (예: 비밀번호 틀림)
  FORBIDDEN: 403, // 인가 실패 unauthorized (예: 접근권한이 없음)
  NOT_FOUND: 404, // 데이터가 없는 경우
  CONFLICT: 409, // 충돌 발생 (예: 이메일 중복)
  INTERNAL_SERVER_ERROR: 500, // 예상치 못한 에러 발생
};
