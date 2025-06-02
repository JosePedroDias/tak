import { State } from "./tak.ts";

export function bot(st: State): string {
    const validMoves = st.getValidMoves();
    return validMoves[ Math.floor(validMoves.length * Math.random()) ];
}
