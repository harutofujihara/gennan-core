import { Properties } from "../types";
export declare function cloneNode(node: Node): Node;
declare type Props = {
    id: string;
    properties: Properties;
    parent?: Node;
};
declare abstract class Node {
    readonly id: string;
    private _properties;
    private _children;
    constructor({ id, properties }: Props);
    get children(): Array<InternalNode>;
    get properties(): Properties;
    abstract isRoot(): this is RootNode;
    abstract isInternal(): this is InternalNode;
    isLeaf(): boolean;
    addChild(node: InternalNode): Node;
    removeChild(id: string): Node;
    setProperties(properties: Properties): void;
}
declare class RootNode extends Node {
    isRoot(): this is RootNode;
    isInternal(): this is InternalNode;
}
declare type NodeProps = {
    id: string;
    properties: Properties;
    parent: Node;
};
declare class InternalNode extends Node {
    readonly parent: Node;
    constructor({ id, properties, parent }: NodeProps);
    isRoot(): this is RootNode;
    isInternal(): this is InternalNode;
}
export { Node, InternalNode, RootNode };
