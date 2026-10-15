-- ==============================================================================
-- مخطط قاعدة بيانات منصة المهدي آل عمران للعقارات (MySQL 8.0+ / MariaDB)
-- ترميز الأحرف: utf8mb4 لضمان الدعم الكامل للغة العربية والرموز التعبيرية
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `almahdi_realestate` 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `almahdi_realestate`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. جدول إعدادات وهوية المنصة
CREATE TABLE IF NOT EXISTS `system_settings` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `platform_name` VARCHAR(255) NOT NULL DEFAULT 'المهدي ال عمران للعقارات',
  `platform_subtitle` VARCHAR(500) NULL,
  `logo_text` VARCHAR(100) NOT NULL DEFAULT 'المهدي آل عمران',
  `primary_color` VARCHAR(20) NOT NULL DEFAULT '#059669',
  `secondary_color` VARCHAR(20) NOT NULL DEFAULT '#0284c7',
  `vat_rate` DECIMAL(5, 4) NOT NULL DEFAULT 0.0500,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'YER',
  `support_phone` VARCHAR(50) NOT NULL DEFAULT '+967 1 477777',
  `support_email` VARCHAR(100) NOT NULL DEFAULT 'care@almahdi-alomran.ye',
  `rega_license_note` TEXT NULL,
  `allow_visitor_reports` TINYINT(1) NOT NULL DEFAULT 1,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. جدول الشركات والمكاتب العقارية
CREATE TABLE IF NOT EXISTS `organizations` (
  `id` VARCHAR(64) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `commercial_record` VARCHAR(50) NOT NULL,
  `fal_org_license` VARCHAR(50) NULL,
  `manager_user_id` VARCHAR(64) NULL,
  `status` ENUM('active', 'pending_verification', 'suspended') DEFAULT 'active',
  `logo_url` VARCHAR(500) NULL,
  `city` VARCHAR(100) NOT NULL DEFAULT 'صنعاء',
  `phone` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_org_cr` (`commercial_record`),
  INDEX `idx_org_city` (`city`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. جدول المستخدمين والحسابات
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(64) PRIMARY KEY,
  `phone` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `role` ENUM(
    'visitor',
    'registered_user',
    'individual_advertiser',
    'org_manager',
    'authorized_broker',
    'content_moderator',
    'compliance_officer',
    'support_officer',
    'financial_officer',
    'system_admin'
  ) NOT NULL DEFAULT 'registered_user',
  `status` ENUM('active', 'suspended', 'pending_verification') NOT NULL DEFAULT 'active',
  `fal_license_number` VARCHAR(50) NULL,
  `org_id` VARCHAR(64) NULL,
  `national_id_masked` VARCHAR(50) NULL,
  `avatar_url` VARCHAR(500) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_user_role` (`role`),
  INDEX `idx_user_status` (`status`),
  CONSTRAINT `fk_user_org` FOREIGN KEY (`org_id`) REFERENCES `organizations` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. جدول المشاريع العقارية الكبرى
CREATE TABLE IF NOT EXISTS `projects` (
  `id` VARCHAR(64) PRIMARY KEY,
  `developer_name` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `district` VARCHAR(100) NOT NULL,
  `description` TEXT NULL,
  `status` ENUM('under_construction', 'ready', 'off_plan') DEFAULT 'under_construction',
  `units_total` INT DEFAULT 0,
  `price_starts_from` DECIMAL(15, 2) NOT NULL,
  `image_url` VARCHAR(500) NULL,
  `handover_date` VARCHAR(50) NULL,
  `features` JSON NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_proj_city` (`city`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. جدول العقارات المادية (Properties)
CREATE TABLE IF NOT EXISTS `properties` (
  `id` VARCHAR(64) PRIMARY KEY,
  `city` VARCHAR(100) NOT NULL,
  `district` VARCHAR(100) NOT NULL,
  `property_type` VARCHAR(50) NOT NULL,
  `total_area_sqm` DECIMAL(10, 2) NOT NULL,
  `latitude` DECIMAL(10, 8) NOT NULL,
  `longitude` DECIMAL(11, 8) NOT NULL,
  `address_description` TEXT NULL,
  `deed_number` VARCHAR(100) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_prop_city` (`city`),
  INDEX `idx_prop_type` (`property_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. جدول الإعلانات العقارية (Listings)
CREATE TABLE IF NOT EXISTS `listings` (
  `id` VARCHAR(64) PRIMARY KEY,
  `property_id` VARCHAR(64) NOT NULL,
  `owner_id` VARCHAR(64) NOT NULL,
  `owner_name` VARCHAR(255) NOT NULL,
  `owner_phone` VARCHAR(50) NOT NULL,
  `org_id` VARCHAR(64) NULL,
  `org_name` VARCHAR(255) NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `purpose` ENUM('sale', 'rent') NOT NULL DEFAULT 'sale',
  `rent_period` VARCHAR(20) NULL,
  `price` DECIMAL(15, 2) NOT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'YER',
  `rooms_count` INT DEFAULT 0,
  `bathrooms_count` INT DEFAULT 0,
  `floor_number` INT NULL,
  `building_age_years` INT DEFAULT 0,
  `facade` VARCHAR(50) NULL,
  `street_width_m` DECIMAL(6, 2) NULL,
  `features` JSON NULL,
  `ad_license_number` VARCHAR(100) NULL,
  `license_verification_status` VARCHAR(50) DEFAULT 'verified',
  `status` VARCHAR(50) NOT NULL DEFAULT 'published',
  `is_featured` TINYINT(1) DEFAULT 0,
  `views_count` INT DEFAULT 0,
  `favorites_count` INT DEFAULT 0,
  `media` JSON NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_list_status` (`status`),
  INDEX `idx_list_purpose` (`purpose`),
  INDEX `idx_list_price` (`price`),
  CONSTRAINT `fk_list_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_list_owner` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. جدول سجل التدقيق الإداري المحمي (Audit Events)
CREATE TABLE IF NOT EXISTS `audit_events` (
  `id` VARCHAR(64) PRIMARY KEY,
  `user_id` VARCHAR(64) NOT NULL,
  `user_role` VARCHAR(50) NOT NULL,
  `user_name` VARCHAR(255) NOT NULL,
  `event_type` VARCHAR(100) NOT NULL,
  `entity_name` VARCHAR(100) NOT NULL,
  `entity_id` VARCHAR(64) NOT NULL,
  `details` TEXT NOT NULL,
  `ip_address` VARCHAR(50) DEFAULT '127.0.0.1',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_audit_event_type` (`event_type`),
  INDEX `idx_audit_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. جدول الفواتير الضريبية (Invoices)
CREATE TABLE IF NOT EXISTS `invoices` (
  `id` VARCHAR(64) PRIMARY KEY,
  `invoice_number` VARCHAR(100) NOT NULL UNIQUE,
  `user_id` VARCHAR(64) NOT NULL,
  `order_id` VARCHAR(64) NOT NULL,
  `subtotal` DECIMAL(15, 2) NOT NULL,
  `vat_amount` DECIMAL(15, 2) NOT NULL,
  `total_amount` DECIMAL(15, 2) NOT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'YER',
  `status` ENUM('paid', 'refunded', 'pending') DEFAULT 'paid',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_inv_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
