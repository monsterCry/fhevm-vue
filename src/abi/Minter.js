export const MinterAddress = {
    '31337':{
        address:'0x5FC8d32690cc91D4c39d9d3abcBD16989F875707'
    },
    '11155111':{
      address:'0x898B729EE884d74c1f18B325D1CB9868c58c0c48'
    }
}
export const MinterABI = {
    abi: [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_monster",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_market",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_fight",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_inventory",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "claimReward",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "gm",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "makeMutation",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "makeRecovery",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        }
      ],
      "name": "mintMonsterEgg",
      "outputs": [],
      "stateMutability": "payable",
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