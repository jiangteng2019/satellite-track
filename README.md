# satellite-track
[中文](https://github.com/jiangteng2019/satellite-track#readme) | [English](https://github.com/jiangteng2019/satellite-track/blob/master/README.en.md)

## 介绍

satellite-track 是一款追踪卫星轨道的程序，使用cesium、vue、satelliteJS开发。支持24小时之内的卫星和卫星星座轨道显示； 数据来源于celestrak。

## 预览
#### [【GitHub Pages】](https://jiangteng2019.github.io/satellite-track/)
#### [【satellite-track】](https://cesium.pages.dev/)

## 运行
```sh
# 克隆项目工程
git clone https://github.com/jiangteng2019/satellite-track.git

# 进入项目根目录
cd satellite-track

# 安装依赖
npm install

# 启动项目
npm run dev

# 编译打包
npm run build
```
编译好的文件无法使用浏览器的file协议打开，你需要一个静态资源服务器，如 nginx。

## 注意
1. github pages 访问速度慢，TLE数据与cesium数据较大，请耐心等待资源加载;
1. 为了节约性能，satellite-track 做了如下限制：
    - 轨道数据预测未来24小时;
    - 只能同时选择5个星座数据;


## 示例

![satellite-track](https://img2023.cnblogs.com/blog/1038573/202303/1038573-20230317144305572-182523586.jpg)