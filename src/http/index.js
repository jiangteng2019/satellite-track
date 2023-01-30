import axios from "axios";

const BASE_URL = "https://celestrak.org"

function getTleData(path = "") {
    let uri = BASE_URL + path;
    return axios.get(uri).then(res => {
        res.status === 200 ? ElMessage.success('获取TLE成功') : ElMessage.error('获取TLE失败');
        return res.status === 200 ? Promise.resolve(res.data) : Promise.reject(res.statusText);
    });
}

/**
 * @description 获取最近30天的发射卫星的TLE数据
 * @returns Promise
 */
function getTleWithLastThirtyDays(path = "/NORAD/elements/gp.php?GROUP=last-30-days&FORMAT=tle") {
    return getTleData(path);
}

export { getTleWithLastThirtyDays };