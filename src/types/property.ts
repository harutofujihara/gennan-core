import { isUpperCase } from "../utils";

const Property = {
  B: "B",
  W: "W",
  C: "C",
  SZ: "SZ",
  PB: "PB",
  PW: "PW",
  AB: "AB",
  AW: "AW",
  GN: "GN",
  KM: "KM",
  CR: "CR",
  SQ: "SQ",
  TR: "TR",
  MA: "MA",
  LB: "LB",
  FF: "FF",
  CA: "CA",
  GM: "GM",
  BR: "BR",
  WR: "WR",
  RE: "RE",
  DT: "DT",
  AP: "AP",
  SO: "SO",
  BC: "BC",
  WC: "WC",
  EV: "EV",
  TM: "TM",
  LT: "LT",
  LC: "LC",
  GK: "GK",
  OT: "OT",
  RU: "RU",
  PL: "PL",
  MULTIGOGM: "MULTIGOGM",
  KGSDE: "KGSDE",
  KGSSB: "KGSSB",
  KGSSW: "KGSSW",
} as const;
type Property = typeof Property[keyof typeof Property] | string;

function isProperty(str: string): str is Property {
  // 値の種類が膨大なので大文字かどうかだけ判定する
  return isUpperCase(str);
  // return Object.values(Property).indexOf(str as any) !== -1;
}

type Properties = { [key in Property]?: Array<string> };

function cloneProperties(properties: Properties): Properties {
  return JSON.parse(JSON.stringify(properties)) as Properties;
}

/**
 * propertiesに値を追加してコピーしたものを返却する
 * @param properties
 * @param key
 * @param val
 */
function addProperty(
  properties: Properties,
  key: Property,
  val: string
): Properties {
  const cloneProps = cloneProperties(properties);

  let bef = cloneProps[key];
  if (bef != null) {
    bef.push(val);
  } else {
    bef = [val];
  }
  const newP = Array.from(new Set(bef)); // 重複排除
  cloneProps[key] = newP;

  return cloneProps;
}

function removeProperty(
  properties: Properties,
  key: Property,
  val: string
): Properties {
  const cloneProps = cloneProperties(properties);
  const bef = cloneProps[key];

  if (bef != null) {
    cloneProps[key] = bef.filter((v) => v !== val);
  }

  return cloneProps;
}

export {
  Property,
  isProperty,
  Properties,
  cloneProperties,
  addProperty,
  removeProperty,
};
