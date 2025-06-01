import { readFileSync } from "node:fs";

const rgxProp = /\[(\w+)\s+"([^"]+)"\]/;
const commentProp = /\{[^\}]+\}/g;
const mvPairRgx = /(\d+)\.\s+(\S+)\s+(\S+)/
const mvRgx = /(\d+)\.\s+(\S+)/

export function loadPtn(filename: string): { props: Record<string, string>, moves: string[] } {
    const props = {};
    const moves: string[] = [];

    const s = readFileSync(filename).toString();

    for (let l of s.split("\n")) {
        console.log(l);
        l = l.replaceAll(commentProp, "");
        l = l.trim();
        if (l.indexOf[0] === '[') {
            const m = rgxProp.exec(l);
            console.log(m);
            if (m) {
                props[m[1]] = m[2];
            } else {
                console.log(`unsupported line in PTN file: ${l}`);
            }
        }
        else {
            let m = mvPairRgx.exec(l);
            if (m) {
                moves.push(m[2]);
                moves.push(m[3]);
            } else {
                m = mvRgx.exec(l);
                if (m) {
                    moves.push(m[2]);
                } else {
                    console.log(`unsupported line in PTN file: ${l}`);
                }
            }
        }
    }

    return { props, moves };
}
