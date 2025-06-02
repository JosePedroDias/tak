import readline from 'node:readline';
import process from 'node:process';

import { State, COLORS } from "./tak.ts";
import { bot } from "./random-bot.ts";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const BOT_INDEX = 1; // Bot plays black


let st = new State(5);

console.log(st.toString());

while (true) {
    const nextColor = st.whoIsNext().nthColor;

    let mv: string;

    if (nextColor === BOT_INDEX) {
    //if (true) { // bot vs bot
        mv = bot(st);
        console.log(`Bot (${COLORS[nextColor]}) played: ${mv}`);
    } else {
        const line = await new Promise<string>((resolve) => {
            const validMoves = st.getValidMoves();
            console.log(`${validMoves.join('  ')}`);
            rl.question(`Human (${COLORS[nextColor]}) turn. Enter move: `, resolve);
        });
        if (line === 'exit') {
            break;
        }
        mv = line.trim();
    }

    const newSt = st.play(mv);
    if (newSt) {
        st = newSt;
        console.log(st.toString());
        const roadsWhite = st.findRoads(0);
        const roadsBlack = st.findRoads(1);
        if (roadsWhite || roadsBlack) {
            console.log(`Roads white:${roadsWhite}, black:${roadsBlack}`);
            console.log(st.getPTN());
            break;
        }
    } else {
        console.log('Invalid move, try again.');
    }
}
rl.close();
