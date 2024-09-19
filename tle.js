import { THREE } from "https://code4fukui.github.io/egxr.js/egxr.js";

// 地球重力定数の３乗根
const egc_cr = 73594.59595;
const earthr = 12742 * 1000 / 2;

class TLE{
    // 衛星名:String
    // "OBJECT_NAME":"GPS BIIR-2  (PRN 13)",
    ObjectName;
    //:String
    // "OBJECT_ID":"1997-035A",
    ObjectId;
    // 衛星カタログ番号:number
    // "NORAD_CAT_ID":24876,
    NoradCatId;
    // 分類:String
    // "CLASSIFICATION_TYPE":"U",
    ClassificationType;
    // 原期:String
    // "EPOCH":"2024-09-12T12:42:13.013856",
    Epoch;
    // 平均運動の1次微分値を2で割った値:number
    // "MEAN_MOTION_DOT":2.0e-7,
    MeanMotionDot;
    // 平均運動の2次微分値を6で割った値:number
    // "MEAN_MOTION_DDOT":0
    MeanMotionDdot;
    // B*抗力項:number
    // "BSTAR":0,
    BStar;
    // この軌道要素を算出した軌道モデル (Ephemeris) の種別:number
    // "EPHEMERIS_TYPE":0,
    EphemerisType;
    // 軌道要素通番:number
    // "ELEMENT_SET_NO":999,
    ElementSetNumber;

    // 軌道傾斜角:number
    // "INCLINATION":55.6956,
    Inclination;
    // 昇交点の赤経:number
    // "RA_OF_ASC_NODE":123.7167,
    RightAscensionOfTheAscendingNode;
    // 離心率:number
    // "ECCENTRICITY":0.0084035,
    Eccentricity;
    // 近地点引数:number
    // "ARG_OF_PERICENTER":53.9679,
    ArgumentOfPericenter;
    // 平均近点角:number
    // "MEAN_ANOMALY":306.895,
    MeanAnomaly;
    // 平均運動:number
    // "MEAN_MOTION":2.00561092,
    MeanMotion;
    // 回転数:number
    // "REV_AT_EPOCH":19906,
    RevolutionAtEpoch;

    radius_short;
    radius_long;
    angle = 0;
    color;

    constructor(elementJson){
        this.ObjectName=elementJson["OBJECT_NAME"];
        this.ObjectId=elementJson["OBJECT_ID"];
        this.NoradCatId=elementJson["NORAD_CAT_ID"];
        this.ClassificationType=elementJson["CLASSIFICATION_TYPE"];
        this.Epoch=elementJson["EPOCH"];
        this.MeanMotionDot=elementJson["MEAN_MOTION_DOT"];
        this.MeanMotionDdot=elementJson["MEAN_MOTION_DDOT"];
        this.BStar=elementJson["BSTAR"];
        this.EphemerisType=elementJson["EPHEMERIS_TYPE"];
        this.ElementSetNumber=elementJson["ELEMENT_SET_NO"];

        this.Inclination=elementJson["INCLINATION"];
        this.RightAscensionOfTheAscendingNode=elementJson["RA_OF_ASC_NODE"];
        this.Eccentricity=elementJson["ECCENTRICITY"];
        this.ArgumentOfPericenter=elementJson["ARG_OF_PERICENTER"];
        this.MeanAnomaly=elementJson["MEAN_ANOMALY"];
        this.MeanMotion=elementJson["MEAN_MOTION"];
        this.RevolutionAtEpoch=elementJson["REV_AT_EPOCH"];

        this.setRadius();
        this.setColor();
    }

    setRadius(){
        this.radius_long = egc_cr / Math.cbrt(this.MeanMotion ** 2);
        this.radius_short = this.radius_long * Math.sqrt(1 - this.Eccentricity ** 2)
    }

    getRadius(){
        // https://otaku-of-suri.hatenablog.com/entry/2016/11/27/174053
        // r= b**2 / a(1+e* Math.cos(angle))
        return this.radius_short**2 / this.radius_long *(1+Math.cos(degToRad(this.angle)))
    }

    addAngle(angle){
        this.angle=this.angle+angle;
    }

    getPosition3D(r){ // :[number,number,number]
        const [x,y]=cartesianToPolar(this.getRadius(),this.angle);

        const incRad=degToRad(this.Inclination);
        const ratRad=degToRad(this.RightAscensionOfTheAscendingNode);

        const c1=Math.cos(incRad);
        const s1=Math.sin(incRad);
        const c2=Math.cos(ratRad);
        const s2=Math.sin(ratRad);

        const x1 = r+(x*c1 - y*s2)/earthr;
        const y1 = r+(x*c1*s2 + y*c1*c2)/earthr; // - z*s1;
        const z1 = r+(x*s1*s2 + y*s1*c1)/earthr; // + z*c1;

        return [x1 , y1 , z1];
    }

    getPositionGeometory(r=1.0){
        const posi = this.getPosition3D(r);
        return {x:posi[0],y:posi[1],z:posi[2]};
    }

    async setColor(){
        const buf2hex = arrayBuffer => {
            return [...new Uint8Array(arrayBuffer)]
                .map(x => x.toString(16).padStart(2, '0')).join('');
        }
        const encoder = new TextEncoder();
        const data = encoder.encode(this.ObjectName);
        const hash = await crypto.subtle.digest("SHA-1", data);
        this.color = "0x"+buf2hex(hash).slice( 0, 6 );
    }
}

function degToRad(deg){
    return deg*180/Math.PI;
}

function radToDeg(rad){
    return rad*Math.PI/180;
}

function cartesianToPolar(r,rad){
    let x , y;
    x = r * Math.sin(rad);
    y = r * Math.cos(rad);
    return [x,y];
}

export {TLE};