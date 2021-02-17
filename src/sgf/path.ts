// [0]             equals '0'
// [1]             equals '1'
// [0,1]           equals '0.1'
// [0,0,0,0,1,1,0] equals '0:4.1:2.0'
// [0,0,1+]        equals [0.0.1.0...(500 times)]
export type TreePath = Array<number>;

export function toPathString(path: TreePath): string {
  // rootNodeに位置しているときのTreePathは[0]なので
  // 要素がなければ例外を発生させる
  if (path.length <= 0 || path[0] !== 0)
    throw new Error("TreePath is invalid.");

  let pathStr = "0";
  let prev = path[0];
  let count = 0;

  for (let i = 1; i < path.length; i++) {
    if (prev === path[i]) {
      // 末尾の要素の場合は追加する必要がある
      if (i === path.length - 1) {
        if (path[i] === 0) {
          // (先頭でない場合)末尾の "0." を取り除く
          if (2 < pathStr.length) pathStr = pathStr.slice(0, -2);
          // "+"を追加
          pathStr += "+";
        } else {
          pathStr = pathStr + ":" + (count + 2);
        }
      }
      // 末尾でなければカウントだけ増やす
      else {
        count += 1;
      }
    } else {
      // 以前の要素までは値が連続していた場合
      if (0 < count) {
        pathStr = pathStr + ":" + (count + 1) + "." + path[i];
      }
      // 連続がなければ普通に値を追加する
      else {
        pathStr = pathStr + "." + path[i];
      }
      prev = path[i];
      count = 0;
    }
  }

  return pathStr;
}

export function toTreePath(pathString: string): TreePath {
  const splitted = pathString.split(".");
  let path: TreePath = [];

  for (let i = 0; i < splitted.length; i++) {
    if (splitted[i].length === 1) path.push(Number(splitted[i]));
    else {
      if (splitted[i].slice(-1) === "+") {
        path.push(Number(splitted[i].slice(0, 1)));
        path = path.concat(new Array(500).fill(0));
      } else {
        const pair = splitted[i].split(":");
        path = path.concat(new Array(Number(pair[1])).fill(Number(pair[0])));
      }
    }
  }

  return path;
}
