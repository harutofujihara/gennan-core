import { GennanCore } from "./gennanCore";
import { MarkupSymbol, PointState } from "./types";
import { Color } from "./types";

test("toProperties", () => {
  const gc = GennanCore.createFromSgf(
    "(;SZ[19]PB[芝野虎丸]PW[余正麒]AB[ab][cd](;B[jj];W[ii])(;B[ij];W[hi]))"
  );

  expect(gc.nextMoveOptions.length).toBe(2);
  gc.playForward();
  expect(gc.nextMoveOptions.length).toBe(1);
  gc.playBackward();
  expect(gc.nextMoveOptions.length).toBe(2);

  expect(gc.viewBoard.length).toBe(19);
});

test("view board", () => {
  const gc = GennanCore.createFromSgf(
    "(;SZ[19]PB[芝野虎丸]PW[余正麒]AB[ab][cd](;B[jj]CR[aa][bb]TR[aa];W[ii])(;B[ij];W[hi]))"
  );
  expect(gc.viewBoard[1][1]).toEqual({
    circle: false,
    square: false,
    triangle: false,
    cross: false,
    current: false,
    star: false,
  });

  gc.playForward();
  expect(gc.viewBoard[0][0]).toEqual({
    circle: true,
    square: false,
    triangle: true,
    cross: false,
    current: false,
    star: false,
  });
  expect(gc.viewBoard[1][1]).toEqual({
    circle: true,
    square: false,
    triangle: false,
    cross: false,
    current: false,
    star: false,
  });
  expect(gc.viewBoard[9][9]).toEqual({
    color: PointState.Black,
    circle: false,
    square: false,
    triangle: false,
    cross: false,
    current: true,
    star: true,
  });
});

test("create from gridnum", () => {
  const gc = GennanCore.create(19);
  expect(gc.nextMoveOptions.length).toBe(0);
});

test("setFromInitPath", () => {
  const gc = GennanCore.createFromSgf(
    "(;SZ[19]PB[芝野虎丸]PW[余正麒]AB[ab][cd](;B[jj]CR[aa][bb]TR[aa];W[ii])(;B[ij];W[hi]))"
  );

  gc.setFromInitPath([1, 0]);
  expect(gc.viewBoard[7][8].current).toBeTruthy();
});

test("add move", () => {
  const gc = GennanCore.createFromSgf(
    "(;SZ[19]PB[芝野虎丸]PW[余正麒]AB[ab][cd](;B[jj]CR[aa][bb]TR[aa];W[ii])(;B[ij];W[hi]))"
  );

  gc.playForward();
  gc.addMove({ color: Color.White, point: { x: 3, y: 3 } });
  expect(gc.nextMoveOptions.length).toBe(2);
  gc.playForward(gc.nextMoveOptions.length - 1);
  expect(gc.nextMoveOptions.length).toBe(0);
  gc.addMove({ color: Color.Black, point: { x: 2, y: 2 } });
  expect(gc.nextMoveOptions.length).toBe(1);
});

test("set and remove circle", () => {
  const gc = GennanCore.createFromSgf(
    "(;SZ[19]PB[芝野虎丸]PW[余正麒]AB[ab][cd](;B[jj]CR[aa][bb]TR[aa];W[ii])(;B[ij];W[hi]))"
  );
  gc.setSymbol({ x: 1, y: 1 }, MarkupSymbol.Circle);
  expect(gc.viewBoard[0][0].circle).toBeTruthy();

  gc.removeSymbol({ x: 1, y: 1 }, MarkupSymbol.Circle);
  expect(gc.viewBoard[0][0].circle).toBeFalsy();
});

test("set alpha", () => {
  const gc = GennanCore.createFromSgf(
    "(;SZ[19]PB[芝野虎丸]PW[余正麒]AB[ab][cd](;B[jj]CR[aa][bb]TR[aa];W[ii])(;B[ij];W[hi]))"
  );
  gc.setAlpha({ x: 1, y: 1 });
  gc.setAlpha({ x: 2, y: 2 });
  expect(gc.viewBoard[0][0].text).toBe("A");
  expect(gc.viewBoard[1][1].text).toBe("B");
});

test("set increment", () => {
  const gc = GennanCore.createFromSgf(
    "(;SZ[19]PB[芝野虎丸]PW[余正麒]AB[ab][cd](;B[jj]CR[aa][bb]TR[aa];W[ii])(;B[ij];W[hi]))"
  );
  gc.setIncrement({ x: 1, y: 1 });
  gc.setIncrement({ x: 2, y: 2 });
  expect(gc.viewBoard[0][0].text).toBe("1");
  expect(gc.viewBoard[1][1].text).toBe("2");
});

test("viewBoard reactivity", () => {
  const gc = GennanCore.createFromSgf(
    "(;SZ[19]PB[芝野虎丸]PW[余正麒]AB[ab][cd];B[aa];W[bb])"
  );
  // forward
  expect(gc.viewBoard[0][0].color).toEqual(undefined);
  gc.playForward();
  expect(gc.viewBoard[0][0].color).toEqual(Color.Black);

  // set circle
  let viewBoard;
  viewBoard = gc.viewBoard;
  expect(viewBoard[1][1].circle).toBeFalsy();
  gc.setSymbol({ x: 2, y: 2 }, MarkupSymbol.Circle);
  viewBoard = gc.viewBoard;
  expect(viewBoard[1][1].circle).toBeTruthy();
});

test("clone", () => {
  const gc = GennanCore.createFromSgf(
    "(;SZ[19]PB[芝野虎丸]PW[余正麒]AB[ab][cd];B[bc];W[bb])"
  );
  expect(gc.viewBoard[0][0].color).toEqual(undefined);
  gc.addFixedStone({ point: { x: 1, y: 1 }, color: Color.Black });
  expect(gc.viewBoard[0][0].color).toEqual(Color.Black);
  gc.playForward();
  expect(gc.viewBoard[0][0].color).toEqual(Color.Black);

  const newGc = gc.clone();
  expect(newGc.viewBoard[0][0].color).toEqual(Color.Black);
});

// test("current path", () => {
//   for (var ii = 0; ii < 1000; ii++) {
//     const gc = GennanCore.createFromSgf(
//       "(;FF[4]GN[Game name]GM[1]SZ[19]CA[UTF-8]PB[Ichiriki Ryo]PW[Xie Ke]KM[7.5]RE[W+R];B[qd]C[test1]TR[dd](;W[pp]C[test2]TR[dd];B[cd]C[test3]LB[qd:A][pp:B][aa:C];W[cp];B[eq];W[dq];B[ep];W[cn];B[ip];W[oc];B[fc];W[pe];B[qe];W[pf];B[qg];W[nq];B[ld];W[fd];B[gd];W[ec];B[ed];W[fe];B[dc];W[gc];B[eb];W[fb];B[pg];W[ec];B[do];W[co];B[fc];W[gq];B[hc];W[ec];B[op];W[oq];B[fc];W[qf];B[rf];W[ec];B[qp];W[po];B[fc];W[re];B[rd];W[ec];B[qo];W[ee];B[fc];W[rg];B[se];W[ec];B[pn];W[dd];B[pq];W[oo];B[pr];W[on];B[om];W[nm];B[pm];W[mn];B[ng];W[go];B[db];W[ce];B[gb];W[fc];B[bd];W[qq];B[rq];W[bb];B[be];W[cf];B[bf];W[ch];B[cg];W[dg];B[bg];W[di];B[ib];W[ea];B[cc];W[hn];B[jn];W[mc];B[lc];W[md];B[dm];W[hl];B[fo];W[fn];B[fm];W[en];B[dn];W[bl];B[cl];W[bk];B[ck];W[cj];B[gm];W[gn];B[ej];W[gj];B[ei];W[eh];B[gi];W[hi];B[dj];W[fi];B[bj];W[ci];B[bm];W[bi];B[cm];W[dr];B[er];W[eo];B[dp];W[br];B[el];W[hm];B[fk];W[or];B[qr];W[kp];B[lo];W[ln];B[kq];W[lp];B[hr];W[gr];B[lq];W[mp];B[hp];W[gp];B[jr];W[mr];B[lr];W[ks];B[nl];W[jp];B[le];W[qb];B[rb];W[pd];B[qc];W[mf];B[ll];W[mg];B[km];W[id];B[ie];W[da];B[df];W[de];B[ca];W[fa];B[cb];W[je];B[jd];W[jc];B[kd];W[ic];B[hd];W[he];B[if];W[jb];B[hb];W[ia];B[ge];W[gf];B[hf];W[ga];B[gg];W[ff];B[kg];W[nh];B[eg];W[dh];B[ki];W[jo];B[og];W[lh];B[kh];W[nf];B[oi];W[ni];B[nj];W[oh];B[pi];W[ha];B[lb];W[mj];B[mi];W[nk];B[li];W[mh];B[oj];W[ph];B[qh];W[qi];B[qj];W[ri];B[rh];W[mb];B[pb];W[ob];B[mm];W[he];B[nn];W[no];B[ao];W[bp];B[ih];W[hg];B[hh];W[gh];B[ds];W[cs];B[es];W[gs];B[fg];W[kk];B[jk];W[jj];B[ij];W[jl];B[ik];W[ok];B[pj];W[kl];B[il];W[lm];B[kn];W[nm];B[ma];W[na];B[nn];W[dk];B[gl];W[nm];B[ap];W[aq];B[nn];W[gk];B[em];W[nm];B[cq];W[lk];B[ml];W[mk];B[nn];W[mo])(;W[pq]))"
//     );
//     for (var i = 0; i < 101; i++) {
//       gc.playForward();
//     }

//     expect(gc.currentPath).toEqual(new Array(102).fill(0));

//     const gc2 = GennanCore.createFromSgf(
//       "(;FF[4]GN[Game name]GM[1]SZ[19]CA[UTF-8]PB[Ichiriki Ryo]PW[Xie Ke]KM[7.5]RE[W+R];B[qd]C[test1]TR[dd](;W[pp]C[test2]TR[dd];B[cd]C[test3]LB[qd:A][pp:B][aa:C];W[cp];B[eq];W[dq];B[ep];W[cn];B[ip];W[oc];B[fc];W[pe];B[qe];W[pf];B[qg];W[nq];B[ld];W[fd];B[gd];W[ec];B[ed];W[fe];B[dc];W[gc];B[eb];W[fb];B[pg];W[ec];B[do];W[co];B[fc];W[gq];B[hc];W[ec];B[op];W[oq];B[fc];W[qf];B[rf];W[ec];B[qp];W[po];B[fc];W[re];B[rd];W[ec];B[qo];W[ee];B[fc];W[rg];B[se];W[ec];B[pn];W[dd];B[pq];W[oo];B[pr];W[on];B[om];W[nm];B[pm];W[mn];B[ng];W[go];B[db];W[ce];B[gb];W[fc];B[bd];W[qq];B[rq];W[bb];B[be];W[cf];B[bf];W[ch];B[cg];W[dg];B[bg];W[di];B[ib];W[ea];B[cc];W[hn];B[jn];W[mc];B[lc];W[md];B[dm];W[hl];B[fo];W[fn];B[fm];W[en];B[dn];W[bl];B[cl];W[bk];B[ck];W[cj];B[gm];W[gn];B[ej];W[gj];B[ei];W[eh];B[gi];W[hi];B[dj];W[fi];B[bj];W[ci];B[bm];W[bi];B[cm];W[dr];B[er];W[eo];B[dp];W[br];B[el];W[hm];B[fk];W[or];B[qr];W[kp];B[lo];W[ln];B[kq];W[lp];B[hr];W[gr];B[lq];W[mp];B[hp];W[gp];B[jr];W[mr];B[lr];W[ks];B[nl];W[jp];B[le];W[qb];B[rb];W[pd];B[qc];W[mf];B[ll];W[mg];B[km];W[id];B[ie];W[da];B[df];W[de];B[ca];W[fa];B[cb];W[je];B[jd];W[jc];B[kd];W[ic];B[hd];W[he];B[if];W[jb];B[hb];W[ia];B[ge];W[gf];B[hf];W[ga];B[gg];W[ff];B[kg];W[nh];B[eg];W[dh];B[ki];W[jo];B[og];W[lh];B[kh];W[nf];B[oi];W[ni];B[nj];W[oh];B[pi];W[ha];B[lb];W[mj];B[mi];W[nk];B[li];W[mh];B[oj];W[ph];B[qh];W[qi];B[qj];W[ri];B[rh];W[mb];B[pb];W[ob];B[mm];W[he];B[nn];W[no];B[ao];W[bp];B[ih];W[hg];B[hh];W[gh];B[ds];W[cs];B[es];W[gs];B[fg];W[kk];B[jk];W[jj];B[ij];W[jl];B[ik];W[ok];B[pj];W[kl];B[il];W[lm];B[kn];W[nm];B[ma];W[na];B[nn];W[dk];B[gl];W[nm];B[ap];W[aq];B[nn];W[gk];B[em];W[nm];B[cq];W[lk];B[ml];W[mk];B[nn];W[mo])(;W[pq]))"
//     );
//     for (var i = 0; i < 149; i++) {
//       gc2.playForward();
//     }

//     expect(gc2.currentPath).toEqual(new Array(150).fill(0));
//   }
// });

test("snapshot sgf", () => {
  const initSnapshotSgf = "(;SZ[19]PB[芝野虎丸]PW[余正麒]AB[ab][cd]AW[gg])";
  const sgf =
    "(;SZ[19]PB[芝野虎丸]PW[余正麒]AB[ab][cd]AW[gg];B[bc];W[bb]CR[dd]LB[ee:A])";
  const advancedSnapshotSgf =
    "(;SZ[19]PB[芝野虎丸]PW[余正麒]AB[ab][cd][bc]AW[gg][bb]CR[dd]LB[ee:A])";
  const gc = GennanCore.createFromSgf(sgf);

  // 最初は置き石だけ
  expect(gc.snapshotSgf).toEqual(initSnapshotSgf);

  // 手を進めた後に再びスナップショットを取得して確認
  gc.playForward();
  gc.playForward();

  expect(gc.snapshotSgf).toEqual(advancedSnapshotSgf);
});
