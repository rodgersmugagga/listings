const SITE_NAME = process.env.SITE_NAME || 'Rodvers Listings';
const SITE_URL = process.env.SITE_URL || 'https://listings-chvc.onrender.com';

// Comprehensive Uganda city/neighborhood data with search variations
const UG_CITIES = [
  { name: 'Kampala', aliases: ['Kampala', 'KCCA', 'Kampala City'] },
  { name: 'Entebbe', aliases: ['Entebbe', 'Entebbe City'] },
  { name: 'Jinja', aliases: ['Jinja', 'Jinja City'] },
  { name: 'Mbarara', aliases: ['Mbarara', 'Mbarara City'] },
  { name: 'Gulu', aliases: ['Gulu', 'Gulu City'] },
  { name: 'Mbale', aliases: ['Mbale', 'Mbale Town'] },
  { name: 'Fort Portal', aliases: ['Fort Portal', 'Fort-Portal'] },
  { name: 'Masaka', aliases: ['Masaka', 'Masaka City'] },
  { name: 'Kabale', aliases: ['Kabale', 'Kabale Town'] },
  { name: 'Soroti', aliases: ['Soroti', 'Soroti City'] },
  { name: 'Lira', aliases: ['Lira', 'Lira City'] },
  { name: 'Hoima', aliases: ['Hoima', 'Hoima City'] },
];

const NEIGHBORHOODS = {
  'Kampala': ['Kampala CBD', 'Kololo', 'Nakasero', 'Muyenga', 'Buziga', 'Bunga', 'Makindye', 'Nakawa', 'Lubaga', 'Kawempe'],
  'Entebbe': ['Entebbe Town', 'Port Bell', 'Zzansi', 'Kitoro'],
  'Jinja': ['Jinja Town', 'Jinja Industrial', 'Mbulamutumbi'],
  'Mbarara': ['Mbarara Town', 'Kamukuzi', 'Nyamityobora'],
};

const VEHICLE_BRANDS = ['Toyota', 'Honda', 'Nissan', 'Hyundai', 'BMW', 'Mercedes', 'Ford', 'Subaru', 'Mazda', 'Volkswagen'];
const ELECTRONICS_BRANDS = ['Apple', 'Samsung', 'Huawei', 'Xiaomi', 'LG', 'Dell', 'HP', 'Asus', 'Lenovo', 'Sony'];

/**
 * Slugify text: lowercase, remove special chars, dash-separated
 */
function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Find city from address/location string
 */
function extractCity(addressOrDetails) {
  if (!addressOrDetails) return null;
  const lowercase = addressOrDetails.toString().toLowerCase();
  for (const cityData of UG_CITIES) {
    for (const alias of cityData.aliases) {
      if (lowercase.includes(alias.toLowerCase())) {
        return cityData.name;
      }
    }
  }
  return null;
}

/**
 * Extract neighborhood from address (if applicable)
 */
function extractNeighborhood(address, city) {
  if (!address || !city || !NEIGHBORHOODS[city]) return null;
  const lowercase = address.toString().toLowerCase();
  for (const hood of NEIGHBORHOODS[city]) {
    if (lowercase.includes(hood.toLowerCase())) {
      return hood;
    }
  }
  return null;
}

/**
 * Generate SEO metadata for Real Estate listings
 */
function generateRealEstateSeo(subCategory, details, address, listingName) {
  const city = extractCity(address) || 'Uganda';
  const neighborhood = extractNeighborhood(address, city);
  const bedroom = details?.bedrooms || '';
  const bathroom = details?.bathrooms || '';
  const furnished = details?.furnished || 'Unfurnished';
  const parking = details?.parking ? `${details.parking} parking` : '';
  const hasOffer = details?.offer ? '(Discounted)' : '';
  const type = details?.type === 'rent' ? 'for Rent' : 'for Sale';

  // Build features string for keywords
  const features = [];
  if (bedroom) features.push(`${bedroom}-bedroom`);
  if (bathroom) features.push(`${bathroom}-bathroom`);
  if (parking) features.push('parking');
  if (furnished !== 'Unfurnished') features.push(furnished.toLowerCase());

  // Generate title (60-70 chars optimal)
  const locationStr = neighborhood ? `in ${neighborhood}, ${city}` : `in ${city}`;
  const title = `${subCategory} ${type} ${locationStr} ${hasOffer} | ${SITE_NAME}`.substring(0, 70);

  // Generate description (150-160 chars)
  const featuresStr = features.length > 0 ? `${features.join(', ')} ` : '';
  const description = `Find a beautiful ${subCategory.toLowerCase()} with ${bedroom || 'spacious'} bedroom${bedroom > 1 ? 's' : ''} ${featuresStr}${type.toLowerCase()} near you in ${city}. Quality properties on ${SITE_NAME}.`.substring(0, 160);

  // Generate keywords (array)
  const keywords = [
    `${subCategory.toLowerCase()} ${type.toLowerCase()}`,
    `${subCategory.toLowerCase()} in ${city}`,
    ...(neighborhood ? [`${subCategory.toLowerCase()} in ${neighborhood}`] : []),
    `${bedroom || 'spacious'} bedroom ${subCategory.toLowerCase()}`,
    `${type.toLowerCase()} properties`,
    'real estate Uganda',
    city,
    ...(neighborhood ? [neighborhood] : []),
    ...features,
    'rental listings',
    'property listing',
  ];

  // Generate slug
  const slug = slugify(`${subCategory} ${type} ${neighborhood || city}`);

  // Generate canonical URL
  const canonical = `${SITE_URL}/${slugify(subCategory)}/${slug}`;

  return { title, description, keywords, canonical, slug };
}

/**
 * Generate SEO metadata for Vehicle listings
 */
function generateVehicleSeo(subCategory, details, address, listingName) {
  const city = extractCity(address) || 'Uganda';
  const brand = details?.brand || '';
  const model = details?.model || '';
  const year = details?.year || '';
  const mileage = details?.mileage ? `${details.mileage}km` : '';
  const hasOffer = details?.offer ? '(Discounted)' : '';

  // Build features
  const features = [];
  if (year) features.push(year);
  if (mileage) features.push(mileage);

  // Generate title (60-70 chars)
  const brandModel = brand && model ? `${brand} ${model}` : subCategory;
  const title = `${brandModel} for Sale in ${city} ${hasOffer} | ${SITE_NAME}`.substring(0, 70);

  // Generate description (150-160 chars)
  const featureStr = features.length > 0 ? `${features.join(', ')} ` : '';
  const description = `Buy ${brandModel.toLowerCase()} in ${city}. ${featureStr}${subCategory.toLowerCase()} for sale from trusted sellers. Best prices on ${SITE_NAME}.`.substring(0, 160);

  // Generate keywords
  const keywords = [
    `${brandModel.toLowerCase()} for sale`,
    `${subCategory.toLowerCase()} for sale`,
    `${subCategory.toLowerCase()} in ${city}`,
    'used vehicles Uganda',
    ...(brand ? [`${brand} vehicles`, `${brand} ${model || subCategory.toLowerCase()}`] : []),
    city,
    'buy vehicle Uganda',
    'vehicle listings',
    'auto marketplace',
  ];

  // Generate slug
  const slug = slugify(`${brandModel} ${city}`);

  // Generate canonical
  const canonical = `${SITE_URL}/${slugify(subCategory)}/${slug}`;

  return { title, description, keywords, canonical, slug };
}

/**
 * Generate SEO metadata for Electronics listings
 */
function generateElectronicsSeo(subCategory, details, address, listingName) {
  const city = extractCity(address) || 'Uganda';
  const brand = details?.brand || '';
  const model = details?.model || '';
  const condition = details?.condition || 'New';
  const hasOffer = details?.offer ? '(Discounted)' : '';

  // Build features
  const features = [];
  if (condition) features.push(condition);

  // Generate title (60-70 chars)
  const brandModel = brand && model ? `${brand} ${model}` : subCategory;
  const title = `${brandModel} for Sale in ${city} ${hasOffer} | ${SITE_NAME}`.substring(0, 70);

  // Generate description (150-160 chars)
  const featureStr = features.length > 0 ? `${features.join(', ')} ` : '';
  const description = `Buy ${brandModel.toLowerCase()} in ${city}. ${featureStr}${subCategory.toLowerCase()} gadgets at best prices on ${SITE_NAME}. Safe buying experience.`.substring(0, 160);

  // Generate keywords
  const keywords = [
    `${brandModel.toLowerCase()} for sale`,
    `${subCategory.toLowerCase()} for sale`,
    `${subCategory.toLowerCase()} in ${city}`,
    'electronics Uganda',
    ...(brand ? [`${brand} gadgets`, `${brand} ${model || subCategory.toLowerCase()}`] : []),
    city,
    'buy electronics Uganda',
    'electronics marketplace',
    'tech gadgets',
  ];

  // Generate slug
  const slug = slugify(`${brandModel} ${city}`);

  // Generate canonical
  const canonical = `${SITE_URL}/${slugify(subCategory)}/${slug}`;

  return { title, description, keywords, canonical, slug };
}

/**
 * Advanced SEO generator - main export
 * @param {string} category - e.g., 'Real Estate', 'Vehicles', 'Electronics'
 * @param {string} subCategory - e.g., 'Apartment', 'Car', 'Mobile Phone'
 * @param {object} details - Category-specific details (bedrooms, brand, model, etc.)
 * @param {string} address - Full address/location string
 * @param {string} listingName - Listing title (optional)
 * @returns {object} { title, description, keywords, canonical, slug }
 */
export function generateSeo(category, subCategory, details = {}, address = '', listingName = '') {
  // Validate inputs
  if (!category || !subCategory) {
    return {
      title: `Listings on ${SITE_NAME}`,
      description: `Find great deals and listings across Uganda on ${SITE_NAME}.`,
      keywords: ['listings', 'buy', 'sell', 'Uganda'],
      canonical: `${SITE_URL}/listings`,
      slug: 'listings',
    };
  }

  // Route to category-specific generator
  switch (category) {
    case 'Real Estate':
      return generateRealEstateSeo(subCategory, details, address, listingName);
    case 'Vehicles':
      return generateVehicleSeo(subCategory, details, address, listingName);
    case 'Electronics':
      return generateElectronicsSeo(subCategory, details, address, listingName);
    default:
      // Fallback for unknown categories
      return {
        title: `${subCategory} on ${SITE_NAME}`,
        description: `Find ${subCategory.toLowerCase()} across Uganda on ${SITE_NAME}.`,
        keywords: [subCategory.toLowerCase(), 'listings', 'Uganda'],
        canonical: `${SITE_URL}/${slugify(category)}/${slugify(subCategory)}`,
        slug: slugify(`${category} ${subCategory}`),
      };
  }
}

export default { generateSeo };