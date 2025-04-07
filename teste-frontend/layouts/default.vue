<template>
  <div class="flex flex-col min-h-screen">
    <!-- Cabeçalho -->
    <Header />

    <!-- Conteúdo principal -->
    <main class="flex-1">
      <UContainer class="my-4">
        <slot />
      </UContainer>
    </main>

    <!-- Rodapé -->
    <Footer />
  </div>
</template>

<script setup lang="ts">

</script>
