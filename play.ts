import readline from 'node:readline';
import process from 'node:process';

import { State, COLORS } from "./tak.ts";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


let st = new State(5);

console.log(st.toString());

while (true) {
    const nextPlayer = st.whoIsNext().nthPlayer;

    const line = await new Promise<string>((resolve) => {
        const validMoves = st.getValidMoves();
                    console.log(`${validMoves.join('  ')}`);
                    rl.question(`${COLORS[nextPlayer]} turn. Enter move: `, resolve);
    });
    if (line === 'exit') {
        break;
    }

    const newSt = st.play(line.trim());
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
