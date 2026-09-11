let googleMapsPromise = null;

export const loadGoogleMaps = (apiKey = 'AIzaSyDTJ_9YxZZUaCUqnaV3DJO3LDlODW8SWaY') => {
  if (window.google && window.google.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  const existingScript = document.getElementById('google-maps-js-api');
  if (existingScript) {
    googleMapsPromise = new Promise((resolve, reject) => {
      existingScript.addEventListener('load', () => resolve(window.google?.maps));
      existingScript.addEventListener('error', reject);
    });
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = 'google-maps-js-api';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&libraries=geometry`;
    script.async = true;
    script.onload = () => resolve(window.google?.maps);
    script.onerror = (err) => {
      googleMapsPromise = null;
      reject(err);
    };
    document.head.appendChild(script);
  });

  return googleMapsPromise;
};
