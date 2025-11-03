export const FightingRoomAddress = {
    '31337':{
        address:'0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9'
    },
    '11155111':{
      address:'0xEE4EAda1b8e91bBcCac8bC4732e49FE79C3b874A'
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
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_point",
          "type": "uint256"
        }
      ],
      "name": "extendPoint",
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
      "inputs": [
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        }
      ],
      "name": "getPointCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_player",
          "type": "address"
        }
      ],
      "name": "loadAttacks",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "sender",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "win",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "decrypt",
              "type": "bool"
            }
          ],
          "internalType": "struct AttackRequest[]",
          "name": "",
          "type": "tuple[]"
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