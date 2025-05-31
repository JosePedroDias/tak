import { Piece, Board, State } from "./tak.ts";

const st = new State();

//console.log('hello');

const mvs = [
    'a1',    'b2', //     (1) places: black(f) white(F)
    'Sc3',   'Cd4', //    (2) places: white(S) black(c)
    '1d3<1', '2c4+11', // (3) moves:  mv left, mv right11
];

console.log(st.toString());

for (const mv of mvs) {
    st.play(mv);
    console.log(st.toString());
    console.log(st.getPTN());
}
