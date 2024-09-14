const line0=/^.{,24}\n$/g;
// https://en.wikipedia.org/wiki/Two-line_element_set#Line_1
const line1=/^1 (?<SCN>\d{5})(?<Classific>S|U) (?<ID1>\d{2})(?<ID2>\d{3})(?<ID3>[A-Z ]{3}) (?<E1>\d{2})(?<E2>\d{3}\.\d{9}) (?<FD>(\+|\-| )\.\d{8}) (?<SD>(\+|\-| )(\d){5}\-(.)) (?<B>(\+|\-| )(\d{5})\-(\d)) (?<ET>\d) (?<ESN>\d{4})(?<Checksum>\d)\n$/g;
// https://en.wikipedia.org/wiki/Two-line_element_set#Line_2
const line2=/^2 (?<SCN>\d{5}) (?<Inc>\d{3}\.\d{4}) (?<Right>\d{3}\.\d{4}) (?<Ecc>\d{7}) (?<AoP>\d{3}\.\d{4}) (?<MA>\d{3}\.\d{4}) (?<MM>\d{2}\.\d{8})(?<RNaE>\d{5})(?<Checksum>\d)\n$/g;

// 地球重力定数の３乗根
const egc_cr = 73594.59595;

class TLE{
    // 衛星名
    SatelliteName:String;

    // 衛星カタログ番号
    SatelliteCatalogNumber:number;
    // 分類
    Classification:number;
    // 国際衛星識別符号 (打上げ年のラスト2桁)
    InternationalDesignatorYear:number;
    // 国際衛星識別符号 (その年の打上げの通算番号)
    InternationalDesignatorNum:number;
    // 国際衛星識別符号（その打上げによる飛行体の通番
    InternationalDesignatorSerial:number;
    // この軌道要素の元期 (年のラスト2桁)
    EpochYear:number;
    // 元期 (続き)
    EpochDay:number;
    // 平均運動の1次微分値を2で割った値
    FirstDerivativeOfMeanMotion:number;
    // 平均運動の2次微分値を6で割った値
    SecondDerivativeOfMeanMotion:number;
    // B*抗力項
    BSTAR:number;
    // この軌道要素を算出した軌道モデル (Ephemeris) の種別
    EphemerisType:number;
    // 軌道要素通番
    ElementSetNumber:number;

    // 軌道傾斜角
    Inclination:number;
    // 昇交点の赤経
    RightAscensionOfTheAscendingNode:number;
    // 離心率
    Eccentricity:number;
    // 近地点引数
    ArgumentOfPerigee:number;
    // 平均近点角
    MeanAnomaly:number;
    // 平均運動
    MeanMotion:number;
    // 回転数
    RevolutionNumberAtEpoch:number;

    radius_short:number;
    radius_long:number;
    angle:number = 0;

    constructor(l0,l1,l2){
        if(l1.SCN!=l2.SCN){
            throw new Error("");
        }
        this.SatelliteName=l0[0];
        this.Inclination=Number(l2.Inc);
        this.RightAscensionOfTheAscendingNode=Number(l2.Right);
        this.Eccentricity=Number(l2.Ecc);
        this.ArgumentOfPerigee=Number(l2.AoP);
        this.MeanAnomaly=Number(l2.MA);
        this.MeanMotion=Number(l2.MM);
        this.RevolutionNumberAtEpoch=Number(l2.RNaE);

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

function splitTles(data){
    let Satellites:Array<TLE> = new Array();
    const line=data.split("\r\n").filter(function(v:string){
        return !(v==="");8
    });
    for(let i=0;i<line.length;i+=3){
        Satellites.push(new TLE(line[i].match(line0),line[i+1].match(line1),line[i+2].match(line2)));
    }
    // Satellites[0].status()
    return Satellites;
}
