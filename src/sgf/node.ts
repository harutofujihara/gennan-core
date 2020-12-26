export const Property = {
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
} as const;
export type Property = typeof Property[keyof typeof Property];
export function isProperty(str: string): str is Property {
  return Object.values(Property).indexOf(str as any) !== -1;
}

// const Property = ["B", "W", "C", "SZ", "PB", "PW", "AB"] as const;
// export type Property = typeof Property[number];
// export function isProperty(str: string): str is Property {
//   return Property.indexOf(str as any) !== -1;
// }

export type Properties = { [key in Property]?: Array<string> };

export function cloneProperties(properties: Properties): Properties {
  return JSON.parse(JSON.stringify(properties)) as Properties;
}

/**
 * propertiesに値を追加してコピーしたものを返却する
 * @param properties
 * @param key
 * @param val
 */
export function addProperty(
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

export function removeProperty(
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

export function cloneNode(node: Node): Node {
  let cloneNode: Node = new RootNode({ id: "test", properties: {} });
  if (node.isRoot()) {
    cloneNode = new RootNode({
      id: node.id,
      properties: cloneProperties(node.properties),
    });
  }
  if (node.isInternal()) {
    cloneNode = new InternalNode({
      id: node.id,
      properties: cloneProperties(node.properties),
      parent: node.parent,
    });
  }

  node.children.map((n) => cloneNode.addChild(n));
  return cloneNode;
}

type Props = {
  id: string;
  properties: Properties;
  parent?: Node;
};

abstract class Node {
  readonly id: string;
  private _properties: Properties;
  private _children: Array<InternalNode> = [];

  constructor({ id, properties }: Props) {
    this.id = id;
    this._properties = properties;
  }

  get children(): Array<InternalNode> {
    return this._children;
  }
  get properties(): Properties {
    return this._properties;
  }

  abstract isRoot(): this is RootNode;
  abstract isInternal(): this is InternalNode;
  public isLeaf(): boolean {
    if (this._children.length <= 0) return true;
    return false;
  }

  public addChild(node: InternalNode): Node {
    this._children.push(node);
    return this;
  }

  public removeChild(id: string): Node {
    if (this.isLeaf()) throw new Error("The node is leaf.");
    const idx = this._children.findIndex((n) => n.id === id);
    this._children.splice(idx, 1);
    return this;
  }

  public setProperties(properties: Properties): void {
    this._properties = properties;
  }
}

class RootNode extends Node {
  public isRoot(): this is RootNode {
    return true;
  }
  public isInternal(): this is InternalNode {
    return false;
  }
}

type NodeProps = {
  id: string;
  properties: Properties;
  parent: Node;
};
class InternalNode extends Node {
  readonly parent: Node;

  constructor({ id, properties, parent }: NodeProps) {
    super({ id, properties });
    this.parent = parent;
  }

  public isRoot(): this is RootNode {
    return false;
  }
  public isInternal(): this is InternalNode {
    return true;
  }
}

export { Node, InternalNode, RootNode };
