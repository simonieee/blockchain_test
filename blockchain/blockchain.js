const { sha3_256 } = require("js-sha3");

function Blockchain() {
  this.chain = [];
  this.pendingTransaction = [];
}

Blockchain.prototype.createNewBlock = function (prevBlockHash, hash) {
  //블록 객체 생성
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    hash: hash,
    transactions: this.pendingTransaction,
    prevBlockHash: prevBlockHash,
  };

  this.pendingTransaction = [];
  this.chain.push(newBlock);

  return newBlock;
};

Blockchain.prototype.getLastBlock = function () {
  return this.chain[this.chain.length - 1];
};

Blockchain.prototype.createNewTransaction = function (
  amount,
  sender,
  recipient
) {
  const newTransaction = {
    txId: this.getTxID() + 1,
    amount: amount,
    sender: sender,
    recipient: recipient,
  };

  this.pendingTransaction.push(newTransaction);

  return this.getLastBlock()["index"] + 1;
};

//TxID 구하기
Blockchain.prototype.getTxID = function () {
  let txCount = 0;
  let pendingTxCount = this.pendingTransaction.length;
  // 등록된 트랜잭션 개수
  this.chain.map((block) => {
    txCount += block.transactions.length;
  });
  return txCount + pendingTxCount;
};

// sha3 해시 함수
Blockchain.prototype.blockHash = function (prevBlockHash, currentBlockData) {
  const strData = prevBlockHash + JSON.stringify(currentBlockData);
  const hash = sha3_256(strData).slice(44, 64);

  return hash;
};

// // pow 구현 ... 필요없긴 한데.. 해본다..
// Blockchain.prototype.proofOfWork = function (prevBlockHash, currentBlockData) {
//   let nonce = 0;
//   let hash = this.blockHash(prevBlockHash, currentBlockData, nonce);
//   // 해시값의 1~4번째 자리 수가 0000을 만족할 때까지 실행
//   while (hash.substring(0, 4) != "0000") {
//     nonce++;
//     hash = this.blockHash(prevBlockHash, currentBlockData, nonce);
//   }
//   return nonce;
// };

// genesis block 생성
function Blockchain() {
  this.chain = [];
  this.pendingTransaction = [];
  this.createNewBlock("0x00000000000000000000", "f1522ace10983a13681a");
}

// 트랜잭션 사이즈 1MB 넘으면 다음 블록생성까지 대기....
// 트랜잭션 사이즈 체크....
// 트랜잭션 머클트리로 구현.....

module.exports = Blockchain;
