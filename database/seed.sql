-- ==============================================================================
-- البيانات الأولية المعتمدة لمنصة المهدي آل عمران للعقارات (اليمن)
-- ==============================================================================

USE `almahdi_realestate`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. إعدادات وهوية المنصة
INSERT INTO `system_settings` (
  `id`, `platform_name`, `platform_subtitle`, `logo_text`, `primary_color`, `secondary_color`, `vat_rate`, `currency`, `support_phone`, `support_email`, `rega_license_note`, `allow_visitor_reports`
) VALUES (
  1,
  'المهدي ال عمران للعقارات',
  'بوابتك الرقمية الشاملة للعقارات والمشاريع المعتمدة في اليمن',
  'المهدي آل عمران',
  '#059669',
  '#0284c7',
  0.0500,
  'YER',
  '+967 1 477777',
  'care@almahdi-alomran.ye',
  'مرخصة ومعتمدة من الهيئة العامة للأراضي والمساحة والتخطيط العمراني برقم: YE-1200004589',
  1
) ON DUPLICATE KEY UPDATE `platform_name`=VALUES(`platform_name`);

-- 2. الشركات والمنشآت العقارية في اليمن
INSERT INTO `organizations` (`id`, `name`, `commercial_record`, `fal_org_license`, `manager_user_id`, `status`, `logo_url`, `city`, `phone`, `email`) VALUES
('org_arkan_1', 'شركة أركان اليمن للتطوير العقاري', 'YE-CR-1010482910', 'YE-1200055412', 'usr_mgr_1', 'active', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150', 'صنعاء', '+967 1 202020', 'info@arkan-ye.com'),
('org_rowaad_2', 'مؤسسة الرواد للوساطة والاستثمار العقاري', 'YE-CR-1010992384', 'YE-1200078921', 'usr_mgr_2', 'active', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150', 'عدن', '+967 2 303030', 'contact@alrowaad.ye')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- 3. المستخدمون وحسابات الأدوار
INSERT INTO `users` (`id`, `phone`, `email`, `full_name`, `role`, `status`, `fal_license_number`, `org_id`, `national_id_masked`, `avatar_url`) VALUES
('usr_adm_1', '+967771234567', 'admin@almahdi-alomran.ye', 'المهدي آل عمران (المدير العام)', 'system_admin', 'active', 'YE-1000000001', NULL, '1012****11', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'),
('usr_reg_1', '+967772345678', 'ahmed.ye@example.com', 'أحمد بن عبدالله الأنسي', 'registered_user', 'active', NULL, NULL, '1088****91', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
('usr_adv_1', '+967773456789', 'nasser.adv@example.com', 'ناصر بن يحيى الحميري', 'individual_advertiser', 'active', 'YE-1100023451', NULL, '1074****82', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'),
('usr_mgr_1', '+967774567890', 'khaled@arkan-ye.com', 'خالد بن عبدالكريم الصنعاني', 'org_manager', 'active', 'YE-1200055412', 'org_arkan_1', '1065****44', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'),
('usr_mod_1', '+967775678901', 'mona.mod@almahdi.ye', 'منى بنت حميد الوصابي', 'content_moderator', 'active', NULL, NULL, '1055****33', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'),
('usr_fin_1', '+967776789012', 'finance@almahdi.ye', 'عصام بن صالح الزبيري', 'financial_officer', 'active', NULL, NULL, '1022****55', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150')
ON DUPLICATE KEY UPDATE `full_name`=VALUES(`full_name`);

-- 4. المشاريع الكبرى في اليمن
INSERT INTO `projects` (`id`, `developer_name`, `name`, `city`, `district`, `description`, `status`, `units_total`, `price_starts_from`, `image_url`, `handover_date`, `features`) VALUES
('prj_1', 'شركة أركان اليمن للتطوير العقاري', 'أبراج حدة السكنية والتجارية', 'صنعاء', 'حدة', 'مشروع عصري متكامل الخدمات في قلب منطقة حدة بصنعاء يضم شققاً سكنية راقية ومساحات تجارية ومواقف مؤمنة وطاقة شمسية مستمرة.', 'under_construction', 120, 45000000.00, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 'الربع الأول 2027', '["منظومة طاقة شمسية","مواقف خاصة","مصاعد ذكية","حراسة 24 ساعة"]'),
('prj_2', 'مؤسسة الرواد للاستثمار العقاري', 'مجمع المعلا فيو الساحلي', 'عدن', 'المعلا', 'إطلالات بحرية بانورامية على خليج عدن مع تشطيبات فندقية عالمية ومسابح ونادي صحي متكامل.', 'off_plan', 85, 65000000.00, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 'الربع الرابع 2027', '["إطلالة بحرية مباشرة","نادي صحي","مسبح بانورامي","أنظمة أمان"]')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- 5. العقارات الميدانية
INSERT INTO `properties` (`id`, `city`, `district`, `propertyType`, `total_area_sqm`, `latitude`, `longitude`, `address_description`, `deed_number`) VALUES
('prop_1', 'صنعاء', 'حدة', 'villa', 550.00, 15.31250000, 44.18550000, 'فيلا راقية تقع في حدة بالقرب من شارع بيروت', 'YE-DEED-2026-9901'),
('prop_2', 'عدن', 'خور مكسر', 'apartment', 210.00, 12.82500000, 45.03500000, 'شقة على كورنيش قحطان الشعبي بإطلالة بحرية', 'YE-DEED-2026-9902'),
('prop_3', 'صنعاء', 'شارع الزبيري', 'building', 1200.00, 15.35200000, 44.20100000, 'عمارة تجارية استثمارية مؤجرة بالكامل على الشارع الرئيسي', 'YE-DEED-2026-9903')
ON DUPLICATE KEY UPDATE `city`=VALUES(`city`);

-- 6. الإعلانات العقارية
INSERT INTO `listings` (`id`, `property_id`, `owner_id`, `owner_name`, `owner_phone`, `org_id`, `org_name`, `title`, `description`, `purpose`, `rent_period`, `price`, `currency`, `rooms_count`, `bathrooms_count`, `floor_number`, `building_age_years`, `facade`, `street_width_m`, `features`, `ad_license_number`, `license_verification_status`, `status`, `is_featured`, `views_count`, `favorites_count`, `media`) VALUES
('lst_1', 'prop_1', 'usr_adm_1', 'المهدي آل عمران', '+967771234567', NULL, NULL, 'فيلا مودرن فاخرة مع حديقة ومسبح خاص في حدة', 'فيلا مصممة بأعلى معايير الفخامة والخصوصية في حي حدة الراقي بصنعاء، تضم مجلس استقبال فخم، صالات عائلية واسعة، منظومة طاقة شمسية كاملة، بئر ماء وخزان أرضي ضخم.', 'sale', NULL, 185000000.00, 'YER', 6, 7, 2, 1, 'شمالية شرقية', 20.00, '["منظومة طاقة شمسية","مسبح خاص","بئر وخزان ماء","مجلس استقبال","موقف 4 سيارات"]', 'YE-AD-2026-001', 'verified', 'published', 1, 1420, 45, '[{"id":"m1","listingId":"lst_1","mediaType":"image","url":"https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800","isPrimary":true}]'),
('lst_2', 'prop_2', 'usr_mgr_1', 'خالد بن عبدالكريم', '+967774567890', 'org_arkan_1', 'شركة أركان اليمن', 'شقة فاخرة بإطلالة بحرية مباشرة في خور مكسر', 'شقة سكنية بتشطيب سوبر ديلوكس، تكييف مركزي، شرفة واسعة مطلة على البحر مباشرة، ومصعد كهربائي ومولد طوارئ يعمل 24 ساعة.', 'sale', NULL, 42000000.00, 'YER', 4, 3, 4, 0, 'جنوبية بحرية', 30.00, '["إطلالة بحرية","تكييف مركزي","مصعدين","حراسة 24 ساعة","مولد كهربائي"]', 'YE-AD-2026-002', 'verified', 'published', 1, 980, 28, '[{"id":"m2","listingId":"lst_2","mediaType":"image","url":"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800","isPrimary":true}]'),
('lst_3', 'prop_3', 'usr_adm_1', 'المهدي آل عمران', '+967771234567', NULL, NULL, 'عمارة تجارية استثمارية مؤجرة بالكامل في شارع الزبيري', 'مبنى تجاري استثماري على شارع الزبيري الرئيسي بصنعاء، يحتوي على 6 معارض تجارية ومكاتب شركات ومعدل دخل سنوي استثماري ممتاز ومضمون.', 'sale', NULL, 480000000.00, 'YER', 18, 12, 5, 4, 'شمالية تجارية', 40.00, '["دخل استثماري ممتاز","موقع تجاري حيوي","مواقف أمامية","واجهات زجاجية"]', 'YE-AD-2026-003', 'verified', 'published', 1, 2150, 67, '[{"id":"m3","listingId":"lst_3","mediaType":"image","url":"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800","isPrimary":true}]')
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

SET FOREIGN_KEY_CHECKS = 1;
