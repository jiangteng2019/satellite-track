# satellite-track

## 概览

satellite-track 是一款追踪卫星轨道的程序，使用cesium、vue、satelliteJS开发。支持24小时之内的卫星和卫星星座轨道显示(性能考虑)；同时也支持自定义的卫星轨道数据（TLE）加载。数据来源于celestrak。

## Preview
### [【satellite-track】](https://jiangteng2019.github.io/satellite-track/)
### [【备用地址】](http://120.48.134.120:10181/satellite-track/)


## 注意
为了节约性能，satellite-track 使用了如下限制：
    - 卫星轨道数据点击显示，而非全量显示;
    - 轨道数据预测未来24小时;
    - 只能同时选择5个星座数据;
1. github pages 访问速度慢，TLE数据与cesium数据较大，请耐心等待资源加载;
1. 如果航天器变轨频繁，使用前需手动清除TLE缓存;

## 示例
[![satellite-track](https://images.cnblogs.com/cnblogs_com/engeng/2270012/o_230203011203_1.jpg "satellite-track")](https://images.cnblogs.com/cnblogs_com/engeng/2270012/o_230203011203_1.jpg "satellite-track")

[![satellite-track](https://images.cnblogs.com/cnblogs_com/engeng/2270012/o_230203011139_2.jpg "satellite-track")](https://images.cnblogs.com/cnblogs_com/engeng/2270012/o_230203011139_2.jpg "satellite-track")