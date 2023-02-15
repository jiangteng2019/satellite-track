let specialSatellite = [
    {
        label: "卫星集合",
        value: null,
        group: null,
        type: "title"
    },
    {
        label: "Last 30 Days' Launches",
        value: 1,
        group: 'last-30-days'
    },
    {
        label: 'Space Stations',
        value: 2,
        group: 'stations'
    },
    {
        label: '100 (or so) Brightest',
        value: 3,
        group: 'visual'
    },
    {
        label: 'Active Satellites',
        value: 4,
        group: 'active'
    },
    {
        label: 'Analyst Satellites ',
        value: 5,
        group: 'analyst'
    }
];

let weatherSatellite = [
    {
        label: "气象和地球资源卫星",
        value: null,
        group: null,
        type: "title"
    },
    {
        label: 'Weather',
        value: 6,
        group: 'weather'
    },
    {
        label: 'NOAA',
        value: 7,
        group: 'noaa'
    },
    {
        label: 'GOES',
        value: 8,
        group: 'goes'
    },
    {
        label: 'Earth Resources',
        value: 9,
        group: 'resource'
    },
    {
        label: 'Search & Rescue (SARSAT) ',
        value: 10,
        group: 'sarsat'
    },
    {
        label: 'Disaster Monitoring',
        value: 11,
        group: 'dmc'
    },
    {
        label: 'TDRSS',
        value: 12,
        group: 'tdrss'
    },
    {
        label: 'ARGOS Data Collection System',
        value: 13,
        group: 'argos'
    },
    {
        label: 'Planet',
        value: 14,
        group: 'planet'
    },
    {
        label: 'Spire',
        value: 15,
        group: 'spire'
    }
];

let communicationSatellite = [
    {
        label: "通讯卫星",
        value: null,
        group: null,
        type: "title"
    },
    {
        label: 'Active Geosynchronous',
        value: 16,
        group: 'geo'
    },
    {
        label: 'GEO Protected Zone',
        value: 17,
        group: 'gpz'
    },
    {
        label: 'GEO Protected Zone Plus',
        value: 18,
        group: 'gpz-plus'
    },
    {
        label: 'Intelsat',
        value: 19,
        group: 'intelsat'
    },
    {
        label: 'SES',
        value: 20,
        group: 'ses'
    },
    {
        label: 'Iridium',
        value: 21,
        group: 'iridium'
    },
    {
        label: 'Iridium NEXT',
        value: 22,
        group: 'iridium-NEXT'
    },
    {
        label: 'Starlink',
        value: 23,
        group: 'starlink'
    },
    {
        label: 'OneWeb',
        value: 24,
        group: 'oneweb'
    },
    {
        label: 'Orbcomm',
        value: 25,
        group: 'orbcomm'
    },
    {
        label: 'Globalstar',
        value: 26,
        group: 'globalstar'
    },
    {
        label: 'Swarm',
        value: 27,
        group: 'swarm'
    },
    {
        label: 'Amateur Radio',
        value: 28,
        group: 'amateur'
    },
    {
        label: 'Experimental Comm',
        value: 29,
        group: 'x-comm'
    },
    {
        label: 'Other Comm',
        value: 30,
        group: 'other-comm'
    },
    {
        label: 'SatNOGS',
        value: 31,
        group: 'satnogs'
    },
    {
        label: 'Gorizont',
        value: 32,
        group: 'gorizont'
    },
    {
        label: 'Raduga',
        value: 33,
        group: 'raduga'
    },
    {
        label: 'Molniya',
        value: 34,
        group: 'molniya'
    },
];

let navigationSatellite = [
    {
        label: "导航卫星",
        value: null,
        group: null,
        type: "title"
    },
    {
        label: 'GNSS',
        value: 35,
        group: 'gnss'
    },
    {
        label: 'GPS Operational',
        value: 36,
        group: 'gps-ops'
    },
    {
        label: 'GLONASS Operational',
        value: 37,
        group: 'glo-ops'
    },
    {
        label: 'Galileo',
        value: 38,
        group: 'galileo'
    },
    {
        label: 'Beidou',
        value: 39,
        group: 'beidou'
    },
    {
        label: 'Satellite-Based Augmentation System',
        value: 40,
        group: 'sbas'
    },
    {
        label: 'Navy Navigation Satellite System (NNSS)',
        value: 41,
        group: 'nnss'
    },
    {
        label: 'Russian LEO Navigation',
        value: 42,
        group: 'musson'
    },
];

let scientificSatellite = [
    {
        label: "科学卫星",
        value: null,
        group: null,
        type: "title"
    },
    {
        label: 'Space & Earth Science',
        value: 43,
        group: 'science'
    },
    {
        label: 'Geodetic',
        value: 44,
        group: 'geodetic'
    },
    {
        label: 'Engineering',
        value: 45,
        group: 'engineering'
    },
    {
        label: 'Education',
        value: 46,
        group: 'education'
    }
];

let miscellaneousSatellite = [
    {
        label: "其他卫星",
        value: null,
        group: null,
        type: "title"
    },
    {
        label: 'Miscellaneous Military',
        value: 47,
        group: 'military'
    },
    {
        label: 'Radar Calibration',
        value: 48,
        group: 'radar'
    },
    {
        label: 'CubeSats',
        value: 49,
        group: 'cubesat'
    },
    {
        label: 'Other Satellites',
        value: 50,
        group: 'other'
    }
]

export { specialSatellite, weatherSatellite, communicationSatellite, navigationSatellite, scientificSatellite, miscellaneousSatellite };

