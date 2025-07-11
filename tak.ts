import { distPerms } from "./helper.ts";

//const log = (s: any) => {};
const log = (s: any) => console.log(s);

export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']; // X axis
//export const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1']; // Y axis

const XM = '<';
const XP = '>';
const YM = '+';
const YP = '-';

const MOVES = [XM, XP, YM, YP];

export const COLORS = ['white', 'black'];

export const DIRECTIONS = {
    [XM]: [-1,  0],
    [XP]: [ 1,  0],
    [YM]: [ 0, -1],
    [YP]: [ 0, +1],
}

// F - flat stone. no prefix needed
// S - standing stone
// C - capstone

function pad(s: string, n: number, ch: string = ' '): string {
    return s.padEnd(n, ch);
}

type XY = [number, number];
type Pos = string;

export class Piece {
    colorIdx: number; // 0 - white, 1 - black
    isBlack: boolean;
    isCapstone: boolean;
    isStanding: boolean;

    constructor(isBlack: boolean, isCapstone: boolean = false, isStanding: boolean = false) {
        this.isBlack = isBlack;
        this.colorIdx = isBlack ? 1 : 0;
        this.isCapstone = isCapstone;
        this.isStanding = isStanding;
    }

    clone() {
        return new Piece(this.isBlack, this.isCapstone, this.isStanding);
    }

    toString() {
        if (this.isBlack) {
            if (this.isCapstone) return 'c';
            else if (this.isStanding) return 's';
            return 'f';
        } else {
            if (this.isCapstone) return 'C';
            else if (this.isStanding) return 'S';
            return 'F';
        }
    }
}

export class PieceStack {
    n: number = 0;
    position: string;
    stack: Piece[] = [];

    constructor(n: number, position: string) {
        this.n = n;
        this.position = position;
    }

    isEmpty() {
        return this.stack.length === 0;
    }

    topmostPiece(): Piece | undefined {
        return this.stack.length > 0 ? this.stack[this.stack.length - 1] : undefined;
    }

    ownedBy(): number | undefined {
        if (this.isEmpty()) return undefined;
        return this.topmostPiece()?.isBlack ? 1 : 0;
    }

    takeN(n: number): Piece[] {
        if (n > this.stack.length) {
            throw new Error(`Cannot take ${n} pieces from stack of size ${this.stack.length}`);
        }
        if (n > this.n) {
            throw new Error(`Cannot take more than ${this.n} pieces from stack`);
        }
        return this.stack.splice(this.stack.length - n, n);
    }

    placeN(pieces: Piece[]) {
        for (const p of pieces) {
            const topP = this.topmostPiece();
            if (topP) {
                if (topP.isCapstone) {
                    throw new Error(`Cannot place piece on top of capstone`);
                }
                else if (topP.isStanding && !p.isCapstone) {
                    throw new Error(`Cannot place a non-capstone piece on top of a standing piece`);
                }
                else if (topP.isStanding && p.isCapstone) {
                    topP.isStanding = false;
                }
            }
            this.stack.push(p);
        }
    }
 
    countsForPlayer(): number {
        const p = this.topmostPiece();
        if (!p || p.isStanding) return -1;
        return p.isBlack ? 1 : 0;
    }

    clone(): PieceStack {
        const ps = new PieceStack(this.n, this.position);
        ps.stack = this.stack.map(p => p.clone());
        return ps;
    }

    toString() {
        return this.stack.map(p => p.toString()).join('');
    }
}

export class PieceCount {
    stones: number;
    capstones: number;

    constructor(n: number = 5) {
        if (n == 3) {
            this.stones = 10;
            this.capstones = 0;
        }
        else if (n == 4) {
            this.stones = 15;
            this.capstones = 0;
        }
        else if (n == 5) {
            this.stones = 21;
            this.capstones = 1;
        }
        else if (n == 6) {
            this.stones = 30;
            this.capstones = 1;
        }
        else if (n == 8) {
            this.stones = 50;
            this.capstones = 2;
        }
        else {
            throw new Error(`Unsupported board size: ${n}`);
        }
    }

    clone(): PieceCount {
        const pc = new PieceCount();
        pc.stones = this.stones;
        pc.capstones = this.capstones;
        return pc;
    }

    toString(): string {
        return `S:${this.stones}, C:${this.capstones}`;
    }
}

export class Board {
    n: number;
    arr: PieceStack[][];
    ranks: string[];

    constructor(n: number = 5) {
        this.n = n;
        this.arr = [];
        this.ranks = new Array(n);
        for (let i = 0; i < n; ++i) {
            this.ranks[i] = (n - i).toString();
        }

        for (let y = 0; y < n; ++y) {
            const row: PieceStack[] = [];
            for (let x = 0; x < n; ++x) {
                row.push(new PieceStack(n, this.xyToPos([x, y])));
            }
            this.arr.push(row);
        }
    }

    getXY([x, y]: XY): PieceStack {
        return this.arr[y][x];
    }

    setXY([x, y]: XY, ps: PieceStack) {
        this.arr[y][x] = ps;
    }

    getPos(pos: Pos) {
        return this.getXY( this.posToXy(pos) );
    }

    setPos(pos: Pos, ps: PieceStack) {
        return this.setXY(this.posToXy(pos), ps);
    }

    xyToPos([x, y]: XY) {
        return `${FILES[x]}${this.ranks[y]}`;
    }

    posToXy(pos: Pos): XY {
        return [
            FILES.indexOf(pos[0]),
            this.ranks.indexOf(pos[1]),
        ];
    }

    *positionsGen() {
        for (let y = 0; y < this.n; ++y) {
            for (let x = 0; x < this.n; ++x) {
                yield `${FILES[x]}${this.ranks[y]}`;
            }
        }
    }

    *cellsGen() {
        for (let y = 0; y < this.n; ++y) {
            for (let x = 0; x < this.n; ++x) {
                yield this.getXY([x, y]);
            }
        }
    }

    getMatching(predicate: (ps: PieceStack) => boolean): PieceStack[] {
        const matching: PieceStack[] = [];
        const g = this.cellsGen();
        let o;
        while (o = g.next()) {
            if (o.done) break;
            const ps = o.value;
            if (predicate(ps)) {
                matching.push(ps);
            }
        }
        return matching;
    }

    getPTS(): string {
        const res: string[] = [];
        const n = this.n;
        const g = this.cellsGen();
        let o;
        let row: string[] = [];
        let x = 0;
        let prevX = 0;
        while (o = g.next()) {
            if (o.done) break;
            const ps = o.value;
            if (ps.isEmpty()) {
                ++prevX;
            } else {
                if (prevX > 0) {
                    row.push( prevX > 1? `x${prevX}` : 'x');
                    prevX = 0;
                }
                row.push(ps.stack.map((p) => {
                    const k = p.isCapstone ? 'C' : (p.isStanding ? 'S' : '');
                    return `${p.colorIdx + 1}${k}`;
                }).join(''));
            }
            x += 1;
            if (x === n) {
                if (prevX > 0) {
                    row.push( prevX > 1? `x${prevX}` : 'x');
                    prevX = 0;
                }
                res.push(row.join(','));
                row = [];
                x = 0;
            }
        }
        //console.log('res', res);
        return res.join('/');
    }

    clone(): Board {
        const b = new Board(this.n);
        for (let y = 0; y < this.n; ++y) {
            for (let x = 0; x < this.n; ++x) {
                b.setXY([x, y], this.getXY([x, y]).clone());
            }
        }
        return b;
    }

    toString(): string {
        let n = this.n;

        const lengths = new Array(n).fill(1);
        {
            let o;
            const g = this.cellsGen();
            let i = 0;
            while (o = g.next()) {
                if (o.done) break;
                const ps = o.value.toString();
                const x = i % n;
                lengths[x] = Math.max(lengths[x], ps.length);
                ++i;
            }
        }
        
        const res: string[] = [];
        const g = this.cellsGen();
        let o;
        let x = 0;
        let y = 0;
        
        function line() {
            res.push('  ');
            for (let x = 0; x < n; ++x) {
                res.push(`+${pad('', lengths[x], '-')}`);
            }
            res.push('+\n');
        }

        line();
        res.push(`${this.ranks[y]} `);
        while (o = g.next()) {
            if (o.done) break;
            const ps = o.value.toString();
            res.push(`|${pad(ps, lengths[x], ' ')}`);
            ++x;
            if (x === this.n) {
                res.push('|\n');
                x = 0;
                ++y;
                line();
                if (y < this.n) {
                    res.push(`${this.ranks[y]} `);
                }
            }
        }

        res.push('  ');
        for (let x = 0; x < n; ++x) {
            res.push(` ${pad(FILES[x], lengths[x], ' ')}`);
        }
        res.push('\n');

        return res.join('');
    }
}

export class State {
    board: Board;
    unused: [PieceCount, PieceCount];
    moves: string[][] = [[]];

    constructor(n: number = 5) {
        this.board = new Board(n);
        this.unused = [
            new PieceCount(n),
            new PieceCount(n),
        ]
    }

    whoIsNext(): { isFirstMovePair: boolean, nthPlayer: number, nthColor: number } {
        let lastPair = this.moves[this.moves.length - 1];
        if (lastPair.length > 1) {
            lastPair = [];
            this.moves.push(lastPair);
        }
        const isFirstMovePair = this.moves.length === 1;
        const nthPlayer = lastPair.length;
        const nthColor = isFirstMovePair ? (nthPlayer ? 0 : 1) : nthPlayer;

        return { isFirstMovePair, nthPlayer, nthColor };
    }

    _play(mv: string) {
        const { isFirstMovePair, nthColor } = this.whoIsNext();

        if (MOVES.some(dir => mv.indexOf(dir) !== -1)) {
            // MOVE PIECE(S) (count)?(square)(direction)(drop counts)?(stone)?:
            
            // d3<
            // 1d3<1
            // 2c4+11
            // 2c4+11C

            if (isFirstMovePair) {
                throw new Error(`Cannot move pieces on your first move!`);
            }

            const lastCh = mv[mv.length - 1];
            if (['S', 'C', 'F'].includes(lastCh)) {
                // drop ending stone, useless
                mv = mv.slice(0, -1);
            }

            let count = parseInt(mv[0]);
            if (isNaN(count)) {
                // fill optional count with 1
                mv = `1${mv}`;
                count = 1;
            }
            const pos = mv.slice(1, 3);
            const moveSymbol = mv[3];
            const dir: [number, number] = DIRECTIONS[moveSymbol];
            let dropCounts: number[] = mv.slice(4).split('').map(ch => parseInt(ch, 10));
            if (dropCounts.length === 0) {
                mv = `${mv}${count}`;
                dropCounts = [count];
            }

            if (count !== dropCounts.reduce((a, b) => a + b, 0)) {
                throw new Error(`Count ${count} does not match sum of drop counts ${dropCounts.join(', ')}`);
            }

            //log({ count, pos, moveSymbol, dir, dropCounts });
            
            const ps = this.board.getPos(pos);
            let xy = this.board.posToXy(pos);
            if (ps.ownedBy() !== nthColor) {
                throw new Error(`You do not own the stack at ${pos}`);
            }
            const taken = ps.takeN(count);
            for (const dropCount of dropCounts) {
                xy = [
                    xy[0] + dir[0],
                    xy[1] + dir[1],
                ];
                const ps = this.board.getXY(xy);
                ps.placeN(taken.splice(0, dropCount));
            }
        }
        else {
            // PLACE PIECE
            // (stone)(square): a3, Sb4, Cc2
            let kind = 'F';
            if (mv.length === 3) {
                const mv0 = mv[0];
                if (mv0 === 'S' || mv0 === 'C') {
                    kind = mv0;
                }
            }
            
            const p = new Piece(nthColor !== 0, kind === 'C', kind === 'S');
            const key = kind === 'C' ? 'capstones' : 'stones';
            const bag = this.unused[nthColor];
            if (bag[key] <= 0) {
                throw new Error(`No more ${kind} pieces left for player ${nthColor + 1}`);
            }
            bag[key] -= 1;

            if (isFirstMovePair && kind !== 'F') {
                throw new Error(`The first move must be a flat stone!`);
            }

            //log({ kind, p });
            const ps = this.board.getPos(mv.length === 3 ? mv.slice(1) : mv);
            if (!ps.isEmpty()) {
                throw new Error(`Cannot place piece on non-empty cell!`);
            }
            ps.placeN([p]);
        }

        this.moves[this.moves.length - 1].push(mv);
    }

    play(mv: string): State | undefined {
        try {
            const st = this.clone();
            st._play(mv);
            return st;
        } catch (e) {
            //log(`Error: ${e.message}`);
        }
    }

    hasPiecesLeft(playerIdx: number) {
        const bag = this.unused[playerIdx];
        return bag.stones > 0 || bag.capstones > 0;
    }

    areAllCellsOccupied(): boolean {
        const g = this.board.cellsGen();
        let o;
        while (o = g.next()) {
            if (o.done) break;
            const ps = o.value;
            if (ps.isEmpty()) {
                return false;
            }
        }
        return true;
    }

    findRoads(playerIdx: number): boolean {
        const board = this.board.arr.map(row => {
            return row.map(ps => ps.countsForPlayer());
        });

        const n = this.board.n;
        
        const dirs = [
            [-1,  0],
            [ 1,  0],
            [ 0, -1],
            [ 0,  1],
        ];

        const tops: XY[] = [];
        const bottoms: XY[] = [];
        const lefts: XY[] = [];
        const rights: XY[] = [];
        for (let i = 0; i < n; ++i) {
            tops.push([i, 0]);
            bottoms.push([i, n-1]);
            lefts.push([0, i]);
            rights.push([n-1, i]);
        }

        const xyToS = ([x, y]: XY): string => `${x},${y}`;

        const bottoms_s = new Set(bottoms.map(xyToS));
        const rights_s = new Set(rights.map(xyToS));

        function explore(from: XY, goals_s: Set<string>, visited: Set<string> = new Set()): boolean {
            if (board[from[1]][from[0]] !== playerIdx) {
                return false;
            }
            const from_s = xyToS(from);
            if (visited.has(from_s)) {
                return false;
            }
            if (goals_s.has(from_s)) {
                return true;
            }
            visited.add(from_s);

            for (const [dx, dy] of dirs) {
                const next: XY = [from[0] + dx, from[1] + dy];
                if (next[0] < 0 ||
                    next[1] < 0 ||
                    next[0] >= n ||
                    next[1] >= n) {
                    continue;
                }
                if (explore(next, goals_s, visited)) {
                    return true;
                }
            }
            return false;
        }

        // top to bottom
        for (let t of tops) {
            if (explore(t, bottoms_s)) {
                //console.log(board);
                return true;
            }
        }

        // left to right
        for (let l of lefts) {
            if (explore(l, rights_s)) {
                //console.log(board);
                return true;
            }
        }

        return false;
    }

    isGameOver(): boolean {
        const otherPlayerIdx = this.whoIsNext().nthPlayer;
        const playerIdx = otherPlayerIdx ? 0 : 1;
        if (this.findRoads(playerIdx)) {
            console.log(`${COLORS[playerIdx]} won with road!`);
            return true;
        }
        if (this.findRoads(otherPlayerIdx)) {
            console.log(`${COLORS[playerIdx]} lost with road (self-inflicted?)!`);
            return true;
        }
        if (this.areAllCellsOccupied() || !this.hasPiecesLeft(otherPlayerIdx)) {
            const scores = this.countScores();
            console.log(`Game over. Scores: ${scores.join(' - ')}`);
            return true;
        }
        return false;
    }

    countScores(): [number, number] {
        const scores: [number, number] = [0, 0];
        const g = this.board.cellsGen();
        let o;
        while (o = g.next()) {
            if (o.done) break;
            const ps = o.value;
            const forWhom = ps.countsForPlayer();
            if (forWhom === -1) continue;
            ++scores[forWhom];
        }
        return scores;
    }

    getPTN(): string {
        const arr: string[] = [];
        let nth = 1;
        for (let [m1, m2] of this.moves) {
            arr.push(`${nth}.`);
            if (m1) arr.push(` ${m1}`);
            if (m2) arr.push(` ${m2}`);
            ++nth;
            arr.push('\n');
        }
        return `[Size "${this.board.n}"]\n[Opening "swap"]\n\n${arr.join('')}`;
    }

    getPTS(): string {
        const { nthPlayer } = this.whoIsNext();
        let t = nthPlayer + 1;
        const rp = this.moves.length;
        return `${this.board.getPTS()} ${t} ${rp}`;
    }

    getValidMoves(): string[] {
        const { isFirstMovePair, nthColor } = this.whoIsNext();

        let validMoves: string[] = [];
    
        if (isFirstMovePair) {
            const emptyPositions = this.board.getMatching((ps) => ps.isEmpty()).map(ps => ps.position);
            validMoves = [...emptyPositions];
        } else {
            // place
            const emptyPositions = this.board.getMatching((ps) => ps.isEmpty()).map(ps => ps.position);
            const myUnused = this.unused[nthColor];
            const hasStone = myUnused.stones > 0;
            const hasCapstone = myUnused.capstones > 0;
            for (let pos of emptyPositions) {
                if (hasCapstone) {
                    validMoves.push(`C${pos}`);
                }
                if (hasStone) {
                    validMoves.push(pos);
                    validMoves.push(`S${pos}`);
                }
            }

            // move
            const controlledStacks = this.board.getMatching((ps) => {
                const tp = ps.topmostPiece();
                if (!tp) return false;
                return tp && tp.colorIdx === nthColor;
            });
            for (let ps of controlledStacks) {
                const n = Math.min(ps.stack.length, this.board.n);
                for (let d of MOVES) {
                    for (let nn = 1; nn <= n; ++nn) {
                        const comb: number[][] = distPerms[nn];
                        const pos = ps.position;
                        for (let co of comb) {
                            const mv = (nn === co[0] && co.length === 1) ? (nn > 1 ? `${nn}${pos}${d}` : `${pos}${d}`) : `${nn}${pos}${d}${co.join('')}`;
                            const worked = this.play(mv);
                            if (worked) {
                                validMoves.push(mv);
                            }
                        }
                    }
                }
            }
        }

        //console.log(validMoves);
        return validMoves;
    }

    clone(): State {
        const st = new State(this.board.n);
        st.board = this.board.clone();
        st.unused = this.unused.map((pc => pc.clone())) as [PieceCount, PieceCount];
        st.moves = this.moves.map(pair => pair.slice());
        return st;
    }

    toString() {
        return this.board.toString();
    }
}
