const styleUrl = "mapbox://styles/nk-studio/cm8rqp5e900cx01s77ju3fbhg/draft";
mapboxgl.accessToken = TOKEN;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: styleUrl, // style URL
    center: [-74.5, 40], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});
GUF_LAYER_NAME = 'GUF28_DLR_v1_Mosaic';

map.on('load', () => {
    map.addSource('wms-source', {
        type: 'raster',
        tiles: [
            `https://geoservice.dlr.de/eoc/land/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS=${GUF_LAYER_NAME}&STYLES&FORMAT=image/png&SRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256&TRANSPARENT=true`
        ],
        tileSize: 256
    });
    map.addLayer({
        id: 'guf-layer',
        type: 'raster',
        source: 'wms-source',
        paint: {
            "raster-opacity": 0.4
        }
    });
});