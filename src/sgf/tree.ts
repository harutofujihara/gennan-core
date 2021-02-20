import { randmStr } from "../utils";
import { Node, RootNode, InternalNode, cloneNode } from "./";
import { propertiesToSgf } from "./stringifier";
import { Properties, cloneProperties } from "../types";
import { TreePath } from "./path";

type Props = {
  rootNode: RootNode;
};

class Tree {
  private _rootNode: RootNode;
  private _currentNode: Node;

  public constructor({ rootNode }: Props) {
    this._rootNode = rootNode;
    this._currentNode = rootNode;
  }

  get properties(): Properties {
    return cloneProperties(this._currentNode.properties);
  }

  get rootProperties(): Properties {
    return cloneProperties(this._rootNode.properties);
  }

  get rootNode(): RootNode {
    return cloneNode(this._rootNode);
  }

  get node(): Node {
    return cloneNode(this._currentNode);
  }

  get nextNodes(): Array<Node> {
    return this._currentNode.children.map((n) => cloneNode(n));
  }

  public atRoot(): boolean {
    return this._currentNode.isRoot();
  }

  public atLeaf(): boolean {
    return this._currentNode.isLeaf();
  }

  /**
   * up
   * @param idx
   */
  public up(): Tree {
    if (this._currentNode.isInternal()) {
      this._currentNode = this._currentNode.parent;
    }

    return this;
  }

  /**
   * down
   */
  public down(idx = 0): Tree {
    if (this._currentNode.children[idx]) {
      this._currentNode = this._currentNode.children[idx];
    } else {
      throw new Error();
    }

    return this;
  }

  /**
   * get treepath of current node
   */
  public getCurrentPath(): TreePath {
    const path: TreePath = [];
    const loop = (node: Node): void => {
      if (node.isInternal()) {
        path.unshift(node.parent.children.findIndex((rn) => rn.id === node.id));
        loop(node.parent);
      }
    };

    loop(this._currentNode);
    return path;
  }
  // あまり速度に違いは見られなかった
  // public getCurrentPath(): TreePath {
  //   if (this._currentNode == null) return [];
  //   const path: TreePath = [];
  //   const loop = (node: Node): void => {
  //     if (node.isInternal()) {
  //       path.push(node.parent.children.findIndex((rn) => rn.id === node.id));
  //       loop(node.parent);
  //     }
  //   };

  //   loop(this._currentNode);

  //   const reversed = path.reverse();
  //   return reversed;
  // }

  public createChildNode(properties: Properties): InternalNode {
    return new InternalNode({
      id: randmStr(),
      properties,
      parent: this._currentNode,
    });
  }

  // 現在位置に一手を足すfn
  public addNode(node: InternalNode): void {
    this._currentNode.addChild(node);
  }
  // 現在位置が末尾の時削除してcurrentNodeを一つ前に戻す
  public removeNode(): void {
    if (this.atRoot()) throw new Error("Root node can not be removed.");
    const id = this._currentNode.id;
    this.up();
    this._currentNode.removeChild(id);
  }

  /**
   * 深さ優先探索でNodeを取得する
   * @param id
   */
  private getNodeById(id: string): Node | undefined {
    const loop = (root: Node): Node | undefined => {
      if (root.id === id) return root;
      if (root.children.length > 0) {
        for (let i = 0; i < root.children.length; i++) {
          const n = loop(root.children[i]);
          if (n) return n;
        }
      }
    };

    return loop(this._rootNode);
  }

  public setRootProps(properties: Properties): void {
    this._rootNode.setProperties(properties);
  }

  public setProps(properties: Properties): void {
    this._currentNode.setProperties(properties);
  }

  public toSgf(): string {
    const dfs = (node: Node): string => {
      let sgf = propertiesToSgf(node.properties);
      if (node.children.length > 1) {
        node.children.map((n) => {
          sgf += "(" + dfs(n) + ")";
        });
      } else if (node.children.length === 1) {
        sgf += dfs(node.children[0]);
      }

      return sgf;
    };

    return "(" + dfs(this._rootNode) + ")";
  }
}

export { Tree };
