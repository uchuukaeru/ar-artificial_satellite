import {TLE} from "./tle.ts";
const elementAData = {
    "OBJECT_NAME":"GPS BIIR-2  (PRN 13)",
    "OBJECT_ID":"1997-035A",
    "EPOCH":"2024-09-12T12:42:13.013856",
    "MEAN_MOTION":2.00561092,
    "ECCENTRICITY":0.0084035,
    "INCLINATION":55.6956,
    "RA_OF_ASC_NODE":123.7167,
    "ARG_OF_PERICENTER":53.9679,
    "MEAN_ANOMALY":306.895,
    "EPHEMERIS_TYPE":0,
    "CLASSIFICATION_TYPE":"U",
    "NORAD_CAT_ID":24876,
    "ELEMENT_SET_NO":999,
    "REV_AT_EPOCH":19906,
    "BSTAR":0,
    "MEAN_MOTION_DOT":2.0e-7,
    "MEAN_MOTION_DDOT":0
};

const elementA = new TLE(elementAData);

for(let i=0;i<360;i++){
    console.log(elementA.getPosition3D());
    elementA.addAngle(1);
}