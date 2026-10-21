import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../../api/health.mjs';

test('health fails closed and never accepts live mode', () => {
  const old = {p: process.env.PAYMENTS_MODE, g: process.env.GIFT_CARDS_MODE};
  try {
    for (const mode of ['mock','live',undefined]) {
      if (mode === undefined) delete process.env.PAYMENTS_MODE;
      else process.env.PAYMENTS_MODE = mode;
      process.env.GIFT_CARDS_MODE = 'mock';
      const res = {setHeader(){},status(code){this.code=code;return this;},json(body){this.body=body;}};
      handler({method:'GET'},res);
      assert.equal(res.code,mode==='mock'?200:503);
      assert.equal(res.body.database,'not_probed');
    }
  } finally {
    for (const [key,value] of [['PAYMENTS_MODE',old.p],['GIFT_CARDS_MODE',old.g]]) {
      if(value===undefined) delete process.env[key]; else process.env[key]=value;
    }
  }
});
