const { sha3_256 } = require("js-sha3");

const bufferID = Buffer.alloc(160);

const genesis = {
  blockID: 0x0,
  prevBlockHash: "0x00000000000000000000",
  blockData: ["Genesis Block"],
};

function Blockchain() {
  this.chain = [genesis];
  this.pendingTx = [];
}

// 블록 생성
Blockchain.prototype.createNewBlock = function () {
  const newBlock = {
    blockID: this.chain.length,
    prevBlockHash: this.getLastBlockHash(),
    blockData: this.pendingTx,
  };

  this.pendingTx = [];
  this.chain.push(newBlock);

  return newBlock;
};

// 마지막 블록 조회
Blockchain.prototype.getLastBlock = function () {
  return this.chain[this.chain.length - 1];
};

// 트랜잭션 ID 구하기
Blockchain.prototype.getTxID = function () {
  let txCount = 0;
  let pendingTxCount = this.pendingTx.length;
  this.chain.map((block) => {
    txCount += block.blockData.length;
  });
  return txCount + pendingTxCount;
};

// 트랜잭션 생성
Blockchain.prototype.createNewTransaction = function (
  amount,
  sender,
  recipient
) {
  const newTransaction = {
    txID: this.getTxID() + 1,
    amount: amount,
    sender: sender,
    recipient: recipient,
  };
  const txString =
    newTransaction.txID.toString() +
    newTransaction.amount +
    newTransaction.sender +
    newTransaction.recipient;
  const txHash = sha3_256(txString).slice(44, 64);
  this.pendingTx.push(txHash);
  return this.getLastBlock()["blockID"] + 1;
};

// 마지막 블록 hash값 조회
Blockchain.prototype.getLastBlockHash = function () {
  const prevBlock = this.getLastBlock();
  const strData =
    prevBlock.blockID.toString() +
    JSON.stringify(prevBlock.blockData) +
    prevBlock.prevBlockHash;
  const hash = sha3_256(strData).slice(44, 64);
  return hash;
};

// 이전블록 해시값 조회
Blockchain.prototype.getPrevHash = function (blockID) {
  const [block] = this.chain.filter((item) => item.blockID == blockID);
  if (block !== "undefined") {
    return block.prevBlockHash;
  }
};

// blockID 값과 일치하는 블록 해시값 조회
Blockchain.prototype.blockHash = function (blockID) {
  const [block] = this.chain.filter((item) => item.blockID === blockID);
  const strData =
    block.blockID + JSON.stringify(block.blockData) + block.prevBlockHash;
  const hash = sha3_256(strData).slice(44, 64);
  return hash;
};

// 블럭 검증
Blockchain.prototype.isVaildBlock = function () {
  const block = this.chain;
  block.map((b) => {
    // 마지막 블럭 전까지 실행.... 마지막 블록이 변조되면 어쩌지???
    if (this.getLastBlock()["blockID"] !== b.blockID) {
      const hash = this.blockHash(b.blockID); // 현재 블록 해시
      const prevHash = this.getPrevHash(b.blockID + 1); // 다음 블록이 가지고 있는 이전 블록 해시
      if (hash !== prevHash) {
        console.log(b.blockID, "번째 블록 hash 값:", hash);
        console.log(b.blockID + 1, "번째 블록 prevHash 값:", prevHash);
        console.log(b.blockID, "번째 블록이 위변조 되었습니다.");
        return b.blockID;
      }
    }
  });
};

module.exports = Blockchain;
