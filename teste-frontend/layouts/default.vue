<template>
  <div>
    <nav class="flex items-center justify-between flex-wrap bg-teal-600 p-6">
      <!-- Logo com imagem -->
      <div class="flex items-center flex-shrink-0 text-white mr-6 ">
        <NuxtLink to="/">
          <img src="../assets/img/aiko.png" alt="Logo" class="h-10 w-auto" />
        </NuxtLink>
      </div>

      <!-- Botão do menu mobile -->
      <div class="block lg:hidden">
        <button
          class="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white"
          @click="toggleMenu"
        >
          <svg
            class="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path
              :class="{ hidden: isOpen, 'inline-block': !isOpen }"
              class="fill-current"
              d="M0 0h20v20H0z"
            />
            <path
              :class="{ hidden: !isOpen, 'inline-block': isOpen }"
              class="fill-current"
              d="M0 0h20v20H0z"
            />
          </svg>
        </button>
      </div>

      <!-- Links de navegação -->
      <div class="text-sm lg:flex-grow">
        <NuxtLink
          to="/"
          class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
        >
          Home
        </NuxtLink>
        <NuxtLink
          to="/"
          class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
        >
          Vídeos
        </NuxtLink>
        <NuxtLink
          to="/"
          class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
        >
          Adicionar Vídeo
        </NuxtLink>
        <NuxtLink
          to="/favoritos"
          class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
        >
          Favoritos
        </NuxtLink>
      </div>

      <!-- Selector de idioma -->
      <div>
        <select>
          <option value="pt">pt</option>
          <option value="en">en</option>
        </select>
      </div>
    </nav>

    <!-- Conteúdo da página -->
    <UContainer class="my-4">
      <slot></slot>
    </UContainer>

    <!-- Rodapé -->
    <USeparator
      label="Leo de Paula"
      :ui="{ label: 'text-primary-500 dark:text-primary-400' }"
    />
    Rodapé Padrão
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isOpen = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};
</script>
