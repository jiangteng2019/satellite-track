<template>
    <div id="cesiumContainer"></div>
    <div class="operate_container">
        <div class="menu_button" @click="drawer = !drawer">
            <img src="../../assets/menu.svg" width="28" height="28" alt="">
        </div>
    </div>
    <!-- 抽屉 -->
    <el-drawer v-model="drawer" title="卫星选择" direction="ltr">
        <el-checkbox-group v-model="checked" @change="handleSatelliteChange" :max=5>
            <template v-for="(item, index) in allSatellite" :key="index">
                <el-row v-if="item.type === 'title'" class="satellite_type">{{ item.label }}</el-row>
                <el-checkbox v-if="!item.type" :label="item.value">{{ item.label }}</el-checkbox>
            </template>
        </el-checkbox-group>
        <el-row style="padding: 30px 0px;">
            <el-button type="primary" @click="clearTLECache">
                清除TLE缓存
            </el-button>

            <el-button type="primary" @click="clearSatelliteOrbit">
                清除轨道
            </el-button>
        </el-row>
    </el-drawer>
</template>

<script setup>


import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";

import { onMounted, ref, watch } from 'vue';

import "./SatelliteTrack.scss"

import { getTleDataFromExternal } from '@/http/index'

import SatelliteEntity from '@/js/SatelliteEntity';

import { specialSatellite, weatherSatellite, communicationSatellite, navigationSatellite, scientificSatellite, miscellaneousSatellite } from "./satelliteType"

let allSatellite = [...specialSatellite, ...weatherSatellite, ...communicationSatellite, ...navigationSatellite, ...scientificSatellite, ...miscellaneousSatellite];


window.CESIUM_BASE_URL = import.meta.env.MODE === 'development' ? '/cesium' : '/satellite-track/cesium';

let viewer;
const totalSeconds = 86400;
// 保存所有的卫星实例 
const satelliteMap = new Map();

// 响应式数据
const drawer = ref(false);

const checked = ref([1]);

const clickedSatelliteArray = [];


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
    let callback = viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
        callback(movement);
        const pickedFeature = viewer.scene.pick(movement.position);
        console.log(pickedFeature);
        if (!Cesium.defined(pickedFeature)) {

        }
        if (pickedFeature) {
            pickedFeature.id.path.show = new Cesium.ConstantProperty(true);
            pickedFeature.id.label.distanceDisplayCondition = undefined;
            clickedSatelliteArray.push(pickedFeature);
        }

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

// 事件
function handleSatelliteChange(e) {

}

function clearTLECache() {
    localStorage.clear();
    ElMessage.success('清除成功')
}

function clearSatelliteOrbit() {
    if (clickedSatelliteArray.length) {
        clickedSatelliteArray.forEach(item => {
            item.id ? item.id.path.show = false : '';
        })
    }
}


// 获取tle数据，从缓存中获取，若无请求数据

async function getTleData(path) {
    let data = localStorage.getItem(path);
    if (data) {
        console.log(`%c 命中缓存,key值为${path}`, 'color:#0f0;');
        return data;
    } else {
        console.warn("未命中缓存，开始下载TLE数据");
        return await getTleDataFromExternal(path);
    }
}

// 创建satellite entity 实例
async function addSatellite(path) {
    // 判断map中是否已经包含对应的路径实例
    if (satelliteMap.has(path)) {
        let satelliteList = satelliteMap.get(path);
        satelliteList.forEach(item => viewer.entities.add(item));
    } else {
        let result = await getTleData(path);
        let parsedResult = parseTle(result);
        let satelliteSet = new Set();

        parsedResult.forEach(tle => {
            let satellite = new SatelliteEntity(tle);
            let cesiumSateEntity = satellite.createSatelliteEntity();
            let result = viewer.entities.add(cesiumSateEntity);
            satelliteSet.add(result);
        });
        satelliteMap.set(path, satelliteSet);
    }
}

function removeSatellite(path) {
    if (satelliteMap.has(path)) {
        let satelliteList = satelliteMap.get(path);
        satelliteList.forEach(item => viewer.entities.remove(item));
    }
}

// 侦听器
watch(checked, (newValue, oldValue) => {
    let filterValue = newValue.concat(oldValue).filter((item, index, arr) => arr.indexOf(item) === arr.lastIndexOf(item));
    let satelliteClassify = allSatellite.find(item => item.value === filterValue[0]);
    // 勾选了卫星
    if (newValue.length > oldValue.length) {
        addSatellite(satelliteClassify.group);
    } else {
        //取消了勾选
        removeSatellite(satelliteClassify.group);
    }
})


// 生命周期
onMounted(async () => {
    initCesium();
    initTimeLine();
    addCesiumEventListener();
    addSatellite('last-30-days');
})


</script>
