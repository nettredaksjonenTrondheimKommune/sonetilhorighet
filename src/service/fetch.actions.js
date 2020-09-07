export function reportFetchRequest(type) {
  return { type: `FETCH_${type.toUpperCase()}_REQUEST` };
}
  
export function reportFetchError(type, error) {
  let payload = typeof error === 'string' ? new Error(error) : error;
  // eslint-disable-next-line no-console
  console.error(payload);
  return { type: `FETCH_${type.toUpperCase()}_ERROR`, payload };
}
  
export function reportFetchSuccess(type) {
  return { type: `FETCH_${type.toUpperCase()}_SUCCESS` };
}
  