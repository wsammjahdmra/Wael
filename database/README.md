# دليل تشغيل قاعدة بيانات MySQL المحلية — منصة المهدي آل عمران للعقارات

هذا الدليل يوضح كيفية ربط وتشغيل قاعدة بيانات **MySQL** محلياً على جهازك مع تطبيق **المهدي آل عمران للعقارات**.

---

## 1. متطلبات التشغيل
- تثبيت أي خادم MySQL محلي مثل:
  - **XAMPP** (يحتوي على Apache + MySQL + phpMyAdmin)
  - **Laragon** (سريع وخفيف جداً)
  - **WampServer**
  - **Docker**
  - أو **MySQL Server 8.0+** الرسمي مع **MySQL Workbench**.

---

## 2. الإعداد السريع عبر سطر الأوامر (Terminal / CMD)

### الخطوة الأولى: إنشاء قاعدة البيانات
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS almahdi_realestate CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```
*(ملاحظة: إذا لم يكن لخادمك كلمة مرور، يمكنك حذف `-p` أو الضغط على Enter مباشرة).*

### الخطوة الثانية: استيراد المخطط والجداول
```bash
mysql -u root -p almahdi_realestate < database/schema.sql
```

### الخطوة الثالثة: استيراد البيانات الأولية (عقارات اليمن والريال اليمني)
```bash
mysql -u root -p almahdi_realestate < database/seed.sql
```

---

## 3. الإعداد عبر phpMyAdmin (XAMPP / Laragon)
1. افتح المتصفح وانتقل إلى: `http://localhost/phpmyadmin`
2. اضغط على **New** (جديد) لإنشاء قاعدة بيانات جديدة.
3. اسم القاعدة: `almahdi_realestate`
4. الترميز (Collation): اختر `utf8mb4_unicode_ci` ثم اضغط **Create** (إنشاء).
5. اختر قاعدة البيانات التي تم إنشاؤها، ثم اضغط على تبويب **Import** (استيراد).
6. اختر الملف `database/schema.sql` ثم اضغط **Go** (تنفيذ).
7. كرر نفس العملية مع الملف `database/seed.sql`.

---

## 4. الإعداد عبر Docker (خيار المطورين)
إذا كنت تستخدم Docker، يمكنك تشغيل حاوية MySQL بترميز عربي فوري عبر هذا الأمر:

```bash
docker run -d \
  --name almahdi_mysql \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=almahdi_realestate \
  mysql:8.0 \
  --character-set-server=utf8mb4 \
  --collation-server=utf8mb4_unicode_ci
```

---

## 5. متغيرات البيئة (.env)
تأكد من توافق إعدادات ملف `.env` مع جهازك:

```env
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=almahdi_realestate
```

---

## 6. فحص الاتصال ومحرر الاستعلامات من داخل المنصة
يمكنك في أي وقت الدخول إلى:
**لوحة التحكم الإدارية -> قاعدة بيانات MySQL المحلية**
لفحص الاتصال، تهيئة الجداول تلقائياً، تنفيذ استعلامات SQL حية، وتحميل ملف Dump كامل للقاعدة بضغطة زر واحدة.
