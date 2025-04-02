const styleUrl = "mapbox://styles/nk-studio/cm8rqp5e900cx01s77ju3fbhg/draft";
mapboxgl.accessToken = TOKEN;
BIRDS_FLYWAYS_LAYER_ID = "BIRDS_FLYWAYS - BASE";

const map = new mapboxgl.Map({
    container: 'map',
    style: styleUrl,
    center: [32, 25],
    zoom: 1.6,
});

// Global Urban Footprint layer
GUF_LAYER_NAME = 'GUF28_DLR_v1_Mosaic';

var scheduledAnimationStep = null;
async function animateMap(views, step=1) {
    if (scheduledAnimationStep) {
        clearTimeout(scheduledAnimationStep);
        console.log(`Timeout ${scheduledAnimationStep} cleared`)
        scheduledAnimationStep = null;
    }
    const [z, lon, lat, speed, waitUntilNext, onMoveend] = views.shift();
    console.log(`Step ${step} started`);

    map.flyTo({
        center: [lat, lon], // Moves to Los Angeles
        zoom: z,
        speed: speed, // Slow down the movement
        curve: 1.1,
    });

    map.once('moveend', () => {
        console.log("Moveend triggered");
        onMoveend ? onMoveend() : null;
        console.log(`Step ${step} completed`);
        if (views.length > 0) {
            scheduledAnimationStep = setTimeout(async () => {
                    await animateMap(views, step + 1);
                },
                waitUntilNext * 1000
            );
        } else {
            console.info("All steps completed.");
        }
    });

}

function runAnimation(views) {
    animateMap(views.slice());
}


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
                "raster-opacity": 0.8,
                'raster-saturation': 0.8,
                'raster-fade-duration': 500,
            },
        },
        BIRDS_FLYWAYS_LAYER_ID // insert before this layer
    );

});


// Animation part

const animationFlowViews = [
    // zoom, lon, lat, speed, waitUntilNext, onComplete
    [
        3.07, 24.7, 30.33,
        0.12, 0, null
    ],
    [
        5.4, 26.667, 31.295,
        0.12, 0, null
    ],
    [
        6.12, 28.752, 30.16,
        0.12, 0, null
    ],
    [
        7.79, 30.037, 30.666,
        0.12, 0, () => {
            console.log("Callback completed!")
        }
    ],
    [
        8.84, 30.2206, 29.9583,
        0.12, 0, null
    ],
    [
        13.08, 30.43664, 29.53953,
        0.12, 0, null
    ],
]

runAnimation(animationFlowViews);