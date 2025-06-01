import { State } from "./tak.ts";
//import { loadPtn } from "./load-ptn.ts";

//const { props, moves } = loadPtn("games/g1.ptn");
//console.log(props);
//console.log(moves);

let n = 6;//5;
//if (props["Size"]) {
//    n = parseInt(props["Size"], 10);
//}

// * - capstone flattens standing stone
// ' - tak
// ! - good move
// ? - questionabled move

const moves = `1. a1 f1
2. d3 e2
3. d2 d1
4. e3 a2
5. f3 a3
6. c3 a4
7. a5 b4
8. b5 Cc4
9. Cb3 c5'
10. b3+' Sb3
11. b2 c2
12. 2b4+ b4'
13. c6 b6'
14. a5- d4
15. 2a4-' c4-
16. Sc4 f2
17. e1 c1
18. b1 e4
19. d5 e5
20. d5- e6
21. e1<' 2c3>
22. e1 b3<
23. Sb3 c3'
24. c4- f5
25. f4 c4
26. Sa4 d5'
27. 3b5>12 b5'
28. d2< a5'
29. f4<' 3d3+'
30. 2c3+ 3a3-
31. 2c2>11? c3
32. 2d1+? 4a2>112'
33. 3c4< d3'
34. 3d5>' d5'
35. b3> 4d2>'
36. 2c3> b3'
37. b1+ 4d4<31*'
38. c6< 4b4-112"
39. 3c4-111 a6`.replace(/[\*'\?!"]+/gm, '').split("\n").map(l => l.trim().split(' ').splice(1, 2)).flat();
console.log(moves);

/*const moves = [
    'a1',    'b2', //  (1) places: p(f) p(F)
    'Sb1',   'Cc1', // (2) places: p(S) p(c)
    'b1<',   'c1+', // (3) moves:  m-x, m-y
    'Sc1',   'c2-',
];*/

const st = new State(n);

console.log(st.toString());

for (const mv of moves) {
    st.play(mv);
    console.log(st.toString());
    //console.log(st.getPTN());
    const roadsWhite = st.findRoads(0);
    const roadsBlack = st.findRoads(1);
    if (roadsWhite || roadsBlack) {
        console.log(`Roads white:${roadsWhite}, black:${roadsBlack}`);
    }
}
