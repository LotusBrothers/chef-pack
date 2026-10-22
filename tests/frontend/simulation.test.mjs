import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newGame,playRound,loadGame,saveGame} from '../../prototype/simulation.mjs';
const brands=[{id:'one',name:'One'},{id:'two',name:'Two'}];
test('all one hundred draws match the published reward distribution and accounting',()=>{
  const counts = new Map();
  for(let roll=0;roll<100;roll++){
    const s=newGame(), result=playRound(s,brands,n=>n===100?roll:1), r=result.history[0];
    counts.set(r.reward.credits,(counts.get(r.reward.credits)||0)+1);
    assert.equal(result.balance,90+r.reward.credits); assert.equal(result.plays,1); assert.equal(r.brand.id,'two'); assert.equal(s.balance,100); assert.equal(s.history.length,0);
  }
  assert.deepEqual([...counts],[[5,70],[15,25],[50,5]]);
});
test('insufficient credits cannot draw; storage resumes the exact outcome; history is bounded',()=>{
  let draws=0;assert.equal(playRound({...newGame(),balance:9},brands,()=>{draws++;return 0}),null);assert.equal(draws,0);
  let s=newGame();for(let i=0;i<40;i++)s=playRound(s,brands,n=>n===100?99:0);
  assert.equal(s.history.length,30);assert.equal(s.plays,40);
  let raw;const storage={setItem:(k,v)=>raw=v,getItem:()=>raw};assert.equal(saveGame(s,storage),true);assert.deepEqual(loadGame(storage),JSON.parse(JSON.stringify(s)));
  raw='broken';assert.deepEqual(loadGame(storage),newGame());
});

