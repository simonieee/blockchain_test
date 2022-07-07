var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var Blockchain = require("./blockchain");
var block = new Blockchain();

app.get("/blockchain", function (req, res) {
  res.send(block);
});

app.post("/transaction", function (req, res) {
  const blockIndex = block.createNewTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );
  res.json({ note: `트랜잭션발생 ... ${blockIndex} 블록으로 생성될 예정` });
});

app.get("/mine", function (req, res) {
  const lastBlock = block.getLastBlock();
  const prevBlockHash = lastBlock["hash"];
  const currentBlockData = {
    transactions: block.pendingTransaction,
    index: lastBlock["index"] + 1,
  };

  const blockHash = block.blockHash(prevBlockHash, currentBlockData);
  const newBlock = block.createNewBlock(prevBlockHash, blockHash);
  res.json({ note: "채굴 성공", newBlock: newBlock });
});

app.listen(3000, function () {
  console.log("listening on port 3000");
});
