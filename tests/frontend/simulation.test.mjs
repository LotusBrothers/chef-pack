import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newGame,playRound,decide,loadGame,saveGame,sellValue,COST,TIERS} from '../../prototype/simulation.mjs';
const brands=[{id:'one',name:'One'},{id:'two',name:'Two'}];
test('all one hundred draws match the published card distribution; opening only spends the pack price',()=>{
  const counts = new Map();
  for(let roll=0;roll<100;roll++){
    const s=newGame(), result=playRound(s,brands,n=>n===100?roll:1), r=result.history[0];
    counts.set(r.tier.credits,(counts.get(r.tier.credits)||0)+1);
    assert.equal(result.balance,100-COST); assert.equal(r.status,'open'); assert.equal(result.plays,1); assert.equal(r.brand.id,'two'); assert.equal(s.balance,100); assert.equal(s.history.length,0);
  }
  assert.deepEqual([...counts],[[20,75],[30,18],[40,6],[100,1]]);
  assert.ok(TIERS.every(t=>t.credits>=COST),'every card is worth at least the pack price');
});
test('each card is decided once: sell back pays 90% in credits, redeem pays nothing',()=>{
  assert.deepEqual(TIERS.map(t=>sellValue(t.credits)),[18,27,36,90]);
  const opened=playRound(newGame(),brands,n=>n===100?80:0), card=opened.history[0];
  assert.equal(card.tier.name,'Foil');
  const sold=decide(opened,card.number,'sell');
  assert.equal(sold.balance,opened.balance+27); assert.equal(sold.history[0].status,'sold');
  assert.equal(decide(sold,card.number,'sell'),null); assert.equal(decide(sold,card.number,'redeem'),null);
  const kept=decide(opened,card.number,'redeem');
  assert.equal(kept.balance,opened.balance); assert.equal(kept.history[0].status,'redeemed');
  assert.equal(decide(kept,card.number,'sell'),null);
  assert.equal(decide(opened,999,'sell'),null); assert.equal(decide(opened,card.number,'cash'),null);
});
test('insufficient credits cannot draw; storage resumes the exact outcome; history is bounded',()=>{
  let draws=0;assert.equal(playRound({...newGame(),balance:COST-1},brands,()=>{draws++;return 0}),null);assert.equal(draws,0);
  let s={...newGame(),balance:10000};for(let i=0;i<40;i++)s=playRound(s,brands,n=>n===100?99:0);
  assert.equal(s.history.length,30);assert.equal(s.plays,40);
  s=decide(s,40,'sell');
  let raw;const storage={setItem:(k,v)=>raw=v,getItem:()=>raw};assert.equal(saveGame(s,storage),true);assert.deepEqual(loadGame(storage),JSON.parse(JSON.stringify(s)));
  raw='broken';assert.deepEqual(loadGame(storage),newGame());
  raw=JSON.stringify({...s,history:[{...s.history[0],status:'cashed'}]});assert.deepEqual(loadGame(storage),newGame());
});
