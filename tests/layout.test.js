import test from "node:test";
import assert from "node:assert/strict";
import { getRingPositions } from "../js/viz/layout.js";

//checks two decinmals are close (same func as the last one)
function assertClose(actual,expected){
    assert.ok(Math.abs(actual-expected)<0.001,`${actual} is not ${expected}`);
}
test("gives as many positions as we ask for", () => {
  assert.equal(getRingPositions(12, 0, 0, 100).length, 12);
  assert.equal(getRingPositions(0, 0, 0, 100).length, 0);
});
test("first dot is at the top of ring",()=>{
    const first = getRingPositions(12,200,150,100)[0];
    assertClose(first.x,200);
    assertClose(first.y,50); //150-100 = straight up 
})
test("4 dots land on top, right, bottom and left", () => {
  const [top, right, bottom, left] = getRingPositions(4, 0, 0, 10);
  assertClose(top.y, -10);
  assertClose(right.x, 10);
  assertClose(bottom.y, 10);
  assertClose(left.x, -10);
});
test("every dot is the same dist from center",()=>{
    for(const position of getRingPositions(12,50,50,80)){
        const distance = Math.hypot(position.x-50,position.y-50);
        assertClose(distance,80);
    }
})