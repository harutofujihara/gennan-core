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

test("toTree コメントに()や[]が含まれる", () => {
  const tree = toTree(
    `(;SZ[19]PB[芝野虎丸]PW[余正麒]AB[ab][cd](;B[jj];W[ii])(;B[ij]C[te(s)A[a\\]\\]\\]\\]t];W[hi]))`
  );
  expect(tree.rootProperties).toEqual({
    SZ: ["19"],
    PB: ["芝野虎丸"],
    PW: ["余正麒"],
    AB: ["ab", "cd"],
  });

  // 1手目
  tree.down(1);
  expect(tree.properties).toEqual({
    B: ["ij"],
    C: [`te(s)A[a\\]\\]\\]\\]t`],
  });

  // // 親と子がの情報が一致しているか
  // expect(tree.node).toEqual(tree.nextNodes[0].parent);

  // 2手目
  tree.down();
  expect(tree.properties).toEqual({ W: ["hi"] });
});

test("各Propertyの値以外の場所で改行コードが含まれていた時にエラーを起こさない", () => {
  const tree = toTree(
    `(;FF[4]
      CA[UTF-8]
      GM[1]
      AB[aa]
      [bb]
      DT[2021-05-04]
      GN[Voltus vs. dominog42]
      PC[https://online-go.com/review/664213]
      PB[Voltus]
      PW[dominog42]
      BR[14k]
      WR[13k]
      TM[300]OT[5x30 byo-yomi]
      RE[B+2.5]
      SZ[9]
      KM[3.5]
      RU[Japanese]
      
      ;B[ee]
      ;W[eg]
      ;B[ge]C[Think this is the right response though I'm not certain.
      ]
      
      ;W[ce]
      (;B[dc]
      (;W[cc]C[Ha forgot he did attack me. I think I played this correctly. His move doesn't threaten to cut and my stone is fine even if he takes away another liberty.
      ]
      
      ;B[gg]C[Was really happy I "disengaged" here.
      ]
      
      ;W[fh]
      ;B[df]C[noticed at this point that my stones were all safe and decided to cut off what was shaping up to be a large group
      ]
      
      ;W[cf]
      ;B[dg]
      ;W[cg]
      ;B[dh]
      ;W[gh]TR[fg]C[I spent more time on this move than any other in the game. My instinct was to play F3 to prevent him from creeping too far into my territory but I realized that connecting at E2 gave him a 3 stone-wide group along the edge and it felt like two eyes would be more possible from there.
      ]
      
      (;B[eh]
      ;W[fg]
      (;B[hh]C[Mistake! This allowed white to be much closer to creating two eyes and to capture. I'm guessing the AI will score this as my biggest blunder?
      ]
      
      ;W[hg]
      ;B[hf]
      ;W[gf]
      ;B[ig]TR[hh]C[Another move I was happy with. I think any other move would have allowed my weakest stone to be captured after white atari'ed it
      ]
      
      ;W[gg]
      ;B[ih]
      ;W[hi]
      (;B[he]
      ;W[gc]C[I misplayed this next sequence. One thing I still struggle with is preventing eye formation in my own territory.
      ]
      
      (;B[hc]
      ;W[fb]
      (;B[eb]
      ;W[dd]
      ;B[ed]
      ;W[db]
      ;B[ec]
      ;W[da]
      ;B[ea]
      ;W[cb]
      ;B[de]TR[cd]C[I think this was a mistake by me. I thought I was preserving sente by forcing a connection at C6 but in reality white didn't lose enough when I ended up capturing.
      ]
      
      ;W[hb]
      (;B[hd]
      ;W[ic]
      ;B[id]
      ;W[ib]
      ;B[ga]
      ;W[fa]
      ;B[fc]
      ;W[gb]
      ;B[gd]C[In exploring moves 43-47 again I just replayed the game exactly.. because he had two spots by 43 to make an eye (g9 and h9) and I couldn't play h9 without putting myself in atari I couldn't stop him at that point.
      ]
      
      ;W[ch]
      ;B[cd]
      ;W[bd]
      ;B[ci]
      ;W[bi]
      ;B[di]
      ;W[bh]
      ;B[dd]
      ;W[ei]
      ;B[fi]
      ;W[gi]
      ;B[ff]
      ;W[if]
      ;B[ie]
      ;W[fe]
      ;B[fd]
      ;W[ei]
      (;B[ef]TR[ff]C[This prevented a minor ko at the triangle though I think as I said in the variation I still would have killed this group.
      ]
      
      ;W[ha]C[Seemed like the unnecessary surrender of a point if I understand Japanese scoring correctly.
      ]
      
      ;B[fi]
      ;W[]
      ;B[]
      )(;B[af]
      ;W[ef]
      ;B[fi]
      ;W[fe]C[I definitely didn't realize just how close I was to getting into trouble here! Is this considered mutual life?
      
      EDIT: Think I still kill this group playing it out a bit more..
      ]
      
      (;B[ei]
      )(;B[if]
      ;W[ei]
      ;B[ff]
      )))(;B[cd]
      ;W[bd]
      ;B[dd]C[Not a good use of tempo..
      ]
      
      ))(;B[fc]
      ;W[fd]
      ;B[ec]C[This feels like a better sequence maybe?
      ]
      
      ))(;B[fb]
      ;W[gb]
      ;B[ga]
      ;W[fc]
      ;B[ha]
      ;W[eb]
      ;B[fa]
      ;W[ea]
      ;B[hb]
      ;W[hc]
      ))(;B[if]C[A move I previously would have played to "help" my attacked group.
      ]
      
      ;W[he]
      ;B[ie]
      ;W[hd]
      ;B[id]
      ;W[ic]
      ))(;B[hg]TR[de]TR[ef]C[Still don't have to worry about my "L" shaped group at this point because of the two connection options available to it in a pinch.
      ]
      
      ))(;B[fg]
      ;W[eh]
      ;B[hh]
      ;W[hi]
      ;B[ih]C[This may have actually been OK?
      ]
      
      ;W[ch]
      ;B[ci]
      ;W[bi]
      ;B[di]
      ;W[bh]
      ))(;W[dd]
      ;B[ed]
      ;W[cc]
      ;B[de]
      ;W[cd]
      ;B[db]C[Playing out how it might have looked had white attacked my stone.
      ]
      
      ))(;B[cc]
      ;W[dc]
      ;B[dd]
      ;W[ec]
      ;B[gc]
      ;W[cd]C[If I had played more aggressively (the 3-3 point move 1) white can form the beginnings of a living shape. Now if I play something like 5 to box it in he cuts with 6 cutting off stone 1. If I played 5 at 6 instead he plays at 5 expanding the size of the top group.
      ]
      
      ))`
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
