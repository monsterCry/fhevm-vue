export const MinterAddress = {
    '31337':{
        address:'0x5FC8d32690cc91D4c39d9d3abcBD16989F875707'
    },
    '11155111':{
      address:'0x72f5947211dB52BBF4E5Ec58c0151f8eD01ab566'
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
      "stateMutability": "nonpayable",
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