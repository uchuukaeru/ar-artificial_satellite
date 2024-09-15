// 地球重力定数の３乗根
const egc_cr = 73594.59595;

class TLE{
    // 衛星名
    // "OBJECT_NAME":"GPS BIIR-2  (PRN 13)",
    ObjectName:String;
    //
    // "OBJECT_ID":"1997-035A",
    ObjectId:String;
    // 衛星カタログ番号
    // "NORAD_CAT_ID":24876,
    NoradCatId:number;
    // 分類
    // "CLASSIFICATION_TYPE":"U",
    ClassificationType:String;
    // 原期
    // "EPOCH":"2024-09-12T12:42:13.013856",
    Epoch:String;
    // 平均運動の1次微分値を2で割った値
    // "MEAN_MOTION_DOT":2.0e-7,
    MeanMotionDot:number;
    // 平均運動の2次微分値を6で割った値
    // "MEAN_MOTION_DDOT":0
    MeanMotionDdot:number;
    // B*抗力項
    // "BSTAR":0,
    BStar:number;
    // この軌道要素を算出した軌道モデル (Ephemeris) の種別
    // "EPHEMERIS_TYPE":0,
    EphemerisType:number;
    // 軌道要素通番
    // "ELEMENT_SET_NO":999,
    ElementSetNumber:number;

    // 軌道傾斜角
    // "INCLINATION":55.6956,
    Inclination:number;
    // 昇交点の赤経
    // "RA_OF_ASC_NODE":123.7167,
    RightAscensionOfTheAscendingNode:number;
    // 離心率
    // "ECCENTRICITY":0.0084035,
    Eccentricity:number;
    // 近地点引数
    // "ARG_OF_PERICENTER":53.9679,
    ArgumentOfPericenter:number;
    // 平均近点角
    // "MEAN_ANOMALY":306.895,
    MeanAnomaly:number;
    // 平均運動
    // "MEAN_MOTION":2.00561092,
    MeanMotion:number;
    // 回転数
    // "REV_AT_EPOCH":19906,
    RevolutionAtEpoch:number;

    radius_short:number;
    radius_long:number;
    angle:number = 0;

    constructor(elementJson:JSON){
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
    }

    private setRadius(){
        this.radius_long = egc_cr / Math.cbrt(this.MeanMotion ** 2);
        this.radius_short = this.radius_long * Math.sqrt(1 - this.Eccentricity ** 2)
    }

    private getRadius(){
        // https://otaku-of-suri.hatenablog.com/entry/2016/11/27/174053
        // r= b**2 / a(1+e* Math.cos(angle))
        return this.radius_short**2 / this.radius_long *(1+Math.cos(degToRad(this.angle)))
    }

    public getPosition3D():[number,number,number]{
        const [x,y]=cartesianToPolar(this.getRadius(),this.angle);

        const incRad=degToRad(this.Inclination);
        const ratRad=degToRad(this.RightAscensionOfTheAscendingNode);

        const c1=Math.cos(incRad);
        const s1=Math.sin(incRad);
        const c2=Math.cos(ratRad);
        const s2=Math.sin(ratRad);

        const x1:number = x*c1 - y*s2;
        const y1:number = x*c1*s2 + y*c1*c2; // - z*s1;
        const z1:number = x*s1*s2 + y*s1*c1; // + z*c1;

        return [x1 , y1 , z1];
    }
}

function degToRad(deg:number){
    return deg*180/Math.PI;
}

function radToDeg(rad:number){
    return rad*Math.PI/180;
}

function cartesianToPolar(r:number,rad:number){
    let x:number , y:number;
    x = r * Math.sin(rad);
    y = r * Math.cos(rad);
    return [x,y];
}

