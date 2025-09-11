const GOOGLE_KEY = process.env.GOOGLE_MAPS_API_KEY || '';

export function staticStreetViewUrl({ lat, lng, heading = 0, pitch = 0, fov = 90, size = '600x400' }: { lat: number; lng: number; heading?: number; pitch?: number; fov?: number; size?: string }) {
  const base = 'https://maps.googleapis.com/maps/api/streetview';
  const params = new URLSearchParams({
    size,
    location: `${lat},${lng}`,
    heading: String(heading),
    pitch: String(pitch),
    fov: String(fov),
    key: GOOGLE_KEY
  });
  return `${base}?${params.toString()}`;
}

export function placesAutocompleteUrl(input: string) {
  const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json');
  url.searchParams.set('input', input);
  url.searchParams.set('types', 'address');
  url.searchParams.set('key', GOOGLE_KEY);
  return url.toString();
}

