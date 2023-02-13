# satellite-track

## Introduction

Satellite-track is a program for tracking satellite orbit, developed by cesium, vue and satelliteJS. It supports satellite and satellite constellation orbit display within the next 24 hours (performance considerations); Custom satellite orbit data (TLE) loading is also supported,TLE data is from celestrak;

## Preview

### [【satellite-track】](https://jiangteng2019.github.io/satellite-track/)

### [【Alternate address】](http://120.48.134.120:10181/satellite-track/)


## Tips
In order to save performance, satellite-track limits the following options: 
    - click display of satellite orbital data, not full display;
    - orbital data prediction for the next 24 hours;
    - only five constellation data can be selected at the same time;

1. The access speed of github pages is slow, and the TLE data and cesium data are large. Please wait patiently for the resources to load;
1. If the spacecraft changes orbit frequently, the TLE cache needs to be cleared manually before use;

## Example

[![satellite-track](https://images.cnblogs.com/cnblogs_com/engeng/2270012/o_230203011203_1.jpg "satellite-track")](https://images.cnblogs.com/cnblogs_com/engeng/2270012/o_230203011203_1.jpg "satellite-track")

[![satellite-track](https://images.cnblogs.com/cnblogs_com/engeng/2270012/o_230203011139_2.jpg "satellite-track")](https://images.cnblogs.com/cnblogs_com/engeng/2270012/o_230203011139_2.jpg "satellite-track")