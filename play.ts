import readline from 'node:readline';
import process from 'node:process';

import { State } from "./tak.ts";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


const st = new State(5);

console.log(st.toString());

while (true) {
    const line = await new Promise<string>((resolve) => {
        rl.question('Enter move: ', resolve);
    });
    if (line === 'exit') {
        break;
    }

    st.play(line.trim());
    console.log(st.toString());
    //console.log(st.getPTN());
    const roadsWhite = st.findRoads(0);
    const roadsBlack = st.findRoads(1);
    if (roadsWhite || roadsBlack) {
        console.log(`Roads white:${roadsWhite}, black:${roadsBlack}`);
    }
}
rl.close();
