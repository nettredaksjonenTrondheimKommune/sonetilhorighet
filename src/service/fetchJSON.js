export async function fetchJSON(url, options = {}) {
  const response = await fetch(url, options);

  if (response.status !== 200) {
    const body = await response.text();
    throw new Error(`Could not get ${url} got ${response.status}: ${body}`);
  }

  const doc = await response.json();

  if (!doc) {
    throw new Error(`Could not get ${url}, got ${response.status} with json '${doc}'.`);
  }

  return doc;
}

export function toRequestQuery(object) {
  const parameters = Object.keys(object)
    .map((key) => (object[key] === null ? null : [key, encodeURIComponent(object[key])]))
    .filter((p) => p !== null);

  return `?${parameters.map(([key, value]) => `${key}=${value}`).join('&')}`;
}
