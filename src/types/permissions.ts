/**
 * Enterprise RBAC Permissions Architecture
 * نظام الصلاحيات والأدوار المعتمد — منصة المهدي آل عمران للعقارات
 */

import { UserRole } from './database';

export type PermissionKey =
  // إعلانات وعقارات
  | 'listings:view'
  | 'listings:create'
  | 'listings:edit_own'
  | 'listings:delete_own'
  | 'listings:moderate'
  | 'listings:compliance_check'
  | 'listings:promote'
  // منشآت ووساطة
  | 'org:manage'
  | 'org:invite_broker'
  | 'org:delegate_listing'
  // مستخدمون وإدارة الحسابات
  | 'users:view'
  | 'users:create'
  | 'users:edit_role'
  | 'users:toggle_status'
  | 'users:delete'
  // مصفوفة الصلاحيات والنظام
  | 'permissions:view'
  | 'permissions:manage'
  // بلاغات ورقابة
  | 'reports:create'
  | 'reports:view_all'
  | 'reports:resolve'
  // امتثال وتراخيص
  | 'compliance:verify_licenses'
  | 'compliance:view_logs'
  // دعم وتذاكر
  | 'tickets:create'
  | 'tickets:view_all'
  | 'tickets:reply'
  // مالية وفواتير
  | 'finance:view_dashboard'
  | 'finance:invoices'
  | 'finance:process_refund'
  // سجل التدقيق والنظام
  | 'audit:view'
  | 'settings:manage'
  | 'database:manage';

export interface PermissionDefinition {
  key: PermissionKey;
  label: string;
  category: 'listings' | 'org' | 'users' | 'reports' | 'compliance' | 'support' | 'finance' | 'system';
  description: string;
}

export const PERMISSION_DEFINITIONS: PermissionDefinition[] = [
  // Listings
  { key: 'listings:view', label: 'تصفح الإعلانات', category: 'listings', description: 'عرض تفاصيل العقارات والمشاريع والخرائط' },
  { key: 'listings:create', label: 'إضافة إعلانات جديدة', category: 'listings', description: 'إنشاء إعلان عقاري جديد ورفعه للمراجعة' },
  { key: 'listings:edit_own', label: 'تعديل الإعلانات الخاصة', category: 'listings', description: 'تعديل تفاصيل أو صور الإعلانات المسجلة باسم المستخدم' },
  { key: 'listings:delete_own', label: 'حذف أو إيقاف الإعلان', category: 'listings', description: 'إيقاف نشر أو أرشفة الإعلان الخاص' },
  { key: 'listings:moderate', label: 'اعتماد ومراجعة الإعلانات', category: 'listings', description: 'فحص الإعلانات في قائمة الانتظار وقبولها أو رفضها' },
  { key: 'listings:compliance_check', label: 'التدقيق النظامي والتراخيص', category: 'listings', description: 'فحص التراخيص العقارية ورخص فال والوثائق' },
  { key: 'listings:promote', label: 'ترقية وترويج الإعلانات', category: 'listings', description: 'شراء باقات الظهور المميز والترويج المدفوع' },

  // Org
  { key: 'org:manage', label: 'إدارة ملف المنشأة العقارية', category: 'org', description: 'تحديث السجل التجاري ورخصة فال للمنشأة وتفاصيل المكتب' },
  { key: 'org:invite_broker', label: 'دعوة وإدارة الوسطاء', category: 'org', description: 'إرسال دعوات للوسطاء وتحديد نطاق تفويضهم' },
  { key: 'org:delegate_listing', label: 'تفويض الإعلانات للوسطاء', category: 'org', description: 'إسناد الإعلانات لوسطاء المنشأة المعتمدين' },

  // Users & RBAC
  { key: 'users:view', label: 'عرض قائمة المستخدمين', category: 'users', description: 'البحث والاطلاع على حسابات المستخدمين والوسطاء' },
  { key: 'users:create', label: 'إضافة مستخدم أو كادر', category: 'users', description: 'تسجيل موظف أو مشرف جديد في النظام' },
  { key: 'users:edit_role', label: 'تعديل أدوار وصلاحيات المستخدمين', category: 'users', description: 'الترقية أو النقل بين الأدوار العشرة المعتمدة' },
  { key: 'users:toggle_status', label: 'تجميد أو تنشيط الحسابات', category: 'users', description: 'إيقاف حساب مخالف أو إعادة تفعيله' },
  { key: 'users:delete', label: 'حذف الحسابات', category: 'users', description: 'حذف الحسابات نهائياً من قاعدة البيانات' },

  // Permissions & System
  { key: 'permissions:view', label: 'عرض مصفوفة الصلاحيات', category: 'system', description: 'استعراض صلاحيات كل دور في النظام' },
  { key: 'permissions:manage', label: 'إدارة وتخصيص الصلاحيات', category: 'system', description: 'تعديل صلاحيات الأدوار وقواعد الوصول' },

  // Reports
  { key: 'reports:create', label: 'إرسال بلاغ أو شكوى', category: 'reports', description: 'الإبلاغ عن إعلان مخالف أو غير دقيق' },
  { key: 'reports:view_all', label: 'استعراض البلاغات الواردة', category: 'reports', description: 'متابعة قائمة الشكاوى والبلاغات المفتوحة' },
  { key: 'reports:resolve', label: 'معالجة واتخاذ قرار بالبلاغ', category: 'reports', description: 'إغلاق البلاغ مع توثيق الإجراء المتخذ' },

  // Compliance
  { key: 'compliance:verify_licenses', label: 'التحقق من الرخص والتراخيص', category: 'compliance', description: 'مطابقة التراخيص مع متطلبات الهيئة' },
  { key: 'compliance:view_logs', label: 'سجلات الامتثال والربط الحكومي', category: 'compliance', description: 'الاطلاع على طلبات التحقق وسجلات الرقابة' },

  // Support
  { key: 'tickets:create', label: 'فتح تذكرة دعم فني', category: 'support', description: 'إرسال طلب مساعدة أو استفسار لفريق الدعم' },
  { key: 'tickets:view_all', label: 'استعراض جميع تذاكر الدعم', category: 'support', description: 'إدارة قائمة التذاكر وتوزيعها' },
  { key: 'tickets:reply', label: 'الرد على تذاكر الدعم وإغلاقها', category: 'support', description: 'محادثة العميل وإيجاد الحلول' },

  // Finance
  { key: 'finance:view_dashboard', label: 'لوحة العمليات المالية', category: 'finance', description: 'الاطلاع على إجمالي الإيرادات والمتحصلات' },
  { key: 'finance:invoices', label: 'إصدار وإدارة الفواتير الضريبية', category: 'finance', description: 'استعراض وتنزيل الفواتير الضريبية الرسمية' },
  { key: 'finance:process_refund', label: 'معالجة واعتماد طلبات الاسترداد', category: 'finance', description: 'الموافقة على إعادة المبالغ للعملاء' },

  // Audit & Settings & DB
  { key: 'audit:view', label: 'استعراض سجل التدقيق الإداري', category: 'system', description: 'تتبع العمليات الحساسة وسجل التغييرات المحمي' },
  { key: 'settings:manage', label: 'تخصيص هوية وإعدادات المنصة', category: 'system', description: 'تعديل الاسم والشعار والألوان والضرائب' },
  { key: 'database:manage', label: 'إدارة قاعدة بيانات MySQL', category: 'system', description: 'الاتصال المحلي، تشغيل الاستعلامات وتصدير SQL' },
];

export interface RoleMetadata {
  role: UserRole;
  title: string;
  badge: string;
  badgeColor: string;
  badgeBorder: string;
  level: number;
  description: string;
  typicalPersona: string;
}

export const ROLE_METADATA: Record<UserRole, RoleMetadata> = {
  visitor: {
    role: 'visitor',
    title: 'الزائر العام',
    badge: 'زائر',
    badgeColor: 'bg-slate-100 text-slate-700',
    badgeBorder: 'border-slate-200',
    level: 1,
    description: 'تصفح الإعلانات والمشاريع، البحث والفلترة والمؤشرات دون حساب',
    typicalPersona: 'مستخدم يتصفح المنصة دون تسجيل دخول',
  },
  registered_user: {
    role: 'registered_user',
    title: 'مستخدم مسجل',
    badge: 'مستخدم',
    badgeColor: 'bg-blue-50 text-blue-700',
    badgeBorder: 'border-blue-200',
    level: 2,
    description: 'إدارة المفضلة، حفظ البحث، التقديم على حجز، رفع البلاغات وتذاكر الدعم',
    typicalPersona: 'أحمد بن فهد الدوسري (باحث عن عقار)',
  },
  individual_advertiser: {
    role: 'individual_advertiser',
    title: 'المعلن الفرد',
    badge: 'معلن فرد',
    badgeColor: 'bg-emerald-50 text-emerald-700',
    badgeBorder: 'border-emerald-200',
    level: 3,
    description: 'إنشاء الإعلانات، ربط ترخيص الإعلان، شراء باقات الترويج، متابعة المشاهدات',
    typicalPersona: 'سعود بن عبدالملك العتيبي (مالك / معلن مستقل)',
  },
  org_manager: {
    role: 'org_manager',
    title: 'مدير المنشأة العقارية',
    badge: 'مدير منشأة',
    badgeColor: 'bg-indigo-50 text-indigo-700',
    badgeBorder: 'border-indigo-200',
    level: 4,
    description: 'إدارة ملف المكتب، رخصة فال للمنشآت، دعوة وتفويض الوسطاء، وإدارة إعلانات المكتب',
    typicalPersona: 'خالد بن عبدالعزيز الشمري (شركة أركان العقارية)',
  },
  authorized_broker: {
    role: 'authorized_broker',
    title: 'وسيط عقاري مفوض',
    badge: 'وسيط معتمد',
    badgeColor: 'bg-cyan-50 text-cyan-700',
    badgeBorder: 'border-cyan-200',
    level: 4,
    description: 'إدارة ونشر الإعلانات الموكلة إليه ضمن نطاق تفويض المنشأة التابع لها',
    typicalPersona: 'طارق بن ناصر المطيري (وسيط معتمد)',
  },
  content_moderator: {
    role: 'content_moderator',
    title: 'مشرف المحتوى والجودة',
    badge: 'مشرف محتوى',
    badgeColor: 'bg-amber-50 text-amber-700',
    badgeBorder: 'border-amber-200',
    level: 5,
    description: 'فحص الإعلانات المعلقة، مراجعة الصور والوصف، القبول أو الرفض مع سبب إلزامي',
    typicalPersona: 'منى بنت سليمان التميمي (مراقبة الجودة)',
  },
  compliance_officer: {
    role: 'compliance_officer',
    title: 'مسؤول الامتثال والتراخيص',
    badge: 'مسؤول امتثال',
    badgeColor: 'bg-purple-50 text-purple-700',
    badgeBorder: 'border-purple-200',
    level: 6,
    description: 'فحص التراخيص العقارية ورخص فال، مراقبة سجلات الرقابة وتوثيق المطابقة',
    typicalPersona: 'فيصل بن إبراهيم القحطاني (الامتثال النظامي)',
  },
  support_officer: {
    role: 'support_officer',
    title: 'مسؤول الدعم الفني',
    badge: 'دعم فني',
    badgeColor: 'bg-teal-50 text-teal-700',
    badgeBorder: 'border-teal-200',
    level: 5,
    description: 'متابعة تذاكر الدعم الواردة وتصنيفها والرد على استفسارات المستخدمين والمعلنين',
    typicalPersona: 'ريم بنت عبدالله العمري (خدمة العملاء)',
  },
  financial_officer: {
    role: 'financial_officer',
    title: 'المسؤول المالي',
    badge: 'مالية',
    badgeColor: 'bg-rose-50 text-rose-700',
    badgeBorder: 'border-rose-200',
    level: 6,
    description: 'متابعة المدفوعات والباقات، الفواتير الضريبية، ومراجعة واعتماد طلبات الاسترداد',
    typicalPersona: 'ماجد بن صالح الزهراني (الشؤون المالية)',
  },
  system_admin: {
    role: 'system_admin',
    title: 'مدير النظام الشامل (Super Admin)',
    badge: 'مدير النظام',
    badgeColor: 'bg-red-50 text-red-700',
    badgeBorder: 'border-red-200',
    level: 10,
    description: 'صلاحيات مطلقة: إدارة المستخدمين والأدوار، سجل التدقيق، تخصيص الهوية والربط الخادمي وقاعدة البيانات',
    typicalPersona: 'عبدالرحمن بن حمود الحربي (مدير النظام)',
  },
};

/**
 * Standard Role-to-Permissions Mapping Matrix
 */
export const ROLE_PERMISSIONS_MATRIX: Record<UserRole, PermissionKey[]> = {
  visitor: [
    'listings:view',
  ],

  registered_user: [
    'listings:view',
    'reports:create',
    'tickets:create',
    'permissions:view',
  ],

  individual_advertiser: [
    'listings:view',
    'listings:create',
    'listings:edit_own',
    'listings:delete_own',
    'listings:promote',
    'reports:create',
    'tickets:create',
    'permissions:view',
  ],

  org_manager: [
    'listings:view',
    'listings:create',
    'listings:edit_own',
    'listings:delete_own',
    'listings:promote',
    'org:manage',
    'org:invite_broker',
    'org:delegate_listing',
    'reports:create',
    'tickets:create',
    'permissions:view',
  ],

  authorized_broker: [
    'listings:view',
    'listings:create',
    'listings:edit_own',
    'listings:promote',
    'org:delegate_listing',
    'reports:create',
    'tickets:create',
    'permissions:view',
  ],

  content_moderator: [
    'listings:view',
    'listings:moderate',
    'reports:view_all',
    'reports:resolve',
    'users:view',
    'users:toggle_status',
    'permissions:view',
  ],

  compliance_officer: [
    'listings:view',
    'listings:compliance_check',
    'compliance:verify_licenses',
    'compliance:view_logs',
    'reports:view_all',
    'users:view',
    'permissions:view',
  ],

  support_officer: [
    'listings:view',
    'tickets:view_all',
    'tickets:reply',
    'users:view',
    'reports:view_all',
    'permissions:view',
  ],

  financial_officer: [
    'listings:view',
    'finance:view_dashboard',
    'finance:invoices',
    'finance:process_refund',
    'permissions:view',
  ],

  system_admin: [
    'listings:view',
    'listings:create',
    'listings:edit_own',
    'listings:delete_own',
    'listings:moderate',
    'listings:compliance_check',
    'listings:promote',
    'org:manage',
    'org:invite_broker',
    'org:delegate_listing',
    'users:view',
    'users:create',
    'users:edit_role',
    'users:toggle_status',
    'users:delete',
    'permissions:view',
    'permissions:manage',
    'reports:create',
    'reports:view_all',
    'reports:resolve',
    'compliance:verify_licenses',
    'compliance:view_logs',
    'tickets:create',
    'tickets:view_all',
    'tickets:reply',
    'finance:view_dashboard',
    'finance:invoices',
    'finance:process_refund',
    'audit:view',
    'settings:manage',
    'database:manage',
  ],
};

/**
 * Check if a given role has a specific permission
 */
export function roleHasPermission(role: UserRole, permission: PermissionKey): boolean {
  if (role === 'system_admin') return true;
  const list = ROLE_PERMISSIONS_MATRIX[role] || [];
  return list.includes(permission);
}
