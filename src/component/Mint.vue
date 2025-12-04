<template>
  <div
    class="w-full min-h-screen bg-[#111215] text-white flex flex-col items-center relative overflow-hidden px-4"
  >

    <main
      class="w-full max-w-6xl flex flex-col items-center mt-4 sm:mt-10 mb-10"
    >

      <section class="text-center">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          Generate your own
          <br />
          <span class="text-[#ff4f6d]">NFT Monster</span>
        </h1>
        <p class="mt-3 text-sm sm:text-base text-white/70">
          Connect your wallet, choose amount, and mint your on-chain monsters.
        </p>
      </section>


      <section class="mt-6 sm:mt-10 w-full flex justify-center">
        <div
          class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0 shadow-xl rounded-2xl overflow-hidden bg-white/5 backdrop-blur"
        >
          <input
            v-model="amount"
            type="text"
            placeholder="Please Input Player Name"
            class="px-4 py-3 sm:py-3.5 sm:w-64 bg-white text-black text-sm sm:text-base focus:outline-none"
          />
          <button
            :disabled="isMinting || !walletAddress || isMinted"
            @click="mint"
            class="px-6 sm:px-10 py-3 sm:py-3.5 bg-[#ff4f6d] hover:bg-[#ff2f54] disabled:bg-[#ff4f6d]/50 disabled:cursor-not-allowed transition text-white font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <span v-if="!isMinting">MINT</span>
            <span v-else>Minting…</span>
            <span
              v-if="isMinting"
              class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
            />
          </button>
        </div>
      </section>


      <section class="mt-3 text-xs sm:text-sm text-center text-white/60">
        <p>Max per mint: {{ maxPerMint }} • Network: {{ networkName }}</p>
        <p v-if="errorMessage" class="text-red-400 mt-1">
          {{ errorMessage }}
        </p>
      </section>


      <section
        class="mt-8 sm:mt-12 w-full flex justify-center pointer-events-none"
      >
        <div
          class="relative w-full max-w-5xl flex justify-center animate-bob-slow"
        >
          <img
            src="/public/monster_full.png"
            alt="Monsters"
            class="w-full max-w-4xl drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
          />
        </div>
      </section>
    </main>


    <transition name="fade">
      <div
        v-if="showSuccessModal"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50"
      >
        <transition name="pop">
          <div
            class="bg-[#1c1d21] w-[90%] max-w-md p-6 rounded-2xl shadow-2xl text-center border border-white/10"
          >
            <h2 class="text-2xl font-bold mb-2">🎉 Mint Successful!</h2>
            <p class="text-white/70 text-sm mb-4">
              You minted <span class="font-semibold">{{ amount }}</span> NFT
              monster{{ amount > 1 ? "s" : "" }}.
            </p>

            <img
              src="/public/monster_full.png"
              class="w-64 mx-auto animate-float-once drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
            />

            <button
              class="mt-6 px-6 py-2 bg-[#ff4f6d] hover:bg-[#ff2f54] transition rounded-xl font-semibold"
              @click="showSuccessModal = false"
            >
              CLOSE
            </button>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { ethers } from 'ethers';
const {wallet} = defineProps(['wallet'])

const amount = ref('');
const maxPerMint = 1;

const walletAddress = ref("");
const connecting = ref(false);
const isMinting = ref(false);
const isMinted= ref(false);

const errorMessage = ref("");
const networkName = "EVM Compatible";

const showSuccessModal = ref(false);

const mint = async () => {

  if (!walletAddress.value) {
    errorMessage.value = "Please connect wallet first.";
    return;
  }
  if(amount.value == '') {
    errorMessage.value = "Please Input Player Name";
    return;
  }

  try {
    isMinting.value = true;
    let minterContract = window.fhevmObject.minterContract;
    console.log(amount.value);
    let tx = await minterContract.mintMonsterEgg(amount.value,{
      value: ethers.parseEther('0.0001')
    });
    await tx.wait();
    showSuccessModal.value = true;
    isMinted.value = true;
  } catch (e) {
    console.error(e)
    errorMessage.value = "Mint failed." ;
  } finally {
    isMinting.value = false;
  }
};

watchEffect(async() => {
  if(!wallet) {
    return;
  }
  let signer = window.fhevmObject.fhevmSigner;
  walletAddress.value = signer.address;
  let monsterContract = window.fhevmObject.monsterContract;
  //Check Is Minted
  let prop = await monsterContract.getProperty(signer.address);
  console.log(prop);
  isMinted.value = prop[3];
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


@keyframes bob-slow {
  0% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
  100% { transform: translateY(0); }
}
.animate-bob-slow {
  animation: bob-slow 4s ease-in-out infinite;
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pop-enter-active {
  animation: pop-in 0.3s ease forwards;
}
@keyframes pop-in {
  0% { transform: scale(0.6); opacity: 0; }
  80% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); }
}


@keyframes floatOnce {
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
.animate-float-once {
  animation: floatOnce 0.6s ease-out forwards;
}
</style>
