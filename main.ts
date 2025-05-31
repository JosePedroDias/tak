import { Piece, Board } from "./tak.ts";

const b = new Board();

console.log('hello');
console.log(b.toString());

const p1 = new Piece(false);
b.setPos('b3', p1);
console.log(b.toString());

const p2 = new Piece(true, true);
b.setPos('c1', p2);
console.log(b.toString());
