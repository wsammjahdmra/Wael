/**
 * Enterprise MySQL Database Connection & Migration Adapter
 * منصة المهدي ال عمران للعقارات — الإصدار الرابع
 */

import mysql from 'mysql2/promise';
import { db } from './db';

export interface MySQLConfig {
  host: string;
  port: number;
  user: string;
  password?: string;
  database: string;
}

// Default connection settings (matches standard local environments: XAMPP, Laragon, WAMP, Docker)
let currentConfig: MySQLConfig = {
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'almahdi_realestate',
};

let activePool: mysql.Pool | null = null;

function getPool(): mysql.Pool {
  if (!activePool) {
    activePool = mysql.createPool({
      host: currentConfig.host,
      port: currentConfig.port,
      user: currentConfig.user,
      password: currentConfig.password,
      database: currentConfig.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 5000,
      charset: 'utf8mb4',
    });
  }
  return activePool;
}

export function updateMySQLConfig(newConfig: Partial<MySQLConfig>) {
  currentConfig = { ...currentConfig, ...newConfig };
  if (activePool) {
    activePool.end().catch(() => {});
    activePool = null;
  }
}

export function getActiveMySQLConfig(): MySQLConfig {
  return { ...currentConfig };
}

/**
 * Check connection health and fetch table metadata
 */
export async function checkMySQLStatus(): Promise<{
  connected: boolean;
  version?: string;
  latencyMs?: number;
  tablesCount?: number;
  tables?: string[];
  error?: string;
  config: Omit<MySQLConfig, 'password'> & { hasPassword: boolean };
}> {
  const safeConfig = {
    host: currentConfig.host,
    port: currentConfig.port,
    user: currentConfig.user,
    database: currentConfig.database,
    hasPassword: Boolean(currentConfig.password && currentConfig.password.length > 0),
  };

  const startTime = Date.now();
  try {
    const pool = getPool();
    // Test simple ping query
    const [rows] = await pool.query('SELECT VERSION() AS version, DATABASE() as dbName');
    const latencyMs = Date.now() - startTime;
    const versionRow = (rows as any[])[0];

    // Get list of tables
    const [tablesResult] = await pool.query('SHOW TABLES');
    const tableNames = (tablesResult as any[]).map((r) => Object.values(r)[0] as string);

    return {
      connected: true,
      version: versionRow?.version || 'MySQL Compatible',
      latencyMs,
      tablesCount: tableNames.length,
      tables: tableNames,
      config: safeConfig,
    };
  } catch (err: any) {
    return {
      connected: false,
      latencyMs: Date.now() - startTime,
      error: err?.message || 'تعذر الاتصال بخادم MySQL المحلي',
      config: safeConfig,
    };
  }
}

/**
 * Test custom credentials without permanently applying them
 */
export async function testConnectionCredentials(testCfg: MySQLConfig): Promise<{
  success: boolean;
  message: string;
  version?: string;
  latencyMs?: number;
}> {
  const startTime = Date.now();
  let conn: mysql.Connection | null = null;
  try {
    conn = await mysql.createConnection({
      host: testCfg.host,
      port: testCfg.port,
      user: testCfg.user,
      password: testCfg.password,
      database: testCfg.database,
      connectTimeout: 4000,
    });

    const [rows] = await conn.query('SELECT VERSION() AS version');
    const latencyMs = Date.now() - startTime;
    const version = (rows as any[])[0]?.version;
    await conn.end();

    return {
      success: true,
      message: `تم الاتصال بنجاح بخادم MySQL (الإصدار: ${version}) خلال ${latencyMs}ms!`,
      version,
      latencyMs,
    };
  } catch (err: any) {
    if (conn) {
      try {
        await conn.end();
      } catch {}
    }
    return {
      success: false,
      message: `فشل الاتصال: ${err?.message || 'خطأ غير معروف في الاتصال بالخادم'}`,
    };
  }
}

/**
 * Execute raw SQL query safely
 */
export async function runRawQuery(sql: string): Promise<{
  success: boolean;
  rows?: any[];
  fields?: string[];
  affectedRows?: number;
  message?: string;
}> {
  try {
    const pool = getPool();
    const [result, fields] = await pool.query(sql);

    if (Array.isArray(result)) {
      const fieldNames = fields ? fields.map((f) => f.name) : (result.length > 0 ? Object.keys(result[0]) : []);
      return {
        success: true,
        rows: result,
        fields: fieldNames,
      };
    } else {
      return {
        success: true,
        affectedRows: (result as mysql.ResultSetHeader).affectedRows,
        message: `تم تنفيذ الاستعلام بنجاح. الصفوف المتأثرة: ${(result as mysql.ResultSetHeader).affectedRows}`,
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'خطأ أثناء تنفيذ استعلام SQL',
    };
  }
}

/**
 * Generate DDL SQL Script matching TypeScript types
 */
export function generateSchemaSQL(): string {
  return `-- ==============================================================================
-- مخطط قاعدة بيانات منصة المهدي آل عمران للعقارات (MySQL 8.0+ / MariaDB)
-- ترميز الأحرف: utf8mb4 لضمان الدعم الكامل للغة العربية والرموز التعبيرية
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS \`${currentConfig.database}\` 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE \`${currentConfig.database}\`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. جدول إعدادات وهوية المنصة
CREATE TABLE IF NOT EXISTS \`system_settings\` (
  \`id\` INT PRIMARY KEY AUTO_INCREMENT,
  \`platform_name\` VARCHAR(255) NOT NULL DEFAULT 'المهدي ال عمران للعقارات',
  \`platform_subtitle\` VARCHAR(500) NULL,
  \`logo_text\` VARCHAR(100) NOT NULL DEFAULT 'المهدي آل عمران',
  \`primary_color\` VARCHAR(20) NOT NULL DEFAULT '#059669',
  \`secondary_color\` VARCHAR(20) NOT NULL DEFAULT '#0284c7',
  \`vat_rate\` DECIMAL(5, 4) NOT NULL DEFAULT 0.0500,
  \`currency\` VARCHAR(10) NOT NULL DEFAULT 'YER',
  \`support_phone\` VARCHAR(50) NOT NULL DEFAULT '+967 1 477777',
  \`support_email\` VARCHAR(100) NOT NULL DEFAULT 'care@almahdi-alomran.ye',
  \`rega_license_note\` TEXT NULL,
  \`allow_visitor_reports\` TINYINT(1) NOT NULL DEFAULT 1,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. جدول الشركات والمكاتب العقارية
CREATE TABLE IF NOT EXISTS \`organizations\` (
  \`id\` VARCHAR(64) PRIMARY KEY,
  \`name\` VARCHAR(255) NOT NULL,
  \`commercial_record\` VARCHAR(50) NOT NULL,
  \`fal_org_license\` VARCHAR(50) NULL,
  \`manager_user_id\` VARCHAR(64) NULL,
  \`status\` ENUM('active', 'pending_verification', 'suspended') DEFAULT 'active',
  \`logo_url\` VARCHAR(500) NULL,
  \`city\` VARCHAR(100) NOT NULL DEFAULT 'صنعاء',
  \`phone\` VARCHAR(50) NOT NULL,
  \`email\` VARCHAR(100) NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_org_cr\` (\`commercial_record\`),
  INDEX \`idx_org_city\` (\`city\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. جدول المستخدمين والحسابات
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` VARCHAR(64) PRIMARY KEY,
  \`phone\` VARCHAR(50) NOT NULL UNIQUE,
  \`email\` VARCHAR(100) NULL,
  \`full_name\` VARCHAR(255) NOT NULL,
  \`role\` ENUM(
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
  \`status\` ENUM('active', 'suspended', 'pending_verification') NOT NULL DEFAULT 'active',
  \`fal_license_number\` VARCHAR(50) NULL,
  \`org_id\` VARCHAR(64) NULL,
  \`national_id_masked\` VARCHAR(50) NULL,
  \`avatar_url\` VARCHAR(500) NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX \`idx_user_role\` (\`role\`),
  INDEX \`idx_user_status\` (\`status\`),
  CONSTRAINT \`fk_user_org\` FOREIGN KEY (\`org_id\`) REFERENCES \`organizations\` (\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. جدول المشاريع العقارية الكبرى
CREATE TABLE IF NOT EXISTS \`projects\` (
  \`id\` VARCHAR(64) PRIMARY KEY,
  \`developer_name\` VARCHAR(255) NOT NULL,
  \`name\` VARCHAR(255) NOT NULL,
  \`city\` VARCHAR(100) NOT NULL,
  \`district\` VARCHAR(100) NOT NULL,
  \`description\` TEXT NULL,
  \`status\` ENUM('under_construction', 'ready', 'off_plan') DEFAULT 'under_construction',
  \`units_total\` INT DEFAULT 0,
  \`price_starts_from\` DECIMAL(15, 2) NOT NULL,
  \`image_url\` VARCHAR(500) NULL,
  \`handover_date\` VARCHAR(50) NULL,
  \`features\` JSON NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_proj_city\` (\`city\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. جدول العقارات المادية (Properties)
CREATE TABLE IF NOT EXISTS \`properties\` (
  \`id\` VARCHAR(64) PRIMARY KEY,
  \`city\` VARCHAR(100) NOT NULL,
  \`district\` VARCHAR(100) NOT NULL,
  \`property_type\` VARCHAR(50) NOT NULL,
  \`total_area_sqm\` DECIMAL(10, 2) NOT NULL,
  \`latitude\` DECIMAL(10, 8) NOT NULL,
  \`longitude\` DECIMAL(11, 8) NOT NULL,
  \`address_description\` TEXT NULL,
  \`deed_number\` VARCHAR(100) NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_prop_city\` (\`city\`),
  INDEX \`idx_prop_type\` (\`property_type\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. جدول الإعلانات العقارية (Listings)
CREATE TABLE IF NOT EXISTS \`listings\` (
  \`id\` VARCHAR(64) PRIMARY KEY,
  \`property_id\` VARCHAR(64) NOT NULL,
  \`owner_id\` VARCHAR(64) NOT NULL,
  \`owner_name\` VARCHAR(255) NOT NULL,
  \`owner_phone\` VARCHAR(50) NOT NULL,
  \`org_id\` VARCHAR(64) NULL,
  \`org_name\` VARCHAR(255) NULL,
  \`title\` VARCHAR(255) NOT NULL,
  \`description\` TEXT NOT NULL,
  \`purpose\` ENUM('sale', 'rent') NOT NULL DEFAULT 'sale',
  \`rent_period\` VARCHAR(20) NULL,
  \`price\` DECIMAL(15, 2) NOT NULL,
  \`currency\` VARCHAR(10) NOT NULL DEFAULT 'YER',
  \`rooms_count\` INT DEFAULT 0,
  \`bathrooms_count\` INT DEFAULT 0,
  \`floor_number\` INT NULL,
  \`building_age_years\` INT DEFAULT 0,
  \`facade\` VARCHAR(50) NULL,
  \`street_width_m\` DECIMAL(6, 2) NULL,
  \`features\` JSON NULL,
  \`ad_license_number\` VARCHAR(100) NULL,
  \`license_verification_status\` VARCHAR(50) DEFAULT 'verified',
  \`status\` VARCHAR(50) NOT NULL DEFAULT 'published',
  \`is_featured\` TINYINT(1) DEFAULT 0,
  \`views_count\` INT DEFAULT 0,
  \`favorites_count\` INT DEFAULT 0,
  \`media\` JSON NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX \`idx_list_status\` (\`status\`),
  INDEX \`idx_list_purpose\` (\`purpose\`),
  INDEX \`idx_list_price\` (\`price\`),
  CONSTRAINT \`fk_list_property\` FOREIGN KEY (\`property_id\`) REFERENCES \`properties\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_list_owner\` FOREIGN KEY (\`owner_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. جدول سجل التدقيق الإداري المحمي (Audit Events)
CREATE TABLE IF NOT EXISTS \`audit_events\` (
  \`id\` VARCHAR(64) PRIMARY KEY,
  \`user_id\` VARCHAR(64) NOT NULL,
  \`user_role\` VARCHAR(50) NOT NULL,
  \`user_name\` VARCHAR(255) NOT NULL,
  \`event_type\` VARCHAR(100) NOT NULL,
  \`entity_name\` VARCHAR(100) NOT NULL,
  \`entity_id\` VARCHAR(64) NOT NULL,
  \`details\` TEXT NOT NULL,
  \`ip_address\` VARCHAR(50) DEFAULT '127.0.0.1',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_audit_event_type\` (\`event_type\`),
  INDEX \`idx_audit_user\` (\`user_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. جدول الفواتير الضريبية (Invoices)
CREATE TABLE IF NOT EXISTS \`invoices\` (
  \`id\` VARCHAR(64) PRIMARY KEY,
  \`invoice_number\` VARCHAR(100) NOT NULL UNIQUE,
  \`user_id\` VARCHAR(64) NOT NULL,
  \`order_id\` VARCHAR(64) NOT NULL,
  \`subtotal\` DECIMAL(15, 2) NOT NULL,
  \`vat_amount\` DECIMAL(15, 2) NOT NULL,
  \`total_amount\` DECIMAL(15, 2) NOT NULL,
  \`currency\` VARCHAR(10) NOT NULL DEFAULT 'YER',
  \`status\` ENUM('paid', 'refunded', 'pending') DEFAULT 'paid',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_inv_user\` (\`user_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
`;
}

/**
 * Generate DML SQL Seed script
 */
export function generateSeedSQL(): string {
  const users = Array.from(db.users.values());
  const orgs = Array.from(db.organizations.values());
  const properties = Array.from(db.properties.values());
  const listings = Array.from(db.listings.values());
  const projects = Array.from(db.projects.values());

  let sql = `-- ==============================================================================
-- بيانات أولية معتمدة لهوية «المهدي ال عمران للعقارات» في اليمن
-- ==============================================================================

USE \`${currentConfig.database}\`;

SET FOREIGN_KEY_CHECKS = 0;

-- إعدادات المنصة
INSERT INTO \`system_settings\` (
  \`id\`, \`platform_name\`, \`platform_subtitle\`, \`logo_text\`, \`primary_color\`, \`secondary_color\`, \`vat_rate\`, \`currency\`, \`support_phone\`, \`support_email\`, \`rega_license_note\`, \`allow_visitor_reports\`
) VALUES (
  1,
  '${db.settings.platformName}',
  '${db.settings.platformSubtitle}',
  '${db.settings.logoText}',
  '${db.settings.primaryColor}',
  '${db.settings.secondaryColor}',
  ${db.settings.vatRate},
  '${db.settings.currency}',
  '${db.settings.supportPhone}',
  '${db.settings.supportEmail}',
  '${db.settings.regaLicenseNote.replace(/'/g, "\\'")}',
  1
) ON DUPLICATE KEY UPDATE 
  \`platform_name\`=VALUES(\`platform_name\`),
  \`currency\`=VALUES(\`currency\`);

`;

  // Seed Organizations
  if (orgs.length > 0) {
    sql += `-- الشركات والمنشآت العقارية\n`;
    for (const o of orgs) {
      sql += `INSERT INTO \`organizations\` (\`id\`, \`name\`, \`commercial_record\`, \`fal_org_license\`, \`manager_user_id\`, \`status\`, \`logo_url\`, \`city\`, \`phone\`, \`email\`) VALUES (
  '${o.id}', '${o.name.replace(/'/g, "\\'")}', '${o.commercialRecord}', '${o.falOrgLicense || ''}', '${o.managerUserId || ''}', '${o.status}', '${o.logoUrl || ''}', '${o.city}', '${o.phone}', '${o.email}'
) ON DUPLICATE KEY UPDATE \`name\`=VALUES(\`name\`);\n`;
    }
    sql += '\n';
  }

  // Seed Users
  if (users.length > 0) {
    sql += `-- المستخدمون\n`;
    for (const u of users) {
      sql += `INSERT INTO \`users\` (\`id\`, \`phone\`, \`email\`, \`full_name\`, \`role\`, \`status\`, \`fal_license_number\`, \`org_id\`, \`national_id_masked\`, \`avatar_url\`) VALUES (
  '${u.id}', '${u.phone}', '${u.email || ''}', '${u.fullName.replace(/'/g, "\\'")}', '${u.role}', '${u.status}', '${u.falLicenseNumber || ''}', ${u.orgId ? `'${u.orgId}'` : 'NULL'}, '${u.nationalIdMasked || ''}', '${u.avatarUrl || ''}'
) ON DUPLICATE KEY UPDATE \`full_name\`=VALUES(\`full_name\`);\n`;
    }
    sql += '\n';
  }

  // Seed Projects
  if (projects.length > 0) {
    sql += `-- المشاريع الكبرى\n`;
    for (const p of projects) {
      sql += `INSERT INTO \`projects\` (\`id\`, \`developer_name\`, \`name\`, \`city\`, \`district\`, \`description\`, \`status\`, \`units_total\`, \`price_starts_from\`, \`image_url\`, \`handover_date\`, \`features\`) VALUES (
  '${p.id}', '${p.developerName.replace(/'/g, "\\'")}', '${p.name.replace(/'/g, "\\'")}', '${p.city}', '${p.district}', '${(p.description || '').replace(/'/g, "\\'")}', '${p.status}', ${p.unitsTotal}, ${p.priceStartsFrom}, '${p.imageUrl || ''}', '${p.handoverDate || ''}', '${JSON.stringify(p.features || [])}'
) ON DUPLICATE KEY UPDATE \`name\`=VALUES(\`name\`);\n`;
    }
    sql += '\n';
  }

  // Seed Properties
  if (properties.length > 0) {
    sql += `-- العقارات الميدانية\n`;
    for (const prop of properties) {
      sql += `INSERT INTO \`properties\` (\`id\`, \`city\`, \`district\`, \`property_type\`, \`total_area_sqm\`, \`latitude\`, \`longitude\`, \`address_description\`, \`deed_number\`) VALUES (
  '${prop.id}', '${prop.city}', '${prop.district}', '${prop.propertyType}', ${prop.totalAreaSqm}, ${prop.latitude}, ${prop.longitude}, '${(prop.addressDescription || '').replace(/'/g, "\\'")}', '${prop.deedNumber || ''}'
) ON DUPLICATE KEY UPDATE \`city\`=VALUES(\`city\`);\n`;
    }
    sql += '\n';
  }

  // Seed Listings
  if (listings.length > 0) {
    sql += `-- الإعلانات العقارية النشطة\n`;
    for (const l of listings) {
      sql += `INSERT INTO \`listings\` (\`id\`, \`property_id\`, \`owner_id\`, \`owner_name\`, \`owner_phone\`, \`org_id\`, \`org_name\`, \`title\`, \`description\`, \`purpose\`, \`rent_period\`, \`price\`, \`currency\`, \`rooms_count\`, \`bathrooms_count\`, \`floor_number\`, \`building_age_years\`, \`facade\`, \`street_width_m\`, \`features\`, \`ad_license_number\`, \`license_verification_status\`, \`status\`, \`is_featured\`, \`views_count\`, \`favorites_count\`, \`media\`) VALUES (
  '${l.id}', '${l.propertyId}', '${l.ownerId}', '${l.ownerName.replace(/'/g, "\\'")}', '${l.ownerPhone}', ${l.orgId ? `'${l.orgId}'` : 'NULL'}, ${l.orgName ? `'${l.orgName.replace(/'/g, "\\'")}'` : 'NULL'}, '${l.title.replace(/'/g, "\\'")}', '${l.description.replace(/'/g, "\\'")}', '${l.purpose}', ${l.rentPeriod ? `'${l.rentPeriod}'` : 'NULL'}, ${l.price}, '${l.currency || 'YER'}', ${l.roomsCount || 0}, ${l.bathroomsCount || 0}, ${l.floorNumber || 'NULL'}, ${l.buildingAgeYears || 0}, '${l.facade || ''}', ${l.streetWidthM || 'NULL'}, '${JSON.stringify(l.features || [])}', '${l.adLicenseNumber || ''}', '${l.licenseVerificationStatus}', '${l.status}', ${l.isFeatured ? 1 : 0}, ${l.viewsCount || 0}, ${l.favoritesCount || 0}, '${JSON.stringify(l.media || [])}'
) ON DUPLICATE KEY UPDATE \`title\`=VALUES(\`title\`);\n`;
    }
    sql += '\n';
  }

  sql += `SET FOREIGN_KEY_CHECKS = 1;\n`;
  return sql;
}

/**
 * Full combined SQL export script
 */
export function generateFullDumpSQL(): string {
  const schema = generateSchemaSQL();
  const seed = generateSeedSQL();
  return `${schema}\n\n${seed}`;
}

/**
 * Execute schema migration on the currently connected MySQL
 */
export async function initializeMySQLDatabase(): Promise<{ success: boolean; message: string; tablesCount?: number }> {
  try {
    const pool = getPool();

    // Check / create database if missing
    await pool.query(`CREATE DATABASE IF NOT EXISTS \`${currentConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await pool.query(`USE \`${currentConfig.database}\``);

    // Split and execute DDL statements
    const schema = generateSchemaSQL();
    const statements = schema
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'));

    for (const stmt of statements) {
      await pool.query(stmt);
    }

    const [tablesResult] = await pool.query('SHOW TABLES');
    const tableNames = (tablesResult as any[]).map((r) => Object.values(r)[0] as string);

    return {
      success: true,
      message: `تم إنشاء وتهيئة جميع جداول قاعدة البيانات (${tableNames.length} جدول) بنجاح!`,
      tablesCount: tableNames.length,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `فشل تهيئة جداول MySQL: ${err?.message || 'خطأ غير معروف'}`,
    };
  }
}

/**
 * Execute seed migration on the currently connected MySQL
 */
export async function seedMySQLDatabase(): Promise<{ success: boolean; message: string }> {
  try {
    const pool = getPool();
    await pool.query(`USE \`${currentConfig.database}\``);

    const seedSql = generateSeedSQL();
    const statements = seedSql
      .split(';\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'));

    for (const stmt of statements) {
      await pool.query(stmt);
    }

    return {
      success: true,
      message: 'تم استيراد كافة بيانات منصة المهدي ال عمران للعقارات في MySQL بنجاح!',
    };
  } catch (err: any) {
    return {
      success: false,
      message: `فشل استيراد البيانات في MySQL: ${err?.message || 'خطأ غير معروف'}`,
    };
  }
}
