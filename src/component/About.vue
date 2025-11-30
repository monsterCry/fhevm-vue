<template>
  <div class="w-full text-white py-12 px-6 max-w-5xl mx-auto">

    <!-- PAGE TITLE -->
    <section class="text-center mb-16">
      <h1 class="text-5xl font-bold mb-4">GeneChain</h1>
      <p class="text-white/60 text-lg leading-relaxed max-w-3xl mx-auto">
        An NFT game utilizing blockchain, FHE encryption and on-chain genetics.
        Mint monsters, combine genes, battle players and evolve through a secure
        fully on-chain ecosystem.
      </p>
    </section>

    <!-- FEATURES -->
    <section class="mb-20">
    <h2 class="text-3xl font-bold text-blue-300 mb-8">FEATURES</h2>

    <div class="grid grid-cols-4 gap-6">

        <!-- NFTs -->
        <div class="p-6 rounded-xl bg-white/5 border border-white/10">
        <p class="text-xl font-semibold mb-2">NFTs</p>
        <p class="text-white/60 text-sm leading-relaxed">
            Unique monsters minted as on-chain assets.
        </p>
        </div>

        <!-- Blockchain -->
        <div class="p-6 rounded-xl bg-white/5 border border-white/10">
        <p class="text-xl font-semibold mb-2">Blockchain</p>
        <p class="text-white/60 text-sm leading-relaxed">
            Secure on-chain game logic.
        </p>
        </div>

        <!-- FHE Encryption -->
        <div class="p-6 rounded-xl bg-white/5 border border-white/10">
        <p class="text-xl font-semibold mb-2">FHE Encryption</p>
        <p class="text-white/60 text-sm leading-relaxed">
            Player attributes private & encrypted.
        </p>
        </div>

        <!-- Genetic Randomness -->
        <div class="p-6 rounded-xl bg-white/5 border border-white/10">
        <p class="text-xl font-semibold mb-2">Genetic Randomness</p>
        <p class="text-white/60 text-sm leading-relaxed">
            On-chain mutation & inheritance.
        </p>
        </div>

    </div>

    <div class="h-[1px] bg-white/10 my-10"></div>
    </section>


    <!-- GAMEPLAY -->
    <section class="mb-20">
    <h2 class="text-3xl font-bold text-blue-300 mb-8">GAMEPLAY</h2>

    <div class="grid grid-cols-4 gap-6">

        <!-- Mint Monsters -->
        <div class="p-6 rounded-xl bg-white/5 border border-white/10">
        <p class="text-xl font-semibold mb-2">Mint Monsters</p>
        <p class="text-white/60 text-sm leading-relaxed">
            Create your first on-chain monster NFT.
        </p>
        </div>

        <!-- Combine Genes -->
        <div class="p-6 rounded-xl bg-white/5 border border-white/10">
        <p class="text-xl font-semibold mb-2">Combine Genes</p>
        <p class="text-white/60 text-sm leading-relaxed">
            Fuse DNA traits to evolve stronger monsters.
        </p>
        </div>

        <!-- Battle Players -->
        <div class="p-6 rounded-xl bg-white/5 border border-white/10">
        <p class="text-xl font-semibold mb-2">Battle Players</p>
        <p class="text-white/60 text-sm leading-relaxed">
            Challenge others and climb the leaderboard.
        </p>
        </div>

        <!-- On-chain Interactions -->
        <div class="p-6 rounded-xl bg-white/5 border border-white/10">
        <p class="text-xl font-semibold mb-2">On-chain Actions</p>
        <p class="text-white/60 text-sm leading-relaxed">
            Every action stored immutably on the blockchain.
        </p>
        </div>

    </div>

    <div class="h-[1px] bg-white/10 my-10"></div>
    </section>

    <!-- ROADMAP -->
    <section class="mb-20">
    <h2 class="text-3xl font-bold text-blue-300 mb-8">ROADMAP</h2>

    <div class="grid grid-cols-4 gap-6">

        <!-- Alpha -->
        <div class="p-6 rounded-xl bg-white/5 border border-white/10">
        <p class="text-xl font-semibold mb-2">Alpha</p>
        <p class="text-white/60 text-sm leading-relaxed">
            Core systems: minting, encrypted stats, basic battles.
        </p>
        </div>

        <!-- Beta -->
        <div class="p-6 rounded-xl bg-white/5 border border-white/10">
        <p class="text-xl font-semibold mb-2">Beta</p>
        <p class="text-white/60 text-sm leading-relaxed">
            Gene swap market + player offer system.
        </p>
        </div>

        <!-- Mainnet Launch -->
        <div class="p-6 rounded-xl bg-white/5 border border-white/10">
        <p class="text-xl font-semibold mb-2">Mainnet Launch</p>
        <p class="text-white/60 text-sm leading-relaxed">
            Full on-chain release with public access.
        </p>
        </div>

        <!-- Season 1 -->
        <div class="p-6 rounded-xl bg-white/5 border border-white/10">
        <p class="text-xl font-semibold mb-2">Season 1</p>
        <p class="text-white/60 text-sm leading-relaxed">
            New monster families, new traits, seasonal ranking events.
        </p>
        </div>

    </div>

    <div class="h-[1px] bg-white/10 my-10"></div>
    </section>


    <!-- SOCIAL -->
    <section class="mb-20">
      <h2 class="text-3xl font-bold text-blue-300 mb-6">SOCIAL</h2>

      <div class="flex items-center gap-14 ml-4">

        <a href="https://github.com" target="_blank" class="hover:opacity-80 transition flex flex-col items-center">
          <div class="text-6xl mb-1">🐙</div>
          <p class="text-white/70 text-sm">GitHub</p>
        </a>

        <a href="https://x.com" target="_blank" class="hover:opacity-80 transition flex flex-col items-center">
          <div class="text-6xl mb-1">❌</div>
          <p class="text-white/70 text-sm">X (Twitter)</p>
        </a>

      </div>
    </section>

  </div>
</template>

<script setup>
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
</style>
