export const makeLocationString = (city = '', country = '') => {
  if (city.length && country.length) {
    return `${city}, ${country}`;
  }
  if (city.length) {
    return `${city}`;
  }
  if (country.length) {
    return `${country}`;
  }
  return '';
};
