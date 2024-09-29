<template>
    <div id="cesiumContainer"></div>
    <div class="operate_container">
        <div class="menu_button" @click="drawer = !drawer" title="卫星星座选择">
            <img src="../../assets/menu.svg" width="28" height="28" alt="卫星星座选择">
        </div>
    </div>

    <el-drawer v-model="drawer" title="卫星星座选择" direction="ltr">
        <el-checkbox-group v-model="checked" @change="handleSatelliteChange" :max=5>
            <template v-for="(item, index) in allSatellite" :key="index">
                <el-row v-if="item.type === 'title'" class="satellite_type">{{ item.label }}</el-row>
                <el-checkbox v-if="!item.type" :label="item.value">{{ item.label }}</el-checkbox>
            </template>
        </el-checkbox-group>
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
import { compareArrays } from '@/utils';
import gaodeImage from "@/assets/gaode.jpg"

const allSatellite = [...specialSatellite, ...weatherSatellite, ...communicationSatellite, ...navigationSatellite, ...scientificSatellite, ...miscellaneousSatellite];

window.CESIUM_BASE_URL = import.meta.env.MODE === 'development' ? '/cesium' : '/satellite-track/cesium';

let viewer;
// 默认场景的时间跨度
const totalSeconds = 86400;
// 保存分组的卫星实例 
const satelliteMap = new Map();
// 响应式数据
const drawer = ref(false);
// 默认勾选
const checked = ref([]);
// TLE缓存
const tleCache = new Map();



Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYjZmMWM4Ny01YzQ4LTQ3MzUtYTI5Mi1hNTgyNjdhMmFiMmMiLCJpZCI6NjIwMjgsImlhdCI6MTYyNjY3MTMxNX0.5SelYUyzXWRoMyjjFvmFIAoPtWlJPQMjsVl2e_jQe-c';

function initCesium() {
    // 复写原型方法 用于timeline组件日期格式化；
    Cesium.Timeline.prototype.makeLabel = function (time) {
        let minutes = 0 - new Date().getTimezoneOffset();
        let dataZone8 = Cesium.JulianDate.addMinutes(time, minutes, new Cesium.JulianDate());
        return Cesium.JulianDate.toIso8601(dataZone8).slice(0, 19);
    }

    //高德卫星地图
    let gaoDeSatelliteImgLayer = new Cesium.UrlTemplateImageryProvider({
        url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
        minimumLevel: 3,
        maximumLevel: 18,
        tilingScheme: new Cesium.WebMercatorTilingScheme(),
    });

    viewer = new Cesium.Viewer('cesiumContainer', {
        baseLayerPicker: true,
        geocoder: false,
        navigationHelpButton: false,
        infoBox: false
    });

    const customLayerViewModel = new Cesium.ProviderViewModel({
        name: '高德地图',
        iconUrl: gaodeImage,
        tooltip: '高德地图',
        category: 'Cesium ion',  // 或 'Other 、Cesium ion'、'Bing Maps' 等
        creationFunction: function () {
            return gaoDeSatelliteImgLayer;
        }
    });

    viewer.baseLayerPicker.viewModel.imageryProviderViewModels.unshift(customLayerViewModel);

    // 设置高德地图为默认图层
    const selectedViewModel = viewer.baseLayerPicker.viewModel.imageryProviderViewModels[0];
    viewer.baseLayerPicker.viewModel.selectedImagery = selectedViewModel;


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

        }

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

// 事件
function handleSatelliteChange(e) {

}


// 获取tle数据，从缓存中获取，若无则请求数据
async function getTleData(path) {
    let data = tleCache.get(path);
    if (data) {
        console.log(`%c 命中缓存,key值为${path}`, 'color:#0f0;');
        return data;
    } else {
        console.warn("未命中缓存，开始下载TLE数据");
        const res = await getTleDataFromExternal(path);
        tleCache.set(path, res);
        return res;
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

watch(checked, (newValue, oldValue) => {
    const { addedItems, removedItems } = compareArrays(oldValue, newValue);
    if (addedItems.length) {
        // 默认只会有一次操作，也就是说addedItems, removedItems数组中的元素只会有一个，可以直接取第一个元素
        addSatellite(addedItems[0]);
    }
    if (removedItems.length) {
        removeSatellite(removedItems[0]);
    }
})


// 生命周期
onMounted(async () => {
    initCesium();
    initTimeLine();
    addCesiumEventListener();
})


</script>
