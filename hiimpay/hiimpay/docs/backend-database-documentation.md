# HiimPay Backend Database Documentation

## 1. Scope (Current)
This document is updated for the active product flows only:
- SuperAdmin flow (`/superadmin`)
- Client/CPOC flow (`/cpoc/:id`)
- Client Employee flow (`/clientEmployee/*`)

Out-of-scope modules/screens should not be considered part of the active backend contract.

## 2. Identity and Access Model

### `users`
Single auth identity table for all login users.

Columns:
- `id` (PK)
- `full_name` (varchar)
- `email` (varchar, unique)
- `mobile` (varchar)
- `password_hash` (varchar)
- `type_of_user` (int) // `0=SUPERADMIN`, `1=CPOC`, `2=EMPLOYEE`
- `status` (enum: `ACTIVE`, `INACTIVE`, `LOCKED`)
- `client_id` (FK -> clients.id, nullable for superadmin)
- `created_at`, `updated_at`

### `roles` (optional if `type_of_user` is used)
Columns:
- `id` (PK)
- `code` (varchar, unique)
- `name` (varchar)
- `created_at`, `updated_at`

### `user_roles` (optional)
Columns:
- `id` (PK)
- `user_id` (FK -> users.id)
- `role_id` (FK -> roles.id)

## 3. Core Business Tables

### `clients`
Columns:
- `id` (PK)
- `client_name` (varchar)
- `contact_name` (varchar)
- `contact_email` (varchar)
- `contact_mobile` (varchar)
- `status` (enum: `ACTIVE`, `INACTIVE`)
- `created_at`, `updated_at`

### `employees`
Columns:
- `id` (PK)
- `user_id` (FK -> users.id, unique)
- `client_id` (FK -> clients.id)
- `employee_code` (varchar)
- `department` (varchar, nullable)
- `designation` (varchar, nullable)
- `created_at`, `updated_at`

Unique constraints:
- (`client_id`, `employee_code`)

### `notifications`
Columns:
- `id` (PK)
- `user_id` (FK -> users.id)
- `title` (varchar)
- `message` (text)
- `is_read` (boolean)
- `created_at` (timestamp)

## 4. Coupon Domain Tables

### `brand_categories_master`
Columns:
- `id` (PK)
- `category_name` (varchar, unique)
- `display_order` (int)
- `is_active` (boolean)

### `brands`
Columns:
- `id` (PK)
- `brand_name` (varchar)
- `brand_code` (varchar, unique)
- `brand_image_url` (text, nullable)
- `is_active` (boolean)
- `created_at`, `updated_at`

### `brand_category_mappings`
Columns:
- `id` (PK)
- `brand_id` (FK -> brands.id)
- `category_id` (FK -> brand_categories_master.id)

Unique constraints:
- (`brand_id`, `category_id`)

### `coupon_products`
Columns:
- `id` (PK)
- `external_product_id` (varchar, unique)
- `provider_name` (varchar)
- `product_name` (varchar)
- `brand_id` (FK -> brands.id)
- `category_id` (FK -> brand_categories_master.id)
- `description` (text, nullable)
- `image_url` (text, nullable)
- `discount_percent` (decimal(5,2), nullable)
- `discount_amount` (decimal(12,2), nullable)
- `expiry_date` (date, nullable)
- `is_active` (boolean)
- `created_at`, `updated_at`

### `employee_coupon_wallet`
Columns:
- `id` (PK)
- `employee_id` (FK -> employees.id)
- `coupon_id` (FK -> coupon_products.id)
- `coupon_code` (varchar)
- `status` (enum: `ACTIVE`, `USED`, `EXPIRED`)
- `allocated_at` (timestamp)
- `expires_at` (timestamp, nullable)
- `redeemed_at` (timestamp, nullable)

### `employee_wallet_accounts`
Purpose: wallet balance snapshot used by employee `Amount` view.

Columns:
- `id` (PK)
- `employee_id` (FK -> employees.id, unique)
- `currency_code` (varchar(3)) // e.g. `INR`
- `total_credited_amount` (decimal(12,2), default 0)
- `total_debited_amount` (decimal(12,2), default 0)
- `remaining_amount` (decimal(12,2), default 0)
- `last_transaction_at` (timestamp, nullable)
- `created_at`, `updated_at`

### `employee_wallet_transactions`
Purpose: amount transaction history (credit/debit) for wallet amount screen.

Columns:
- `id` (PK)
- `wallet_account_id` (FK -> employee_wallet_accounts.id)
- `employee_id` (FK -> employees.id)
- `transaction_type` (enum: `CREDIT`, `DEBIT`)
- `source_type` (enum: `TOPUP`, `COUPON_REDEMPTION`, `ADJUSTMENT`, `REVERSAL`)
- `amount` (decimal(12,2))
- `currency_code` (varchar(3))
- `description` (varchar)
- `reference_no` (varchar, nullable)
- `coupon_wallet_id` (FK -> employee_coupon_wallet.id, nullable)
- `transaction_at` (timestamp)
- `created_at`

### `employee_redemption_logs`
Columns:
- `id` (PK)
- `employee_wallet_id` (FK -> employee_coupon_wallet.id)
- `employee_id` (FK -> employees.id)
- `coupon_id` (FK -> coupon_products.id)
- `status` (enum: `SUCCESS`, `FAILED`)
- `reference_no` (varchar, nullable)
- `redeemed_at` (timestamp)

### `employee_coupon_monthly_reports`
Purpose: pre-aggregated monthly coupon count analytics for dashboard reporting.

Columns:
- `id` (PK)
- `employee_id` (FK -> employees.id)
- `report_month` (date) // first day of month, e.g. `2026-06-01`
- `purchased_count` (int)
- `assigned_count` (int)
- `expired_count` (int)
- `redeemed_count` (int)
- `created_at`, `updated_at`

## 5. Assignment Tables

### `brand_coupon_assignments`
Columns:
- `id` (PK)
- `client_id` (FK -> clients.id)
- `assigned_by` (FK -> users.id)
- `notes` (text, nullable)
- `assigned_at` (timestamp)

### `brand_coupon_assignment_coupons`
Columns:
- `id` (PK)
- `assignment_id` (FK -> brand_coupon_assignments.id)
- `coupon_id` (FK -> coupon_products.id)

### `brand_coupon_assignment_employees`
Columns:
- `id` (PK)
- `assignment_id` (FK -> brand_coupon_assignments.id)
- `employee_id` (FK -> employees.id)

## 6. API Configuration Tables (Brand Sync)

### `brand_api_profiles`
Columns:
- `id` (PK)
- `brand_id` (FK -> brands.id)
- `profile_name` (varchar)
- `created_at`, `updated_at`

### `brand_api_endpoints`
Columns:
- `id` (PK)
- `brand_api_profile_id` (FK -> brand_api_profiles.id)
- `endpoint_type` (enum: `AUTH`, `DATA`)
- `endpoint_name` (varchar)
- `http_method` (enum: `GET`, `POST`)
- `url` (varchar)
- `api_key_encrypted` (text, nullable)
- `request_secret_encrypted` (text, nullable)
- `sequence_no` (int)

## 7. Flow Mapping (App -> Data)
- SuperAdmin login reads `users`, writes session/token metadata.
- CPOC login reads `users` and navigates with `client_id` context.
- Employee dashboard reads coupon catalog and employee wallet data.
- Coupon claim/write path affects `employee_coupon_wallet` and `employee_redemption_logs`.
- Wallet `Coupon` view reads `employee_coupon_wallet` + `employee_coupon_monthly_reports`.
- Wallet `Amount` view reads `employee_wallet_accounts` + `employee_wallet_transactions`.
- Notifications read/write in `notifications`.

## 8. Required Indexes
- `users(email)` unique
- `users(type_of_user, client_id)`
- `employees(client_id, employee_code)` unique
- `coupon_products(brand_id, category_id, is_active)`
- `employee_coupon_wallet(employee_id, status, expires_at)`
- `employee_coupon_monthly_reports(employee_id, report_month)` unique
- `employee_wallet_accounts(employee_id)` unique
- `employee_wallet_transactions(wallet_account_id, transaction_at desc)`
- `employee_wallet_transactions(employee_id, transaction_type, transaction_at desc)`
- `notifications(user_id, is_read, created_at)`

## 9. Security
- Encrypt secrets in `brand_api_endpoints`.
- Never return password hash/api secrets in API payloads.
- Enforce server-side checks for `type_of_user` and `client_id` scoping.
- Maintain audit logs for assignment, coupon claim, and redemption.
