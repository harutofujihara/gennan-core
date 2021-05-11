import { toProperties, toTree } from "./parser";

test("toProperties", () => {
  expect(
    toProperties(`SZ[19]PB[芝野虎丸]WHAT[test]PW[余正麒]AB[ab][cd]C[te
st]`)
  ).toEqual({
    SZ: ["19"],
    PB: ["芝野虎丸"],
    PW: ["余正麒"],
    AB: ["ab", "cd"],
    C: ["te\nst"],
    WHAT: ["test"],
  });
});

test("toTree", () => {
  const tree = toTree(
    "(;SZ[19]PB[芝野虎丸]PW[余正麒]AB[ab][cd](;B[jj];W[ii])(;B[ij]C[te(s)A[a]t];W[hi]))"
  );
  expect(tree.rootProperties).toEqual({
    SZ: ["19"],
    PB: ["芝野虎丸"],
    PW: ["余正麒"],
    AB: ["ab", "cd"],
  });

  // 1手目
  tree.down(1);
  expect(tree.properties).toEqual({ B: ["ij"], C: ["te(s)A[a]t"] });

  // // 親と子がの情報が一致しているか
  // expect(tree.node).toEqual(tree.nextNodes[0].parent);

  // 2手目
  tree.down();
  expect(tree.properties).toEqual({ W: ["hi"] });
});

test("各Propertyの値以外の場所で改行コードが含まれていた時にエラーを起こさない", () => {
  const tree = toTree(
    `(;CA[utf-8]FF[4]GM[1]OT[1 moves / 30 sec]AP[SGFC:1.16]SZ[19]RU[Chinese]DT[2015-10-06]
      PB[AlphaGo]PW[Fan Hui]WR[2p]KM[7.5]TM[3600]RE[黒中押勝]MULTIGOGM[1]
      ;B[pd];W[dd];B[pp];W[dq];B[do];W[co];B[dp];W[cp];B[eq];W[cn];B[dn]C[大ナダレと呼ばれる難解定石。AlphaGoは過去のデータを網羅しているのだろうか？]
      ;W[dm];B[cq];W[dr];B[bq];W[cr];B[cm];W[cl];B[br];W[er];B[bm];W[bn];B[bl];W[bp];B[fq]
      C[ここまで定石とされる手順通り。];W[dl];B[ck];W[dk]LB[fr:A]C[白のこの手ではAがよく打たれる手順だったと思う。]
      ;B[cj];W[fr]C[微妙な手順前後は作戦だろうか？];B[ao]C[この手はAlphaGoのハッキリしたミス。定石手順を外されたせいで間違えたのではないか？]
      ;W[ap];B[fo];W[dj];B[ch]LB[an:A]C[31手のオキを打った以上、この手ではAを利かすタイミングだろう。]
      ;W[di];B[bg];W[am];B[bk];W[gn]
      (;B[hq];W[ip]C[圧迫されて黒が不利だ。]
      (;B[iq]LB[gr:A]C[31の悪手のせいでAが先手で打てなくなっているのが非常に痛い。]
      ;W[jp];B[kq]C[ここで白は一旦大場に向かうのが普通と思う。];W[kp]
      ;B[lq];W[jq];B[jr];W[ir]C[白は更に追求して打ったが効果があるかどうかは疑問。]
      ;B[hr];W[kr];B[is];W[mp];B[lp];W[lo]
      (;B[mo]C[キリは非常に好戦的な手だが得にならないと言うのが私の第一感。]
      ;W[np];B[ln];W[ko];B[lr]
      (;W[po]C[この手はfanさんの手拍子か。痛恨のミスになった。]
      ;B[no]C[これで白が困った。良く出来る筋なので、白が見落としたのが不思議過ぎる。]
      ;W[op];B[oo];W[pq];B[qp];W[qq];B[ro]C[筋の良いコスミ。]
      (;W[pn];B[rq]LB[rr:A][oq:B]C[白AにはBキリがあるので白が厳しい状況。]
      ;W[mn];B[nn];W[mm];B[nm];W[nl];B[ml];W[lm];B[ol];W[nk];B[om];W[rr]C[やむを得ず白は捨て石作戦に出た。]
      ;B[oq];W[ok];B[nq]C[黒の実利が大きく中央の厚みも傷残りだ。];W[pk]
      ;B[fc];W[cf];B[dh];W[eh];B[eg];W[fh];B[df];W[bf];B[fg];W[gh];B[ce];W[de];B[be];W[ef]
      ;B[dg];W[bd];B[af];W[cd];B[cg]C[左上も黒が満足な結果を得たと思う。]
      ;W[gd];B[hc]LB[fd:A]C[黒のこの手ではAから切っていく手もありそう。モンテカルロ・プログラムは優勢と思えばどんどん手を緩める。]
      ;W[gc];B[gb];W[fd];B[eb]C[この後の黒の打ち方を見ると本来大きいはずの中央を消す手を全く考えていない。]
      ;W[ec];B[fb];W[db];B[jc];W[ke];B[ld];W[le];B[md];W[nf]C[こうなってみると中央の白地もかなり大きく見える。]
      ;B[pf];W[pc];B[qc];W[od];B[oe];W[qd];B[pe];W[qb];B[rc];W[rb];B[oc];W[pb];B[rd];W[ob]
      ;B[mb];W[sb]C[この活き方は白としては満足できる結果。];B[ho];W[jm]
      C[白は味が悪いので相場の受けだと思う。];B[oh];W[nh];B[ni];W[oi]
      ;B[pi];W[oj];B[hn];W[hl];B[hg]C[たくみに減らしていく。どれくらい計算してるのだろうか？]
      ;W[gg];B[ie];W[if];B[hf];W[ig]C[目いっぱいに止めようとしたがここで黒の決め手が出た。]
      ;B[hh]
      (;W[hd];B[id];W[he];B[jf]C[右側で139から味を付けておいたのが生きてきた。非常に上手い。]
      ;W[ih];B[gf];W[ff];B[hi]C[白が持たない状況だ。]
      (;W[kg];B[fj];W[ei];B[ii]LB[kh:A]C[次にAが厳しい。];W[kh]C[黒がやれると、感覚では分かるが具体的に読むとなると大変な場面だ。]
      ;B[gl]C[全ての手順を確認するとすれば非常に変化が多い。];W[gk]
      C[どのくらいコンピュータは読みを入れていたのかが気になる。]
      ;B[hk];W[ik];B[fk];W[hj];B[gi];W[en];B[fl];W[fn];B[eo];W[em];B[hm];W[gm];B[il];W[hk]
      C[セキになって中央は地が消えてしまった。];B[go]C[右下隅でパンチが入ってから危なげのない逃げ切り勝利だったと思う。])
      (;W[fj]C[左側を守る余裕はとても無い。];B[ng];W[mh];B[ji];W[jg];B[kg]
      ;W[kf];B[ii];W[je];B[jh];W[jf];B[mg]C[白が取られてしまう。]))
      (;W[he];B[hd];W[ge];B[gf];W[ff];B[ee]C[ダメヅマリで白がツブレ形になる。]))
      (;W[nr]C[ここで隅を守るわけにもいかない。];B[rq];W[rr];B[sr];W[rs]
      ;B[pn]C[黒が厚くなり下辺を仕掛けた白石が全て効力を失ってるから白敗勢と言える。]))
      (;W[mn]C[ここは誰が見ても切るべき所だった。];B[no]C[黒は逃げるしか無い。]
      ;W[oo];B[nn];W[op]C[隅の星が腐るので白がやれる感じだ。];B[mm];W[pq]
      C[隅を儲けたので、この後下辺は適度に捨てて打てると感じる。]))
      (;B[lr]C[私なら受けておく。];W[mo]LB[pn:A]C[白はツギでなくA等と打つかもしれないが、それなら急いで切る必要は無いと感じる。]
      ;B[pm]C[白がツギならヒラキで部分的に黒不満はない。]))
      (;B[gr]LB[ao:A][ap:B]C[ABの交換が無ければこの手が先手だった。]
      ;W[jq];B[cs];W[aq];B[fs];W[ar];B[bs];W[as]CR[ap]C[○に白があるせいで攻め合いが負けになっている。]))
      (;B[ip]C[誰しも高く逃げる手を考えるところだ。左下に関してはAlphaGoにミスが目立つ。]))`
  );
});

test("toTree", () => {
  const tree = toTree(
    "(;SZ[19]PB[芝野虎丸]PW[余正麒]AB[ab][cd](;B[jj];W[ii])(;B[ij];W[hi]))"
  );
  expect(tree.rootProperties).toEqual({
    SZ: ["19"],
    PB: ["芝野虎丸"],
    PW: ["余正麒"],
    AB: ["ab", "cd"],
  });

  // 1手目
  tree.down(1);
  expect(tree.properties).toEqual({ B: ["ij"] });
  // // 親と子がの情報が一致しているか
  // expect(tree.node).toEqual(tree.nextNodes[0].parent);

  // 2手目
  tree.down();
  expect(tree.properties).toEqual({ W: ["hi"] });
});
