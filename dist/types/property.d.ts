declare const Property: {
    readonly B: "B";
    readonly W: "W";
    readonly C: "C";
    readonly SZ: "SZ";
    readonly PB: "PB";
    readonly PW: "PW";
    readonly AB: "AB";
    readonly AW: "AW";
    readonly GN: "GN";
    readonly KM: "KM";
    readonly CR: "CR";
    readonly SQ: "SQ";
    readonly TR: "TR";
    readonly MA: "MA";
    readonly LB: "LB";
    readonly FF: "FF";
    readonly CA: "CA";
    readonly GM: "GM";
    readonly BR: "BR";
    readonly WR: "WR";
    readonly RE: "RE";
    readonly DT: "DT";
    readonly AP: "AP";
    readonly SO: "SO";
    readonly BC: "BC";
    readonly WC: "WC";
    readonly EV: "EV";
    readonly TM: "TM";
    readonly LT: "LT";
    readonly LC: "LC";
    readonly GK: "GK";
    readonly OT: "OT";
    readonly RU: "RU";
    readonly PL: "PL";
    readonly MULTIGOGM: "MULTIGOGM";
    readonly KGSDE: "KGSDE";
    readonly KGSSB: "KGSSB";
    readonly KGSSW: "KGSSW";
};
declare type Property = typeof Property[keyof typeof Property] | string;
declare function isProperty(str: string): str is Property;
declare type Properties = {
    [key in Property]?: Array<string>;
};
declare function cloneProperties(properties: Properties): Properties;
/**
 * propertiesに値を追加してコピーしたものを返却する
 * @param properties
 * @param key
 * @param val
 */
declare function addProperty(properties: Properties, key: Property, val: string): Properties;
declare function removeProperty(properties: Properties, key: Property, val: string): Properties;
export { Property, isProperty, Properties, cloneProperties, addProperty, removeProperty, };
