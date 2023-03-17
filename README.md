# satellite-track
[中文](https://github.com/jiangteng2019/satellite-track#readme) | [English](https://github.com/jiangteng2019/satellite-track/blob/master/README.en.md)

## 介绍

satellite-track 是一款追踪卫星轨道的程序，使用cesium、vue、satelliteJS开发。支持24小时之内(性能考虑)的卫星和卫星星座轨道显示；同时也支持自定义的卫星轨道数据（TLE）加载。数据来源于celestrak。

## 预览
#### [【satellite-track】](https://jiangteng2019.github.io/satellite-track/)
#### [【备用地址】](http://120.48.134.120:10181/satellite-track/)


## 注意
1. github pages 访问速度慢，TLE数据与cesium数据较大，请耐心等待资源加载;
1. 如果航天器变轨频繁，使用前需手动清除TLE缓存;
1. 为了节约性能，satellite-track 做了如下限制：
    - 卫星轨道数据点击显示，而非全量显示;
    - 轨道数据预测未来24小时;
    - 只能同时选择5个星座数据;


## 示例
[![satellite-track](https://img2023.cnblogs.com/blog/1038573/202303/1038573-20230317144305572-182523586.jpg "satellite-track")](https://img2023.cnblogs.com/blog/1038573/202303/1038573-20230317144305572-182523586.jpg "satellite-track")
