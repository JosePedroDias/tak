export const FILES = ['a', 'b', 'c', 'd', 'e']; // X axis
export const RANKS = ['5', '4', '3', '2', '1']; // Y axis
export const DIRECTIONS = {
    '>': [ 1,  0],
    '<': [-1,  0],
    '+': [ 0, -1], // TODO CONFIRM
    '-': [ 0,  1],
}

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

// TODO
export class PieceStack {
    isBlack: boolean;
    isCapstone: boolean;
    isStanding: boolean;

    constructor(isBlack: boolean, isCapstone: boolean = false, isStanding: boolean = false) {
        this.isBlack = isBlack;
        this.isCapstone = isCapstone;
        this.isStanding = isStanding;
    }

    toString() {
        
    }
}

export class Pieces {
    capstones: 1;
    stones: 21;
}

export class Board {
    n: number;
    arr: Piece[][];

    constructor(n: number = 5) {
        this.n = n;
        this.arr = [];
        for (let i = 0; i < n; ++i) {
            this.arr.push(new Array(n))
        }
    }

    getXY([x, y]: XY): Piece {
        return this.arr[y][x];
    }

    setXY([x, y]: XY, p: Piece) {
        this.arr[y][x] = p;
    }

    getPos(pos: Pos) {
        return this.getXY( this.posToXy(pos) );
    }

    setPos(pos: Pos, piece: Piece) {
        return this.setXY( this.posToXy(pos), piece );
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
