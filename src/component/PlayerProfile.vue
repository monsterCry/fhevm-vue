<template>
  <div
    class="w-full min-h-screen bg-[#111215] text-white flex justify-center py-10 px-4"
  >
    <div
      class="w-full max-w-6xl rounded-3xl bg-black/40 border border-white/5 shadow-2xl p-8"
    >

      <div class="flex gap-8 items-start">
  
        <div
          class="w-32 h-32 rounded-full bg-[#1f2229] flex items-center justify-center overflow-hidden shadow-lg"
        >
          <img
            :src="stats.tokenURI?.image"
            alt="avatar"
            class="w-28 h-28 object-contain"
          />
          <!-- <canvas
            id="player-avstart"
            class="w-28 h-28 object-contain"
          ></canvas> -->
        </div>

        <div class="flex-1">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold mb-1">
                {{ playerName }}
              </h1>
              <p class="text-xs text-white/50">ID: #{{playerId}} • On-chain Player</p>
            </div>

   
            <button
              v-if="!decrypted"
              @click="toggleDecrypt"
              class="px-5 py-2 rounded-xl bg-[#2b3245] hover:bg-[#39415a] text-sm font-semibold transition shadow"
            >
              Decrypt
            </button>
          </div>

   
          <div class="grid grid-cols-2 gap-3 mt-6 max-w-lg">
            <div
              v-for="stat in statList"
              :key="stat.key"
              class="flex items-center justify-between px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-sm"
            >
              <span class="text-white/70">{{ stat.label }}</span>
              <span
                class="font-semibold tracking-widest transition-all duration-200"
                :class="decrypted ? 'text-[#ffcf5c]' : 'text-white/40'"
              >
                {{ decrypted ? stat.value : "••••" }}
              </span>
            </div>
          </div>

    
          <div class="flex gap-4 mt-6">
            <button
              @click="checkIn()"
              class="flex-1 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold border border-white/10 transition"
            >
              CHECK-IN
            </button>
            <button
              @click="claimReward()"
              class="flex-1 px-4 py-2 rounded-xl bg-[#ff4f6d] hover:bg-[#ff2f54] text-sm font-semibold transition shadow"
            >
             CLAIM REWARD
            </button>
          </div>
        </div>
      </div>


      <div class="mt-10 grid grid-cols-3 gap-8">

        <section class="col-span-1">
          <h2 class="text-sm font-semibold mb-3 tracking-wide">
            EQUIPMENT
          </h2>
          <div class="space-y-3">
            <div class="w-full flex items-center gap-3 px-3 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition text-left">
              <h3>Comming Soon</h3>
            </div>
            <!-- <button
              v-for="item in equipment"
              :key="item.slot"
              @click="openEquipModal(item)"
              class="w-full flex items-center gap-3 px-3 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition text-left"
            >
              <div
                class="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center text-xl"
              >
                {{ item.icon }}
              </div>
              <div class="flex-1">
                <div class="text-xs text-white/50">
                  {{ item.slot }}
                </div>
                <div class="text-sm font-semibold">
                  {{ item.name }}
                </div>
              </div>
              <div class="text-xs text-emerald-300">
                {{ item.bonus }}
              </div>
            </button> -->
          </div>
        </section>

   
        <section class="col-span-2">
          <h2 class="text-sm font-semibold mb-3 tracking-wide">
            INVENTORY
          </h2>
          <div
            class="rounded-2xl bg-white/3 border border-white/5 p-4 grid grid-cols-4 gap-4"
          >
            <div
              @click="useInventory(item)"
              v-for="item in inventory"
              :key="item.name"
              class="group rounded-2xl bg-black/40 border border-white/5 hover:border-[#ff4f6d] hover:-translate-y-1 transition transform p-3 flex flex-col items-center text-center cursor-pointer"
            >
              <div class="text-3xl mb-2 drop-shadow">
                {{ item.icon }}
              </div>
              <div class="text-xs font-semibold">
                {{ item.name }}
              </div>
              <div class="text-[10px] text-white/50 mt-1">
                {{ item.desc }}
              </div>
            </div>

            <div
              v-for="n in 2"
              :key="'empty-'+n"
              class="rounded-2xl border border-dashed border-white/10 bg-black/20"
            ></div>
          </div>
        </section>
      </div>


      <section class="mt-10">
        <div
          class="inline-flex rounded-2xl bg-white/5 border border-white/10 overflow-hidden text-sm"
        >
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            class="px-6 py-2 transition"
            :class="
              activeTab === tab.key
                ? 'bg-[#ff4f6d] text-white font-semibold'
                : 'text-white/70 hover:bg-white/10'
            "
          >
            {{ tab.label }}
          </button>
        </div>

 
        <div
          class="mt-4 rounded-2xl bg-white/3 border border-white/5 p-4 space-y-3"
        >

          <template v-if="activeTab === 'battle'">
            <div
              v-for="(b, idx) in battleHistory"
              :key="idx"
              class="flex items-center justify-between px-3 py-2 rounded-xl bg-black/40 border border-white/5 text-xs sm:text-sm"
            >
              <div>
                <div class="font-semibold">
                  VS {{ b.opponent }}
                  <span
                    class="ml-2 text-[11px] px-2 py-[2px] rounded-full"
                    :class="b.result === 'WIN' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'"
                  >
                    {{ b.result }}
                  </span>
                </div>
                <div class="text-white/50 mt-1">
                  {{ b.time }}
                </div>
              </div>
              <div class="text-right">
                <div class="text-[11px] text-white/60">
                  Reward
                </div>
                <div class="text-xs font-semibold text-[#ffcf5c]">
                  {{ b.reward }}
                </div>
              </div>
            </div>
          </template>

        <template v-else-if="activeTab === 'received'">
        <div
            v-for="(offer, idx) in receivedOffers"
            :key="idx"
            class="flex items-center justify-between px-3 py-2 rounded-xl bg-black/40 border border-white/5 text-xs sm:text-sm"
        >
            <div>
            <div class="font-semibold">From {{ offer.from }}</div>
            <div class="text-white/50 mt-1">For: {{ offer.target }}</div>
            </div>

            <div class="text-right">
            <div class="text-xs font-semibold text-emerald-300">
                {{ offer.price }}
            </div>

            <div class="flex gap-2 mt-2">
    
                <button
                v-if="offer.status === 'Pending'"
                @click="acceptOffer('received', idx)"
                class="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition text-[11px] text-white"
                >
                Accept
                </button>

                <button
                v-if="offer.status === 'Pending'"
                @click="rejectOffer('received', idx)"
                class="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 transition text-[11px] text-white"
                >
                Reject
                </button>

                <!-- Status after action -->
                <span
                v-if="offer.status !== 'Pending'"
                class="text-[11px] px-2 py-[2px] rounded-full"
                :class="offer.status === 'Accepted'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-red-500/20 text-red-300'"
                >
                {{ offer.status }}
                </span>
            </div>
            </div>
        </div>
        </template>


        <template v-else>
        <div
            v-for="(offer, idx) in sentOffers"
            :key="idx"
            class="flex items-center justify-between px-3 py-2 rounded-xl bg-black/40 border border-white/5 text-xs sm:text-sm"
        >
            <div>
            <div class="font-semibold">To {{ offer.to }}</div>
            <div class="text-white/50 mt-1">For: {{ offer.target }}</div>
            </div>

            <div class="text-right">
            <div class="text-xs font-semibold text-emerald-300">
                {{ offer.price }}
            </div>

            <div class="flex gap-2 mt-2">
                <!-- Cancel only when pending -->
                <button
                v-if="offer.status === 'Pending'"
                @click="cancelOffer(idx)"
                class="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 transition text-[11px] text-white"
                >
                Cancel
                </button>

                <!-- Status after action -->
                <span
                v-if="offer.status !== 'Pending'"
                class="text-[11px] px-2 py-[2px] rounded-full"
                :class="offer.status === 'Cancelled'
                    ? 'bg-red-500/20 text-red-300'
                    : offer.status === 'Rejected'
                    ? 'bg-red-500/20 text-red-300'
                    : 'bg-emerald-500/20 text-emerald-300'"
                >
                {{ offer.status }}
                </span>
            </div>
            </div>
        </div>
        </template>
        </div>
      </section>
    </div>


    <transition name="fade">
      <div
        v-if="activeEquip"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <div
          class="w-[90%] max-w-sm rounded-3xl bg-[#1b1c22] border border-white/10 p-6 shadow-2xl"
        >
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center text-2xl"
            >
              {{ activeEquip.icon }}
            </div>
            <div>
              <div class="text-xs text-white/50">{{ activeEquip.slot }}</div>
              <div class="text-lg font-semibold">
                {{ activeEquip.name }}
              </div>
            </div>
          </div>
          <p class="text-sm text-white/70 mb-3">
            {{ activeEquip.desc }}
          </p>
          <p class="text-sm text-emerald-300 font-semibold">
            {{ activeEquip.bonus }}
          </p>

          <button
            class="mt-6 w-full py-2 rounded-xl bg-[#ff4f6d] hover:bg-[#ff2f54] font-semibold text-sm"
            @click="activeEquip = null"
          >
            CLOSE
          </button>
        </div>
      </div>
    </transition>
  </div>

      <!-- <canvas
        id="player-avstart" width="600" height="850" style="background-color: aqua;"
    ></canvas> -->
</template>

<script setup>
import { computed, ref,watchEffect } from "vue";
import { fheUserDeccrypt} from '../fhevm/mock/fhevmMock'

const {wallet,commonComp} = defineProps(['wallet','commonComp'])

const playerName = ref("Unnamed Player");
const playerId = ref("***");
const decrypted = ref(false);
const activeTab = ref("battle");
const activeEquip = ref(null);

let player = {
  arm:'arm_whiteE',
  body:'body_whiteE',
  eye:'eye_cute_dark',
  leg:'leg_greenA',
  mouth:'mouthH',
  nose:'nose_yellow',
  scale: 2
}

const stats = ref({
  attack: 128,
  magic: 96,
  defense: 72,
  energy: 150,
  tokenURI:{}
});

const statList = computed(() => [
  { key: "attack", label: "Attack", value: stats.value.attack },
  { key: "magic", label: "Magic", value: stats.value.magic },
  { key: "defense", label: "Defense", value: stats.value.defense },
  { key: "energy", label: "Energy", value: stats.value.energy },
]);

const equipment = ref([
  {
    slot: "Weapon",
    name: "Genetic Blade",
    icon: "🗡️",
    bonus: "+20 Atack",
    desc: "Provide additional damage",
  },
  {
    slot: "Armor",
    name: "FHE Armor",
    icon: "🛡️",
    bonus: "+18 Defense",
    desc: "Reduce the damage caused by opponents to oneself",
  },
  {
    slot: "Relic",
    name: "Energy Core",
    icon: "⚗️",
    bonus: "+30 Energy",
    desc: "Slow recovery of energy is particularly important in long-term battles.",
  },
]);

const inventory = ref([
  // {
  //   name: "Mutation Potion",
  //   icon: "🧪",
  //   desc: "Randomly changing the monster's genes",
  // },
  // {
  //   name: "Energy Recovery Potion",
  //   icon: "🔋",
  //   desc: "Immediately restore 50 points of energy.",
  // },
]);

const battleHistory = ref([
  // {
  //   opponent: "Player_0xA1",
  //   result: "WIN",
  //   time: "2025-11-16 20:45",
  //   reward: "+35 Token & +5 Exp",
  // },
  // {
  //   opponent: "Player_0xB2",
  //   result: "LOSE",
  //   time: "2025-11-15 18:10",
  //   reward: "+5 Exp",
  // },
]);

const receivedOffers = ref([
  // {
  //   from: "0x9f...12ab",
  //   target: "Your Monster #123",
  //   price: "0.25 ETH",
  //   status: "Pending",
  // },
  // {
  //   from: "0x33...c7e1",
  //   target: "Your FHE Armor",
  //   price: "0.4 ETH",
  //   status: "Accepted",
  // },
]);

const sentOffers = ref([
  // {
  //   to: "0x88...c001",
  //   target: "Gene Egg #77",
  //   price: "0.15 ETH",
  //   status: "Pending",
  // },
  // {
  //   to: "0x55...ddfa",
  //   target: "Energy Core",
  //   price: "0.05 ETH",
  //   status: "Rejected",
  // },
]);

const tabs = [
  { key: "battle", label: "Battle History" },
  { key: "received", label: "Offers Received" },
  { key: "sent", label: "Offers Sent" },
];

const toggleDecrypt = async() => {
    if(decrypted.value) {
        return;
    }
    commonComp.commonOpt('Decrypt','Decrypt...',async()=>{
      let signer = window.fhevmObject.fhevmSigner;
      let monsterContract = window.fhevmObject.monsterContract;
      console.log(signer.address)
      //Load Player Property
      let prop = await monsterContract.getProperty(signer.address);
      //Decrypt Prop
      const props = await fheUserDeccrypt(window.fhevmInstance, monsterContract.target, prop[0],signer);
      stats.value.attack = props[0];
      stats.value.magic = props[1];
      stats.value.defense = props[2];
      stats.value.energy = props[2];
      decrypted.value = !decrypted.value;
    });
};

const checkIn = async() => {
  commonComp.commonOpt('checkIn','checkIn...',async()=>{
    let minterContract = window.fhevmObject.minterContract;
    let tx = await minterContract.gm();
    await tx.wait();
    console.log(tx.hash);
  })
}



const claimReward = async() => {
  commonComp.commonOpt('Claim Reward','Claimimg...',async()=>{
    let minterContract = window.fhevmObject.minterContract;
    let tx = await minterContract.claimReward()
    await tx.wait();
    console.log(tx.hash)
  });
}

const useMutationPotion = async(id)=> {
  commonComp.commonOpt('Use Manta','Mutationing...',async()=>{
    let minterContract = window.fhevmObject.minterContract;
    let tx = await minterContract.makeMutation(id);
    await tx.wait();
    console.log(tx.hash);
  });
}

const useEnergyPotion = async(id)=> {
  commonComp.commonOpt('Use Manta','Recovering...',async()=>{
    let minterContract = window.fhevmObject.minterContract;
    let tx = await minterContract.makeRecovery(id);
    await tx.wait();
    console.log(tx.hash);
  });
}

const useInventory = async(itm) => {
  console.log(itm)
  if(itm.type == 1) {
    await useMutationPotion(itm.id);
  } else if(itm.type == 2) {
    await useEnergyPotion(itm.id);
  }
}

const openEquipModal = (item) => {
  activeEquip.value = item;
};

// 接受 offer
const acceptOffer = (type, idx) => {
  if (type === "received") {
    receivedOffers.value[idx].status = "Accepted";
  }
};

// 拒绝 offer
const rejectOffer = (type, idx) => {
  if (type === "received") {
    receivedOffers.value[idx].status = "Rejected";
  }
};

// 取消发出的 offer
const cancelOffer = (idx) => {
  sentOffers.value[idx].status = "Cancelled";
};
watchEffect(async() => {
  if(!wallet) {
    return;
  }
  let signer = window.fhevmObject.fhevmSigner;
  const monsterContract = window.fhevmObject.monsterContract;
  const marketContrat = window.fhevmObject.marketContrat;
  const fightRoomContract = window.fhevmObject.fightRoomContract;
  const minterContract = window.fhevmObject.minterContract;
  const inventoryContrat = window.fhevmObject.inventoryContrat;
  const poffer = await marketContrat.palyerOffers(0);
  const offer = await marketContrat.palyerOwnerOffers(0);
  const lastGmtimeStamp = await minterContract.getGmTimestamp();
  let prop = await monsterContract.getProperty(signer.address);
  playerName.value = prop[2];
  playerId.value = prop[5];
  let tokenUri = JSON.parse(await monsterContract.tokenURI(prop[5]));
  stats.value.tokenURI = tokenUri;
  console.log(lastGmtimeStamp)
  if(prop[3]) {
    const fights = await fightRoomContract.loadAttacks(signer.address);
    for(let i = 0; i < fights.length; i++) {
      battleHistory.value.push({
            opponent: `${short(fights[i][0])} vs ${short(fights[i][1])}`,
            details: fights[i][3]?(fights[i][2]?'win':'lose'):'pendding'
          })
    }
    let mantaCount = await inventoryContrat.balanceOfType(wallet);
    for(let i = 0; i < mantaCount.length; i++) {
      if(mantaCount[i][0] == 1) {
        inventory.value.push({
          type:1,
          count:mantaCount[i][1],
          name: "Mutation Potion",
          icon:  "🧪",
          desc: "Randomly changing the monster's genes",
        });
      } else if(mantaCount[i][0] == 2) {
        inventory.value.push({
          type:2,
          count:mantaCount[i][1],
          name: "Energy Recovery Potion",
          icon: "🔋",
          desc: "Immediately restore 50 points of energy.",
        });
      }
    }

    for(let i = 0; i < poffer.length; i++) {
      receivedOffers.push({ 
        id: poffer[i][5], 
        bidder: poffer[i][0], 
        amount: ethers.formatEther(poffer[i][3] + ''), 
        ts: Date.now() - 3600000, 
        status: poffer[i][4] == 0?'open':'close', 
        partnerAvatar: '' 
      })
    }

    for(let i = 0; i < offer.length; i++) {
      sentOffers.value.push({ 
        id: offer[i][5], 
        bidder: offer[i][2], 
        amount: ethers.formatEther(offer[i][3] + ''), 
        ts: Date.now() - 3600000, 
        status: offer[i][4] == 0?'open':'close', 
        partnerAvatar: '' 
      })
    }
  }
  //commonComp.drawPlayer(player,'player-avstart')
})

</script>

<style scoped>
:host {
  background-image: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.03) 25%,
      transparent 25%
    ),
    linear-gradient(-45deg, rgba(255, 255, 255, 0.03) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.03) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.03) 75%);
  background-size: 40px 40px;
}

/* 弹窗淡入 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
