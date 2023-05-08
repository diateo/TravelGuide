mapboxgl.accessToken = token;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: attraction.geometry.coordinates,
    zoom: 9,
});

new mapboxgl.Marker()
    .setLngLat(attraction.geometry.coordinates)
    .addTo(map)