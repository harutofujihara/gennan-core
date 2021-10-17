// refer to
// https://github.com/Kashomon/glift/blob/master/deps/glift-core/rules/treepath.js

// [0]             equals '0'
// [1]             equals '1'
// [0,1]           equals '0.1'
// [0,0,0,0,1,1,0] equals '0:4.1:2.0'

// [0,0,1+]        equals [0.0.1.0...(500 times)]
export type TreePath = Array<number>;

export function toInitPathString(path: TreePath, isEnd: boolean = false) {
  if (path.length === 0) {
    return "0";
  }

  let firstNumber = 0;
  for (let i = 0; i < path.length; i++) {
    let elem = path[i];
    if (elem !== 0) {
      break;
    } else {
      firstNumber = i + 1;
    }
  }
  let component = toFragmentString(path.slice(firstNumber));
  if (component) {
    // 0.1....0:3 => 0.1....+
    if (isEnd) {
      const splitted = component.split(".");
      const lastToken = splitted[splitted.length - 1];
      if (lastToken.split(":").length > 1 && lastToken.split(":")[0] === "0")
        component = splitted.slice(0, splitted.length - 1).join(".") + "+";
    }
    return firstNumber + "." + component;
  } else {
    return firstNumber + "";
  }
}

export function toFragmentString(path: TreePath) {
  if (path.length === 0) {
    return "";
  }
  let last: string = "";
  let next = null;
  let repeated = 0;
  let out = "";

  let flush = function () {
    let component = "";
    if (repeated < 2) {
      component = last + "";
    } else {
      component = last + ":" + repeated;
    }
    if (out === "") {
      out = component;
    } else {
      out += "." + component;
    }
    repeated = 1;
  };

  for (let i = 0; i < path.length; i++) {
    next = path[i];
    if (last === "") {
      last = next.toString();
    }
    if (next.toString() === last) {
      repeated++;
    } else {
      flush();
    }
    last = next.toString();
  }
  flush();
  return out;
}

export function parseInitialPath(initPos: string): TreePath {
  if (initPos === "+") {
    return toEnd;
  }

  var out = [];
  var firstNum = parseInt(initPos, 10);
  for (var j = 0; j < firstNum; j++) {
    out.push(0);
  }

  // The only valid next characters are . or +.
  var rest = initPos.replace(firstNum + "", "");
  if (rest == "") {
    return out;
  }

  var next = rest.charAt(0);
  if (next === ".") {
    return out.concat(parseFragment(rest.substring(1)));
  } else if (next === "+") {
    return out.concat(toEnd);
  } else {
    throw new Error("Unexpected token [" + next + "] for path " + initPos);
  }
}

export function parseFragment(pathStr: string): TreePath {
  var splat = pathStr.split(/([\.:+])/);
  var numre = /^\d+$/;
  var out = [];

  var states = {
    VARIATION: 1,
    SEPARATOR: 2,
    MULTIPLIER: 3,
  };
  var curstate = states.VARIATION;
  var prevVariation = null;
  for (var i = 0; i < splat.length; i++) {
    var token = splat[i];
    if (curstate === states.SEPARATOR) {
      if (token === ".") {
        curstate = states.VARIATION;
      } else if (token === ":") {
        curstate = states.MULTIPLIER;
      } else if (token === "+") {
        // There could be more characters after this. Maybe throw an error.
        return out.concat(toEnd);
      } else {
        throw new Error("Unexpected token " + token + " for path " + pathStr);
      }
    } else {
      if (!numre.test(token)) {
        throw new Error(
          "Was expecting number but found " + token + " for path: " + pathStr
        );
      }
      var num = parseInt(token, 10);
      if (curstate === states.VARIATION) {
        out.push(num);
        prevVariation = num;
        curstate = states.SEPARATOR;
      } else if (curstate === states.MULTIPLIER) {
        if (prevVariation === null) {
          throw new Error(
            "Error using variation multiplier for path: " + pathStr
          );
        }
        // We should have already added the variation once, so we add num-1
        // more times. This has the side effect that 0:0 is equivalent to 0:1
        // and also equivalent to just 0. Probably ok.
        for (var j = 0; j < num - 1; j++) {
          out.push(prevVariation);
        }
        prevVariation = null;
        curstate = states.SEPARATOR;
      }
    }
  }
  return out;
}

const toEnd = new Array(500).fill(0);
