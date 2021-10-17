import { Node, RootNode, InternalNode } from "./";
import { Properties } from "../types";
import { TreePath } from "./path";
declare type Props = {
    rootNode: RootNode;
};
declare class Tree {
    private _rootNode;
    private _currentNode;
    constructor({ rootNode }: Props);
    get properties(): Properties;
    get rootProperties(): Properties;
    get rootNode(): RootNode;
    get node(): Node;
    get nextNodes(): Array<Node>;
    atRoot(): boolean;
    atLeaf(): boolean;
    /**
     * up
     * @param idx
     */
    up(): Tree;
    /**
     * down
     */
    down(idx?: number): Tree;
    /**
     * get treepath of current node
     */
    getCurrentPath(): TreePath;
    createChildNode(properties: Properties): InternalNode;
    addNode(node: InternalNode): void;
    removeNode(): void;
    /**
     * 深さ優先探索でNodeを取得する
     * @param id
     */
    private getNodeById;
    setRootProps(properties: Properties): void;
    setProps(properties: Properties): void;
    toSgf(): string;
}
export { Tree };
