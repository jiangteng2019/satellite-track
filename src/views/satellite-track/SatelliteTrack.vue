<template>
    <div id="cesiumContainer"></div>
</template>

<script setup>


import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";

import { onMounted, onBeforeMount } from 'vue';

import "./SatelliteTrack.scss"

import { getTleWithLastThirtyDays } from '@/http/index'

import SatelliteEntity from '@/js/SatelliteEntity';


window.CESIUM_BASE_URL = import.meta.env.MODE === 'development' ? '/cesium' : '/satellite-track/cesium';

let viewer;
const totalSeconds = 864000;
const satelliteMap = new Map();


Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYjZmMWM4Ny01YzQ4LTQ3MzUtYTI5Mi1hNTgyNjdhMmFiMmMiLCJpZCI6NjIwMjgsImlhdCI6MTYyNjY3MTMxNX0.5SelYUyzXWRoMyjjFvmFIAoPtWlJPQMjsVl2e_jQe-c';

function initCesium() {
    // 复写原型方法 用于timeline组件日期格式化；
    Cesium.Timeline.prototype.makeLabel = function (time) {
        let minutes = 0 - new Date().getTimezoneOffset();
        let dataZone8 = Cesium.JulianDate.addMinutes(time, minutes, new Cesium.JulianDate());
        return Cesium.JulianDate.toIso8601(dataZone8).slice(0, 19);
    }

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
        infoBox: false
    });

    // 时间格式化
    let minutes = 0 - new Date().getTimezoneOffset(); // 0 - (-480);
    viewer.animation.viewModel.timeFormatter = function (date, viewModel) {
        let dataZone8 = Cesium.JulianDate.addMinutes(date, minutes, new Cesium.JulianDate());
        return Cesium.JulianDate.toIso8601(dataZone8).slice(11, 19);
    }
    viewer.animation.viewModel.dateFormatter = function (date, viewModel) {
        let dataZone8 = Cesium.JulianDate.addMinutes(date, minutes, new Cesium.JulianDate());
        return Cesium.JulianDate.toIso8601(dataZone8).slice(0, 10);
    }

    Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
        75.0, // 西经
        10.0, // 南纬
        140.0, // 东经
        60.0 // 北纬
    );
}

function initTimeLine() {
    const start = Cesium.JulianDate.fromIso8601(new Date().toISOString());
    const stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate());
    viewer.clock.startTime = start.clone();
    viewer.clock.stopTime = stop.clone();
    viewer.clock.currentTime = start.clone();
    viewer.timeline.zoomTo(start, stop);
    viewer.clock.multiplier = 1;
    viewer.clock.shouldAnimate = true;
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
}

function parseTle(data = "") {
    if (data.length === 0) return;
    let result = data.split("\r\n");
    let tles = [], i = 0, tem = [];
    result.forEach(item => {
        i++;
        tem.push(item)
        if (i === 3) {
            tles.push(tem.join("\r\n"));
            tem = [];
            i = 0;
        }
    });
    return tles;
}

function addCesiumEventListener() {
    let callback = viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);// 还原点击聚焦方块的效果。
    viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
        callback(movement);
        const pickedFeature = viewer.scene.pick(movement.position);
        console.log(pickedFeature);
        if (!Cesium.defined(pickedFeature)) {
            satelliteMap.forEach(item => {
                item.path.show = false;
            })
            return;
        }
        if (pickedFeature) {
            pickedFeature.id.path.show = new Cesium.ConstantProperty(true);
            pickedFeature.id.label.distanceDisplayCondition = undefined;
        }

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

onMounted(async () => {
    initCesium();
    initTimeLine();
    addCesiumEventListener();

    let result = await getTleWithLastThirtyDays();
    let parsedResult = parseTle(result);

    parsedResult.forEach(tle => {
        let satellite = new SatelliteEntity(tle);
        let cesiumSateEntity = satellite.createSatelliteEntity();
        let result = viewer.entities.add(cesiumSateEntity);
        satelliteMap.set(satellite.name, result);
    });
})


</script>
