# 풀스텍 2기 2팀

### 팀원 구성
방신철 (https://github.com/bangsinchur)

강명곤 (https://github.com/GGON123)

김태연 (개인 Github 링크)

신지원 (https://github.com/shinji530)

이예린 (개인 Github 링크)

### 프로젝트 소개

최근에는 벤처 캐피탈에 비해 개인 투자자들의 스타트업에 대한 관심이 증가하고 있습니다. 하지만 스타트업에 관한 정보 접근성에는 여전히 큰 격차가 존재합니다. 이러한 상황을 개선하기 위해, 개인 투자자들이 스타트업을 선택하여 그들의 누적 투자 금액, 매출액 등을 확인하고 비교할 수 있는 모의 투자 서비스를 제작합니다.

### 프로젝트 기간
프로젝트 기간 : 2024. 09. 25(수) ~ 2024. 10. 17(목) 2교시까지

### 기술 스택
FrontEnd: React.js
BackEnd: PrismaORM
Database: PostgreSQL
공통 : Github.

### 팀원별 구현 상세기능
방신철

#### compareCotroller 
- GET 엔드포인트에 검색기능,exclude기능 구현
- PATCH 엔드포인트 추가
(여러 id를 쿼리로 받아서 동시에 여러데이터 업데이트 기능 구현)


강명곤

#### companyDetailController
 - getCompanyDetail : 해당 기업의 정보와 기업에 투자한 투자자 정보 조회 기능 구현
 - patchInvestment : 투자자 정보 PATCH 기능 구현
 - deleteInvestment : 투자자 정보 DELETE 기능 구현
 - companyDetailRoutes에 각 루트 구현

김태연

신지원

#### companyController
 - getCompanyList : 검색 기능, 정렬 기능, 페이지네이션 기능 구현
 - getCompany : 특정 게시물 조회 기능 구현
 - companyRoutes에 각 루트 구현

#### investmentController
 - getInvestmentList : 정렬 기능, 페이지네이션 기능 구현
 - postInvestment : 투자자 정보 post 기능 구현 transaction을 활용하여 virtualInvestment 값에 투자 금액이 추가되도록 구현
 - patchInvestment : 투자자 정보 patch 기능 구현 transaction을 활용하여 virtualInvestment 값에 투자 금액이 반영되어 총 금액이 변경되도록 구현
 - deleteInvestment : 투자자 정보 delete 기능 구현 transaction을 활용하여 virtualInvestment 값에 투자 금액이 제외되도록 구현
 - investmentRoutes에 각 루트 구현

#### Investment 스키마 구현
 - Company 스키마와 일대다 관계 형성

이예린


### 파일구조
```
2-VIEWMYSTARTUP-2TEAM-BE
┣ app.js
┣ struct.js
┣.github
 ┣ ISSUE_TEMPLATE
 ┃ ┗ issue-template.md
 ┗ pull_request_template.md
controllers
 ┣ companyController.js
 ┣ companyDetailController.js
 ┣ compareController.js
 ┣ countController.js
 ┗ investmentController.js
middleware
 ┣ asyncHandler.js
 ┗ initializeVirtualInvestment.js
prisma
 ┣ migrations
 ┃ ┣ 20240926024358_add_company
 ┃ ┃ ┗ migration.sql
 ┃ ┣ 20240926060219_add_new_mockdata
 ┃ ┃ ┗ migration.sql
 ┃ ┣ 20240927024843_update_company_investamount
 ┃ ┃ ┗ migration.sql
 ┃ ┣ 20240930074407_add_investor_table
 ┃ ┃ ┗ migration.sql
 ┃ ┣ 20241001063020_add_total_invest
 ┃ ┃ ┗ migration.sql
 ┃ ┣ 20241001074730_add_cascade_option_for_seeding
 ┃ ┃ ┗ migration.sql
 ┃ ┣ 20241001114044_edit_attribute_name
 ┃ ┃ ┗ migration.sql
 ┃ ┣ 20241001123424_edit_simulated_to_virtual
 ┃ ┃ ┗ migration.sql
 ┃ ┣ 20241001130642_delete_total_investment_field_and_chage_model_investor_to_investment
 ┃ ┃ ┗ migration.sql
 ┃ ┣ 20241001131058_change_revenue_field_type_from_int_to_big_int_in_company_model
 ┃ ┃ ┗ migration.sql
 ┃ ┣ 20241001131224_rename_investment_s_amount_field_to_amount
 ┃ ┃ ┗ migration.sql
 ┃ ┣ 20241002024011_add_compare_controller_created_at_schema_compare_routes
 ┃ ┃ ┗ migration.sql
 ┃ ┗ migration_lock.toml
 ┣ .env
 ┣ mock.js
 ┣ schema.prisma
 ┗ seed.js
routes
 ┣ companyDetailRoutes.js
 ┣ companyRoutes.js
 ┣ compareRoutes.js
 ┣ countRoutes.js
 ┗ investmentRoutes.js
utils
 ┗ contorllerHelper.js
```
