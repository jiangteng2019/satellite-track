<template>
    <div id="cesiumContainer"></div>
</template>

<script setup>


import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";

import { onMounted } from 'vue';

import "./SatelliteTrack.scss"

import { getTleWithLastThirtyDays } from '@/http/index'

window.CESIUM_BASE_URL = '/cesium';

let viewer;


Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYjZmMWM4Ny01YzQ4LTQ3MzUtYTI5Mi1hNTgyNjdhMmFiMmMiLCJpZCI6NjIwMjgsImlhdCI6MTYyNjY3MTMxNX0.5SelYUyzXWRoMyjjFvmFIAoPtWlJPQMjsVl2e_jQe-c';

function initCesium() {

    let imgLayer = new Cesium.MapboxImageryProvider({
        mapId: 'mapbox.satellite',
        accessToken: 'pk.eyJ1Ijoiamlhbmd0ZW5nIiwiYSI6ImNqbGhhcDhzMjAxdncza294c2ZqcHFxNGIifQ.rjSmtZ5QzE2sJ-qDANh3WQ'
    });

    viewer = new Cesium.Viewer('cesiumContainer', {
        // terrainProvider: Cesium.createWorldTerrain(),  // 会触发渲染错误
        imageryProvider: imgLayer,
        baseLayerPicker: false,
        geocoder: false,
        navigationHelpButton: false,
    });

    // const buildingTileset = viewer.scene.primitives.add(Cesium.createOsmBuildings());



    Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
        75.0, // 西经
        10.0, // 南纬
        140.0, // 东经
        60.0 // 北纬
    );
}

onMounted(async () => {
    initCesium();
    let result = await getTleWithLastThirtyDays();
    console.log(result);
})


</script>
