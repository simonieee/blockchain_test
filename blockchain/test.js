const Blockchain = require("./blockchain");

const block = new Blockchain();

const prevBlockHash = "abcdef123456";
const currentBlockData = [
  {
    txId: 4,
    amount: 110,
    sender: "Simon",
    recipient: "simon2132134",
  },
  {
    txId: 5,
    amount: 10,
    sender: "simon",
    recipient: "simon21434",
  },
  {
    txId: 6,
    amount: 1210,
    sender: "simon",
    recipient: "simon213134",
  },
];
