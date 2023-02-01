import { twoline2satrec, propagate } from "satellite.js";
import * as Cesium from 'cesium';

class SatelliteEntity {

    constructor(tle = "", options = {}) {
        const [name, tleLine1, tleLine2] = this._checkTle(tle);


        this.name = name;
        this.tleLine1 = tleLine1.trim();
        this.tleLine2 = tleLine2.trim();
        this.satrec = twoline2satrec(this.tleLine1, this.tleLine2);

        this.totalSeconds = 864000;// 864000
        this.stepSeconds = 300;
        this.leadTime = 5822;
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
            point: { pixelSize: 6, color: Cesium.Color.RED },
            path: new Cesium.PathGraphics({
                width: 0.5,
                show: false,
                leadTime: this.leadTime,
                trailTime: this.trailTime,
                material: Cesium.Color.LIME
            }),
        }
        return satelliteEntity;
    }


}

export default SatelliteEntity