<template>
  <div class="w-full text-white">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <h1 class="text-3xl font-bold">Players</h1>

      <!-- <div class="flex flex-col sm:flex-row gap-3 sm:items-center">

        <div class="relative">
          <input
            v-model="search"
            type="text"
            placeholder="Search by name or address…"
            class="pl-9 pr-3 py-2 rounded-xl bg-white text-black text-sm w-64 focus:outline-none shadow"
          />
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-black/40">
            🔍
          </span>
        </div>

 
        <select
          v-model="filterMode"
          class="px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-sm focus:outline-none"
        >
          <option value="all">All players</option>
          <option value="winrate">Sort by win rate</option>
          <option value="battles">Sort by total battles</option>
        </select>
      </div> -->
    </div>


    <div
      class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
    >
      <div
        v-for="p in pagedPlayers"
        :key="p.id"
        class="group rounded-2xl bg-white/5 border border-white/10 px-4 pt-4 pb-3 shadow transition transform hover:-translate-y-1 hover:shadow-2xl"
      >
        <div
          class="w-full h-36 rounded-2xl bg-black/40 border border-white/10 overflow-hidden mb-3"
          :style="monsterStyle(p)"
        ></div>

        <div class="mb-3">
          <div class="text-lg font-semibold truncate">
            {{ p.name }}
          </div>
          <div class="text-xs text-white/50 mt-1">
            ID: {{ p.id }}
          </div>
          <div class="text-xs text-white/60 mt-1 flex justify-between">
            <span>W: {{ p.wins }} L: {{ p.losses }}</span>
            <span>WR: {{ winRate(p) }}%</span>
          </div>
        </div>

        <div class="flex gap-2 mt-2">
          <button
            @click="openSwap(p)"
            class="flex-1 px-3 py-2 rounded-xl bg-[#2b3245] hover:bg-[#39415a] text-[11px] font-semibold transition shadow"
          >
            GENE SWAP
          </button>

          <button
            @click="startBattle(p)"
            class="flex-1 px-3 py-2 rounded-xl bg-[#ff4f6d] hover:bg-[#ff2f54] text-[11px] font-semibold transition shadow hover:shadow-lg hover:-translate-y-0.5"
          >
            BATTLE
          </button>
        </div>
      </div>
    </div>

    <div class="flex justify-center mt-8" v-if="canLoadMore">
      <button
        @click="loadMore"
        class="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm border border-white/20 transition"
      >
        Load more ({{ visibleCount }}/{{ filteredPlayers.length }})
      </button>
    </div>
    <div
      v-else-if="filteredPlayers.length === 0"
      class="mt-8 text-center text-sm text-white/50"
    >
      No players matched your search.
    </div>


    <transition name="fade">
      <div
        v-if="loadingBattle"
        class="fixed inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-center z-50"
      >
        <div
          class="w-16 h-16 rounded-full border-4 border-white border-t-transparent animate-spin mb-6"
        ></div>
        <h2 class="text-2xl font-bold mb-2">Preparing Battle…</h2>
        <p class="text-white/60 text-sm">
          FHE secure combat calculation running…
        </p>
        <p class="mt-3 text-xs text-white/30" v-if="activeBattlePlayer">
          Target: {{ activeBattlePlayer.name }} ({{ activeBattlePlayer.id }})
        </p>
      </div>
    </transition>

    <transition name="fade">
      <div
        v-if="showSwapModal && activeSwapPlayer"
        class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      >
        <div
          class="bg-[#1c1d22] w-full max-w-md rounded-2xl p-6 border border-white/10 shadow-2xl"
        >
          <h2 class="text-xl font-bold mb-4 text-center">Gene Swap</h2>

          <div class="flex items-center gap-4 mb-6">
            <div
              class="w-20 h-20 rounded-2xl bg-black/40 border border-white/10 overflow-hidden"
              :style="monsterStyle(activeSwapPlayer.id)"
            ></div>
            <div>
              <div class="text-lg font-semibold">
                {{ activeSwapPlayer.name }}
              </div>
              <div class="text-xs text-white/50 mt-1">
                Wins: {{ activeSwapPlayer.wins }} Losses:
                {{ activeSwapPlayer.losses }}
              </div>
            </div>
          </div>

          <div class="mb-6">
            <label class="text-sm text-white/70">Swap Price (ETH)</label>
            <input
              v-model="swapPrice"
              type="number"
              min="0"
              step="0.0001"
              placeholder="Enter price"
              class="w-full mt-1 px-4 py-2 rounded-xl bg-white text-black text-sm focus:outline-none shadow"
            />
          </div>


          <div class="flex gap-3 mt-4">
            <button
              @click="confirmSwap"
              :disabled="swapping"
              class="flex-1 px-4 py-2 bg-[#ff4f6d] hover:bg-[#ff2f54] disabled:bg-[#ff4f6d]/50 text-white rounded-xl font-semibold shadow transition"
            >
              {{ swapping ? "Processing..." : "Confirm" }}
            </button>

            <button
              @click="closeSwap"
              :disabled="swapping"
              class="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 rounded-xl font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from "vue";
const {fhevmObject} = defineProps(['fhevmObject'])


const players = ref([]);


const search = ref("");
const filterMode = ref("all");

const filteredPlayers = computed(() => {
  let list = [...players.value];


  if (search.value.trim()) {
    const s = search.value.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.id.toLowerCase().includes(s)
    );
  }


  if (filterMode.value === "winrate") {
    list.sort((a, b) => winRate(b) - winRate(a));
  } else if (filterMode.value === "battles") {
    list.sort(
      (a, b) =>
        totalBattles(b) - totalBattles(a)
    );
  }

  return list;
});


const pageSize = 8;
const visibleCount = ref(pageSize);

const pagedPlayers = computed(() =>
  filteredPlayers.value.slice(0, visibleCount.value)
);

const canLoadMore = computed(
  () => visibleCount.value < filteredPlayers.value.length
);

const loadMore = () => {
  visibleCount.value += pageSize;
};


const totalBattles = (p) => p.wins + p.losses || 0;
const winRate = (p) => {
  const t = totalBattles(p);
  if (!t) return 0;
  return Math.round((p.wins / t) * 100);
};


const monsterCount = 5;
const monsterWidth = 300;


const monsterStyle = (monster) => {
  return `
    background-image: url('${monster.tokenUri.image}');
    background-size: 1536px auto;
    background-repeat: no-repeat;
  `;
};


const loadingBattle = ref(false);
const activeBattlePlayer = ref(null);

const startBattle = (player) => {
  activeBattlePlayer.value = player;
  loadingBattle.value = true;

  setTimeout(() => {
    loadingBattle.value = false;
    alert("Battle ready vs " + player.name);

  }, 1500);
};


const showSwapModal = ref(false);
const activeSwapPlayer = ref(null);
const swapPrice = ref("");
const swapping = ref(false);

const openSwap = (player) => {
  activeSwapPlayer.value = player;
  swapPrice.value = "";
  showSwapModal.value = true;
};

const closeSwap = () => {
  showSwapModal.value = false;
  swapping.value = false;
};

const confirmSwap = () => {
  if (!swapPrice.value || Number(swapPrice.value) <= 0) {
    alert("Please enter a valid price.");
    return;
  }

  swapping.value = true;


  setTimeout(() => {
    swapping.value = false;
    showSwapModal.value = false;
    alert(
      `Gene Swap offer of ${swapPrice.value} ETH sent to ${activeSwapPlayer.value.name}`
    );

  }, 1500);
};

const loadMonsters = async() => {
    const monsterContract = window.fhevmObject.monsterContract;
    if(!monsterContract) {
      return;
    }
    let playerList = await monsterContract.listMonsters(0,5);
   
    players.value = [];
    for(let i = 0; i < playerList.length; i++) {
      console.log(playerList[i]);
      let tokenUri = JSON.parse(await monsterContract.tokenURI(playerList[i][5]));
      players.value.push({
        id: playerList[i][1],
        name: `${playerList[i][2]}`,
        wins: 0,
        losses: 0,
        tokenUri: tokenUri
      })
      console.log(tokenUri);
    }
}

watchEffect(async() => {
  try {
    await loadMonsters();
  } catch(e) {
    console.error(e)
  }
})
</script>

<style scoped>

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
