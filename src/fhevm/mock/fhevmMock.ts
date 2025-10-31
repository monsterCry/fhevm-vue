//////////////////////////////////////////////////////////////////////////
//
// WARNING!!
// ALWAY USE DYNAMICALLY IMPORT THIS FILE TO AVOID INCLUDING THE ENTIRE 
// FHEVM MOCK LIB IN THE FINAL PRODUCTION BUNDLE!!
//
//////////////////////////////////////////////////////////////////////////

import { JsonRpcProvider } from "ethers";
import { MockFhevmInstance } from "@fhevm/mock-utils";

import {
  initSDK,
  createInstance,
  SepoliaConfig,
  FhevmInstance
} from '@zama-fhe/relayer-sdk/bundle';

const fhevmMockCreateInstance = async (parameters: {
  rpcUrl: string;
  chainId: number;
  metadata: {
    ACLAddress: `0x${string}`;
    InputVerifierAddress: `0x${string}`;
    KMSVerifierAddress: `0x${string}`;
  };
}): Promise<FhevmInstance> => {
  const provider = new JsonRpcProvider(parameters.rpcUrl);
  const instance = await MockFhevmInstance.create(provider, provider, {
    //aclContractAddress: "0x50157CFfD6bBFA2DECe204a89ec419c23ef5755D",
    aclContractAddress: parameters.metadata.ACLAddress,
    chainId: parameters.chainId,
    gatewayChainId: 55815,
    // inputVerifierContractAddress: "0x901F8942346f7AB3a01F6D7613119Bca447Bb030",
    // kmsContractAddress: "0x1364cBBf2cDF5032C47d8226a6f6FBD2AFCDacAC",
    inputVerifierContractAddress: parameters.metadata.InputVerifierAddress,
    kmsContractAddress: parameters.metadata.KMSVerifierAddress,
    verifyingContractAddressDecryption:
      "0x5ffdaAB0373E62E2ea2944776209aEf29E631A64",
    verifyingContractAddressInputVerification:
      "0x812b06e1CDCE800494b79fFE4f925A504a9A9810",
  });
  return instance;
};

const fheUserDeccrypt = async (instance,contractAddress,ciphertextHandle,signer) => {
  const keypair = instance.generateKeypair();

  const startTimeStamp = Math.floor(Date.now() / 1000).toString();
  const durationDays = '10';
  const contractAddresses = [contractAddress];

  const eip712 = instance.createEIP712(
    keypair.publicKey,
    contractAddresses,
    startTimeStamp,
    durationDays,
  );

  const signature = await signer.signTypedData(
    eip712.domain,
    {
      UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification,
    },
    eip712.message,
  );

  let decryptedValues = [];
  for(let i = 0; i < ciphertextHandle.length; i++) {
    console.log(ciphertextHandle[i],contractAddress)
    const handleContractPairs = [
      {
        handle: ciphertextHandle[i],
        contractAddress: contractAddress,
      },
    ];
    const result = await instance.userDecrypt(
      handleContractPairs,
      keypair.privateKey,
      keypair.publicKey,
      signature.replace('0x', ''),
      contractAddresses,
      signer.address,
      startTimeStamp,
      durationDays,
    );

    const decryptedValue = result[ciphertextHandle[i]];
    decryptedValues.push(decryptedValue)    
  }
  return decryptedValues;
}
const createFHEInstance = async (parameters: {
  rpcUrl: string;
  chainId: number;
  metadata: {
    ACLAddress: `0x${string}`;
    InputVerifierAddress: `0x${string}`;
    KMSVerifierAddress: `0x${string}`;
  };
}): Promise<FhevmInstance> => {
  // const instance = await createInstance({
  //   aclContractAddress: parameters.metadata.ACLAddress,
  //   chainId: parameters.chainId,
  //   gatewayChainId: 55815,
  //   inputVerifierContractAddress: parameters.metadata.InputVerifierAddress,
  //   kmsContractAddress: parameters.metadata.KMSVerifierAddress,
  //   verifyingContractAddressDecryption:
  //     "0xb6E160B1ff80D67Bfe90A85eE06Ce0A2613607D1",
  //   verifyingContractAddressInputVerification:
  //     "0x7048C39f048125eDa9d678AEbaDfB22F7900a29F",
  //     // Optional RPC provider to host chain
  //   network: 'https://eth-sepolia.public.blastapi.io',
  //   // Relayer URL
  //   relayerUrl: 'https://relayer.testnet.zama.cloud',
  // });
  await initSDK();

  const config = SepoliaConfig;
  config.network = 'https://eth-sepolia.public.blastapi.io';
  const instance = await createInstance(config);
  return instance;
};
export {fhevmMockCreateInstance,fheUserDeccrypt,createFHEInstance}
