# HiimPay API Documentation (Current Flows)

## 1. Scope
This API document covers only active flows:
- SuperAdmin
- Client/CPOC
- Client Employee

## 2. Auth and Navigation Rules

### Login APIs used by frontend
Base URL: `environment.baseUrl`

1. `POST /users/Login/emailId/jwt`
- Used by both Admin login and User login screens.
- Request:
```json
{
  "email": "user@domain.com",
  "password": "string"
}
```
- Response: JWT/token payload + message.

2. `POST /users/getCurrentLoggedInJwt`
- Used after login to resolve current user details (`typeOfUser`, `clientId`, etc.).
- Requires `Authorization: Bearer <token>`.

3. `POST /users/SendOTPOnEmailId?emailId={email}`
- Sends OTP to email.

4. `POST /users/VerifyOtpJWT?emailId={email}&otp={otp}`
- Verifies OTP.

### Route mapping after login (must remain)
- `typeOfUser = 0` -> `/superadmin`
- `typeOfUser = 1` -> `/cpoc/:clientId`
- `typeOfUser = 2` -> `/clientEmployee/dashboard`

## 3. Password and Support APIs

1. `PUT /users/updatePassword`
- Requires bearer token.
- Request:
```json
{
  "password": "newPassword"
}
```

2. `POST /Email/sendForHelpAndSupport?content={content}&emailId={email}&subject={subject}`
- Used from support/help flow.

## 4. Client and User Management APIs

1. `GET /clients/pagention?orderBy=asc&page=0&size=10&sortBy=id`
- Fetch paginated client list.

2. `PUT /users/{id}`
- Update user profile/account details.

## 5. Coupon/Brand/Assignment APIs (Expected Active Contracts)
These are required contracts for active superadmin/cpoc/employee modules.

### Brand APIs
- `GET /brands`
- `GET /brands/{id}`
- `POST /brands`
- `PUT /brands/{id}`
- `DELETE /brands/{id}`

### Brand API config
- `GET /brands/{id}/api-profile`
- `PUT /brands/{id}/api-profile`
- `GET /brands/{id}/api-endpoints`
- `PUT /brands/{id}/api-endpoints`
- `POST /brands/{id}/pull`

### Coupon product APIs
- `GET /coupon-products`
- `GET /coupon-products/{id}`
- `POST /coupon-products`
- `PUT /coupon-products/{id}`
- `DELETE /coupon-products/{id}`

### Assignment APIs
- `POST /assignments/brand-coupon`
- `GET /assignments/brand-coupon?clientId={id}`
- `GET /assignments/brand-coupon/{assignmentId}`

### Employee wallet APIs
- `GET /employees/{id}/wallet`
- `GET /employees/{id}/redemptions`
- `POST /employees/{id}/wallet/{walletId}/claim`
- `POST /employees/{id}/wallet/{walletId}/redeem`
- `GET /employees/{id}/coupon-stats` // returns purchased/assigned/expired/redeemed totals
- `GET /employees/{id}/coupon-monthly-report?months=6` // month-wise purchased/assigned/expired counts
- `GET /employees/{id}/wallet/amount-summary` // remainingAmount, totalUsedAmount
- `GET /employees/{id}/wallet/transactions?from=YYYY-MM-DD&to=YYYY-MM-DD&page=0&size=20` // amount ledger for wallet amount view

### Employee browse/category APIs
- `GET /coupon-products?search={text}&brandId={id}&categoryId={id}&discountType={FLAT|PERCENTAGE|CASHBACK}&page=0&size=20`
- `GET /brand-categories?search={text}&isActive=true` // supports category search bar

### Notification APIs
- `GET /notifications`
- `POST /notifications/read`

## 6. Current Frontend Integration Note
- `src/app/client-employee/dashboard/dashboard.component.ts` currently runs mock/local OTP and coupon data for UI demonstration.
- Backend integration for employee dashboard actions (send OTP, verify OTP, browse coupons, claim/redeem) should be connected to APIs listed above before production release.
- Wallet screen has two UI modes: `Coupon` and `Amount`.
- `Coupon` mode uses coupon stats + monthly report endpoints.
- `Amount` mode uses amount summary + wallet transaction endpoints.

## 7. Error/Response Standards (Recommended)

Example count analytics response:
```json
{
  "success": true,
  "message": "Coupon statistics fetched",
  "data": {
    "totals": {
      "purchasedCount": 192,
      "assignedCount": 154,
      "expiredCount": 36,
      "redeemedCount": 112
    },
    "monthlyReport": [
      { "month": "Jan", "purchased": 24, "assigned": 18, "expired": 4 },
      { "month": "Feb", "purchased": 30, "assigned": 22, "expired": 5 }
    ]
  }
}
```

Example wallet amount summary response:
```json
{
  "success": true,
  "message": "Wallet amount summary fetched",
  "data": {
    "remainingAmount": 4280,
    "totalUsedAmount": 8560,
    "currency": "INR"
  }
}
```

Example wallet transaction response:
```json
{
  "success": true,
  "message": "Wallet transactions fetched",
  "data": {
    "items": [
      {
        "id": 101,
        "transactionDate": "2026-02-18T10:25:00Z",
        "description": "Food Coupon Redemption",
        "transactionType": "DEBIT",
        "amount": 540,
        "referenceNo": "TXN-88931"
      },
      {
        "id": 102,
        "transactionDate": "2026-02-14T09:10:00Z",
        "description": "Wallet Top-up",
        "transactionType": "CREDIT",
        "amount": 1200,
        "referenceNo": "TXN-88410"
      }
    ],
    "page": 0,
    "size": 20,
    "totalElements": 2
  }
}
```

Standard error response:
```json
{
  "timestamp": "2026-02-20T12:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/users/VerifyOtpJWT"
}
```

Standard success wrapper:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

## 8. Security Requirements
- All protected endpoints require JWT bearer token.
- Enforce server-side role checks for `typeOfUser`.
- Enforce client scoping for CPOC and employee requests.
- Never expose encrypted secrets in response payloads.
