export const customNet = {
  id: 31337,
  name: 'Custom Network',
  caipNetworkId: 'eip155:31337',
  chainNamespace: 'eip155',
  nativeCurrency: { name: 'Example', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
  },
  blockExplorers: {
  },
  contracts: {
  },
};

export const mockContract = {
    ACLAddress: `0x50157CFfD6bBFA2DECe204a89ec419c23ef5755D`,
    InputVerifierAddress: `0x901F8942346f7AB3a01F6D7613119Bca447Bb030`,
    KMSVerifierAddress: `0x1364cBBf2cDF5032C47d8226a6f6FBD2AFCDacAC`,
};

export const speContract = {
    ACLAddress: `0x687820221192C5B662b25367F70076A37bc79b6c`,
    InputVerifierAddress: `0xbc91f3daD1A5F19F8390c400196e58073B6a0BC4`,
    KMSVerifierAddress: `0x1364cBBf2cDF5032C47d8226a6f6FBD2AFCDacAC`,
};


