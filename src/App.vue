<script lang="ts" setup>
import { ref,onMounted} from 'vue'
import axios from 'axios';
import { createAppKit,useAppKit,useDisconnect } from '@reown/appkit/vue'
import { type  AppKitNetwork } from '@reown/appkit/networks'
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { sepolia } from "@reown/appkit/networks";

import { defineChain } from '@reown/appkit/networks';
import { customNet } from './fhevm/mock/networks'
import { fheUserDeccrypt, createFHEInstance} from './fhevm/mock/fhevmMock'

import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/vue";
import { BrowserProvider, Contract, formatUnits } from "ethers";

import {EvolvAddress,EvolvABI} from './abi/EvolvMonster';
import {FightingRoomABI,FightingRoomAddress} from './abi/FightingRoom';
import {CountABI,CountAddress} from './abi/Counter';

import {GeneMarketplaceABI,GeneMarketplaceAddress} from './abi/GeneMarketplace';
import {InventoryABI,InventoryAddress} from './abi/Inventory';

import {MinterABI,MinterAddress} from './abi/Minter';

const customNetwork = sepolia;//defineChain(customNet);
const projectId = 'a84a612db0164bf224ae42d5da621bb3'
const metadata = {
  name: 'AppKit',
  description: 'AppKit Example',
  url: 'https://example.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [customNetwork]
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
const minted = ref(false);
let signer;
let minterContract;
let monsterContract;
let fightRoomContract;
let counterContract;
let marketContrat;
let inventoryContrat;
console.log(customNetwork.id)
onMounted(async ()=>{
  await appkit.ready();
  if(appkit.getAddress() == undefined) {
    return;
  }
});

const loadProper = async(monster)=>{
  console.log('loadProper',monster);
  appData.value.player.hasEgg = true/*monster[3]*/;
  appData.value.player.encrypt = {
      attack: monster[0][0],
      magic: monster[0][1],
      defense: monster[0][2],    
  };
  appData.value.player.name = monster[2]  
}

appkit.subscribeState(async (sta)=>{

  if(!sta.initialized) {
    return;
  }
  const { walletProvider } = useAppKitProvider("eip155");
  if(walletProvider == undefined) {
    return;
  }

  const ethersProvider = new BrowserProvider(walletProvider);
  signer = await ethersProvider.getSigner(); 
  let wallet = signer.address;
  appData.value.player.address = short(wallet);
  
  if (appData.value.player.nameInput) {
    appData.value.player.name = appData.value.player.nameInput;
  }
  
  minterContract = new Contract(MinterAddress[customNetwork.id + ''].address, MinterABI.abi, signer);
  monsterContract = new Contract(EvolvAddress[customNetwork.id + ''].address, EvolvABI.abi, signer);
  fightRoomContract = new Contract(FightingRoomAddress[customNetwork.id + ''].address, FightingRoomABI.abi, signer);
  counterContract = new Contract(CountAddress[customNetwork.id + ''].address, CountABI.abi, signer);
  marketContrat = new Contract(GeneMarketplaceAddress[customNetwork.id + ''].address, GeneMarketplaceABI.abi, signer);
  inventoryContrat = new Contract(InventoryAddress[customNetwork.id + ''].address, InventoryABI.abi, signer);

  let poffer = await marketContrat.palyerOffers(0);
  let offer = await marketContrat.palyerOwnerOffers(0);
  console.log('poffer',poffer)
  console.log('offer', offer)

  for(let i = 0; i < poffer.length; i++) {
     appData.value.otherPlayers.push({ id: 1, bidder: '0xAAA111', amount: 1.5, ts: Date.now() - 3600000, status: 'open', partnerAvatar: '' })
   }

   for(let i = 0; i < offer.length; i++) {
     appData.value.otherPlayers.push({ id: 1, listingOwner: '0xBBB222', amount: 1.2, ts: Date.now() - 1800000, status: 'open' })
   }

  //playerlist
  let playerList = await monsterContract.listMonsters(0,5);
  console.log('==playerList==>' , playerList[0]);
  for(let i = 0; i < playerList[0].length; i++) {
    console.log('playerList==>' + playerList[1][i]/*,await monsterContract.tokenURI(playerList[1][i])*/);

    appData.value.otherPlayers.push({ 
      id: playerList[1][i], 
      name: playerList[0][i][3], 
      attack: 72, 
      magic: 65, 
      defense: 58, 
      energy: 80, 
      wins: 12, 
      losses: 5 
    })
  }

  let recentPlayerList = await monsterContract.listRecentMinted(2);
  console.log('recentPlayerList',recentPlayerList);
  for(let i = 0; i < recentPlayerList.length; i++) {
    appData.value.minted.push({ 
      id: '0xAAA111', 
      name: 'NeonNinja', 
      attack: 72, 
      magic: 65, 
      defense: 58, 
      energy: 80, 
      wins: 12, 
      losses: 5 
    })
  }
  
  console.log(wallet)
  let monster = await monsterContract.getProperty(wallet);
  await loadProper(monster);
  await monsterContract.on('MonsterMinted', async(e)=>{
     console.log('monsterContract' , e);
     monster = await monsterContract.getProperty(wallet);
     await loadProper(monster);
   });

   await inventoryContrat.on('InventoryMinted',async(e)=>{
     console.log('inventoryContrat' , e);
   })

   let mutaionCount = await inventoryContrat.balanceOfType(wallet,1);
   let recoverCount = await inventoryContrat.balanceOfType(wallet,2);
   appData.value.player.inventory = {
       mutationPotion: mutaionCount,
       energyPotion: recoverCount,
   };
});


const appData = ref({
    activeTab: 'mint',
    player: {
      address: null,
      encrypt:{
      },
      name: '',
      nameInput: '',
      hasEgg: false,
      attack: 0,
      magic: 0,
      defense: 0,
      energy: 0,
      rarity: '',
      wins: 0,
      losses: 0,
      decrypted: false,
      inventory: {
        mutationPotion: 3,
        energyPotion: 2,
      }
    },
    minted: [
    ],
    inboxBids: [
    ],
    myOutboundBids: [
    ],
    otherPlayers: [
    ],
    battleLog: [],
    battleInProgress: false,
    
    showOfferModal: false,
    selectedPlayer: null,
    offerAmount: 0.5,
    
    showDNAAnimation: false,
    showNewEggModal: false,
    fusionPartner: '',
    newEgg: {}
 });

 const short = (addr)=>{
  if (!addr) return '';
  if (addr.length < 12) return addr;
  return addr.slice(0,8)+'...'+addr.slice(-4);
}
const connectWallet = async() => {
 open();
}

const disconnectWallet = async() => {
  await disconnect();
  appData.value.player = {
    address: null,
    name: '',
    nameInput: '',
    hasEgg: false,
    attack: 0,
    magic: 0,
    defense: 0,
    energy: 0,
    rarity: '',
    wins: 0,
    losses: 0,
    decrypted: false,
    inventory: {
      mutationPotion: 3,
      energyPotion: 2
    }
  };
}

const openOfferModal = (player)=> {
  appData.value.selectedPlayer = player;
  appData.value.showOfferModal = true;
}

const shortAddress = () => {
  return appData.value.player.address ? appData.value.player.address.slice(0, 10) + '...' : '';
}

const nameFor = (addr) => {
  const p = appData.value.otherPlayers.find(pp => pp.id === addr);
  return p ? p.name : (addr ? short(addr) : '—');
}

const mintEgg = async(name) => {
  let tx = await minterContract.mintMonsterEgg(name);
  await tx.wait();
  console.log(tx.hash)
};

const toggleDecrypt = async()=>{
  let monster = appData.value.player.encrypt;
  console.log(monster);
  const props = await fheUserDeccrypt(window.fhevmInstance, EvolvAddress['31337'].address,[
    monster?.attack,
    monster?.magic,
    monster?.defense
  ],signer);
  appData.value.player.attack = props[0];
  appData.value.player.magic = props[1];
  appData.value.player.defense = props[2];
  appData.value.player.decrypted = true;
};

const battle = async (opponent)=> {
  // if (!appData.value.player.hasEgg) {
  //   appData.value.battleLog.unshift({
  //     message: '没有蛋无法战斗！',
  //     details: '请先铸造一个蛋开始战斗',
  //     type: 'info'
  //   });
  //   return;
  // }
  console.log(opponent);
  appData.value.battleInProgress = true;
  let dst  = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
  if(customNet.id == 11155111) {
    dst  = '0x2b090b06e8987d215643cb2450f60640fe0079cf'
  }
  let scaore = await fightRoomContract.getFightScore(dst);
  console.log(scaore)
  await fightRoomContract.attack(dst);
  scaore = await fightRoomContract.getFightScore(signer.address);
  console.log(scaore)
}

const useMutationPotion = async()=> {
  if (!appData.value.player.hasEgg) {
    alert("You don't have any monsters yet");
    return;
  }
  
  if (appData.value.player.inventory.mutationPotion <= 0) {
    alert('Insufficient amount of mutation potion');
    return;
  }
  
  appData.value.player.inventory.mutationPotion--;
  let tx = await minterContract.makeMutation(1);
  await tx.wait();
  console.log(tx.hash);
}

const useEnergyPotion = async()=> {
  if (!appData.value.player.hasEgg) {
    alert("You don't have any monsters yet");
    return;
  }
  
  if (appData.value.player.inventory.energyPotion <= 0) {
    alert('Insufficient quantity of energy recovery potion');
    return;
  }
  
  // 减少药水数量
  appData.value.player.inventory.energyPotion--;
  let tx = await minterContract.makeRecovery(1);
  await tx.wait();
  console.log(tx.hash);
}


const makeOffer = async()=> {
  if (!appData.value.selectedPlayer) {
    return;
  }
  console.log(appData.value.selectedPlayer);
  let tx = await marketContrat.makeCrossOverRequest(1);
  appData.value.showOfferModal = false;
  appData.value.showDNAAnimation = true;
  // appData.value.fusionPartner = appData.value.selectedPlayer.name;

  await tx.wait();
  console.log(tx.hash);
  appData.value.showDNAAnimation = false;  
  appData.value.showNewEggModal = true;
}

const acceptBid = (bid)=> {
  bid.status = 'accepted';

}

const cancelBid = (bid)=> {
  bid.status = 'cancelled';
}

const claimRewards = async ()=> {
  let tx = counterContract.requestBool();
}

const checkIn = async()=> {
  let tx = await minterContract.gm();
  await tx.wait();
  console.log(tx.hash);
}

</script>

<template>
    <header class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl">The Evolving Monster<span class="muted text-sm">— Web3 Edition</span></h1>
        <div class="muted text-sm">Each wallet can only mint one monster, player battles, and gene exchanges</div>
      </div>

      <div class="flex items-center gap-4">
        <div class="text-right muted text-xs">
          <div>Wallet Address</div>
          <div class="font-mono text-sm" v-text="appData.player?.address || 'Not connected'"></div>
        </div>

        <div v-if="!appData.player?.address">
          <button @click="connectWallet()" class="btn-primary">Connect Wallet</button>
        </div>
        <div v-else class="flex items-center gap-2">
          <button @click="disconnectWallet()" class="btn-ghost">Disconnect</button>
        </div>
      </div>
    </header>

    <nav class="flex gap-3 mb-6 flex-wrap">
      <button @click="appData.activeTab = 'mint'" :class="appData.activeTab === 'mint' ? 'btn-primary' : 'btn-ghost'">🥚 Monster Casting</button>
      <button @click="appData.activeTab = 'player'" :class="appData.activeTab === 'player' ? 'btn-primary' : 'btn-ghost'">👤 Player Information</button>
      <button @click="appData.activeTab = 'battle'" :class="appData.activeTab === 'battle' ? 'btn-primary' : 'btn-ghost'">⚔️ Battle</button>
      <button @click="appData.activeTab = 'exchange'" :class="appData.activeTab === 'exchange' ? 'btn-primary' : 'btn-ghost'">💱 Gene Exchange</button>
    </nav>

<main>
      <!-- Egg Minting Page -->
      <div v-if="appData.activeTab === 'mint'" class="space-y-6">
        <div class="card p-5">
          <h2 class="text-lg">Monster Casting (Each wallet can only cast 1 egg)</h2>
          <div class="muted text-sm mt-1">Casting after connecting the wallet. After casting is completed, the button will be disabled and your monster will be displayed.</div>

          <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div class="muted text-xs">Player name</div>
              <input v-model.trim="appData.player.nameInput" placeholder="Enter player name (required)" class="p-2 mt-2 w-full rounded bg-[#021428]/70 border border-[#0b3450]" />
              <div class="muted text-xs mt-3">Current status</div>
              <div class="mt-2">
                <template v-if="appData.player.hasEgg">
                  <div class="p-3 card rounded flex items-center gap-3">
                    <div class="avatar-svg neon-glow"></div>
                    <div>
                      <div class="font-semibold">{{ appData.player.name || 'Player' }}</div>
                      <div class="muted text-xs"></div>
                      <div class="muted text-xs mt-1">ATK <span class="encrypted">████</span> • MAG <span class="encrypted">████</span> • DEF <span class="encrypted">████</span> • ENG <span class="encrypted">████</span></div>
                    </div>
                  </div>
                  <div class="mt-3 muted text-sm">You have already cast a monster and cannot cast it again.</div>
                </template>
                <template v-else>
                  <div class="muted">Monsters have not yet been cast. After connecting the wallet and filling in the player name, it can be cast.</div>
                  <div class="mt-3">
                    <button @click="mintEgg(appData.player.nameInput)" :disabled="!appData.player.address || !appData.player.nameInput" class="btn-primary" :class="(!appData.player.address || !appData.player.nameInput) ? 'opacity-60 cursor-not-allowed' : ''">Mint</button>
                    <div class="muted text-xs mt-2">Each wallet can only be minted once. Please first connect the wallet and fill in the name.</div>
                  </div>
                </template>
              </div>
            </div>

            <div>
              <div class="muted text-xs">Recently cast</div>
              <div class="mt-3 space-y-2 scrollbar-custom max-h-80 overflow-y-auto">
                <div v-for="egg in appData.minted" :key="egg.id" class="flex items-center gap-3 p-2 card rounded">
                  <div v-html="egg.avatar" class="avatar-svg neon-glow"></div>
                  <div class="flex-1">
                    <div class="font-semibold">{{ egg.name }} <span class="muted text-xs">#{{egg.id}}</span></div>
                    <div class="muted text-xs">ATK <span class="encrypted">████</span> • MAG <span class="encrypted">████</span> • DEF <span class="encrypted">████</span> • ENG <span class="encrypted">████</span></div>
                  </div>
                </div>
                <div v-if="appData.minted.length===0" class="muted p-3">No monsters at the moment - click on 'Cast Monster' to start.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Player Info Page -->
      <div v-if="appData.activeTab === 'player'" class="space-y-6">
        <div class="card p-5">
          <h2 class="text-lg">Player Information</h2>
          <div class="muted text-sm mt-1">Display your profile picture, attributes, wins and losses, and bid history (received/sent).</div>

          <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-3 rounded">
              <div class="muted text-xs">avatar</div>
              <div class="mt-2">
                <div v-if="appData.player.address" class="avatar-svg neon-glow"></div>
                <div v-else class="muted">Not connected</div>
              </div>
              <div class="muted mt-2 text-xs">Name</div>
              <div class="text-lg font-bold mt-1">{{ appData.player.name || '—' }}</div>
              <div class="muted mt-2 text-xs">Address</div>
              <div class="font-mono mt-1">{{ appData.player.address || '未连接' }}</div>
              <div class="muted mt-2 text-xs">Record</div>
              <div class="text-lg font-bold mt-1">WIN：{{ appData.player.wins }} • LOSE：{{ appData.player.losses }}</div>
            </div>

            <div class="p-3 rounded">
              <div class="muted text-xs">Property</div>
              <div class="mt-2">
                <div v-if="appData.player.hasEgg">
                  <div class="mb-2">
                    <button @click="toggleDecrypt()" class="decrypt-btn">
                      {{ appData.player.decrypted ? '🔒 Encryption' : '🔓 Decryption' }}
                    </button>
                  </div>
                  <div v-if="appData.player.decrypted">
                    <div>Attack (ATK): <strong>{{ appData.player.attack }}</strong></div>
                    <div>Magic (MAG): <strong>{{ appData.player.magic }}</strong></div>
                    <div>Defense (DEF): <strong>{{ appData.player.defense }}</strong></div>
                    <div>Energy (ENG): <strong>{{ appData.player.energy }}</strong></div>
                  </div>
                  <div v-else>
                    <div>Attack (ATK): <span class="encrypted">████</span></div>
                    <div>Magic (MAG): <span class="encrypted">████</span></div>
                    <div>Defense (DEF): <span class="encrypted">████</span></div>
                    <div>Energy (ENG): <span class="encrypted">████</span></div>
                  </div>
                </div>
                <div v-else class="muted">There are no monsters yet</div>
              </div>
            </div>

            <div class="p-3 rounded">
              <div class="muted text-xs">Operation</div>
              <div class="mt-2 flex gap-2">
                <button @click="claimRewards()" class="btn-primary">Claim Reward</button>
                <button @click="checkIn()" class="btn-ghost">Check In</button>
              </div>
            </div>
          </div>

          <!-- Inventory -->
          <div class="mt-4">
            <h3 class="muted text-sm">Supplies</h3>
            <div class="mt-3 grid grid-cols-2 gap-3">
              <!-- 变异药水 -->
              <div v-if="appData.player.inventory.mutationPotion > 0" class="card p-3 rounded flex items-center gap-3">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#8eb8ff] to-[#00f6ff] flex items-center justify-center font-bold">🧪</div>
                <div class="flex-1">
                  <div class="font-semibold flex items-center">
                    Mutation Potion
                    <span class="item-count">{{ appData.player.inventory.mutationPotion }}</span>
                  </div>
                  <div class="muted text-xs">After use, there is a probability of slightly improving one attribute</div>
                </div>
                <div>
                  <button :disabled="!appData.player.hasEgg" @click="useMutationPotion" class="btn-ghost">Use</button>
                </div>
              </div>

              
              <div v-if="appData.player.inventory.energyPotion > 0" class="card p-3 rounded flex items-center gap-3">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#3ab6ff] to-[#8eb3ff] flex items-center justify-center font-bold">⚡</div>
                <div class="flex-1">
                  <div class="font-semibold flex items-center">
                    Energy Recovery Potion
                    <span class="item-count">{{ appData.player.inventory.energyPotion }}</span>
                  </div>
                  <div class="muted text-xs">Restore energy to your monster after use</div>
                </div>
                <div>
                  <button :disabled="!appData.player.hasEgg" @click="useEnergyPotion" class="btn-ghost">Use</button>
                </div>
              </div>

              
              <div v-if="Object.values(appData.player.inventory).every(count => count === 0)" class="col-span-2 p-4 text-center muted">
                No available materials at the moment
              </div>
            </div>
          </div>

          <!-- BIDS: received and sent -->
          <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 class="muted text-sm">Received Bid</h3>
              <div class="mt-3 space-y-3 scrollbar-custom max-h-80 overflow-y-auto">
                <div v-for="b in appData.inboxBids" :key="b.id" class="card p-3 rounded flex items-start gap-3">
                  <div v-html="b.partnerAvatar" class="avatar-svg neon-glow"></div>
                  <div class="flex-1">
                    <div class="font-semibold">{{ short(b.bidder) }} Propose <strong>{{ b.amount.toFixed(3) }} ETH</strong></div>
                    <div class="muted text-xs">Time：{{ new Date(b.ts).toLocaleString() }}</div>
                    <div class="muted text-xs mt-1">Status：{{ b.status }}</div>
                  </div>
                  <div class="flex flex-col gap-2">
                    <button @click="acceptBid(b)" class="btn-primary text-sm" :disabled="b.status!=='open'">Accept</button>
                  </div>
                </div>
                <div v-if="appData.inboxBids.length===0" class="muted p-3">There are currently no bids received.</div>
              </div>
            </div>

            <div>
              <h3 class="muted text-sm">The Bid You Made</h3>
              <div class="mt-3 space-y-3 scrollbar-custom max-h-80 overflow-y-auto">
                <div v-for="b in appData.myOutboundBids" :key="b.id" class="card p-3 rounded flex items-start gap-3">
                  <div class="avatar-svg neon-glow"></div>
                  <div class="flex-1">
                    <div class="font-semibold">For {{ nameFor(b.listingOwner) }} Bid <strong>{{ b.amount.toFixed(3) }} ETH</strong></div>
                    <div class="muted text-xs">Time：{{ new Date(b.ts).toLocaleString() }}</div>
                    <div class="muted text-xs mt-1">Status：{{ b.status }}</div>
                  </div>
                  <div class="flex flex-col gap-2">
                    <button @click="cancelBid(b)" class="btn-ghost text-sm" :disabled="b.status!=='open'">Cancel</button>
                  </div>
                </div>
                <div v-if="appData.myOutboundBids.length===0" class="muted p-3">You haven't made any bids yet.</div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- Battle Page -->
      <div v-if="appData.activeTab === 'battle'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Player Card -->
        <div class="card p-6">
          <h3 class="text-lg mb-4 text-center">Your state</h3>
          
          <div class="flex justify-center mb-4">
            <div v-if="appData.player.address" class="avatar-svg neon-glow w-24 h-24"></div>
          </div>
          
          <div class="space-y-3 mb-4">
            <div class="flex justify-between items-center">
              <span>Attack</span>
              <span class="encrypted">████</span>
            </div>
            
            <div class="flex justify-between items-center">
              <span>Magic</span>
              <span class="encrypted">████</span>
            </div>
            
            <div class="flex justify-between items-center">
              <span>Defense</span>
              <span class="encrypted">████</span>
            </div>
            
            <div class="flex justify-between items-center">
              <span>Energy</span>
              <span class="encrypted">████</span>
            </div>
          </div>
          
          <div class="mt-6 text-center">
            <p class="text-sm text-gray-400">Record: {{ appData.player.wins || 0 }}WIN - {{ appData.player.losses || 0 }}LOSE</p>
          </div>
        </div>
        
        <!-- Battle Log -->
        <div class="card p-6 lg:col-span-2">
          <h3 class="text-lg mb-4">Battle Log</h3>
          
          <div v-if="appData.battleLog.length > 0" class="space-y-3 max-h-96 overflow-y-auto scrollbar-custom">
            <div v-for="(log, index) in appData.battleLog" :key="index" class="p-3 rounded-lg" :class="log.type === 'win' ? 'bg-green-900/20 border border-green-500/30' : log.type === 'loss' ? 'bg-red-900/20 border border-red-500/30' : 'bg-gray-800/30'">
              <p class="font-bold">{{ log.message }}</p>
              <p class="text-sm text-gray-400 mt-1">{{ log.details }}</p>
            </div>
          </div>
          
          <div v-else class="text-center py-8 text-gray-400">
            <p>There are currently no battle records. Challenge your opponent and start fighting!</p>
          </div>
          
          <div v-if="appData.battleInProgress" class="mt-6 text-center">
            <div class="inline-block animate-pulse py-2 px-4 bg-cyan-900/30 rounded-lg">
              <p>in battle...</p>
            </div>
          </div>
        </div>
        
        <!-- Opponents -->
        <div class="lg:col-span-3 mt-4">
          <h3 class="text-lg mb-4">List of opponents</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="opponent in appData.otherPlayers" :key="opponent.id" class="card p-4 grid-card">
              <div class="flex items-center space-x-4 mb-4">
                <div class="avatar-svg w-12 h-12">
                  <div :style="{backgroundImage:'url(../../public/game.png)'}" ></div>
                </div>
                <div>
                  <p class="font-bold">Player#{{ opponent.tokenId  }}</p>
                  <p class="text-sm text-gray-400">{{ opponent.wins }}胜 - {{ opponent.losses }}负</p>
                </div>
              </div>
              
              <div class="space-y-2 mb-4">
                <div class="flex justify-between text-sm">
                  <span>Attack</span>
                  <span class="encrypted">████</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span>Magic</span>
                  <span class="encrypted">████</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span>Defense</span>
                  <span class="encrypted">████</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span>Energy</span>
                  <span class="encrypted">████</span>
                </div>
              </div>
<!--               
              <button @click="battle(opponent)" class="btn-primary w-full" :disabled="!appData.player.hasEgg">对战</button> -->
              <button @click="battle(opponent)" class="btn-primary w-full" >Battle</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Gene Exchange Page -->
      <div v-if="appData.activeTab === 'exchange'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Player List -->
        <div class="card p-6 lg:col-span-2">
          <h2 class="text-xl mb-4">Player List</h2>
          
          <div class="space-y-4 max-h-96 overflow-y-auto scrollbar-custom">
            <div v-for="otherPlayer in appData.otherPlayers" :key="otherPlayer.id" class="p-4 bg-gray-800/30 rounded-lg">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div  class="avatar-svg w-12 h-12"></div>
                  <div>
                    <p class="font-bold">{{ otherPlayer.name }}</p>
                    <p class="text-sm text-gray-400">{{ otherPlayer.wins }}WIN - {{ otherPlayer.losses }}LOSE</p>
                    <div class="text-xs mt-1">
                      Attack:<span class="encrypted">████</span> Magic:<span class="encrypted">████</span> Defense:<span class="encrypted">████</span> Energy:<span class="encrypted">████</span>
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center space-x-4">
                  <button @click="openOfferModal(otherPlayer)" class="btn-ghost">出价</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Exchange Info -->
        <div class="card p-6">
          <h3 class="text-lg mb-4">Exchange Info</h3>
          
          <p class="mb-4">Exchange genes with other players to create powerful new Monster</p>
          
          <div class="space-y-4">
            <div class="p-4 bg-cyan-900/20 rounded-lg">
              <p class="font-bold text-cyan-300">Working principle:</p>
              <ul class="mt-2 text-sm space-y-1">
                <li>• Make bids to other players</li>
                <li>• If accepted, genes will bind</li>
                <li>• Create new and stronger Monster</li>
                <li>• Both players will receive new eggs</li>
              </ul>
            </div>
            
            <div class="p-4 bg-purple-900/20 rounded-lg">
              <p class="font-bold text-purple-300">Benefit:</p>
              <ul class="mt-2 text-sm space-y-1">
                <li>• Higher attribute potential</li>
                <li>• Unique genetic combination</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-grid">
          <div class="footer-section">
            <h3>The Evolving Monster</h3>
            <p class="muted text-sm">A gene exchange game based on Web3 technology. Casting, battling, merging, creating your own unique digital creature.</p>
            <div class="footer-social">
              <a href="https://x.com/0x07e" class="social-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="https://github.com/monsterCry" class="social-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
          <div class="footer-section">
            <h3>Game Features</h3>
            <ul class="footer-links">
              <li><a href="#">🥚 Casting system</a></li>
              <li><a href="#">⚔️ Battle arena</a></li>
              <li><a href="#">💱 Gene exchange</a></li>
              <li><a href="#">🔐 Encryption attribute</a></li>
              <li><a href="#">🧪 Mutation potion</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h3>Support and Resources</h3>
            <ul class="footer-links">
              <li><a href="../intr.html">📖 Game Guide</a></li>
            </ul>
          </div>
          <div class="footer-section">

          </div>
        </div>
        <div class="footer-bottom">
          <div class="footer-logo">
            <span>The Evolving Monster</span>
          </div>
          <div class="footer-legal">
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Cookie Policy</a>
            <span class="muted text-sm">© 2023 FullChain Game. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>

    <!-- Offer Modal -->
    <div v-if="appData.showOfferModal" class="dna-modal fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="card p-6 max-w-md w-full">
        <h3 class="text-xl font-bold mb-4">For {{ appData.selectedPlayer?.name }} Bid</h3>
        
        <div class="mb-6">
          <label class="block text-sm font-medium mb-2">ETH Amount</label>
          <input v-model.number="appData.offerAmount" type="number" min="0.001" step="0.001" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500">
        </div>
        
        <div class="flex space-x-3">
          <button @click="appData.showOfferModal = false" class="btn-ghost flex-1">Cancel</button>
          <button @click="makeOffer()" class="btn-primary flex-1">Confirm Bid</button>
        </div>
      </div>
    </div>

    <!-- DNA Animation -->
    <div v-if="appData.showDNAAnimation" class="dna-modal fixed inset-0 z-50 flex items-center justify-center">
      <div class="text-center">
        <svg class="dna-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gx1" x1="0" x2="1"><stop offset="0" stop-color="#8eb8ff"/><stop offset="1" stop-color="#00f6ff"/></linearGradient>
            <linearGradient id="gx2" x1="0" x2="1"><stop offset="0" stop-color="#6dd3ff"/><stop offset="1" stop-color="#3ab6ff"/></linearGradient>
          </defs>
          <g transform="translate(100,100)">
            <path d="M -40 -80 C -60 -40 -60 40 -40 80" stroke="url(#gx1)" stroke-width="4" fill="none" stroke-linecap="round"/>
            <path d="M 40 -80 C 60 -40 60 40 40 80" stroke="url(#gx2)" stroke-width="4" fill="none" stroke-linecap="round"/>
          </g>
          <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 100 100" to="360 100 100" dur="3s" repeatCount="indefinite" />
        </svg>

        <div class="text-lg font-semibold mt-4">In gene fusion...</div>
        <div class="muted text-sm">Gene fusion with</div>
      </div>
    </div>

    <!-- New Egg Modal -->
    <div v-if="appData.showNewEggModal" class="dna-modal fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="card p-6 max-w-md w-full text-center fade-in">
        <h3 class="text-2xl font-bold mb-2 text-cyan-300">Successful integration!</h3>
        <p class="mb-6">You have created a new powerful monster</p>
        
        <div class="w-32 h-32 mx-auto mb-6 rounded-full border-4 border-cyan-500 flex items-center justify-center neon-glow">
          <span class="text-4xl">🥚</span>
        </div>
        
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="bg-gray-800/50 rounded-lg p-3">
            <p class="text-gray-400 text-sm">Attack</p>
            <p class="text-xl font-bold">{{ appData.newEgg.attack }}</p>
          </div>
          <div class="bg-gray-800/50 rounded-lg p-3">
            <p class="text-gray-400 text-sm">Magic</p>
            <p class="text-xl font-bold">{{ appData.newEgg.magic }}</p>
          </div>
          <div class="bg-gray-800/50 rounded-lg p-3">
            <p class="text-gray-400 text-sm">Defanse</p>
            <p class="text-xl font-bold">{{ appData.newEgg.defense }}</p>
          </div>
          <div class="bg-gray-800/50 rounded-lg p-3">
            <p class="text-gray-400 text-sm">Energy</p>
            <p class="text-xl font-bold">{{ appData.newEgg.energy }}</p>
          </div>
        </div>
        <button @click="appData.showNewEggModal = false" class="btn-primary w-full">Take the new monster</button>
      </div>
    </div>
</template>

<style>
  :root{
      --bg-a:#061426; --bg-b:#07263d; --accent:#00f6ff; --accent-2:#6dd3ff; --muted:#9fb6c9;
    }
    body{
      background:
        radial-gradient(900px 450px at 12% 8%, rgba(6,34,48,0.08), transparent),
        linear-gradient(180deg,var(--bg-a),var(--bg-b));
      color:#e6f6ff;
      font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
      -webkit-font-smoothing:antialiased;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    #app {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    main {
      flex: 1;
    }
    h1,h2,h3{ font-family: 'Orbitron', Inter, sans-serif; color:var(--accent-2) }
    .card{ 
      background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); 
      border:1px solid rgba(109,182,210,0.06); 
      box-shadow: 0 8px 40px rgba(2,10,16,0.6); 
      border-radius:12px; 
    }
    .muted{ color:var(--muted); }
    .avatar-svg{ width:72px; height:72px; border-radius:999px; display:inline-flex; align-items:center; justify-content:center; overflow:hidden; }
    .btn-primary{ 
      background: linear-gradient(90deg,var(--accent),var(--accent-2)); 
      color:#021220; 
      padding:0.5rem 0.9rem; 
      border-radius:0.6rem; 
      font-weight:700; 
      transition: all 0.3s ease;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,246,255,0.3);
    }
    .btn-ghost{ 
      border:1px solid rgba(109,182,210,0.06); 
      padding:0.45rem 0.75rem; 
      border-radius:0.6rem; 
      background:transparent; 
      color:#e6f6ff; 
      transition: all 0.3s ease;
    }
    .btn-ghost:hover {
      background: rgba(109,182,210,0.1);
      border-color: rgba(109,182,210,0.2);
    }
    .neon-glow{ filter: drop-shadow(0 10px 26px rgba(0,246,255,0.08)); }
    .log{ 
      max-height:260px; 
      overflow:auto; 
      background: rgba(2,12,20,0.36); 
      padding:0.6rem; 
      border-radius:8px; 
      border:1px solid rgba(109,182,210,0.03);
    }
    .kbd{ font-family: monospace; background: rgba(0,0,0,0.12); padding: 3px 7px; border-radius:8px; color:var(--accent-2); }
    .grid-card{ transition: transform 180ms ease; }
    .grid-card:hover{ transform: translateY(-6px); }

    /* DNA modal */
    .dna-modal { backdrop-filter: blur(6px); }
    .dna-svg{ width:220px; height:220px; display:block; margin:auto; }

    .potion-flash { animation: potionFlash 900ms ease forwards; }
    @keyframes potionFlash {
      0% { box-shadow: 0 0 0px rgba(0,246,255,0.0); transform: scale(1); }
      30% { box-shadow: 0 0 22px rgba(0,246,255,0.18); transform: scale(1.06); }
      100% { box-shadow: 0 0 6px rgba(0,246,255,0.06); transform: scale(1); }
    }

    .energy-animation {
      animation: energyPulse 2s infinite;
    }
    @keyframes energyPulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.05); opacity: 0.8; }
      100% { transform: scale(1); opacity: 1; }
    }

    .fade-in {
      animation: fadeIn 0.5s ease-in;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .encrypted {
      color: var(--muted);
      background: rgba(109,182,210,0.1);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
    }

    .decrypt-btn {
      background: rgba(0,246,255,0.1);
      border: 1px solid rgba(0,246,255,0.3);
      color: var(--accent);
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      transition: all 0.3s ease;
    }
    .decrypt-btn:hover {
      background: rgba(0,246,255,0.2);
      transform: translateY(-1px);
    }

    .item-count {
      background: rgba(0,246,255,0.2);
      color: var(--accent);
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: bold;
      margin-left: 8px;
    }

    /* 美化滚动条 */
    .scrollbar-custom {
      scrollbar-width: thin;
      scrollbar-color: rgba(0,246,255,0.3) rgba(2,12,20,0.36);
    }
    .scrollbar-custom::-webkit-scrollbar {
      width: 6px;
    }
    .scrollbar-custom::-webkit-scrollbar-track {
      background: rgba(2,12,20,0.36);
      border-radius: 3px;
    }
    .scrollbar-custom::-webkit-scrollbar-thumb {
      background: rgba(0,246,255,0.3);
      border-radius: 3px;
    }
    .scrollbar-custom::-webkit-scrollbar-thumb:hover {
      background: rgba(0,246,255,0.5);
    }

    /* Footer Styles */
    .footer {
      background: linear-gradient(180deg, rgba(6,20,38,0.8), rgba(4,15,29,0.95));
      border-top: 1px solid rgba(109,182,210,0.1);
      margin-top: auto;
      padding: 2rem 0 1.5rem;
    }
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .footer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }
    .footer-section h3 {
      font-size: 1.1rem;
      margin-bottom: 1rem;
      color: var(--accent-2);
      font-family: 'Orbitron', sans-serif;
    }
    .footer-links {
      list-style: none;
      padding: 0;
    }
    .footer-links li {
      margin-bottom: 0.5rem;
    }
    .footer-links a {
      color: var(--muted);
      text-decoration: none;
      transition: color 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .footer-links a:hover {
      color: var(--accent);
    }
    .footer-social {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }
    .social-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(109,182,210,0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      border: 1px solid rgba(109,182,210,0.2);
    }
    .social-icon:hover {
      background: rgba(0,246,255,0.2);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,246,255,0.2);
    }
    .footer-bottom {
      border-top: 1px solid rgba(109,182,210,0.1);
      padding-top: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .footer-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: 'Orbitron', sans-serif;
      font-weight: 700;
      color: var(--accent-2);
    }
    .footer-legal {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    .footer-legal a {
      color: var(--muted);
      text-decoration: none;
      font-size: 0.875rem;
      transition: color 0.3s ease;
    }
    .footer-legal a:hover {
      color: var(--accent);
    }

    @media (max-width:700px){
      .avatar-svg{ width:56px; height:56px; }
      .dna-svg{ width:160px; height:160px; }
      .footer-bottom {
        flex-direction: column;
        text-align: center;
      }
      .footer-legal {
        justify-content: center;
      }
    }
</style>
