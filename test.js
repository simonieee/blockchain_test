const Blockchain = require("./block");

const block = new Blockchain();
block.createNewTransaction(100, "simon", "100원보냄");
block.createNewTransaction(100, "simon", "100원보냄");
block.createNewTransaction(100, "simon", "100원보냄");
block.createNewTransaction(100, "simon", "100원보냄");
block.createNewTransaction(100, "simon", "100원보냄");
block.createNewTransaction(100, "simon", "100원보냄");
block.createNewTransaction(100, "simon", "100원보냄");
block.createNewTransaction(100, "simon", "100원보냄");
block.createNewTransaction(100, "simon", "100원보냄");
// block.createNewTransaction(100, "simon", "100원보냄");
block.createNewBlock();
block.createNewTransaction(100, "simon", "100원보냄");
block.createNewTransaction(100, "simon", "100원보냄");
block.createNewBlock();
block.createNewTransaction(100, "simon", "100원보냄");
block.createNewTransaction(100, "simon", "100원보냄");
block.createNewBlock();
block.createNewTransaction(100, "simon", "100원보냄");
block.createNewTransaction(100, "simon", "100원보냄");
block.createNewBlock();
block.createNewTransaction(100, "simon", "100원보냄");
block.createNewTransaction(100, "simon", "100원보냄");
block.createNewBlock();
block.createNewTransaction(100, "simon", "100원보냄");
block.createNewTransaction(100, "simon", "100원보냄");
block.createNewBlock();
console.log(block);
block.chain[1].blockData[0] = "a00287e2e2a30c442bd1";
block.chain[3].blockData[0] = "a00287e2e2a30c442bd5";
block.chain[4].blockData[1] = "a00323";

var t0 = performance.now();
block.isVaildBlock();
var t1 = performance.now();
console.log("isVaildBlock: " + (t1 - t0) + "ms");
// console.log(block.prevHash(2));
