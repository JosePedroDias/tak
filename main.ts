import { State } from "./tak.ts";

const st = new State(5);
const mvs = [
    'a1',    'b2', //  (1) places: p(f) p(F)
    'Sb1',   'Cc1', // (2) places: p(S) p(c)
    'b1<',   'c1+', // (3) moves:  m-x, m-y
    'Sc1',   'c2-',
];

console.log(st.toString());

for (const mv of mvs) {
    st.play(mv);
    console.log(st.toString());
    console.log(st.getPTN());
}
