/**
 * بيانات المحافظات والمديريات والأحياء الجغرافية في الجمهورية اليمنية
 * لمنصة المهدي ال عمران للعقارات
 */

export interface YemenDistrict {
  id: string;
  name: string;          // الحي أو المنطقة
  directorate: string;   // المديرية
  lat: number;
  lng: number;
}

export interface YemenGovernorate {
  id: string;
  name: string;          // المحافظة
  defaultLat: number;
  defaultLng: number;
  zoom: number;
  directorates: string[];
  districts: YemenDistrict[];
}

export const YEMEN_GOVERNORATES: YemenGovernorate[] = [
  {
    id: 'sanaa',
    name: 'صنعاء (أمانة العاصمة)',
    defaultLat: 15.3694,
    defaultLng: 44.1910,
    zoom: 12,
    directorates: [
      'مديرية السبعين',
      'مديرية الوحدة',
      'مديرية معين',
      'مديرية التحرير',
      'مديرية الثورة',
      'مديرية بني الحارث',
      'مديرية شعوب',
      'مديرية الصافية',
      'مديرية سنحان وبني بهلول',
      'مديرية بني مطر',
      'مديرية همدان',
    ],
    districts: [
      { id: 'haddah', name: 'حي حدة السكني', directorate: 'مديرية السبعين', lat: 15.3268, lng: 44.1852 },
      { id: 'bayt_baws', name: 'حي بيت بوس', directorate: 'مديرية السبعين', lat: 15.2954, lng: 44.1953 },
      { id: 'asbahi', name: 'حي الأصبحي', directorate: 'مديرية السبعين', lat: 15.3121, lng: 44.2045 },
      { id: 'attan', name: 'حي فج عطان', directorate: 'مديرية السبعين', lat: 15.3340, lng: 44.1680 },
      { id: 'sabeen', name: 'محيط ميدان السبعين', directorate: 'مديرية السبعين', lat: 15.3312, lng: 44.2055 },
      { id: 'asr', name: 'حي عصر - شارع الزبيري', directorate: 'مديرية الوحدة', lat: 15.3480, lng: 44.1750 },
      { id: 'baghdad_st', name: 'شارع بغداد والجزائر', directorate: 'مديرية الوحدة', lat: 15.3410, lng: 44.1920 },
      { id: 'tahrir', name: 'حي التحرير والقاع', directorate: 'مديرية التحرير', lat: 15.3550, lng: 44.2020 },
      { id: 'sixtieth_w', name: 'شارع الستين الغربي ومذبح', directorate: 'مديرية معين', lat: 15.3720, lng: 44.1720 },
      { id: 'hayel', name: 'حي شارع هايل والرقاص', directorate: 'مديرية معين', lat: 15.3620, lng: 44.1880 },
      { id: 'hasabah', name: 'حي الحصبة وصوفان', directorate: 'مديرية الثورة', lat: 15.3850, lng: 44.2010 },
      { id: 'airport', name: 'حي المطار والروضة', directorate: 'مديرية بني الحارث', lat: 15.4420, lng: 44.2190 },
      { id: 'sawan', name: 'حي سعوان ونقم', directorate: 'مديرية شعوب', lat: 15.3710, lng: 44.2380 },
      { id: 'hiziaz', name: 'حي حزيز وقاع القيضي', directorate: 'مديرية سنحان وبني بهلول', lat: 15.2650, lng: 44.2210 },
    ],
  },
  {
    id: 'aden',
    name: 'عدن',
    defaultLat: 12.7855,
    defaultLng: 45.0187,
    zoom: 12,
    directorates: [
      'مديرية خور مكسر',
      'مديرية المعلا',
      'مديرية صيرة (كريتر)',
      'مديرية المنصورة',
      'مديرية الشيخ عثمان',
      'مديرية التواهي',
      'مديرية البريقة',
      'مديرية دار سعد',
    ],
    districts: [
      { id: 'abyan_coast', name: 'حي ساحل أبين والإنشاءات', directorate: 'مديرية خور مكسر', lat: 12.8220, lng: 45.0450 },
      { id: 'embassies', name: 'حي السفارات والدبلوماسيين', directorate: 'مديرية خور مكسر', lat: 12.8150, lng: 45.0320 },
      { id: 'mualla_main', name: 'الشارع الرئيسي والدكة', directorate: 'مديرية المعلا', lat: 12.7910, lng: 44.9950 },
      { id: 'crater_maidan', name: 'حي الميدان والخساف', directorate: 'مديرية صيرة (كريتر)', lat: 12.7750, lng: 45.0350 },
      { id: 'reemi', name: 'حي ريمي والدرين', directorate: 'مديرية المنصورة', lat: 12.8450, lng: 44.9950 },
      { id: 'qahirah', name: 'حي القاهرة وعبدالعزيز', directorate: 'مديرية المنصورة', lat: 12.8550, lng: 45.0120 },
      { id: 'sheikh_othman', name: 'حي السيلة والممدارة', directorate: 'مديرية الشيخ عثمان', lat: 12.8680, lng: 45.0350 },
      { id: 'goldmoor', name: 'حي الفتح وجولدمور', directorate: 'مديرية التواهي', lat: 12.7820, lng: 44.9750 },
      { id: 'ghadeer', name: 'حي الغدير وكود النمر', directorate: 'مديرية البريقة', lat: 12.7540, lng: 44.8820 },
      { id: 'dar_saad', name: 'حي اللحوم والبساتين', directorate: 'مديرية دار سعد', lat: 12.8950, lng: 45.0080 },
    ],
  },
  {
    id: 'taiz',
    name: 'تعز',
    defaultLat: 13.5789,
    defaultLng: 44.0219,
    zoom: 13,
    directorates: [
      'مديرية القاهرة',
      'مديرية المظفر',
      'مديرية صالة',
      'مديرية المخا',
      'مديرية الشمايتين',
      'مديرية المعافر',
    ],
    districts: [
      { id: 'jamal_st', name: 'شارع جمال والمسبح', directorate: 'مديرية القاهرة', lat: 13.5820, lng: 44.0190 },
      { id: 'wadi_qadi', name: 'حي وادي القاضي', directorate: 'مديرية القاهرة', lat: 13.5910, lng: 44.0150 },
      { id: 'beer_basha', name: 'حي بير باشا والنسيم', directorate: 'مديرية المظفر', lat: 13.5680, lng: 43.9850 },
      { id: 'saynah', name: 'حي صينة والدحي', directorate: 'مديرية المظفر', lat: 13.5740, lng: 44.0050 },
      { id: 'jahmaliyah', name: 'حي الجحملية وثعبات', directorate: 'مديرية صالة', lat: 13.5750, lng: 44.0410 },
      { id: 'mokha_city', name: 'المدينة السكنية ومحيط الميناء', directorate: 'مديرية المخا', lat: 13.3210, lng: 43.2510 },
      { id: 'turbah', name: 'مدينة التربة والقلعة', directorate: 'مديرية الشمايتين', lat: 13.2150, lng: 44.1350 },
    ],
  },
  {
    id: 'hadhramaut',
    name: 'حضرموت',
    defaultLat: 14.5425,
    defaultLng: 49.1242,
    zoom: 12,
    directorates: [
      'مديرية المكلا',
      'مديرية سيئون',
      'مديرية تريم',
      'مديرية الشحر',
      'مديرية شبام',
      'مديرية القطن',
      'مديرية الديس الشرقية',
    ],
    districts: [
      { id: 'fuwwah', name: 'حي فوه القديمة والإنشاءات', directorate: 'مديرية المكلا', lat: 14.5220, lng: 49.0750 },
      { id: 'dees', name: 'حي الديس والشرج', directorate: 'مديرية المكلا', lat: 14.5380, lng: 49.1210 },
      { id: 'khalf', name: 'حي خلف والميناء السياحي', directorate: 'مديرية المكلا', lat: 14.5490, lng: 49.1550 },
      { id: 'bajeman', name: 'حي باجعمان وروكب', directorate: 'مديرية المكلا', lat: 14.5610, lng: 49.1820 },
      { id: 'qarn', name: 'حي القرن والسحيل', directorate: 'مديرية سيئون', lat: 15.9390, lng: 48.7910 },
      { id: 'maryamah', name: 'حي مريمة والغرفة', directorate: 'مديرية سيئون', lat: 15.9250, lng: 48.8150 },
      { id: 'eidid', name: 'حي عيديد والنويدرة', directorate: 'مديرية تريم', lat: 16.0520, lng: 48.9950 },
      { id: 'shihr_sea', name: 'حي سدة العيدروس وكورنيش الشحر', directorate: 'مديرية الشحر', lat: 14.7580, lng: 49.6050 },
    ],
  },
  {
    id: 'ibb',
    name: 'إب',
    defaultLat: 13.9667,
    defaultLng: 44.1833,
    zoom: 13,
    directorates: [
      'مديرية الظهار',
      'مديرية المشنة',
      'مديرية جبلة',
      'مديرية يريم',
      'مديرية العدين',
    ],
    districts: [
      { id: 'daeri_w', name: 'حي الدائري الغربي والمعاين', directorate: 'مديرية الظهار', lat: 13.9750, lng: 44.1750 },
      { id: 'jiblah_junction', name: 'حي مفرق جبلة وشارع تعز', directorate: 'مديرية الظهار', lat: 13.9520, lng: 44.1880 },
      { id: 'old_ibb', name: 'البلدة القديمة ودار الشرف', directorate: 'مديرية المشنة', lat: 13.9680, lng: 44.1950 },
      { id: 'qahzah', name: 'حي قحزة والصلبة', directorate: 'مديرية المشنة', lat: 13.9850, lng: 44.2020 },
      { id: 'jiblah_city', name: 'مدينة جبلة التاريخية', directorate: 'مديرية جبلة', lat: 13.9210, lng: 44.1480 },
      { id: 'yarim_center', name: 'مدينة يريم وقاع الحقل', directorate: 'مديرية يريم', lat: 14.2980, lng: 44.3780 },
    ],
  },
  {
    id: 'hodeidah',
    name: 'الحديدة',
    defaultLat: 14.7978,
    defaultLng: 42.9545,
    zoom: 13,
    directorates: [
      'مديرية الحوك',
      'مديرية الحالي',
      'مديرية الميناء',
      'مديرية زبيد',
      'مديرية بيت الفقيه',
      'مديرية باجل',
    ],
    districts: [
      { id: 'corniche', name: 'حي الكورنيش وغليل', directorate: 'مديرية الحوك', lat: 14.7820, lng: 42.9450 },
      { id: 'sanaa_st_hod', name: 'شارع صنعاء وحي 7 يوليو', directorate: 'مديرية الحالي', lat: 14.8150, lng: 42.9750 },
      { id: 'port_district', name: 'حي الميناء والصديقية', directorate: 'مديرية الميناء', lat: 14.7990, lng: 42.9480 },
    ],
  },
  {
    id: 'dhamar',
    name: 'ذمار',
    defaultLat: 14.5428,
    defaultLng: 44.4051,
    zoom: 13,
    directorates: [
      'مديرية مدينة ذمار',
      'مديرية معبر (جهران)',
      'مديرية عنس',
    ],
    districts: [
      { id: 'dhamar_roma', name: 'حي روما والمحافظة', directorate: 'مديرية مدينة ذمار', lat: 14.5450, lng: 44.4020 },
      { id: 'dhamar_harran', name: 'حي هران والجمارك', directorate: 'مديرية مدينة ذمار', lat: 14.5580, lng: 44.3980 },
      { id: 'mabar_city', name: 'مدينة معبر وحي الجامعة', directorate: 'مديرية معبر (جهران)', lat: 14.7890, lng: 44.3120 },
    ],
  },
  {
    id: 'marib',
    name: 'مأرب',
    defaultLat: 15.4542,
    defaultLng: 45.3256,
    zoom: 13,
    directorates: [
      'مديرية مدينة مأرب',
      'مديرية الوادي',
      'مديرية حريب',
    ],
    districts: [
      { id: 'marib_rawdah', name: 'حي الروضة والزراعة', directorate: 'مديرية مدينة مأرب', lat: 15.4610, lng: 45.3280 },
      { id: 'marib_forty', name: 'شارع الأربعين وحي الفاو', directorate: 'مديرية مدينة مأرب', lat: 15.4420, lng: 45.3150 },
      { id: 'marib_wadi', name: 'منطقة المجمع والوادي', directorate: 'مديرية الوادي', lat: 15.4750, lng: 45.3620 },
    ],
  },
  {
    id: 'lahj',
    name: 'لحج',
    defaultLat: 13.0583,
    defaultLng: 44.8833,
    zoom: 13,
    directorates: ['مديرية الحوطة', 'مديرية تبن'],
    districts: [
      { id: 'hawtah', name: 'مدينة الحوطة', directorate: 'مديرية الحوطة', lat: 13.0610, lng: 44.8850 },
      { id: 'sabr', name: 'منطقة صبر والوهط', directorate: 'مديرية تبن', lat: 12.9850, lng: 44.9120 },
    ],
  },
  {
    id: 'abyan',
    name: 'أبين',
    defaultLat: 13.1287,
    defaultLng: 45.3806,
    zoom: 13,
    directorates: ['مديرية زنجبار', 'مديرية خنفر'],
    districts: [
      { id: 'zinjibar', name: 'مدينة زنجبار الساحلية', directorate: 'مديرية زنجبار', lat: 13.1290, lng: 45.3820 },
      { id: 'jaar', name: 'مدينة جعار وباتيس', directorate: 'مديرية خنفر', lat: 13.2210, lng: 45.3050 },
    ],
  },
  {
    id: 'shabwah',
    name: 'شبوة',
    defaultLat: 14.5375,
    defaultLng: 46.8319,
    zoom: 13,
    directorates: ['مديرية عتق', 'مديرية بيحان', 'مديرية ميفعة'],
    districts: [
      { id: 'ataq_city', name: 'مدينة عتق والمخطط العام', directorate: 'مديرية عتق', lat: 14.5390, lng: 46.8340 },
    ],
  },
  {
    id: 'almahrah',
    name: 'المهرة',
    defaultLat: 16.2081,
    defaultLng: 52.1764,
    zoom: 12,
    directorates: ['مديرية الغيضة', 'مديرية حوف', 'مديرية شحن'],
    districts: [
      { id: 'ghaydah', name: 'مدينة الغيضة والكورنيش', directorate: 'مديرية الغيضة', lat: 16.2110, lng: 52.1790 },
    ],
  },
];

export const YEMEN_CURRENCY = {
  code: 'YER',
  symbol: 'ر.ي',
  nameAr: 'ريال يمني',
};

export const BRAND_CONFIG = {
  name: 'المهدي ال عمران للعقارات',
  shortName: 'المهدي آل عمران',
  englishName: 'Al Mahdi Al Omran Real Estate',
  license: 'YE-1200001882',
  phone: '+967 1 477777',
  mobile: '+967 777123456',
  email: 'care@almahdi-alomran.ye',
  address: 'صنعاء، اليمن - شارع حدة الرئيسي، برج المهدي آل عمران',
};

export function formatYemenPrice(price: number): string {
  return `${new Intl.NumberFormat('ar-YE').format(price)} ${YEMEN_CURRENCY.symbol}`;
}

export function getAllGovernorateNames(): string[] {
  return YEMEN_GOVERNORATES.map((g) => g.name);
}

export function getDistrictsForGovernorate(govName: string): YemenDistrict[] {
  const gov = YEMEN_GOVERNORATES.find(
    (g) => g.name === govName || govName.includes(g.name.split(' ')[0])
  );
  return gov ? gov.districts : [];
}

export function getDirectoratesForGovernorate(govName: string): string[] {
  const gov = YEMEN_GOVERNORATES.find(
    (g) => g.name === govName || govName.includes(g.name.split(' ')[0])
  );
  return gov ? gov.directorates : [];
}
