let specialSatellite = [
    {
        label: "卫星集合",
        value: null,
        group: null,
        type: "title"
    },
    {
        label: "Last 30 Days' Launches",
        value: 'last-30-days',
        group: 'last-30-days'
    },
    {
        label: 'Space Stations',
        value: 'stations',
        group: 'stations'
    },
    {
        label: '100 (or so) Brightest',
        value: 'visual',
        group: 'visual'
    },
    {
        label: 'Active Satellites',
        value: 'active',
        group: 'active'
    },
    {
        label: 'Analyst Satellites ',
        value: 'analyst',
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
        value: 'weather',
        group: 'weather'
    },
    {
        label: 'NOAA',
        value: 'noaa',
        group: 'noaa'
    },
    {
        label: 'GOES',
        value: 'goes',
        group: 'goes'
    },
    {
        label: 'Earth Resources',
        value: 'resource',
        group: 'resource'
    },
    {
        label: 'Search & Rescue (SARSAT) ',
        value: 'sarsat',
        group: 'sarsat'
    },
    {
        label: 'Disaster Monitoring',
        value: 'dmc',
        group: 'dmc'
    },
    {
        label: 'TDRSS',
        value: 'tdrss',
        group: 'tdrss'
    },
    {
        label: 'ARGOS Data Collection System',
        value: 'argos',
        group: 'argos'
    },
    {
        label: 'Planet',
        value: 'planet',
        group: 'planet'
    },
    {
        label: 'Spire',
        value: 'spire',
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
        value: 'geo',
        group: 'geo'
    },
    {
        label: 'GEO Protected Zone',
        value: 'gpz',
        group: 'gpz'
    },
    {
        label: 'GEO Protected Zone Plus',
        value: 'gpz-plus',
        group: 'gpz-plus'
    },
    {
        label: 'Intelsat',
        value: 'intelsat',
        group: 'intelsat'
    },
    {
        label: 'SES',
        value: 'ses',
        group: 'ses'
    },
    {
        label: 'Iridium',
        value: 'iridium',
        group: 'iridium'
    },
    {
        label: 'Iridium NEXT',
        value: 'iridium-NEXT',
        group: 'iridium-NEXT'
    },
    {
        label: 'Starlink',
        value: 'starlink',
        group: 'starlink'
    },
    {
        label: 'OneWeb',
        value: 'oneweb',
        group: 'oneweb'
    },
    {
        label: 'Orbcomm',
        value: 'orbcomm',
        group: 'orbcomm'
    },
    {
        label: 'Globalstar',
        value: 'globalstar',
        group: 'globalstar'
    },
    {
        label: 'Swarm',
        value: 'swarm',
        group: 'swarm'
    },
    {
        label: 'Amateur Radio',
        value: 'amateur',
        group: 'amateur'
    },
    {
        label: 'Experimental Comm',
        value: 'x-comm',
        group: 'x-comm'
    },
    {
        label: 'Other Comm',
        value: 'other-comm',
        group: 'other-comm'
    },
    {
        label: 'SatNOGS',
        value: 'satnogs',
        group: 'satnogs'
    },
    {
        label: 'Gorizont',
        value: 'gorizont',
        group: 'gorizont'
    },
    {
        label: 'Raduga',
        value: 'raduga',
        group: 'raduga'
    },
    {
        label: 'Molniya',
        value: 'molniya',
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
        value: 'gnss',
        group: 'gnss'
    },
    {
        label: 'GPS Operational',
        value: 'gps-ops',
        group: 'gps-ops'
    },
    {
        label: 'GLONASS Operational',
        value: 'glo-ops',
        group: 'glo-ops'
    },
    {
        label: 'Galileo',
        value: 'galileo',
        group: 'galileo'
    },
    {
        label: 'Beidou',
        value: 'beidou',
        group: 'beidou'
    },
    {
        label: 'Satellite-Based Augmentation System',
        value: 'sbas',
        group: 'sbas'
    },
    {
        label: 'Navy Navigation Satellite System (NNSS)',
        value: 'nnss',
        group: 'nnss'
    },
    {
        label: 'Russian LEO Navigation',
        value: 'musson',
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
        value: 'science',
        group: 'science'
    },
    {
        label: 'Geodetic',
        value: 'geodetic',
        group: 'geodetic'
    },
    {
        label: 'Engineering',
        value: 'engineering',
        group: 'engineering'
    },
    {
        label: 'Education',
        value: 'education',
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
        value: 'military',
        group: 'military'
    },
    {
        label: 'Radar Calibration',
        value: 'radar',
        group: 'radar'
    },
    {
        label: 'CubeSats',
        value: 'cubesat',
        group: 'cubesat'
    },
    {
        label: 'Other Satellites',
        value: 'other',
        group: 'other'
    }
]

export { specialSatellite, weatherSatellite, communicationSatellite, navigationSatellite, scientificSatellite, miscellaneousSatellite };

