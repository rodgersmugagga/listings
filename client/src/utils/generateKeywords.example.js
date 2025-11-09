// Example usage of generateKeywords helper
import { generateSearchKeywords } from './generateKeywords';

// Basic usage with a simple listing title
const basicExample = generateSearchKeywords('2 Bedroom Apartment in Kampala');
console.log('Basic keywords:', basicExample);
// Output includes: ['2 bedroom apartment', '2br', '2bed', 'apartment', 'apt', 'flat', ...]

// Usage with a furnished property listing
const furnishedExample = generateSearchKeywords('Furnished 3BR Apartment with Parking');
console.log('Furnished property keywords:', furnishedExample);
// Output includes: ['3br', 'furnished', 'furn', 'apartment', 'apt', 'parking', 'park', ...]

// Usage with custom n-gram size
const customNgramExample = generateSearchKeywords('Luxury Studio Apartment Near Mall', { maxNgram: 3 });
console.log('Custom n-gram keywords:', customNgramExample);
// Output includes: ['luxury', 'studio', 'apartment', 'luxury studio', 'studio apartment', 'luxury-studio-apartment', ...]

// Example of how keywords help with various search patterns:
const searchTerms = [
  '2 bed', // matches '2 bedroom', '2br', '2bed'
  'apt',   // matches 'apartment', 'apt'
  'furn',  // matches 'furnished', 'furn'
];

const listing = {
  title: '2 Bedroom Furnished Apartment',
  keywords: generateSearchKeywords('2 Bedroom Furnished Apartment')
};

// Search matching example
const matchesSearch = (keywords, term) => 
  keywords.some(k => k.includes(term.toLowerCase()));

searchTerms.forEach(term => {
  console.log(`Search '${term}' matches:`, matchesSearch(listing.keywords, term));
});