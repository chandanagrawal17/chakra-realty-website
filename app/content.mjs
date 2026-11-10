export const rent = 'https://resident.stessa.com/pay';
export const repair = 'https://resident.stessa.com';
export const property = {
  slug: 'sample-courtyard',
  name: 'Courtyard Apartments',
  location: 'Chicago, Illinois',
  availability: null,
  guide: [
    ['Utilities', 'Ask your property contact which utilities to transfer and confirm the start date before move-in.'],
    ['Trash and recycling', 'Confirm collection days and designated bins with your property contact.'],
    ['Parking', 'Confirm your assigned space or permit requirements before parking.'],
    ['Packages', 'Check delivery instructions with your property contact before scheduling a shipment.'],
  ],
};
export const routes = ['', 'rentals', 'properties', 'properties/' + property.slug, 'contact',
  'residents/' + property.slug, 'services', 'privacy'];

export function inquiry(email, name) {
  if (!email) return null;
  return 'mailto:' + email + '?subject=' + encodeURIComponent(name ? 'Property inquiry — ' + name : 'Chakra Realty inquiry');
}
