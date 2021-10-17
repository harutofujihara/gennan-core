# gennan-core

This is a library for handling Baduk game and board state.

made for [gennan](https://github.com/harutofujihara/gennan).

## Install
```sh
$ npm install gennan-core
```

## Usage

You can create `GennanCore` object by SGF or Grid number as argument.

```js
const gncFromSgf = GennanCore.createFromSgf(sgf);
const gncFromGridNum = GennanCore.create(19);
```

## Functions

### constructors
#### GennanCore.create(gridNum: GridNum = 19): GennanCore
#### GennanCore.createFromSgf(sgf: string): GennanCore

### properties
#### gennanCore.sgf(): string
#### gennanCore.viewBoard(): ViewBoard

Unfinished...
