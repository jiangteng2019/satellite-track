<template>
    <div id="cesiumContainer"></div>
    <div class="operate_container">
        <div class="menu_button" @click="drawer = !drawer" title="卫星星座选择">
            <img src="../../assets/menu.svg" width="28" height="28" alt="卫星星座选择">
        </div>
        <div class="menu_button" @click="drawerImport = !drawerImport" title="自定义导入TLE数据">
            <img src="../../assets/import.svg" width="28" height="28" alt="自定义导入TLE数据">
        </div>
        <div class="menu_button" @click="handleClearTLECache" title="清除TLE缓存">
            <img src="../../assets/clean.svg" width="24" height="24" alt="清除TLE缓存">
        </div>
        <div class="menu_button" @click="clearSatelliteOrbit" title="清除轨道">
            <img src="../../assets/hide.svg" width="24" height="24" alt="清除轨道">
        </div>
    </div>
    <!-- 抽屉1 -->
    <el-drawer v-model="drawer" title="卫星星座选择" direction="ltr">
        <el-checkbox-group v-model="checked" @change="handleSatelliteChange" :max=5>
            <template v-for="(item, index) in allSatellite" :key="index">
                <el-row v-if="item.type === 'title'" class="satellite_type">{{ item.label }}</el-row>
                <el-checkbox v-if="!item.type" :label="item.value">{{ item.label }}</el-checkbox>
            </template>
        </el-checkbox-group>
    </el-drawer>
    <!-- 抽屉2 -->
    <el-drawer v-model="drawerImport" title="自定义卫星数据" direction="ltr">
        <el-input v-model="tleData" type="textarea" placeholder="Please input tle data" :rows="20" />
        <el-row class="add_satellite">
            <el-button type="primary" @click="handleAddSatellite">
                添加
            </el-button>
            <el-upload class="upload_button" :on-change="handleImportSatellite" :show-file-list="false" accept="txt" :limit="1" :auto-upload="false" ref="upload">
                <template #trigger>
                    <el-button type="default">导入</el-button>
                </template>
            </el-upload>
            <el-button type="danger" @click="handleClearSatellite">
                清空
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
// 自定义的卫星
const customSatelliteMap = new Map();
// 响应式数据
const drawer = ref(false);

const drawerImport = ref(false);

const checked = ref([1]);

const clickedSatelliteArray = [];

const upload = ref(null);

let tleData = ref(`BEIDOU-3 G2             
1 45344U 20017A   23037.82027362 -.00000136  00000+0  00000+0 0  9994
2 45344   1.9879   4.6761 0000950 328.7503 178.5761  1.00272999 10962
BEIDOU-3 G3             
1 45807U 20040A   23037.85365455 -.00000347  00000+0  00000+0 0  9999
2 45807   0.9369 314.6571 0008244 342.4957 257.2704  1.00264764  9772`);


Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYjZmMWM4Ny01YzQ4LTQ3MzUtYTI5Mi1hNTgyNjdhMmFiMmMiLCJpZCI6NjIwMjgsImlhdCI6MTYyNjY3MTMxNX0.5SelYUyzXWRoMyjjFvmFIAoPtWlJPQMjsVl2e_jQe-c';

function initCesium() {
    // 复写原型方法 用于timeline组件日期格式化；
    Cesium.Timeline.prototype.makeLabel = function (time) {
        let minutes = 0 - new Date().getTimezoneOffset();
        let dataZone8 = Cesium.JulianDate.addMinutes(time, minutes, new Cesium.JulianDate());
        return Cesium.JulianDate.toIso8601(dataZone8).slice(0, 19);
    }

    // mapbox 卫星地图
    // let imgLayer = new Cesium.MapboxImageryProvider({
    //     mapId: 'mapbox.satellite',
    //     accessToken: 'pk.eyJ1Ijoiamlhbmd0ZW5nIiwiYSI6ImNqbGhhcDhzMjAxdncza294c2ZqcHFxNGIifQ.rjSmtZ5QzE2sJ-qDANh3WQ'
    // });

    //高德卫星地图
    let imgLayer = new Cesium.UrlTemplateImageryProvider({
        url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
        minimumLevel: 3,
        maximumLevel: 18
    });

    // 高德地图路网图层
    var gaoDeImageryProvider = new Cesium.UrlTemplateImageryProvider({
        url: "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
        minimumLevel: 3,
        maximumLevel: 18
    })

    viewer = new Cesium.Viewer('cesiumContainer', {
        // terrainProvider: Cesium.createWorldTerrain(),  // 会触发渲染错误
        // imageryProvider: imgLayer,
        baseLayerPicker: true,
        geocoder: false,
        navigationHelpButton: false,
        infoBox: false
    });

    // viewer.imageryLayers.addImageryProvider(gaoDeImageryProvider);

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

function parseTleWithSimpleSplit(data = "") {
    if (data.length === 0) return;
    let result = data.split("\n");
    console.log(result)
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

function handleClearTLECache() {
    ElMessageBox.confirm("清空TLE缓存后手动刷新页面将重新下载TLE数据，是否继续？", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
    }).then(() => {
        clearTLECache();
    }).catch(() => {
        console.log('取消');
    })
}

function clearTLECache() {
    // satelliteMap.forEach(satelliteSet => satelliteSet.forEach(sate => viewer.entities.remove(sate)));
    // satelliteMap.clear();  // 一级缓存
    localStorage.clear(); // 二级缓存
    ElMessage.success('清除成功')
}

function clearSatelliteOrbit() {
    if (clickedSatelliteArray.length) {
        clickedSatelliteArray.forEach(item => {
            item.id ? item.id.path.show = false : '';
        })
    }
}

function checkTleData(data) {
    try {
        if (!data.length) {
            return false;
        }
        let dataArray = data.split('\n');
        if (dataArray.length % 3 !== 0) {
            return false;
        }
        dataArray.forEach((item, index) => {
            if (index % 3 === 0 && !item) throw new Error(false);
            if (index % 3 === 1 && item.length < 69) throw new Error(false);
            if (index % 3 === 2 && item.length < 69) throw new Error(false);
        })
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

// 添加自定义卫星实例
function handleAddSatellite() {
    if (!checkTleData(tleData.value)) {
        ElMessage.error('wrong TLE data');
        return;
    }
    clearCustomSatelliteMap();
    let result = parseTleWithSimpleSplit(tleData.value);
    result.forEach(tle => {
        let satellite = new SatelliteEntity(tle);
        let cesiumSateEntity = satellite.createSatelliteEntity();
        let result = viewer.entities.add(cesiumSateEntity);
        customSatelliteMap.set(satellite.name, result)
    });
    viewer.zoomTo(viewer.entities);

}

async function handleImportSatellite(uploadFiles) {
    upload.value.clearFiles();
    if (uploadFiles.raw.type !== "text/plain") {
        ElMessage.warning('请上传TXT格式的TLE数据');
        return;
    }
    let data = await uploadFiles.raw.text();
    tleData.value = data;
}

// 清空所有状态，输入框和cesium实例
function handleClearSatellite() {
    clearCustomSatelliteMap();
    tleData.value = "";
    upload.value.clearFiles();
}

// 清空卫星实例;
function clearCustomSatelliteMap() {
    customSatelliteMap.forEach(item => viewer.entities.remove(item));
    customSatelliteMap.clear();
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
