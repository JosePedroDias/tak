import readline from 'node:readline';
import process from 'node:process';

import { State, COLORS } from "./tak.ts";
import { bot } from "./random-bot.ts";

let validMoves: string[] = [];
function completer(line: string): [string[], string] {
    const hits = validMoves.filter((c) => c.startsWith(line));
    return [hits, line];
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer,
});

const BOT_INDEX = 1; // Bot plays black


let st = new State(5);

console.log(st.toString());

while (true) {
    const nextPlayer = st.whoIsNext().nthPlayer;

    let mv: string;

    if (nextPlayer === BOT_INDEX) {
    //if (true) { // bot vs bot
        mv = bot(st);
        console.log(`Bot (${COLORS[nextPlayer]}) played: ${mv}`);
    } else {
        const line = await new Promise<string>((resolve) => {
            validMoves = st.getValidMoves();
            rl.question(`Human (${COLORS[nextPlayer]}) turn. Enter move: `, resolve);
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
        if (st.isGameOver()) {
            console.log(st.getPTN());
            break;
        }
    } else {
        console.log('Invalid move, try again.');
    }
}
rl.close();
