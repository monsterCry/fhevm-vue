<template>
  <div class="min-h-screen w-full bg-[#111215] text-white flex flex-col">

    <header class="w-full border-b border-white/5 bg-black/20 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-6 py-4 grid grid-cols-3 items-center">

     
        <div class="text-xl font-bold tracking-wide">
          Evolving Monster
        </div>

    
        <nav class="flex items-center justify-center gap-8 text-sm font-semibold">
          <router-link
            v-for="item in navItems"
            :key="item.name"
            :to="item.to"
            class="nav-link"
            :class="{ 'is-active': current === item.name }"
            @click="navigate(item.name)"
          >
            {{ item.label }}
          </router-link>
        </nav>

   
        <div class="flex justify-end">
          <button
            @click="connectWallet"
            class="px-5 py-2 rounded-xl bg-[#2b3245] hover:bg-[#3b445f] text-sm font-semibold shadow transition"
          >
            {{ walletAddress ? shortAddress : "CONNECT WALLET" }}
          </button>
        </div>

      </div>
    </header>

    <main class="flex-1 w-full">
      <div class="max-w-7xl mx-auto px-6 py-10">
        <transition :name="transitionName" mode="out-in">
          <router-view :wallet="walletAddress" :commonComp="commonComp"/>
        </transition>
      </div>
    </main>

  </div>

  <GlobalLoading
        :model-value="globalLoading"
        :title="loadingTitle"
        :message="loadingMessage"
        @update:modelValue="globalLoading = $event"
    />

    <GlobalError
        :model-value="globalError"
        :title="errorTitle"
        :message="errorMessage"
        :footer="errorFooter"
        @update:modelValue="globalError = $event"
        />
  <div id="spriteContainer"></div>
</template>

<script setup>
import { ref, computed, watch,onMounted } from "vue";
import { useRoute } from "vue-router";
import GlobalLoading from './component/GlobalLoading.vue'
import GlobalError from "./component/GlobalError.vue";
import { createAppKit,useAppKit,useDisconnect,useAppKitProvider } from '@reown/appkit/vue'
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { sepolia } from "@reown/appkit/networks";
import { BrowserProvider, Contract } from "ethers";

import { defineChain } from '@reown/appkit/networks';
import { customNet } from './fhevm/mock/networks'

import {EvolvAddress,EvolvABI} from './abi/EvolvMonster';
import {FightingRoomABI,FightingRoomAddress} from './abi/FightingRoom';
import {CountABI,CountAddress} from './abi/Counter';
import {GeneMarketplaceABI,GeneMarketplaceAddress} from './abi/GeneMarketplace';
import {InventoryABI,InventoryAddress} from './abi/Inventory';
import {MinterABI,MinterAddress} from './abi/Minter';

const globalError = ref(false);
const errorTitle = ref("");
const errorMessage = ref("");
const errorFooter = ref("");

const globalLoading = ref(false);
const loadingTitle = ref("");
const loadingMessage = ref("");
const walletAddress = ref("");
let atlas;

const commonOpt = async(title,msg,func) => {
  try {
    showLoading(title,msg);
    await func();
    hideLoading();
  } catch(e) {
    console.error(e)
    hideLoading();
    showError(title + ' Error ',e,'');
  }
}

function showError(title, message, footer = "") {
  errorTitle.value = title;
  errorMessage.value = message;
  errorFooter.value = footer;
  globalError.value = true;
}

function hideError() {
  globalError.value = false;
}

function showLoading(title = "Processing...", message = "") {
  loadingTitle.value = title;
  loadingMessage.value = message;
  globalLoading.value = true;
}

function hideLoading() {
  globalLoading.value = false;
  loadingTitle.value = "";
  loadingMessage.value = "";
}
/**
 *   arm:'arm_darkC',
  body:'body_darkF',
  eye:'eye_yellow',
  leg:'leg_whiteA',
  mouth:'mouth_closed_fangs',
  nose:'nose_red',
 * 
 */
const drawPlayer = async(player, elem) => {
    const canvas = document.getElementById(elem);
    const ctx = canvas.getContext('2d');
    let mouth = atlas.sprites[player.mouth + '.png'];
    let body = atlas.sprites[player.body + '.png'];
    let leg = atlas.sprites[player.leg + '.png'];
    ctx.drawImage(
        atlas.image,
        leg.x, leg.y, leg.width, leg.height,
        body.width / 2 + leg.width / 6, body.height * 0.8, leg.width, leg.height
    );
    let arm = atlas.sprites[player.arm + '.png'];
    ctx.drawImage(
        atlas.image,
        arm.x, arm.y, arm.width, arm.height,
        body.width / 2 + arm.width / 8, body.height / 3, arm.width, arm.height
    );
    ctx.drawImage(
        atlas.image,
        body.x, body.y, body.width, body.height,
        0, 0, body.width, body.height
    );
    ctx.drawImage(
        atlas.image,
        mouth.x, mouth.y, mouth.width, mouth.height,
        body.width / 2 - mouth.width / 2, body.height * 3 / 5, mouth.width, mouth.height
    );
    let nose = atlas.sprites[player.nose + '.png'];
    ctx.drawImage(
        atlas.image,
        nose.x, nose.y, nose.width, nose.height,
        body.width / 2 - nose.width / 2, body.height * 3 / 7, nose.width, nose.height
    );
    let eye = atlas.sprites[player.eye + '.png'];
    ctx.drawImage(
        atlas.image,
        eye.x, eye.y, eye.width, eye.height,
        body.width / 2 - eye.width / 2, body.height * 1 / 7, eye.width, eye.height
    );
};

const commonComp = ref({
  commonOpt,
  drawPlayer
})

const connectWallet = async () => {
  open();
};

const shortAddress = computed(() =>
  walletAddress.value
    ? walletAddress.value.slice(0, 6) + "..." + walletAddress.value.slice(-4)
    : ""
);


const navItems = [
  { name: "mint", label: "Mint", to: "/mint" },
  { name: "players", label: "Players", to: "/players" },
  { name: "profile", label: "Profile", to: "/profile" },
  { name: "about", label: "About", to: "/about" },
];

const order = navItems.map((n) => n.name); // ["mint","players","profile"]

const route = useRoute();
const current = ref("mint");
const previous = ref("mint");
const transitionName = ref("slide-left");

watch(
  () => route.path,
  (newPath) => {
    let name = newPath.replace("/", "");
    if (!name) name = "mint";

    previous.value = current.value;
    current.value = name;

    const oldIdx = order.indexOf(previous.value);
    const newIdx = order.indexOf(current.value);

    if (oldIdx === -1 || newIdx === -1) {
      transitionName.value = "slide-left";
    } else {
      transitionName.value = newIdx > oldIdx ? "slide-left" : "slide-right";
    }
  },
  { immediate: true }
);

const navigate = (name) => {
  previous.value = current.value;
  current.value = name;
};


const customNetwork = defineChain(customNet);

const projectId = 'a84a612db0164bf224ae42d5da621bb3'
const metadata = {
  name: 'AppKit',
  description: 'Evolving Monster',
  url: 'https://fhevm-vue.vercel.app', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}
const networks = [customNetwork]
const eap = new EthersAdapter()
const appkit = createAppKit({
  adapters: [eap],
  networks,
  projectId,
  metadata,
  themeMode: 'light',
  features: {
    connectMethodsOrder: ["wallet"],
    analytics: false 
  }
})
const { open } = useAppKit()
const { disconnect } = useDisconnect()

window.fhevmObject = {};

onMounted(async ()=>{
  await appkit.ready();
  if(appkit.getAddress() == undefined) {
    return;
  }
  try {
    atlas = await loadAtlas('/spritesheet_double.xml','/spritesheet_double.png')
  } catch(e) {
    console.error(e)
  }
});
appkit.subscribeState(async (sta)=>{
  try {
    if(!sta.initialized) {
        return;
      }
      const { walletProvider } = useAppKitProvider("eip155");
      if(walletProvider == undefined) {
        return;
      }
      const ethersProvider = new BrowserProvider(walletProvider);
      let signer = await ethersProvider.getSigner(); 
      let wallet = signer.address;
      walletAddress.value = wallet;
      window.fhevmObject.minterContract = new Contract(MinterAddress[customNetwork.id + ''].address, MinterABI.abi, signer);
      window.fhevmObject.monsterContract = new Contract(EvolvAddress[customNetwork.id + ''].address, EvolvABI.abi, signer);
      window.fhevmObject.fightRoomContract = new Contract(FightingRoomAddress[customNetwork.id + ''].address, FightingRoomABI.abi, signer);
      window.fhevmObject.counterContract = new Contract(CountAddress[customNetwork.id + ''].address, CountABI.abi, signer);
      window.fhevmObject.marketContrat = new Contract(GeneMarketplaceAddress[customNetwork.id + ''].address, GeneMarketplaceABI.abi, signer);
      window.fhevmObject.inventoryContrat = new Contract(InventoryAddress[customNetwork.id + ''].address, InventoryABI.abi, signer);
      window.fhevmObject.fhevmSigner = signer;
  } catch(e) {
    console.error(e)
  }
});


const loadAtlas = async (xmlUrl, imageUrl) => {
    try {
        // load XML
        const xmlResponse = await fetch(xmlUrl);
        const xmlText = await xmlResponse.text();
        
        // load image
        const image = new Image();
        image.src = imageUrl;
        
        await new Promise((resolve, reject) => {
            image.onload = resolve;
            image.onerror = reject;
        });

        // parse XML
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        const sprites = {};

        const subTextures = xmlDoc.getElementsByTagName("SubTexture");
        for (let sprite of subTextures) {
            sprites[sprite.getAttribute("name")] = {
                name: sprite.getAttribute("name"),
                x: parseInt(sprite.getAttribute("x")),
                y: parseInt(sprite.getAttribute("y")),
                width: parseInt(sprite.getAttribute("width")),
                height: parseInt(sprite.getAttribute("height"))
            };
        }

        const atlas = { image, sprites };
        return atlas;
    } catch (error) {
        console.error('load image failed:', error);
        throw error;
    }
}
</script>

<style scoped>

:host {
  background-image: linear-gradient(
      45deg, rgba(255,255,255,0.03) 25%, transparent 25%
    ),
    linear-gradient(-45deg, rgba(255,255,255,0.03) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.03) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.03) 75%);
  background-size: 40px 40px;
}


.nav-link {
  position: relative;
  padding-bottom: 4px;
  transition: color 0.25s ease;
}

.nav-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 100%;
  background: #ff4f6d;
  transform-origin: center;
  transform: scaleX(0);
  transition: transform 0.25s ease;
}

.nav-link:hover {
  color: #ff8ca0;
}

.nav-link.is-active {
  color: #ff4f6d;
}

.nav-link.is-active::after {
  transform: scaleX(1);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(40px);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.35s ease;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-40px);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(40px);
}
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.35s ease;
}
</style>
