import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { State } from './tak.ts';

describe('getPTS()', () => {
    it('empty state 3', () => {
        const st = new State(3);
        assert.equal(st.getPTS(), `x3/x3/x3 1 1`);
    });

    it('other state', () => {
        let st = new State(3);
        st = st.play('a1') as State;
        st = st.play('b2') as State;
        assert.equal(st.getPTS(), `x3/x,1,x/2,x2 1 2`);
    });

    it('empty state 5', () => {
        let st = new State(5);
        assert.equal(st.getPTS(), `x5/x5/x5/x5/x5 1 1`);
    });

    it('state 5 d4', () => {
        let st = new State(5);
        st = st.play('d4') as State;
        assert.equal(st.getPTS(), `x5/x3,2,x/x5/x5/x5 2 1`);
    });

    it('state 5 d4 b2', () => {
        let st = new State(5);
        st = st.play('d4') as State;
        st = st.play('b2') as State;
        assert.equal(st.getPTS(), `x5/x3,2,x/x5/x,1,x3/x5 1 2`);
    });

    it('state 5 d4 b2 b4', () => {
        let st = new State(5);
        st = st.play('d4') as State;
        st = st.play('b2') as State;
        st = st.play('b4') as State;
        assert.equal(st.getPTS(), `x5/x,1,x,2,x/x5/x,1,x3/x5 2 2`);
    });

    it('state 5 d4 b2 b4 d2', () => {
        let st = new State(5);
        st = st.play('d4') as State;
        st = st.play('b2') as State;
        st = st.play('b4') as State;
        st = st.play('d2') as State;
        assert.equal(st.getPTS(), `x5/x,1,x,2,x/x5/x,1,x,2,x/x5 1 3`);
    });
});

describe('getPTN()', () => {
    it('empty state', () => {
        const st = new State(3);
        assert.equal(st.getPTN(), `[Size "3"]\n[Opening "swap"]\n\n1.\n`);
    });

    it('state 5 d4 b2 b4 d2', () => {
        let st = new State(5);
        st = st.play('d4') as State;
        st = st.play('b2') as State;
        st = st.play('b4') as State;
        st = st.play('d2') as State;
        assert.equal(st.getPTN(), `[Size "5"]\n[Opening "swap"]\n\n1. d4 b2\n2. b4 d2\n`);
    });
});

describe('toString()', () => {
    it('empty state', () => {
        const st = new State(3);
        assert.equal(st.toString(), `  +-+-+-+
3 | | | |
  +-+-+-+
2 | | | |
  +-+-+-+
1 | | | |
  +-+-+-+
   a b c
`);
    });
});

describe('getValidMoves()', () => {
    it('empty state', () => {
        const st = new State(3);
        assert.equal(st.getValidMoves().join(' '), `a3 b3 c3 a2 b2 c2 a1 b1 c1`);
    });
});
