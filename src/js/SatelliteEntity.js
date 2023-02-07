import { twoline2satrec, propagate } from "satellite.js";
import * as Cesium from 'cesium';

class SatelliteEntity {

    constructor(tle = "", options = {}) {
        const [name, tleLine1, tleLine2] = this._checkTle(tle);
        let circle = tleLine2.slice(52, 64);

        this.name = name.trim();
        this.tleLine1 = tleLine1.trim();
        this.tleLine2 = tleLine2.trim();
        this.satrec = twoline2satrec(this.tleLine1, this.tleLine2);

        this.totalSeconds = 86400;// 24小时
        this.stepSeconds = 100;
        this.leadTime = parseInt(24 * 3600 / circle);
        this.trailTime = 0;

    }

    _checkTle(tle) {
        let elements = tle.split('\n');
        if (elements.length !== 3) throw new Error("tle data error");
        return elements;
    }

    // 获取地心惯性坐标系坐标
    getPositionEci(time) {
        return propagate(this.satrec, time).position;
    }

    // 创建PositionProperty
    _getPositionProperty() {
        const start = Cesium.JulianDate.fromIso8601(new Date().toISOString());
        const positionProperty = new Cesium.SampledPositionProperty(Cesium.ReferenceFrame.INERTIAL);

        let now = Date.now();
        for (let i = 0; i < this.totalSeconds / this.stepSeconds; i++) {
            let sateTime = new Date(now + i * this.stepSeconds * 1000);
            let sateCoord = this.getPositionEci(sateTime);
            if (!sateCoord) continue;
            const cesiumTime = Cesium.JulianDate.addSeconds(start, i * this.stepSeconds, new Cesium.JulianDate());
            const cesiumPosition = { x: sateCoord.x * 1000, y: sateCoord.y * 1000, z: sateCoord.z * 1000 };
            positionProperty.addSample(cesiumTime, cesiumPosition);
        }
        return positionProperty;
    }

    // 创建卫星实例
    createSatelliteEntity() {
        const start = Cesium.JulianDate.fromIso8601(new Date().toISOString());
        const stop = Cesium.JulianDate.addSeconds(start, this.totalSeconds, new Cesium.JulianDate());
        let satelliteEntity = {
            name: this.name,
            description: this.name,
            availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({ start: start, stop: stop })]),
            position: this._getPositionProperty(),
            point: {
                pixelSize: 8,
                color: Cesium.Color.fromRandom({ alpha: 1.0 }),
                // scaleByDistance: new Cesium.NearFarScalar(1.5e3, 1, 8.0e8, 0.5),
            },
            path: new Cesium.PathGraphics({
                width: 1,
                show: false,
                leadTime: this.leadTime,
                trailTime: this.trailTime,
                material: Cesium.Color.LIME,
            }),
            label: {
                text: this.name,
                font: '12px sans-serif',
                showBackground: true,
                backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.5),
                backgroundPadding: new Cesium.Cartesian2(4, 4),
                outlineWidth: 1,
                verticalOrigin: Cesium.VerticalOrigin.TOP,
                horizontalOrigin: Cesium.VerticalOrigin.LEFT,
                pixelOffset: new Cesium.Cartesian2(0, 5),
                fillColor: Cesium.Color.WHITE,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(10.0, 5000000),
            }
        }
        return satelliteEntity;
    }
}

export default SatelliteEntity