//const log = (s: any) => {};
const log = (s: any) => console.log(s);

export const FILES = ['a', 'b', 'c', 'd', 'e']; // X axis
export const RANKS = ['5', '4', '3', '2', '1']; // Y axis

const XM = '<';
const XP = '>';
const YM = '+';
const YP = '-';

const MOVES = [XM, XP, YM, YP];

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
    isBlack: boolean;
    isCapstone: boolean;
    isStanding: boolean;

    constructor(isBlack: boolean, isCapstone: boolean = false, isStanding: boolean = false) {
        this.isBlack = isBlack;
        this.isCapstone = isCapstone;
        this.isStanding = isStanding;
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
    stack: Piece[] = [];

    constructor(n: number) {
        this.n = n;
    }

    isEmpty() {
        return this.stack.length === 0;
    }

    topMostPiece(): Piece | undefined {
        return this.stack.length > 0 ? this.stack[this.stack.length - 1] : undefined;
    }

    ownedBy(): number | undefined {
        if (this.isEmpty()) return undefined;
        return this.topMostPiece()?.isBlack ? 1 : 0;
    }

    takeN(n: number): Piece[] {
        if (n > this.stack.length) {
            throw new Error(`Cannot take ${n} pieces from stack of size ${this.stack.length}`);
        }
        if (n > this.n) {
            throw new Error(`Cannot take more than ${this.n} pieces from stack`);
        }
        const taken = this.stack.slice(-n);
        this.stack = this.stack.slice(0, -n);
        return taken;
    }

    placeN(pieces: Piece[]) {
        for (const p of pieces) {
            const topP = this.topMostPiece();
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

    toString() {
        return this.stack.map(p => p.toString()).join('');
    }
}

export class PieceCount {
    stones: number;
    capstones: number;

    constructor(n: number = 5) {
        if (n == 5) {
            this.stones = 21;
            this.capstones = 1;
        } else {
            throw new Error(`Unsupported board size: ${n}`);
        }
    }
}

export class Board {
    n: number;
    arr: PieceStack[][];

    constructor(n: number = 5) {
        this.n = n;
        this.arr = [];
        for (let y = 0; y < n; ++y) {
            const row: PieceStack[] = [];
            for (let x = 0; x < n; ++x) {
                row.push(new PieceStack(n));
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
        return `${FILES[x]}${RANKS[y]}`;
    }

    posToXy(pos: Pos): XY {
        return [
            FILES.indexOf(pos[0]),
            RANKS.indexOf(pos[1]),
        ];
    }

    *positionsGen() {
        for (let y = 0; y < this.n; ++y) {
            for (let x = 0; x < this.n; ++x) {
                yield `${FILES[x]}${RANKS[y]}`;
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

    toString(): string {
        const res: string[] = [];
        const g = this.cellsGen();
        let o;
        let x = 0;
        let y = 0;
        let l = 2; // TODO

        let n = this.n;
        function line() {
            res.push('  ');
            for (let x = 0; x < n; ++x) {
                res.push(`+${pad('', l, '-')}`);
            }
            res.push('+\n');
        }

        line();
        res.push(`${RANKS[y]} `);
        while (o = g.next()) {
            if (o.done) break;
            const p = o.value ? o.value.toString() : '';
            res.push(`|${pad(p, l, ' ')}`);
            ++x;
            if (x === this.n) {
                res.push('|\n');
                x = 0;
                ++y;
                line();
                if (y < this.n) {
                    res.push(`${RANKS[y]} `);
                }
            }
        }

        res.push('  ');
        for (let x = 0; x < n; ++x) {
            res.push(` ${pad(FILES[x], l, ' ')}`);
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

    play(mv_: string) {
        let lastPair = this.moves[this.moves.length - 1];
        const isFirstMovePair = this.moves.length === 1;

        if (lastPair.length > 1) {
            lastPair = [];
            this.moves.push(lastPair);
        }

        const nthPlayer = lastPair.length;
        const nthColor = isFirstMovePair ? (nthPlayer ? 0 : 1) : nthPlayer;

        let p;
        let kind;
        let mv = mv_;
        if (mv.length === 2) {
            kind = 'F';
        }
        else if (mv.length === 3) {
            const mv0 = mv[0];
            mv = mv.slice(1);
            if (mv0 === 'S' || mv0 === 'C') {
                kind = mv0;
            }
        }
        
        if (kind) {
            // add piece (stone)(square): a3, Sb4, Cc2
            p = new Piece(nthColor !== 0, kind === 'C', kind === 'S');
            const key = kind === 'C' ? 'capstones' : 'stones';
            const bag = this.unused[nthColor];
            if (bag[key] <= 0) {
                throw new Error(`No more ${kind} pieces left for player ${nthColor + 1}`);
            }
            log({ kind, p });
            const ps = this.board.getPos(mv);
            ps.placeN([p]);
        }
        else if (MOVES.some(dir => mv.indexOf(dir) !== -1)) {
            // TODO move (count)(square)(direction)(drop counts)(stone):
            // 1d3<1
            // 2c4+11
            const count = parseInt(mv[0]);
            const pos = mv.slice(1, 3);
            const moveSymbol = mv[3];
            const dir: [number, number] = DIRECTIONS[moveSymbol];
            const dropCounts = mv.slice(4).split('').map(ch => parseInt(ch, 10));
            log({ count, pos, moveSymbol, dir, dropCounts });
            // TODO
        }
        else {
            throw new Error(`Invalid move: ${mv}`);
        }

        lastPair.push(mv);
    }

    getPTN(): string {
        const arr: string[] = [];
        let nth = 1;
        for (let [m1, m2] of this.moves) {
            arr.push(`${nth}.`);
            if (m1) arr.push(` ${m1}`);
            if (m2) arr.push(` ${m2}`);
            ++nth;
        }
        return arr.join('');
    }

    toString() {
        return this.board.toString();
    }
}
