# 🍗 TURKEY EAT 🦃

## ✨ 배포 링크

- [TURKEY EATS](https://turkey-eats.shop/)

## 👋 소개

- **TURKEY EATS**는 등록된 가게에서 메뉴를 주문할 수 있는 배달 플랫폼 웹 서비스입니다.

## 👩‍💻 팀원

<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/lunaradio24"><img src="https://avatars.githubusercontent.com/u/91360383?v=4" width="100px;" alt=""/><br /><sub><b> 팀장 : 여창준 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/benefrihw"><img src="https://avatars.githubusercontent.com/u/167044707?v=4" width="100px;" alt=""/><br /><sub><b> 팀원 : 이현우 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/minjun0702"><img src="https://avatars.githubusercontent.com/u/145142726?v=4" width="100px;" alt=""/><br /><sub><b> 팀원 : 이민준 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/blueclorox/"><img src="https://avatars.githubusercontent.com/u/165770132?v=4" width="100px;" alt=""/><br /><sub><b> 팀원 : 김호연 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/9r3dflam3"><img src="https://avatars.githubusercontent.com/u/167046779?v=4" width="100px;" alt=""/><br /><sub><b> 팀원 : 구남욱 </b></sub></a><br /></td>
    </tr>
  </tbody>
</table>

## ✅ 기술 스택

<img  src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">

<img  src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white">

<img  src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white">

<img  src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">

<img  src="https://img.shields.io/badge/amazonrds-527FFF?style=for-the-badge&logo=amazonrds&logoColor=white">

<img  src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">

<img  src="https://img.shields.io/badge/prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white">

## ✅ 주요 기능

### 회원 가입 시 Business와 Personal을 구분하여 별도의 기능을 구현

- 공통

  - AUTH
    - 이메일 인증 / 회원가입 / 로그인 / 토큰 재발급
  - 가게 카테고리에 따라 가게 목록 조회
  - 뉴스피드
    - 각 기준에 따라 정렬된 가게 목록 조회
      - 기본 값 : 매출액 / 별점 순 or 리뷰 많은 순 선택 가능
  - 가게 상세조회
    - 가게 메뉴 전체 조회
    - 가게에 작성된 리뷰 전체 조회
  - 내 프로필 조회 / 수정

- Business

  - 가게 입점 / 수정 / 폐점
  - 메뉴 등록 / 수정 / 삭제
  - 주문 확인 후 주문 상태 변경
  - 주문 조회
    - 내 가게에 들어온 주문 목록 조회
    - 주문 내용 상세 조회

- Personal

  - 장바구니에 메뉴 저장 / 수량 변경 / 삭제
  - 저장된 메뉴 주문 / 취소
    - 배달 완료 후 주문에 대한 리뷰 작성 / 수정 / 삭제
    - 내가 주문한 주문 내역 확인
    - 주문 내역을 통해 리뷰 확인 / 작성 / 수정 / 삭제
  - 가게 찜하기 / 취소 / 내가 찜한 가게 목록 조회
