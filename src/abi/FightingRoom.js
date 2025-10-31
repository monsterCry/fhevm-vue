export const FightingRoomAddress = {
    '31337':{
        address:'0x69bFABf5963A2F712d13b57dF88EDa0a75f934fF'
    },
    '11155111':{
      address:'0x4c582bf5283BD16698E508409446F8368FFcc0f0'
    }
}
export const FightingRoomABI = {
    abi:[
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_cat",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_item",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "HandlesAlreadySavedForRequestID",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidKMSSignatures",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NoHandleFoundForRequestID",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "src",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "dest",
          "type": "address"
        }
      ],
      "name": "BattleComplete",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "requestID",
          "type": "uint256"
        }
      ],
      "name": "DecryptionFulfilled",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "attack",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "requestId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "cleartexts",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "decryptionProof",
          "type": "bytes"
        }
      ],
      "name": "attackResult",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_target",
          "type": "address"
        }
      ],
      "name": "getFightScore",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint64",
              "name": "score",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "win",
              "type": "uint64"
            },
            {
              "internalType": "uint64",
              "name": "total",
              "type": "uint64"
            }
          ],
          "internalType": "struct FightInfo",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "protocolId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    }
  ]
}