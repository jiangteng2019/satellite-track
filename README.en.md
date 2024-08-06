# satellite-track
[中文](https://github.com/jiangteng2019/satellite-track#readme) | [English](https://github.com/jiangteng2019/satellite-track/blob/master/README.en.md)

## Introduction

Satellite-track is a program for tracking satellite orbit, developed by cesium, vue and satelliteJS. It supports satellite and satellite constellation orbit display within the next 24 hours (performance considerations); Custom satellite orbit data (TLE) loading is also supported,TLE data is from celestrak;

## Preview
#### [【GitHub Pages】](https://jiangteng2019.github.io/satellite-track/)
#### [【satellite-track】](https://cesium.pages.dev/)

## Run
```sh
# Clone project
git clone https://github.com/jiangteng2019/satellite-track.git

# enter the project root directory
cd satellite-track

# Install dependencies
npm install

# startup project
npm run dev

# Compile and package
npm run build
```
The compiled file cannot be opened using the browser's file protocol. You need a static resource server, such as nginx.

## Tips
1. The access speed of github pages is slow, and the TLE data and cesium data are large. Please wait patiently for the resources to load;
1. If the spacecraft changes orbit frequently, the TLE cache needs to be cleared manually before use;
1. In order to save performance, satellite-track limits the following options: 
    - click display of satellite orbital data, not full display;
    - orbital data prediction for the next 24 hours;
    - only five constellation data can be selected at the same time;

## Example
![satellite-track](https://img2023.cnblogs.com/blog/1038573/202303/1038573-20230317144305572-182523586.jpg)