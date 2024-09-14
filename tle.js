async function fetchTle(dataUrl){
    let data;
    await fetch(dataUrl)
        .then((response) => response.text())
        .then((text) => {
            data=text;
        });
    return data;
}

const line0=/^.{,24}\n$/g;
// https://en.wikipedia.org/wiki/Two-line_element_set#Line_1
const line1=/^1 (?<SCN>\d{5})(?<Classific>S|U) (?<ID1>\d{2})(?<ID2>\d{3})(?<ID3>[A-Z ]{3}) (?<E1>\d{2})(?<E2>\d{3}\.\d{9}) (?<FD>(\+|\-| )\.\d{8}) (?<SD>(\+|\-| )(\d){5}\-(.)) (?<B>(\+|\-| )(\d{5})\-(\d)) (?<ET>\d) (?<ESN>\d{4})(?<Checksum>\d)\n$/g;
// https://en.wikipedia.org/wiki/Two-line_element_set#Line_2
const line2=/^2 (?<SCN>\d{5}) (?<Inc>\d{3}\.\d{4}) (?<Right>\d{3}\.\d{4}) (?<Ecc>\d{7}) (?<AoP>\d{3}\.\d{4}) (?<MA>\d{3}\.\d{4}) (?<MM>\d{2}\.\d{8})(?<RNaE>\d{5})(?<Checksum>\d)\n$/g;

// 地球重力定数の３乗根
const egc_cr = 73594.59595;
// Math.cbrt()

class TLE{
    // 衛星名
    SatelliteName;

    // 衛星カタログ番号
    SatelliteCatalogNumber;
    // 分類
    Classification;
    // 国際衛星識別符号 (打上げ年のラスト2桁)
    InternationalDesignatorYear;
    // 国際衛星識別符号 (その年の打上げの通算番号)
    InternationalDesignatorNum;
    // 国際衛星識別符号（その打上げによる飛行体の通番
    InternationalDesignatorSerial;
    // この軌道要素の元期 (年のラスト2桁)
    EpochYear;
    // 元期 (続き)
    EpochDay;
    // 平均運動の1次微分値を2で割った値
    FirstDerivativeOfMeanMotion;
    // 平均運動の2次微分値を6で割った値
    SecondDerivativeOfMeanMotion;
    // B*抗力項
    BSTAR;
    // この軌道要素を算出した軌道モデル (Ephemeris) の種別
    EphemerisType;
    // 軌道要素通番
    ElementSetNumber;

    // 軌道傾斜角
    Inclination;
    // 昇交点の赤経
    RightAscensionOfTheAscendingNode;
    // 離心率
    Eccentricity;
    // 近地点引数
    ArgumentOfPerigee;
    // 平均近点角
    MeanAnomaly;
    // 平均運動
    MeanMotion;
    // 回転数
    RevolutionNumberAtEpoch;

    radius_short;
    radius_long;

    constructor(l0,l1,l2){
        if(l1.SCN!=l2.SCN){
            throw new Error("");
        }
        this.SatelliteName=l0
        this.Inclination=float(l2.Inc);
        this.RightAscensionOfTheAscendingNode=float(l2.Right);
        this.Eccentricity=float(l2.Ecc);
        this.ArgumentOfPerigee=float(l2.AoP);
        this.MeanAnomaly=float(l2.MA);
        this.MeanMotion=float(l2.MM);
        this.RevolutionNumberAtEpoch=l2.RNaE

        this.radius_long = egc_cr / Math.cbrt(this.MeanMotion ** 2);
        this.radius_short = this.radius_long * Math.sqrt(1 - this.Eccentricity ** 2)

    }
}

function splitTles(data){
    let Satellites=[];
    const line=data.split("\r\n").filter(function(v){
        return ! v=="";
    });
    for(let i=0;i<line.length;i+=3){
        Satellites.push(new TLE(line[i].match(line0),line[i+1].match(line1),line[i+2].match(line2)));
    }
    Satellites[0].status()
    return Satellites;
}

// function splitTles(data){
//     const line0s=data.match(line0);
//     const line1s=data.match(line1);
//     const line2s=data.match(line2);

//     let items=[];
//     const l0=line0s.length;
//     const l1=line1s.length;
//     const l2=line2s.length;
//     if(l0==l1 && l1==l2){
//         for(let i=0;i<=l0;i++){
//             console.log(l0[i])
//             console.log(l1[i])
//             console.log(l2[i])
//             let item={};
//             item.name=line0s[i];
//             item.line1=line1s[i];
//             item.line2=line2s[i];
//             items.push(item);
//         }
//     }
//     return items;
// }

export{fetchTle}