// East African countries with codes, names, and flags
export const eastAfricanCountries = [
  {
    code: 'KE',
    name: 'Kenya',
    dialCode: '+254',
    flag: '🇰🇪',
    currency: 'KES',
    currencySymbol: 'KSh',
  },
  {
    code: 'TZ',
    name: 'Tanzania',
    dialCode: '+255',
    flag: '🇹🇿',
    currency: 'TZS',
    currencySymbol: 'TSh',
  },
  {
    code: 'UG',
    name: 'Uganda',
    dialCode: '+256',
    flag: '🇺🇬',
    currency: 'UGX',
    currencySymbol: 'USh',
  },
  {
    code: 'RW',
    name: 'Rwanda',
    dialCode: '+250',
    flag: '🇷🇼',
    currency: 'RWF',
    currencySymbol: 'RF',
  },
  {
    code: 'BI',
    name: 'Burundi',
    dialCode: '+257',
    flag: '🇧🇮',
    currency: 'BIF',
    currencySymbol: 'FBu',
  },
  {
    code: 'SS',
    name: 'South Sudan',
    dialCode: '+211',
    flag: '🇸🇸',
    currency: 'SSP',
    currencySymbol: 'SS£',
  },
];

// Helper function to get country by code
export const getCountryByCode = (code) => {
  return (
    eastAfricanCountries.find(
      (country) => country.code === code || country.dialCode === code
    ) || null
  );
};

// Helper to get country by phone number
export const getCountryByPhone = (phone) => {
  if (!phone) return null;
  return (
    eastAfricanCountries.find(
      (country) =>
        phone.startsWith(country.dialCode) ||
        phone.startsWith(country.dialCode.replace('+', ''))
    ) || null
  );
};

// Regions for each East African country
export const regionsByCountry = {
  KE: [
    { value: 'BAR', label: 'Baringo' },
    { value: 'BOM', label: 'Bomet' },
    { value: 'BUN', label: 'Bungoma' },
    { value: 'BUS', label: 'Busia' },
    { value: 'ELG', label: 'Elgeyo-Marakwet' },
    { value: 'EMB', label: 'Embu' },
    { value: 'GAR', label: 'Garissa' },
    { value: 'HOM', label: 'Homa Bay' },
    { value: 'ISI', label: 'Isiolo' },
    { value: 'KAJ', label: 'Kajiado' },
    { value: 'KAK', label: 'Kakamega' },
    { value: 'KER', label: 'Kericho' },
    { value: 'KIA', label: 'Kiambu' },
    { value: 'KIL', label: 'Kilifi' },
    { value: 'KIR', label: 'Kirinyaga' },
    { value: 'KIS', label: 'Kisii' },
    { value: 'KSM', label: 'Kisumu' },
    { value: 'KIT', label: 'Kitui' },
    { value: 'KWA', label: 'Kwale' },
    { value: 'LAI', label: 'Laikipia' },
    { value: 'LAM', label: 'Lamu' },
    { value: 'MAC', label: 'Machakos' },
    { value: 'MAK', label: 'Makueni' },
    { value: 'MAN', label: 'Mandera' },
    { value: 'MAR', label: 'Marsabit' },
    { value: 'MER', label: 'Meru' },
    { value: 'MIG', label: 'Migori' },
    { value: 'MOM', label: 'Mombasa' },
    { value: 'MUR', label: "Murang'a" },
    { value: 'NAI', label: 'Nairobi' },
    { value: 'NAK', label: 'Nakuru' },
    { value: 'NAN', label: 'Nandi' },
    { value: 'NAR', label: 'Narok' },
    { value: 'NYM', label: 'Nyamira' },
    { value: 'NDA', label: 'Nyandarua' },
    { value: 'NYE', label: 'Nyeri' },
    { value: 'SAM', label: 'Samburu' },
    { value: 'SIA', label: 'Siaya' },
    { value: 'TAI', label: 'Taita-Taveta' },
    { value: 'TAN', label: 'Tana River' },
    { value: 'THA', label: 'Tharaka-Nithi' },
    { value: 'TRA', label: 'Trans Nzoia' },
    { value: 'TUR', label: 'Turkana' },
    { value: 'UAS', label: 'Uasin Gishu' },
    { value: 'VIH', label: 'Vihiga' },
    { value: 'WAJ', label: 'Wajir' },
    { value: 'WPO', label: 'West Pokot' },
  ],
  TZ: [
    { value: 'DAR', label: 'Dar es Salaam' },
    { value: 'DOD', label: 'Dodoma' },
    { value: 'ARU', label: 'Arusha' },
    { value: 'MBE', label: 'Mbeya' },
    { value: 'MOR', label: 'Morogoro' },
    { value: 'MZA', label: 'Mwanza' },
    { value: 'TAN', label: 'Tanga' },
    { value: 'ZAN', label: 'Zanzibar' },
    { value: 'KIL', label: 'Kilimanjaro' },
    { value: 'MTW', label: 'Mtwara' },
  ],
  UG: [
    { value: 'KLA', label: 'Kampala' },
    { value: 'ENT', label: 'Entebbe' },
    { value: 'JIN', label: 'Jinja' },
    { value: 'MBR', label: 'Mbarara' },
    { value: 'GUL', label: 'Gulu' },
    { value: 'LIR', label: 'Lira' },
    { value: 'MBL', label: 'Mbale' },
    { value: 'MUK', label: 'Mukono' },
    { value: 'KAS', label: 'Kasese' },
    { value: 'FOT', label: 'Fort Portal' },
  ],
  RW: [
    { value: 'KGL', label: 'Kigali' },
    { value: 'BUT', label: 'Butare' },
    { value: 'RUB', label: 'Rubavu' },
    { value: 'MUS', label: 'Musanze' },
    { value: 'HUG', label: 'Huye' },
    { value: 'RUS', label: 'Rusizi' },
    { value: 'KIC', label: 'Kicukiro' },
    { value: 'GAS', label: 'Gasabo' },
    { value: 'NYA', label: 'Nyagatare' },
    { value: 'GIS', label: 'Gisenyi' },
  ],
  BI: [
    { value: 'BJM', label: 'Bujumbura' },
    { value: 'GIT', label: 'Gitega' },
    { value: 'NGO', label: 'Ngozi' },
    { value: 'RUM', label: 'Rumonge' },
    { value: 'MUR', label: 'Muyinga' },
    { value: 'RUT', label: 'Rutana' },
    { value: 'MAK', label: 'Makamba' },
    { value: 'KAY', label: 'Kayanza' },
    { value: 'BUB', label: 'Bubanza' },
    { value: 'CIB', label: 'Cibitoke' },
  ],
  SS: [
    { value: 'JUB', label: 'Juba' },
    { value: 'MAL', label: 'Malakal' },
    { value: 'WAU', label: 'Wau' },
    { value: 'YEI', label: 'Yei' },
    { value: 'AWE', label: 'Aweil' },
    { value: 'BOR', label: 'Bor' },
    { value: 'BEN', label: 'Bentiu' },
    { value: 'TOR', label: 'Torit' },
    { value: 'YAM', label: 'Yambio' },
    { value: 'RUM', label: 'Rumbek' },
  ],
};
