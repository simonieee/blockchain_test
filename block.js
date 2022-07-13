const { sha3_256 } = require("js-sha3");
const { MerkleTree } = require("merkletreejs");

function Blockchain() {
  this.chain = [];
  this.pendingTx = [];
}

// 제네시스 블록 생성
Blockchain.prototype.createGenesis = function () {
  const blockData = ["genesis block"];
  const genesis = {
    blockID: 0x0,
    prevBlockHash: "0x00000000000000000000",
    merkleRoot: this.createMerkleTree(blockData),
    blockData: blockData,
  };

  this.chain.push(genesis);
};

// 블록 생성
Blockchain.prototype.createNewBlock = function () {
  const newBlock = {
    blockID: this.chain.length,
    prevBlockHash: this.getLastBlockHash(),
    merkleRoot: this.createMerkleTree(this.pendingTx),
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
    prevBlock.prevBlockHash +
    prevBlock.merkleRoot;
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
    block.blockID +
    JSON.stringify(block.blockData) +
    block.prevBlockHash +
    block.merkleRoot;
  const hash = sha3_256(strData).slice(44, 64);
  return hash;
};

// 블럭 검증
Blockchain.prototype.isVaildBlock = function () {
  const block = this.chain;
  for (const b of block) {
    if (this.getLastBlock()["blockID"] !== b.blockID) {
      const hash = this.blockHash(b.blockID); // 현재 블록 해시
      const prevHash = this.getPrevHash(b.blockID + 1); // 다음 블록이 가지고 있는 이전 블록 해시
      const merkleRoot = this.createMerkleTree(b.blockData);
      if (hash !== prevHash) {
        console.log(
          `---------------------------------------------${b.blockID}번 블록 검증---------------------------------------------`
        );
        console.log(
          b.blockID,
          "번째 블록 hash 값:",
          "\x1b[31m",
          hash,
          "\x1b[0m"
        );
        console.log(
          b.blockID + 1,
          "번째 블록 prevHash 값:",
          "\x1b[31m",
          prevHash,
          "\x1b[0m"
        );
        console.log(
          b.blockID,
          "번째 블록 MerkleRoot: ",
          "\x1b[31m",
          b.merkleRoot,
          "\x1b[0m"
        );
        console.log(
          b.blockID,
          "번째 블록 수정 후 MerkleRoot: ",
          "\x1b[31m",
          merkleRoot,
          "\x1b[0m"
        );
        console.log(
          b.blockID,
          "\x1b[31m",
          "번째 블록이 위변조 되었습니다.",
          "\x1b[0m"
        );
        console.log(
          "-------------------------------------------------------------------------------------------------------"
        );
      }
    }
  }
};

Blockchain.prototype.isVaildBlock2 = function () {
  const block = this.chain;
  block.map((b) => {
    if (this.getLastBlock()["blockID"] !== b.blockID) {
      const hash = this.blockHash(b.blockID); // 현재 블록 해시
      const prevHash = this.getPrevHash(b.blockID + 1); // 다음 블록이 가지고 있는 이전 블록 해시\
      const merkleRoot = this.createMerkleTree(b.blockData);
      if (hash !== prevHash) {
        console.log(
          `---------------------------------------------${b.blockID}번 블록 검증---------------------------------------------`
        );
        console.log(
          b.blockID,
          "번째 블록 hash 값:",
          "\x1b[31m",
          hash,
          "\x1b[0m"
        );
        console.log(
          b.blockID + 1,
          "번째 블록 prevHash 값:",
          "\x1b[31m",
          prevHash,
          "\x1b[0m"
        );
        console.log(
          b.blockID,
          "번째 블록 MerkleRoot: ",
          "\x1b[31m",
          b.merkleRoot,
          "\x1b[0m"
        );
        console.log(
          b.blockID,
          "번째 블록 수정 후 MerkleRoot: ",
          "\x1b[31m",
          merkleRoot,
          "\x1b[0m"
        );
        console.log(
          b.blockID,
          "\x1b[31m",
          "번째 블록이 위변조 되었습니다.",
          "\x1b[0m"
        );
        console.log(
          "-------------------------------------------------------------------------------------------------------"
        );
      }
    }
  });
};

// 머클루트 생성
Blockchain.prototype.createMerkleTree = function (blockData) {
  const merkleTree = new MerkleTree(blockData, sha3_256);
  const merkleRoot = merkleTree.getRoot().toString("hex");
  return merkleRoot;
};

// merkletreejs 사용 검증
Blockchain.prototype.merkleVaild = function () {
  const block = this.chain;
  block.map((b) => {
    const merkleTree = new MerkleTree(b.blockData, sha3_256);
    const newMerkleRoot = merkleTree.getRoot().toString("hex");
    const oldMerkleRoot = b.merkleRoot;
    // let verify = true;
    // b.blockData.forEach((blockData) => {
    //   const leaf = blockData;
    //   const proof = merkleTree.getProof(leaf);
    //   const result = merkleTree.verify(proof, leaf, oldMerkleRoot);
    //   if (result === false) {
    //     verify = false;
    //   }
    // });
    let verify = b.blockData.some((x) => {
      const leaf = x;
      const proof = merkleTree.getProof(leaf);
      const result = merkleTree.verify(proof, leaf, oldMerkleRoot);
      return result === true;
    });

    if (verify === false) {
      console.log(
        `---------------------------------------------${b.blockID}번 블록 검증---------------------------------------------`
      );
      console.log("수정 후 머클루트: ", "\x1b[31m", newMerkleRoot, "\x1b[0m");
      console.log("수정 전 머클루트: ", "\x1b[31m", oldMerkleRoot, "\x1b[0m");
      console.log(
        b.blockID,
        "\x1b[31m",
        "번째 블록이 위변조 되었습니다.",
        "\x1b[0m"
      );
      console.log(
        "-------------------------------------------------------------------------------------------------------"
      );
    }
  });
};

// 머클트리 단순 검증
Blockchain.prototype.merkleVaild2 = function () {
  const block = this.chain;
  block.map((b) => {
    const merkleTree = new MerkleTree(b.blockData, sha3_256);
    const newMerkleRoot = merkleTree.getRoot().toString("hex");
    const oldMerkleRoot = b.merkleRoot;
    if (newMerkleRoot !== oldMerkleRoot) {
      console.log(
        `---------------------------------------------${b.blockID}번 블록 검증---------------------------------------------`
      );
      console.log("수정 후 머클루트: ", "\x1b[31m", newMerkleRoot, "\x1b[0m");
      console.log("수정 전 머클루트: ", "\x1b[31m", oldMerkleRoot, "\x1b[0m");
      console.log(
        b.blockID,
        "\x1b[31m",
        "번째 블록이 위변조 되었습니다.",
        "\x1b[0m"
      );
      console.log(
        "-------------------------------------------------------------------------------------------------------"
      );
    }
  });
};

module.exports = Blockchain;
