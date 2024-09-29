import axios from "axios";

const BASE_URL = "https://celestrak.org";

function getTleDataFromExternal(path = "") {
    let uri = `${BASE_URL}/NORAD/elements/gp.php?GROUP=${path}&FORMAT=tle`;
    return axios.get(uri).then(res => {
        if (res.status === 200) {
            return Promise.resolve(res.data);
        } else {
            ElMessage.error('获取TLE失败');
            return Promise.reject(res.statusText);
        }
    });
}

export { getTleDataFromExternal };