mapboxgl.accessToken = token;
const map = new mapboxgl.Map({
    container: 'cluster-map',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [24.773543, 45.949434],
    zoom: 5
});

map.addControl(new mapboxgl.NavigationControl());

map.on('load', () => {
    map.addSource('attractions', {
        type: 'geojson',
        data: attractions,
        cluster: true,
        clusterMaxZoom: 14, 
        clusterRadius: 50 
    });

    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'attractions',
        filter: ['has', 'point_count'],
        paint: {
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#FCC8D1',
                10,
                '#FFABAB',
                15,
                '#D14D72'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                15,
                10,
                20,
                15,
                25
            ]
        }
    });

    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'attractions',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    });

    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'attractions',
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': '#FCC8D1',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
        }
    });

    
    map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        map.getSource('attractions').getClusterExpansionZoom(
            clusterId,
            (err, zoom) => {
                if (err) return;

                map.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom: zoom
                });
            }
        );
    });

    map.on('click', 'unclustered-point', (e) => {
        const { popupContent } = e.features[0].properties;
        const coordinates = e.features[0].geometry.coordinates.slice();
       
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popupContent)
            .addTo(map);
    });

    map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', () => {
         map.getCanvas().style.cursor = '';
    });
});
