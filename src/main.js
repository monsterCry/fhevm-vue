import '../public/relayer-sdk-js.umd.cjs'
import { createApp } from 'vue'
import App from './App1.vue'
import { createRouter, createWebHistory } from "vue-router";

import {fhevmMockCreateInstance,createFHEInstance} from './fhevm/mock/fhevmMock';

import Mint from './component/Mint.vue';
import PlayerProfile from './component/PlayerProfile.vue';
import PlayerList from './component/PlayerList.vue';
import About from './component/About.vue';

import {mockContract} from "./fhevm/mock/networks"
import {speContract} from "./fhevm/mock/networks"

const localhost = 'http://localhost:8545'
const spehost = 'https://eth-sepolia.g.alchemy.com/v2/_iXGcHToZonxLc1dSFv_-2ySIeC0_heG'

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

const routes = [
  {
    path: "/",
    children: [
      { path: "", redirect: "/mint" },
      { path: "/mint", component: Mint },
      { path: "/players", component: PlayerList },
      { path: "/profile", component: PlayerProfile },
      { path: "/about", component: About },
    ],
  },
];

const rt = createRouter({
  history: createWebHistory(),
  routes,
});


const app = createApp(App)
    .use(rt)
    .mount('#app')