(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/gennanCore.ts":
/*!***************************!*\
  !*** ./src/gennanCore.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GennanCore = void 0;
var types_1 = __webpack_require__(/*! ./types */ "./src/types/index.ts");
var sgf_1 = __webpack_require__(/*! ./sgf */ "./src/sgf/index.ts");
var rule_1 = __webpack_require__(/*! ./rule */ "./src/rule/index.ts");
var utils_1 = __webpack_require__(/*! ./utils */ "./src/utils.ts");
var STAR_POINTS = {
    9: [{ x: 5, y: 5 }],
    13: [
        { x: 4, y: 4 },
        { x: 4, y: 10 },
        { x: 7, y: 7 },
        { x: 10, y: 4 },
        { x: 10, y: 10 },
    ],
    19: [
        { x: 4, y: 4 },
        { x: 4, y: 10 },
        { x: 4, y: 16 },
        { x: 10, y: 4 },
        { x: 10, y: 10 },
        { x: 10, y: 16 },
        { x: 16, y: 4 },
        { x: 16, y: 10 },
        { x: 16, y: 16 },
    ],
};
var GennanCore = /** @class */ (function () {
    function GennanCore(tree) {
        this.tree = tree;
        this.board = new rule_1.Board({
            gridNum: this.gridNum,
            fixedStones: this.fixedStones,
        });
    }
    /**
     * Factory
     * @param gridNum
     */
    GennanCore.create = function (gridNum) {
        if (gridNum === void 0) { gridNum = 19; }
        var sgf = "(;CA[utf-8]FF[4]GM[1]SZ[" + String(gridNum) + "])";
        return new GennanCore(sgf_1.toTree(sgf));
    };
    /**
     * Factory
     * @param sgf
     */
    GennanCore.createFromSgf = function (sgf) {
        return new GennanCore(sgf_1.toTree(sgf));
    };
    Object.defineProperty(GennanCore.prototype, "viewBoard", {
        /**
         * BoardState for View
         */
        get: function () {
            var _this = this;
            var _a, _b, _c, _d, _e;
            var viewBoard = this.board.boardState
                .filter(function (_, i) { return i !== 0 && i !== _this.board.boardState.length - 1; })
                .map(function (v) {
                return v
                    .filter(function (_, i) { return i !== 0 && i !== _this.board.boardState.length - 1; })
                    .map(function (vv) {
                    var color;
                    if (vv === types_1.PointState.Black)
                        color = types_1.Color.Black;
                    if (vv === types_1.PointState.White)
                        color = types_1.Color.White;
                    return {
                        color: color,
                        circle: false,
                        square: false,
                        triangle: false,
                        cross: false,
                        current: false,
                        star: false,
                    };
                });
            });
            // markups
            (_a = this.tree.properties[types_1.Property.CR]) === null || _a === void 0 ? void 0 : _a.map(function (sp) {
                var point = sgf_1.toPoint(sp);
                viewBoard[point.x - 1][point.y - 1].circle = true; // viewBoardは1から始まるので地点をずらす
            });
            (_b = this.tree.properties[types_1.Property.TR]) === null || _b === void 0 ? void 0 : _b.map(function (sp) {
                var point = sgf_1.toPoint(sp);
                viewBoard[point.x - 1][point.y - 1].triangle = true;
            });
            (_c = this.tree.properties[types_1.Property.SQ]) === null || _c === void 0 ? void 0 : _c.map(function (sp) {
                var point = sgf_1.toPoint(sp);
                viewBoard[point.x - 1][point.y - 1].square = true;
            });
            (_d = this.tree.properties[types_1.Property.MA]) === null || _d === void 0 ? void 0 : _d.map(function (sp) {
                var point = sgf_1.toPoint(sp);
                viewBoard[point.x - 1][point.y - 1].cross = true;
            });
            (_e = this.tree.properties[types_1.Property.LB]) === null || _e === void 0 ? void 0 : _e.map(function (sp) {
                var spl = sp.split(":");
                var point = sgf_1.toPoint(spl[0]);
                viewBoard[point.x - 1][point.y - 1].text = spl[1];
            });
            // star
            STAR_POINTS[this.gridNum].map(function (p) { return (viewBoard[p.x - 1][p.y - 1].star = true); });
            // current
            if (!this.tree.atRoot()) {
                var move = sgf_1.nodeToMove(this.tree.node);
                if (move.point != null) {
                    viewBoard[move.point.x - 1][move.point.y - 1].current = true;
                }
            }
            // next
            var nos = this.nextMoveOptions.filter(function (no) { return no.move.point != null; });
            if (nos.length > 0) {
                nos.map(function (no) {
                    if (no.move.point != null) {
                        viewBoard[no.move.point.x - 1][no.move.point.y - 1].nextIndex =
                            no.idx;
                    }
                });
            }
            return viewBoard;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GennanCore.prototype, "sgf", {
        get: function () {
            return this.tree.toSgf();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GennanCore.prototype, "snapshotSgf", {
        get: function () {
            var _a, _b, _c, _d, _e;
            // stones
            var clonedRootProperties = types_1.cloneProperties(this.tree.rootNode.properties);
            var newProps = clonedRootProperties;
            var gridNum = this.board.boardState.length;
            for (var x = 0; x < gridNum; x++) {
                for (var y = 0; y < gridNum; y++) {
                    if (this.board.boardState[x][y] === types_1.PointState.Black) {
                        newProps = types_1.addProperty(newProps, types_1.Property.AB, sgf_1.pointTo({ x: x, y: y }));
                    }
                    if (this.board.boardState[x][y] === types_1.PointState.White) {
                        newProps = types_1.addProperty(newProps, types_1.Property.AW, sgf_1.pointTo({ x: x, y: y }));
                    }
                }
            }
            // markups
            (_a = this.tree.properties[types_1.Property.CR]) === null || _a === void 0 ? void 0 : _a.map(function (cp) {
                newProps = types_1.addProperty(newProps, types_1.Property.CR, cp);
            });
            (_b = this.tree.properties[types_1.Property.TR]) === null || _b === void 0 ? void 0 : _b.map(function (tp) {
                newProps = types_1.addProperty(newProps, types_1.Property.TR, tp);
            });
            (_c = this.tree.properties[types_1.Property.SQ]) === null || _c === void 0 ? void 0 : _c.map(function (sp) {
                newProps = types_1.addProperty(newProps, types_1.Property.SQ, sp);
            });
            (_d = this.tree.properties[types_1.Property.MA]) === null || _d === void 0 ? void 0 : _d.map(function (map) {
                newProps = types_1.addProperty(newProps, types_1.Property.MA, map);
            });
            (_e = this.tree.properties[types_1.Property.LB]) === null || _e === void 0 ? void 0 : _e.map(function (lbp) {
                newProps = types_1.addProperty(newProps, types_1.Property.LB, lbp);
            });
            var sgf = sgf_1.propertiesToSgf(newProps);
            return "(" + sgf + ")";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GennanCore.prototype, "currentPath", {
        get: function () {
            return this.tree.getCurrentPath();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GennanCore.prototype, "nextMoveOptions", {
        get: function () {
            return this.tree.nextNodes.map(function (v, i) {
                return {
                    idx: i,
                    move: sgf_1.nodeToMove(v),
                };
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GennanCore.prototype, "gridNum", {
        get: function () {
            var sz = this.tree.rootProperties[types_1.Property.SZ];
            if (sz != null) {
                var gn = Number(sz[0]);
                if (types_1.isGridNum(gn))
                    return gn;
            }
            return this.board ? this.board.gridNum : 19;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GennanCore.prototype, "teban", {
        get: function () {
            return this.board.teban;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GennanCore.prototype, "phase", {
        get: function () {
            return this.board.phase;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GennanCore.prototype, "fixedStones", {
        get: function () {
            var stones = [];
            var blacks = this.tree.rootProperties[types_1.Property.AB];
            if (blacks != null) {
                blacks.map(function (v) { return stones.push({ color: types_1.Color.Black, point: sgf_1.toPoint(v) }); });
            }
            var whites = this.tree.rootProperties[types_1.Property.AW];
            if (whites != null) {
                whites.map(function (v) { return stones.push({ color: types_1.Color.White, point: sgf_1.toPoint(v) }); });
            }
            return stones;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GennanCore.prototype, "gameName", {
        get: function () {
            var gn = this.tree.rootProperties[types_1.Property.GN];
            if (gn != null) {
                return gn[0];
            }
        },
        enumerable: false,
        configurable: true
    });
    GennanCore.prototype.setGameName = function (gameName) {
        if (this.gameName != null) {
            this.removeRootProp(types_1.Property.GN, this.gameName);
        }
        this.setRootProp(types_1.Property.GN, gameName);
    };
    Object.defineProperty(GennanCore.prototype, "blackPlayer", {
        get: function () {
            var bp = this.tree.rootProperties[types_1.Property.PB];
            if (bp != null) {
                return bp[0];
            }
        },
        enumerable: false,
        configurable: true
    });
    GennanCore.prototype.setBlackPlayer = function (blackPlayer) {
        if (this.blackPlayer != null) {
            this.removeRootProp(types_1.Property.PB, this.blackPlayer);
        }
        this.setRootProp(types_1.Property.PB, blackPlayer);
    };
    Object.defineProperty(GennanCore.prototype, "whitePlayer", {
        get: function () {
            var qp = this.tree.rootProperties[types_1.Property.PW];
            if (qp != null) {
                return qp[0];
            }
        },
        enumerable: false,
        configurable: true
    });
    GennanCore.prototype.setWhitePlayer = function (whitePlayer) {
        if (this.whitePlayer != null) {
            this.removeRootProp(types_1.Property.PW, this.whitePlayer);
        }
        this.setRootProp(types_1.Property.PW, whitePlayer);
    };
    Object.defineProperty(GennanCore.prototype, "komi", {
        get: function () {
            var km = this.tree.rootProperties[types_1.Property.KM];
            if (km != null) {
                return km[0];
            }
        },
        enumerable: false,
        configurable: true
    });
    GennanCore.prototype.setKomi = function (komi) {
        if (this.komi != null) {
            this.removeRootProp(types_1.Property.KM, this.komi);
        }
        this.setRootProp(types_1.Property.KM, komi);
    };
    Object.defineProperty(GennanCore.prototype, "gameDate", {
        get: function () {
            var date = this.tree.rootProperties[types_1.Property.DT];
            if (date != null) {
                return date[0];
            }
        },
        enumerable: false,
        configurable: true
    });
    GennanCore.prototype.setGameDate = function (date) {
        if (this.gameDate != null) {
            this.removeRootProp(types_1.Property.DT, this.gameDate);
        }
        this.setRootProp(types_1.Property.DT, date);
    };
    Object.defineProperty(GennanCore.prototype, "gameResult", {
        get: function () {
            var result = this.tree.rootProperties[types_1.Property.RE];
            if (result != null) {
                return result[0];
            }
        },
        enumerable: false,
        configurable: true
    });
    GennanCore.prototype.setGameResult = function (result) {
        if (this.gameResult != null) {
            this.removeRootProp(types_1.Property.RE, this.gameResult);
        }
        this.setRootProp(types_1.Property.RE, result);
    };
    Object.defineProperty(GennanCore.prototype, "comment", {
        get: function () {
            var c = this.tree.properties[types_1.Property.C];
            if (c != null) {
                return c[0];
            }
        },
        enumerable: false,
        configurable: true
    });
    GennanCore.prototype.setComment = function (comment) {
        if (this.comment != null) {
            this.removeProp(types_1.Property.C, this.comment);
        }
        this.setProp(types_1.Property.C, comment);
    };
    GennanCore.prototype.initBoard = function () {
        this.board = new rule_1.Board({
            gridNum: this.gridNum,
            fixedStones: this.fixedStones,
        });
    };
    Object.defineProperty(GennanCore.prototype, "existsNextMove", {
        get: function () {
            return !this.tree.atLeaf();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GennanCore.prototype, "existsBackMove", {
        get: function () {
            return !this.tree.atRoot();
        },
        enumerable: false,
        configurable: true
    });
    GennanCore.prototype.clone = function () {
        var cloned = GennanCore.createFromSgf(this.sgf);
        cloned.setFromInitPath(this.currentPath);
        return cloned;
    };
    GennanCore.prototype.playForward = function (idx) {
        if (idx === void 0) { idx = 0; }
        if (!this.existsNextMove)
            throw new Error("There are not next moves.");
        if (!this.tree.nextNodes[idx])
            throw new Error("Move index is invalid.");
        this.board.takeMove(sgf_1.nodeToMove(this.tree.nextNodes[idx]));
        this.tree.down(idx);
    };
    GennanCore.prototype.playForwardTimes = function (times, stopOnComment) {
        if (times === void 0) { times = 10; }
        if (stopOnComment === void 0) { stopOnComment = true; }
        for (var i = 0; i < times; i++) {
            if (!this.existsNextMove)
                break;
            this.playForward();
            if (this.comment != null && stopOnComment)
                break;
        }
    };
    GennanCore.prototype.playBackward = function () {
        if (this.tree.atRoot())
            throw new Error("This is root now.");
        this.board.undoMove();
        this.tree.up();
    };
    GennanCore.prototype.playBackwardTimes = function (times, stopOnComment) {
        if (times === void 0) { times = 10; }
        if (stopOnComment === void 0) { stopOnComment = true; }
        for (var i = 0; i < times; i++) {
            if (!this.existsBackMove)
                break;
            this.playBackward();
            if (this.comment != null && stopOnComment)
                break;
        }
    };
    GennanCore.prototype.setFromInitPath = function (initPath) {
        // initialize
        this.tree = sgf_1.toTree(this.sgf);
        this.board = new rule_1.Board({
            gridNum: this.gridNum,
            fixedStones: this.fixedStones,
        });
        this.setFromFragment(initPath);
    };
    GennanCore.prototype.setFromFragment = function (path) {
        for (var i = 0; i < path.length; i++) {
            if (this.existsNextMove)
                this.playForward(path[i]);
        }
    };
    // 一手追加する
    GennanCore.prototype.addMove = function (move) {
        var _a;
        var child = this.tree.createChildNode((_a = {},
            _a[move.color === types_1.Color.Black ? "B" : "W"] = move.point != null ? [sgf_1.pointTo(move.point)] : [],
            _a));
        this.tree.addNode(child);
    };
    // 一手削除する
    GennanCore.prototype.removeMove = function () {
        if (this.existsBackMove) {
            this.tree.removeNode();
            this.board.undoMove();
        }
    };
    GennanCore.prototype.setProp = function (property, sgf) {
        var newProps = types_1.addProperty(this.tree.properties, property, sgf);
        this.tree.setProps(newProps);
    };
    GennanCore.prototype.removeProp = function (property, sgf) {
        var newProps = types_1.removeProperty(this.tree.properties, property, sgf);
        this.tree.setProps(newProps);
    };
    GennanCore.prototype.setRootProp = function (property, sgf) {
        var newProps = types_1.addProperty(this.tree.rootProperties, property, sgf);
        this.tree.setRootProps(newProps);
    };
    GennanCore.prototype.removeRootProp = function (property, sgf) {
        var newProps = types_1.removeProperty(this.tree.rootProperties, property, sgf);
        this.tree.setRootProps(newProps);
    };
    GennanCore.prototype.setSymbol = function (point, symbol) {
        this.setProp(types_1.markupSymbolToProperty(symbol), sgf_1.pointTo(point));
    };
    GennanCore.prototype.removeSymbol = function (point, symbol) {
        this.removeProp(types_1.markupSymbolToProperty(symbol), sgf_1.pointTo(point));
    };
    GennanCore.prototype.setText = function (point, text) {
        this.setProp(types_1.Property.LB, sgf_1.pointTo(point) + ":" + text);
    };
    GennanCore.prototype.removeText = function (point) {
        var sgf = sgf_1.pointTo(point);
        var properties = this.tree.properties;
        var LB = properties[types_1.Property.LB];
        if (LB != null) {
            // 取り除く
            properties[types_1.Property.LB] = LB.filter(function (v) { return v.slice(0, 2) !== sgf; });
        }
        // 更新
        this.tree.setProps(properties);
    };
    GennanCore.prototype.setAlpha = function (point) {
        var ps = sgf_1.pointTo(point);
        var properties = this.tree.properties;
        var LB = properties[types_1.Property.LB];
        var next = "A";
        if (LB != null) {
            var regex_1 = /[^a-z]/gi; // a-z(lower,upperは無視)以外の文字が含まれているか判定する正規表現
            var alphas = LB.filter(function (v) { return !v.slice(-1).match(regex_1); });
            if (alphas.length > 0) {
                var last = alphas.map(function (v) { return v.slice(-1); }).sort()[alphas.length - 1];
                next = utils_1.nextAlpha(last).toUpperCase();
            }
        }
        this.setProp(types_1.Property.LB, ps + ":" + next);
    };
    GennanCore.prototype.setIncrement = function (point) {
        var ps = sgf_1.pointTo(point);
        var properties = this.tree.properties;
        var LB = properties[types_1.Property.LB];
        var next = 1;
        if (LB != null) {
            var nums = LB.filter(function (v) {
                return !isNaN(v.split(":")[1]);
            });
            if (nums.length > 0) {
                var last = nums
                    .map(function (v) { return Number(v.split(":")[1]); })
                    .sort(function (a, b) { return a - b; })[nums.length - 1];
                next = Number(last) + 1;
            }
        }
        this.setProp(types_1.Property.LB, ps + ":" + next.toString());
    };
    /**
     * 置石をセットする
     * @param stone
     */
    GennanCore.prototype.addFixedStone = function (stone) {
        var newProps = types_1.addProperty(this.tree.rootProperties, stone.color === types_1.Color.Black ? "AB" : "AW", sgf_1.pointTo(stone.point));
        this.tree.setProps(newProps);
        this.initBoard();
    };
    GennanCore.prototype.removeFixedStone = function (stone) {
        var newProps = types_1.removeProperty(this.tree.rootProperties, stone.color === types_1.Color.Black ? "AB" : "AW", sgf_1.pointTo(stone.point));
        this.tree.setProps(newProps);
        this.initBoard();
    };
    return GennanCore;
}());
exports.GennanCore = GennanCore;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./types */ "./src/types/index.ts"), exports);
__exportStar(__webpack_require__(/*! ./rule */ "./src/rule/index.ts"), exports);
__exportStar(__webpack_require__(/*! ./sgf */ "./src/sgf/index.ts"), exports);
__exportStar(__webpack_require__(/*! ./gennanCore */ "./src/gennanCore.ts"), exports);
__exportStar(__webpack_require__(/*! ./utils */ "./src/utils.ts"), exports);


/***/ }),

/***/ "./src/rule/board.ts":
/*!***************************!*\
  !*** ./src/rule/board.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Board = void 0;
var types_1 = __webpack_require__(/*! ../types */ "./src/types/index.ts");
var utils_1 = __webpack_require__(/*! ../utils */ "./src/utils.ts");
var Board = /** @class */ (function () {
    function Board(_a) {
        var _b;
        var _c = _a.gridNum, gridNum = _c === void 0 ? 19 : _c, _d = _a.fixedStones, fixedStones = _d === void 0 ? [] : _d, _e = _a.teban, teban = _e === void 0 ? types_1.Color.Black : _e;
        this._boardState = [[]];
        this._fixedStones = [];
        this._phase = 0;
        this.history = [];
        this.capturesCount = (_b = {},
            _b[types_1.Color.Black] = 0,
            _b[types_1.Color.White] = 0,
            _b);
        this._gridNum = gridNum;
        this.initBoardState();
        this.setFixedStones(fixedStones);
        this._teban = teban;
    }
    Object.defineProperty(Board.prototype, "boardState", {
        get: function () {
            return this._boardState;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "gridNum", {
        get: function () {
            return this._gridNum;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "teban", {
        get: function () {
            return this._teban;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "phase", {
        get: function () {
            return this._phase;
        },
        enumerable: false,
        configurable: true
    });
    Board.prototype.setFixedStones = function (fixedStones) {
        var _this = this;
        this._fixedStones = fixedStones;
        fixedStones.map(function (s) { return (_this._boardState[s.point.x][s.point.y] = s.color); });
    };
    Board.prototype.getPointState = function (point) {
        // clone
        return types_1.PointState[this._boardState[point.x][point.y]];
    };
    /**
     * initialize rule board using gridNum
     *
     * @return void
     */
    Board.prototype.initBoardState = function () {
        var board = [];
        for (var i = 0; i < this.gridNum + 2; i++) {
            var line = [];
            if (i === 0 || i === this.gridNum + 1) {
                for (var y = 0; y < this.gridNum + 2; y++) {
                    line[y] = types_1.PointState.Edge;
                }
            }
            else {
                for (var y = 0; y < this.gridNum + 2; y++) {
                    if (y === 0 || y === this.gridNum + 1) {
                        line[y] = types_1.PointState.Edge;
                    }
                    else {
                        line[y] = types_1.PointState.Empty;
                    }
                }
            }
            board[i] = line;
        }
        this._boardState = board;
    };
    Board.prototype.takeMove = function (move) {
        // if (this.teban !== move.color) throw new Error("Teban color is invalid.");
        var prevKou = this._kou;
        var capturedStones = [];
        // パスでない場合
        if (move.point != null) {
            // Validation
            // nonempty is illegal
            if (this._boardState[move.point.x][move.point.y] !== types_1.PointState.Empty) {
                throw new Error("The point is not empty.");
            }
            // check kou
            if (this._kou != null &&
                this._kou.x === move.point.x &&
                this._kou.y === move.point.y) {
                throw new Error("The point is kou.");
            }
            // suicide is illegal
            if (this.isSuicide(move.color, move.point)) {
                throw new Error("The point is suicide.");
            }
            // 仮に石を先に置く
            var clonedBoardState_1 = utils_1.copyMatrix(this._boardState);
            clonedBoardState_1[move.point.x][move.point.y] = move.color;
            // 石を取れるかの確認
            var oppoColor_1 = types_1.oppositeColor(move.color);
            var capture = function (p) {
                if (clonedBoardState_1[p.x][p.y] === oppoColor_1 &&
                    Board.isGroupSurroundedByEnemy(p, clonedBoardState_1)) {
                    // 石が取れたら重複を排除しつつ追加する
                    Board.getConnectedStones(p, clonedBoardState_1).map(function (s) {
                        if (capturedStones.findIndex(function (cs) { return s.point.x === cs.point.x && s.point.y === cs.point.y; }) === -1) {
                            capturedStones.push(s);
                        }
                    });
                }
            };
            // 上下左右をチェック
            capture(types_1.leftP(move.point));
            capture(types_1.upperP(move.point));
            capture(types_1.rightP(move.point));
            capture(types_1.lowerP(move.point));
            // コウを記録
            this._kou = undefined;
            if (capturedStones.length === 1 &&
                Board.isSurroundedByEnemy(move.point, clonedBoardState_1)) {
                this._kou = capturedStones[0].point;
            }
            // 取られた地点を空にする
            capturedStones.map(function (cs) {
                clonedBoardState_1[cs.point.x][cs.point.y] = types_1.PointState.Empty;
            });
            // 取られた石数を加算
            this.capturesCount[oppoColor_1] += capturedStones.length;
            // 状態を反映
            this._boardState = clonedBoardState_1;
        }
        // History
        this.history.push({
            move: move,
            capturedStones: capturedStones,
            kou: prevKou,
        });
        this._phase += 1; // 手数を進める
        this._teban = types_1.oppositeColor(move.color); // 手番を変える
    };
    Board.prototype.undoMove = function () {
        var _this = this;
        var history = this.history.pop();
        if (history == null)
            return;
        // 打った石を取り除く
        if (history.move.point != null) {
            this._boardState[history.move.point.x][history.move.point.y] =
                types_1.PointState.Empty;
        }
        // 取られた石を戻す
        history.capturedStones.map(function (s) {
            _this._boardState[s.point.x][s.point.y] = s.color;
        });
        this.capturesCount[types_1.oppositeColor(history.move.color)] -=
            history.capturedStones.length; // 取られた石数を戻す
        this._kou = history.kou; // コウをセット
        this._phase -= 1; // 手数を戻す
        this._teban = history.move.color; // 手番を戻す
    };
    /**
     * (同じ色の)繋がっている石の地点の配列を取得する
     * @param point
     */
    Board.getConnectedStones = function (point, boardState) {
        var color = boardState[point.x][point.y];
        if (color !== types_1.PointState.Black && color !== types_1.PointState.White) {
            return [];
        }
        var stones = [];
        var loop = function (point_) {
            // すでにチェックされていたら終了
            if (stones.find(function (s) { return s.point.x === point_.x && s.point.y === point_.y; })) {
                return;
            }
            stones.push({ color: color, point: point_ });
            // 左
            var lp = types_1.leftP(point_);
            if (boardState[lp.x][lp.y] === color)
                loop(lp);
            // 上
            var up = types_1.upperP(point_);
            if (boardState[up.x][up.y] === color)
                loop(up);
            // 右
            var rp = types_1.rightP(point_);
            if (boardState[rp.x][rp.y] === color)
                loop(rp);
            // 下
            var lowP = types_1.lowerP(point_);
            if (boardState[lowP.x][lowP.y] === color)
                loop(lowP);
        };
        loop(point);
        return stones;
    };
    Board.prototype.isSuicide = function (color, point) {
        // 仮に石を置いてみる
        var clonedBoardState = utils_1.copyMatrix(this._boardState);
        clonedBoardState[point.x][point.y] = color;
        // - 置いた石が敵石に囲まれていなければ自殺手ではない
        if (!Board.isGroupSurroundedByEnemy(point, clonedBoardState)) {
            return false;
        }
        // - 置いた石が敵石に囲まれているが、敵石のいずれかを囲めるなら自殺手ではない
        var left = types_1.leftP(point);
        var upper = types_1.upperP(point);
        var right = types_1.rightP(point);
        var lower = types_1.lowerP(point);
        if (
        // 左
        (clonedBoardState[left.x][left.y] === types_1.oppositeColor(color) &&
            Board.isGroupSurroundedByEnemy(left, clonedBoardState)) ||
            // 上
            (clonedBoardState[upper.x][upper.y] === types_1.oppositeColor(color) &&
                Board.isGroupSurroundedByEnemy(upper, clonedBoardState)) ||
            // 右
            (clonedBoardState[right.x][right.y] === types_1.oppositeColor(color) &&
                Board.isGroupSurroundedByEnemy(right, clonedBoardState)) ||
            // 下
            (clonedBoardState[lower.x][lower.y] === types_1.oppositeColor(color) &&
                Board.isGroupSurroundedByEnemy(lower, clonedBoardState))) {
            return false;
        }
        return true;
    };
    /**
     * 地点に石があり、かつその石が単体でが敵石に囲まれているかどうかを判定
     * @param point
     * @param boardState
     */
    Board.isSurroundedByEnemy = function (point, boardState) {
        if (boardState[point.x][point.y] === types_1.PointState.Empty ||
            boardState[point.x][point.y] === types_1.PointState.Edge) {
            return false;
        }
        var oppoColor = types_1.oppositeColor(boardState[point.x][point.y]);
        if ((boardState[point.x][point.y - 1] === types_1.PointState.Edge ||
            boardState[point.x][point.y - 1] === oppoColor) &&
            (boardState[point.x + 1][point.y] === types_1.PointState.Edge ||
                boardState[point.x + 1][point.y] === oppoColor) &&
            (boardState[point.x][point.y + 1] === types_1.PointState.Edge ||
                boardState[point.x][point.y + 1] === oppoColor) &&
            (boardState[point.x - 1][point.y] === types_1.PointState.Edge ||
                boardState[point.x - 1][point.y] === oppoColor)) {
            return true;
        }
        return false;
    };
    /**
     * 地点に石があり、かつその石を含むグループが敵石に囲まれているかどうかを判定
     * @param point
     * @param boardState
     */
    Board.isGroupSurroundedByEnemy = function (point, boardState) {
        if (boardState[point.x][point.y] === types_1.PointState.Empty ||
            boardState[point.x][point.y] === types_1.PointState.Edge) {
            return false;
        }
        var checked = [];
        var color = boardState[point.x][point.y];
        var loop = function (point_) {
            // すでにチェックされていたら終了
            if (checked.find(function (c) { return c.x === point_.x && c.y === point_.y; })) {
                return true;
            }
            checked.push(point_);
            // 空きが見つかったら終了
            if (boardState[point_.x][point_.y] === types_1.PointState.Empty) {
                return false;
            }
            // 同じ手番色なら、隣を再帰的に調べる
            if (boardState[point_.x][point_.y] === color) {
                // 左
                if (!loop(types_1.leftP(point_)))
                    return false;
                // 上
                if (!loop(types_1.upperP(point_)))
                    return false;
                // 右
                if (!loop(types_1.rightP(point_)))
                    return false;
                // 下
                if (!loop(types_1.lowerP(point_)))
                    return false;
            }
            return true;
        };
        return loop(point);
    };
    return Board;
}());
exports.Board = Board;


/***/ }),

/***/ "./src/rule/index.ts":
/*!***************************!*\
  !*** ./src/rule/index.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./board */ "./src/rule/board.ts"), exports);


/***/ }),

/***/ "./src/sgf/index.ts":
/*!**************************!*\
  !*** ./src/sgf/index.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./node */ "./src/sgf/node.ts"), exports);
__exportStar(__webpack_require__(/*! ./tree */ "./src/sgf/tree.ts"), exports);
__exportStar(__webpack_require__(/*! ./parser */ "./src/sgf/parser.ts"), exports);
__exportStar(__webpack_require__(/*! ./stringifier */ "./src/sgf/stringifier.ts"), exports);
__exportStar(__webpack_require__(/*! ./utils */ "./src/sgf/utils.ts"), exports);
__exportStar(__webpack_require__(/*! ./path */ "./src/sgf/path.ts"), exports);


/***/ }),

/***/ "./src/sgf/node.ts":
/*!*************************!*\
  !*** ./src/sgf/node.ts ***!
  \*************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RootNode = exports.InternalNode = exports.Node = exports.cloneNode = void 0;
var types_1 = __webpack_require__(/*! ../types */ "./src/types/index.ts");
function cloneNode(node) {
    var cloneNode = new RootNode({ id: "test", properties: {} });
    if (node.isRoot()) {
        cloneNode = new RootNode({
            id: node.id,
            properties: types_1.cloneProperties(node.properties),
        });
    }
    if (node.isInternal()) {
        cloneNode = new InternalNode({
            id: node.id,
            properties: types_1.cloneProperties(node.properties),
            parent: node.parent,
        });
    }
    node.children.map(function (n) { return cloneNode.addChild(n); });
    return cloneNode;
}
exports.cloneNode = cloneNode;
var Node = /** @class */ (function () {
    function Node(_a) {
        var id = _a.id, properties = _a.properties;
        this._children = [];
        this.id = id;
        this._properties = properties;
    }
    Object.defineProperty(Node.prototype, "children", {
        get: function () {
            return this._children;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "properties", {
        get: function () {
            return this._properties;
        },
        enumerable: false,
        configurable: true
    });
    Node.prototype.isLeaf = function () {
        if (this._children.length <= 0)
            return true;
        return false;
    };
    Node.prototype.addChild = function (node) {
        this._children.push(node);
        return this;
    };
    Node.prototype.removeChild = function (id) {
        if (this.isLeaf())
            throw new Error("The node is leaf.");
        var idx = this._children.findIndex(function (n) { return n.id === id; });
        this._children.splice(idx, 1);
        return this;
    };
    Node.prototype.setProperties = function (properties) {
        this._properties = properties;
    };
    return Node;
}());
exports.Node = Node;
var RootNode = /** @class */ (function (_super) {
    __extends(RootNode, _super);
    function RootNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RootNode.prototype.isRoot = function () {
        return true;
    };
    RootNode.prototype.isInternal = function () {
        return false;
    };
    return RootNode;
}(Node));
exports.RootNode = RootNode;
var InternalNode = /** @class */ (function (_super) {
    __extends(InternalNode, _super);
    function InternalNode(_a) {
        var id = _a.id, properties = _a.properties, parent = _a.parent;
        var _this = _super.call(this, { id: id, properties: properties }) || this;
        _this.parent = parent;
        return _this;
    }
    InternalNode.prototype.isRoot = function () {
        return false;
    };
    InternalNode.prototype.isInternal = function () {
        return true;
    };
    return InternalNode;
}(Node));
exports.InternalNode = InternalNode;


/***/ }),

/***/ "./src/sgf/parser.ts":
/*!***************************!*\
  !*** ./src/sgf/parser.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.pointTo = exports.toPoint = exports.toTree = exports.toProperties = void 0;
var utils_1 = __webpack_require__(/*! ../utils */ "./src/utils.ts");
var tree_1 = __webpack_require__(/*! ./tree */ "./src/sgf/tree.ts");
var node_1 = __webpack_require__(/*! ./node */ "./src/sgf/node.ts");
var SGFFormatError = /** @class */ (function (_super) {
    __extends(SGFFormatError, _super);
    function SGFFormatError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = "ValidationError";
        return _this;
    }
    return SGFFormatError;
}(Error));
// SGFの構造例
// (;ルート
//   (;着手1a;着手2a(;着手3aa)
//                  (;着手3ab;着手4ab))
//   (;着手1b(;着手2ba;着手3ba;着手4ba)
//           (;着手3bb)))
function escapeSgfString(sgf) {
    return sgf.toString().replace(/]/g, "\\]");
}
function unescapeSgfString(sgf) {
    return sgf.toString().replace(/\\]/g, "]");
}
function toTree(sgf) {
    var rootNode = toNode(sgf);
    return new tree_1.Tree({ rootNode: rootNode });
}
exports.toTree = toTree;
function toNode(sgf, parent) {
    if (!sgf.startsWith("(") || !sgf.endsWith(")"))
        throw new SGFFormatError();
    // 先頭と末尾の()を取り除く
    var sgfStr = sgf.slice(1).slice(0, -1);
    // 親ノードを作成
    var firstLeftBracketIdx = -1;
    var isInSquareBracket = false;
    for (var i = 0; i < sgfStr.length; i++) {
        if (sgfStr.charAt(i) === "[")
            isInSquareBracket = true;
        if (sgfStr.charAt(i) === "]")
            isInSquareBracket = false;
        if (sgfStr.charAt(i) === "(" && !isInSquareBracket) {
            firstLeftBracketIdx = i;
            break;
        }
    }
    var branchSgf = firstLeftBracketIdx !== -1 ? sgfStr.slice(0, firstLeftBracketIdx) : sgfStr;
    var nodeSgfs = branchSgf.split(";").filter(function (s) { return s !== ""; });
    var top;
    if (parent == null) {
        top = new node_1.RootNode({
            id: utils_1.randmStr(),
            properties: toProperties(nodeSgfs[0]),
        });
    }
    else {
        top = new node_1.InternalNode({
            id: utils_1.randmStr(),
            properties: toProperties(nodeSgfs[0]),
            parent: parent,
        });
    }
    nodeSgfs.shift();
    var bottom = top;
    for (var _i = 0, nodeSgfs_1 = nodeSgfs; _i < nodeSgfs_1.length; _i++) {
        var nodeSgf = nodeSgfs_1[_i];
        var properties = toProperties(nodeSgf);
        var node = new node_1.InternalNode({
            id: utils_1.randmStr(),
            properties: properties,
            parent: bottom,
        });
        bottom.addChild(node);
        bottom = node;
    }
    // childrenの生成
    var children = [];
    var leftBracketIdx = -1;
    var leftBracketCount = 0;
    var rightBracketCount = 0;
    isInSquareBracket = false;
    for (var i = 0; i < sgfStr.length; i++) {
        if (sgfStr.charAt(i) === "[")
            isInSquareBracket = true;
        if (sgfStr.charAt(i) === "]")
            isInSquareBracket = false;
        if (sgfStr.charAt(i) === "(" && !isInSquareBracket) {
            if (leftBracketIdx === -1)
                leftBracketIdx = i;
            leftBracketCount += 1;
        }
        if (sgfStr.charAt(i) === ")" && !isInSquareBracket) {
            if (leftBracketIdx === -1)
                throw new SGFFormatError();
            rightBracketCount += 1;
            if (leftBracketCount === rightBracketCount) {
                // 再帰
                var child = toNode(sgfStr.substring(leftBracketIdx, i + 1), bottom);
                children.push(child);
                leftBracketIdx = -1;
                leftBracketCount = 0;
                rightBracketCount = 0;
            }
        }
    }
    if (leftBracketIdx !== -1 ||
        leftBracketCount !== 0 ||
        rightBracketCount !== 0) {
        throw new SGFFormatError(); // 対応する')'が見つからなかった場合
    }
    for (var _a = 0, children_1 = children; _a < children_1.length; _a++) {
        var child = children_1[_a];
        bottom.addChild(child);
    }
    return top;
}
// SZ[19]PB[芝野虎丸]PW[余正麒]AB[ab][cd] => {SZ: ["19"], PB: ["芝野虎丸"], PW: ["余正麒"], AB: ["ab", "cd"]}
function toProperties(nodeSgf) {
    var regexp = new RegExp("(.*?])(?=[A-Z])|(.*?])$", "gs");
    // const props = nodeSgf.match(regexp); nodeSgfの末尾に改行コードが含まれていたりした場合うまくいかない
    var props = nodeSgf.trim().match(regexp);
    utils_1.assertIsDefined(props);
    var properties = {};
    props.map(function (p) {
        // const regexp = new RegExp("(.*?)(?=\\[)", "g");
        // const result = p.match(regexp);
        var _a;
        // assertIsDefined(result);
        // if (!isProperty(result[0])) throw new Error(); // Propertyが正しい値かどうか
        // properties[result[0]] = [];
        // 後読みがSafariなど一部の環境でエラーになる
        // const regexp2 = new RegExp("(?<=\\[).*?(?=])", "g");
        // const result2 = p.match(regexp2);
        // assertIsDefined(result2);
        // result2.map((r) => properties[result[0] as Property]?.push(r));
        // ので、正規表現を一旦諦めてシンプルなsplitで対応
        var propKeyBuf = "";
        var propKey = "";
        var valBuf = "";
        var isInSquareBracket = false;
        for (var i = 0; i < p.length; i++) {
            // set is in square bracket
            if (p.charAt(i) === "[" && !isInSquareBracket) {
                isInSquareBracket = true;
                continue;
            }
            // set Property key
            if (!isInSquareBracket) {
                if (p.charAt(i).trim()) {
                    // 改行コードやスペースでない場合は、新たなPropertyブロックに入ったとみなす
                    propKey = "";
                    propKeyBuf += p.charAt(i);
                }
                continue;
            }
            if (isInSquareBracket &&
                p.charAt(i) === "]" &&
                p.charAt(i - 1) !== "\\") {
                if (!propKey) {
                    propKey = propKeyBuf.trim(); // 改行コードなどが入り込む可能性
                    propKeyBuf = "";
                }
                if (!properties[propKey]) {
                    properties[propKey] = [];
                }
                (_a = properties[propKey]) === null || _a === void 0 ? void 0 : _a.push(valBuf);
                valBuf = "";
                isInSquareBracket = false;
                continue;
            }
            valBuf += p.charAt(i);
        }
    });
    return properties;
}
exports.toProperties = toProperties;
function toPoint(point) {
    var alpha = "abcdefghijklmnopqrs".split("");
    var pointArr = point.toLowerCase().split("");
    return {
        x: alpha.indexOf(pointArr[0]) + 1,
        y: alpha.indexOf(pointArr[1]) + 1,
    };
}
exports.toPoint = toPoint;
function pointTo(point) {
    var alpha = "abcdefghijklmnopqrs";
    return alpha.substr(point.x - 1, 1) + alpha.substr(point.y - 1, 1);
}
exports.pointTo = pointTo;


/***/ }),

/***/ "./src/sgf/path.ts":
/*!*************************!*\
  !*** ./src/sgf/path.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports) => {


// [0]             equals '0'
// [1]             equals '1'
// [0,1]           equals '0.1'
// [0,0,0,0,1,1,0] equals '0:4.1:2.0'
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseFragment = exports.parseInitialPath = exports.toFragmentString = exports.toInitPathString = void 0;
function toInitPathString(path, isEnd) {
    if (isEnd === void 0) { isEnd = false; }
    if (path.length === 0) {
        return "0";
    }
    var firstNumber = 0;
    for (var i = 0; i < path.length; i++) {
        var elem = path[i];
        if (elem !== 0) {
            break;
        }
        else {
            firstNumber = i + 1;
        }
    }
    var component = toFragmentString(path.slice(firstNumber));
    if (component) {
        // 0.1....0:3 => 0.1....+
        if (isEnd) {
            var splitted = component.split(".");
            var lastToken = splitted[splitted.length - 1];
            if (lastToken.split(":").length > 1 && lastToken.split(":")[0] === "0")
                component = splitted.slice(0, splitted.length - 1).join(".") + "+";
        }
        return firstNumber + "." + component;
    }
    else {
        return firstNumber + "";
    }
}
exports.toInitPathString = toInitPathString;
function toFragmentString(path) {
    if (path.length === 0) {
        return "";
    }
    var last = "";
    var next = null;
    var repeated = 0;
    var out = "";
    var flush = function () {
        var component = "";
        if (repeated < 2) {
            component = last + "";
        }
        else {
            component = last + ":" + repeated;
        }
        if (out === "") {
            out = component;
        }
        else {
            out += "." + component;
        }
        repeated = 1;
    };
    for (var i = 0; i < path.length; i++) {
        next = path[i];
        if (last === "") {
            last = next.toString();
        }
        if (next.toString() === last) {
            repeated++;
        }
        else {
            flush();
        }
        last = next.toString();
    }
    flush();
    return out;
}
exports.toFragmentString = toFragmentString;
function parseInitialPath(initPos) {
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
    }
    else if (next === "+") {
        return out.concat(toEnd);
    }
    else {
        throw new Error("Unexpected token [" + next + "] for path " + initPos);
    }
}
exports.parseInitialPath = parseInitialPath;
function parseFragment(pathStr) {
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
            }
            else if (token === ":") {
                curstate = states.MULTIPLIER;
            }
            else if (token === "+") {
                // There could be more characters after this. Maybe throw an error.
                return out.concat(toEnd);
            }
            else {
                throw new Error("Unexpected token " + token + " for path " + pathStr);
            }
        }
        else {
            if (!numre.test(token)) {
                throw new Error("Was expecting number but found " + token + " for path: " + pathStr);
            }
            var num = parseInt(token, 10);
            if (curstate === states.VARIATION) {
                out.push(num);
                prevVariation = num;
                curstate = states.SEPARATOR;
            }
            else if (curstate === states.MULTIPLIER) {
                if (prevVariation === null) {
                    throw new Error("Error using variation multiplier for path: " + pathStr);
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
exports.parseFragment = parseFragment;
var toEnd = new Array(500).fill(0);


/***/ }),

/***/ "./src/sgf/stringifier.ts":
/*!********************************!*\
  !*** ./src/sgf/stringifier.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.propertiesToSgf = void 0;
function propertiesToSgf(props) {
    var sgf = ";";
    for (var _i = 0, _a = Object.entries(props); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (value != null && value.length > 0) {
            sgf += key + "[" + value.join("][") + "]";
        }
    }
    return sgf;
}
exports.propertiesToSgf = propertiesToSgf;


/***/ }),

/***/ "./src/sgf/tree.ts":
/*!*************************!*\
  !*** ./src/sgf/tree.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Tree = void 0;
var utils_1 = __webpack_require__(/*! ../utils */ "./src/utils.ts");
var _1 = __webpack_require__(/*! ./ */ "./src/sgf/index.ts");
var stringifier_1 = __webpack_require__(/*! ./stringifier */ "./src/sgf/stringifier.ts");
var types_1 = __webpack_require__(/*! ../types */ "./src/types/index.ts");
var Tree = /** @class */ (function () {
    function Tree(_a) {
        var rootNode = _a.rootNode;
        this._rootNode = rootNode;
        this._currentNode = rootNode;
    }
    Object.defineProperty(Tree.prototype, "properties", {
        get: function () {
            return types_1.cloneProperties(this._currentNode.properties);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tree.prototype, "rootProperties", {
        get: function () {
            return types_1.cloneProperties(this._rootNode.properties);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tree.prototype, "rootNode", {
        get: function () {
            return _1.cloneNode(this._rootNode);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tree.prototype, "node", {
        get: function () {
            return _1.cloneNode(this._currentNode);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tree.prototype, "nextNodes", {
        get: function () {
            return this._currentNode.children.map(function (n) { return _1.cloneNode(n); });
        },
        enumerable: false,
        configurable: true
    });
    Tree.prototype.atRoot = function () {
        return this._currentNode.isRoot();
    };
    Tree.prototype.atLeaf = function () {
        return this._currentNode.isLeaf();
    };
    /**
     * up
     * @param idx
     */
    Tree.prototype.up = function () {
        if (this._currentNode.isInternal()) {
            this._currentNode = this._currentNode.parent;
        }
        return this;
    };
    /**
     * down
     */
    Tree.prototype.down = function (idx) {
        if (idx === void 0) { idx = 0; }
        if (this._currentNode.children[idx]) {
            this._currentNode = this._currentNode.children[idx];
        }
        else {
            throw new Error();
        }
        return this;
    };
    /**
     * get treepath of current node
     */
    Tree.prototype.getCurrentPath = function () {
        var path = [];
        var loop = function (node) {
            if (node.isInternal()) {
                path.unshift(node.parent.children.findIndex(function (rn) { return rn.id === node.id; }));
                loop(node.parent);
            }
        };
        loop(this._currentNode);
        return path;
    };
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
    Tree.prototype.createChildNode = function (properties) {
        return new _1.InternalNode({
            id: utils_1.randmStr(),
            properties: properties,
            parent: this._currentNode,
        });
    };
    // 現在位置に一手を足すfn
    Tree.prototype.addNode = function (node) {
        this._currentNode.addChild(node);
    };
    // 現在位置が末尾の時削除してcurrentNodeを一つ前に戻す
    Tree.prototype.removeNode = function () {
        if (this.atRoot())
            throw new Error("Root node can not be removed.");
        var id = this._currentNode.id;
        this.up();
        this._currentNode.removeChild(id);
    };
    /**
     * 深さ優先探索でNodeを取得する
     * @param id
     */
    Tree.prototype.getNodeById = function (id) {
        var loop = function (root) {
            if (root.id === id)
                return root;
            if (root.children.length > 0) {
                for (var i = 0; i < root.children.length; i++) {
                    var n = loop(root.children[i]);
                    if (n)
                        return n;
                }
            }
        };
        return loop(this._rootNode);
    };
    Tree.prototype.setRootProps = function (properties) {
        this._rootNode.setProperties(properties);
    };
    Tree.prototype.setProps = function (properties) {
        this._currentNode.setProperties(properties);
    };
    Tree.prototype.toSgf = function () {
        var dfs = function (node) {
            var sgf = stringifier_1.propertiesToSgf(node.properties);
            if (node.children.length > 1) {
                node.children.map(function (n) {
                    sgf += "(" + dfs(n) + ")";
                });
            }
            else if (node.children.length === 1) {
                sgf += dfs(node.children[0]);
            }
            return sgf;
        };
        return "(" + dfs(this._rootNode) + ")";
    };
    return Tree;
}());
exports.Tree = Tree;


/***/ }),

/***/ "./src/sgf/utils.ts":
/*!**************************!*\
  !*** ./src/sgf/utils.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.moveToInternalNode = exports.nodeToMove = void 0;
var types_1 = __webpack_require__(/*! ../types */ "./src/types/index.ts");
var parser_1 = __webpack_require__(/*! ./parser */ "./src/sgf/parser.ts");
var node_1 = __webpack_require__(/*! ./node */ "./src/sgf/node.ts");
var utils_1 = __webpack_require__(/*! ../utils */ "./src/utils.ts");
function nodeToMove(node) {
    var b = node.properties[types_1.Property.B];
    var w = node.properties[types_1.Property.W];
    var move;
    if (b != null && b.length > 0) {
        if (b[0] == null || b[0] == "tt") {
            move = {
                color: types_1.Color.Black,
            };
        }
        else {
            move = {
                color: types_1.Color.Black,
                point: parser_1.toPoint(b[0]),
            };
        }
    }
    else if (w != null && w.length > 0) {
        if (w[0] == null || w[0] == "tt") {
            move = {
                color: types_1.Color.White,
            };
        }
        else {
            move = {
                color: types_1.Color.White,
                point: parser_1.toPoint(w[0]),
            };
        }
    }
    else {
        throw new Error("");
    }
    return move;
}
exports.nodeToMove = nodeToMove;
function moveToInternalNode(move, parent) {
    var _a;
    return new node_1.InternalNode({
        id: utils_1.randmStr(),
        properties: (_a = {},
            _a[move.color === types_1.Color.Black ? "B" : "W"] = move.point != null ? [parser_1.pointTo(move.point)] : [],
            _a),
        parent: parent,
    });
}
exports.moveToInternalNode = moveToInternalNode;


/***/ }),

/***/ "./src/types/color.ts":
/*!****************************!*\
  !*** ./src/types/color.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.oppositeColor = exports.Color = void 0;
var Color = {
    Black: "Black",
    White: "White",
};
exports.Color = Color;
function oppositeColor(color) {
    if (color === Color.Black)
        return Color.White;
    if (color === Color.White)
        return Color.Black;
    else
        return color;
}
exports.oppositeColor = oppositeColor;


/***/ }),

/***/ "./src/types/gridNum.ts":
/*!******************************!*\
  !*** ./src/types/gridNum.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isGridNum = void 0;
var Gridnum = [9, 13, 19];
function isGridNum(n) {
    return Gridnum.indexOf(n) !== -1;
}
exports.isGridNum = isGridNum;


/***/ }),

/***/ "./src/types/index.ts":
/*!****************************!*\
  !*** ./src/types/index.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./color */ "./src/types/color.ts"), exports);
__exportStar(__webpack_require__(/*! ./gridNum */ "./src/types/gridNum.ts"), exports);
__exportStar(__webpack_require__(/*! ./move */ "./src/types/move.ts"), exports);
__exportStar(__webpack_require__(/*! ./stone */ "./src/types/stone.ts"), exports);
__exportStar(__webpack_require__(/*! ./point */ "./src/types/point.ts"), exports);
__exportStar(__webpack_require__(/*! ./pointState */ "./src/types/pointState.ts"), exports);
__exportStar(__webpack_require__(/*! ./property */ "./src/types/property.ts"), exports);
__exportStar(__webpack_require__(/*! ./markupSymbol */ "./src/types/markupSymbol.ts"), exports);


/***/ }),

/***/ "./src/types/markupSymbol.ts":
/*!***********************************!*\
  !*** ./src/types/markupSymbol.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.markupSymbolToProperty = exports.MarkupSymbol = void 0;
var property_1 = __webpack_require__(/*! ./property */ "./src/types/property.ts");
var MarkupSymbol = {
    Circle: "Circle",
    Square: "Square",
    Triangle: "Triangle",
    Cross: "Cross",
};
exports.MarkupSymbol = MarkupSymbol;
function markupSymbolToProperty(symbol) {
    switch (symbol) {
        case MarkupSymbol.Circle:
            return property_1.Property.CR;
        case MarkupSymbol.Square:
            return property_1.Property.SQ;
        case MarkupSymbol.Triangle:
            return property_1.Property.TR;
        case MarkupSymbol.Cross:
            return property_1.Property.MA;
        default:
            throw new Error("symbol is invalid.");
    }
}
exports.markupSymbolToProperty = markupSymbolToProperty;


/***/ }),

/***/ "./src/types/move.ts":
/*!***************************!*\
  !*** ./src/types/move.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./src/types/point.ts":
/*!****************************!*\
  !*** ./src/types/point.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.lowerP = exports.rightP = exports.upperP = exports.leftP = void 0;
function leftP(point) {
    return {
        x: point.x - 1,
        y: point.y,
    };
}
exports.leftP = leftP;
function upperP(point) {
    return {
        x: point.x,
        y: point.y - 1,
    };
}
exports.upperP = upperP;
function rightP(point) {
    return {
        x: point.x + 1,
        y: point.y,
    };
}
exports.rightP = rightP;
function lowerP(point) {
    return {
        x: point.x,
        y: point.y + 1,
    };
}
exports.lowerP = lowerP;


/***/ }),

/***/ "./src/types/pointState.ts":
/*!*********************************!*\
  !*** ./src/types/pointState.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PointState = void 0;
var _1 = __webpack_require__(/*! ./ */ "./src/types/index.ts");
var PointState = {
    Black: _1.Color.Black,
    White: _1.Color.White,
    Empty: "Empty",
    Edge: "Edge",
};
exports.PointState = PointState;


/***/ }),

/***/ "./src/types/property.ts":
/*!*******************************!*\
  !*** ./src/types/property.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.removeProperty = exports.addProperty = exports.cloneProperties = exports.isProperty = exports.Property = void 0;
var utils_1 = __webpack_require__(/*! ../utils */ "./src/utils.ts");
var Property = {
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
};
exports.Property = Property;
function isProperty(str) {
    // 値の種類が膨大なので大文字かどうかだけ判定する
    return utils_1.isUpperCase(str);
    // return Object.values(Property).indexOf(str as any) !== -1;
}
exports.isProperty = isProperty;
function cloneProperties(properties) {
    return JSON.parse(JSON.stringify(properties));
}
exports.cloneProperties = cloneProperties;
/**
 * propertiesに値を追加してコピーしたものを返却する
 * @param properties
 * @param key
 * @param val
 */
function addProperty(properties, key, val) {
    var cloneProps = cloneProperties(properties);
    var bef = cloneProps[key];
    if (bef != null) {
        bef.push(val);
    }
    else {
        bef = [val];
    }
    var newP = Array.from(new Set(bef)); // 重複排除
    cloneProps[key] = newP;
    return cloneProps;
}
exports.addProperty = addProperty;
function removeProperty(properties, key, val) {
    var cloneProps = cloneProperties(properties);
    var bef = cloneProps[key];
    if (bef != null) {
        cloneProps[key] = bef.filter(function (v) { return v !== val; });
    }
    return cloneProps;
}
exports.removeProperty = removeProperty;


/***/ }),

/***/ "./src/types/stone.ts":
/*!****************************!*\
  !*** ./src/types/stone.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports) {


var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isUpperCase = exports.randmStr = exports.nextAlpha = exports.copyMatrix = exports.assertIsDefined = void 0;
function assertIsDefined(val) {
    if (val === undefined || val === null) {
        // throw new AssertionError(
        //   `Expected 'val' to be defined, but received ${val}`
        // );
        throw new Error("Expected 'val' to be defined, but received " + val);
    }
}
exports.assertIsDefined = assertIsDefined;
function copyMatrix(base) {
    var result = [];
    for (var _i = 0, base_1 = base; _i < base_1.length; _i++) {
        var line = base_1[_i];
        result.push(__spreadArrays(line));
    }
    return result;
}
exports.copyMatrix = copyMatrix;
function nextAlpha(s) {
    var alpha = "abcdefghijklmnopqrstuvwxyz".split("");
    return alpha[alpha.indexOf(s.toLowerCase()) + 1];
}
exports.nextAlpha = nextAlpha;
function randmStr() {
    return Math.random().toString(32).substring(2);
}
exports.randmStr = randmStr;
function isUpperCase(c) {
    return /^[A-Z]+$/g.test(c);
}
exports.isUpperCase = isUpperCase;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./src/index.ts");
/******/ })()
;
});
//# sourceMappingURL=index.js.map