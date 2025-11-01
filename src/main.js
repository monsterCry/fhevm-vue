import '../public/relayer-sdk-js.umd.cjs'
import { createApp } from 'vue'
import App from './App.vue'

import {fhevmMockCreateInstance,createFHEInstance} from './fhevm/mock/fhevmMock';
import { createMemoryHistory, createRouter } from 'vue-router'


import {mockContract} from "./fhevm/mock/networks"
import {speContract} from "./fhevm/mock/networks"

const localhost = 'http://localhost:8545'
const spehost = 'https://eth-sepolia.public.blastapi.io'

// const curNet = {
//     chainId: 11155111,
//     metadata: speContract,
//     rpcUrl: spehost,
//     instance: createFHEInstance
// }

const curNet = {
    chainId: 31337,
    metadata: mockContract,
    rpcUrl: localhost,
    instance: fhevmMockCreateInstance
}


curNet.instance({
    rpcUrl:curNet.rpcUrl,
    chainId:curNet.chainId,
    metadata: curNet.metadata
}).then((instance)=>{
    window.fhevmInstance = instance;
});

const app = createApp(App)
    .mount('#app')