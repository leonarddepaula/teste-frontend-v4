<template>
  <nav class="bg-teal-600 shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center">
          <NuxtLink to="/" class="flex items-center">
            <img src="../assets/img/aiko.png" alt="Logo" class="h-10 w-auto" />
          </NuxtLink>
        </div>

        <!-- Menu Desktop -->
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <NuxtLink
              to="/"
              class="px-3 py-2 rounded-md text-sm font-medium text-teal-100 hover:text-white hover:bg-teal-700 transition-colors duration-300"
              active-class="text-white bg-teal-800"
            >
              Home
            </NuxtLink>
            <NuxtLink
              to="/equipment"
              class="px-3 py-2 rounded-md text-sm font-medium text-teal-100 hover:text-white hover:bg-teal-700 transition-colors duration-300"
              active-class="text-white bg-teal-800"
            >
              Equipments
            </NuxtLink>
            <NuxtLink
              to="/equipmentState"
              class="px-3 py-2 rounded-md text-sm font-medium text-teal-100 hover:text-white hover:bg-teal-700 transition-colors duration-300"
              active-class="text-white bg-teal-800"
            >
              Dashboard
            </NuxtLink>
            <NuxtLink
              to="/mapa"
              class="px-3 py-2 rounded-md text-sm font-medium text-teal-100 hover:text-white hover:bg-teal-700 transition-colors duration-300"
              active-class="text-white bg-teal-800"
            >
              Geolocation
            </NuxtLink>
            <NuxtLink
              to="/favoritos"
              class="px-3 py-2 rounded-md text-sm font-medium text-teal-100 hover:text-white hover:bg-teal-700 transition-colors duration-300"
              active-class="text-white bg-teal-800"
            >
              Alert System
            </NuxtLink>
          </div>
        </div>

        <!-- Botão Mobile -->
        <div class="md:hidden">
          <button
            @click="toggleMenu"
            class="inline-flex items-center justify-center p-2 rounded-md text-teal-200 hover:text-white hover:bg-teal-700 focus:outline-none transition duration-300"
            aria-expanded="false"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
              :class="{ 'hidden': isOpen, 'block': !isOpen }"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              class="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
              :class="{ 'hidden': !isOpen, 'block': isOpen }"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Menu Mobile -->
    <div
      class="md:hidden transition-all duration-300 ease-in-out"
      :class="{ 'max-h-0 overflow-hidden': !isOpen, 'max-h-screen': isOpen }"
    >
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-teal-700">
        <NuxtLink
          to="/"
          class="block px-3 py-2 rounded-md text-base font-medium text-teal-100 hover:text-white hover:bg-teal-600 transition-colors duration-300"
          active-class="text-white bg-teal-800"
          @click="isOpen = false"
        >
          Home
        </NuxtLink>
        <NuxtLink
          to="/equipment"
          class="block px-3 py-2 rounded-md text-base font-medium text-teal-100 hover:text-white hover:bg-teal-600 transition-colors duration-300"
          active-class="text-white bg-teal-800"
          @click="isOpen = false"
        >
          Equipments
        </NuxtLink>
        <NuxtLink
          to="/equipmentState"
          class="block px-3 py-2 rounded-md text-base font-medium text-teal-100 hover:text-white hover:bg-teal-600 transition-colors duration-300"
          active-class="text-white bg-teal-800"
          @click="isOpen = false"
        >
          Dashboard
        </NuxtLink>
        <NuxtLink
          to="/mapa"
          class="block px-3 py-2 rounded-md text-base font-medium text-teal-100 hover:text-white hover:bg-teal-600 transition-colors duration-300"
          active-class="text-white bg-teal-800"
          @click="isOpen = false"
        >
          Geolocation
        </NuxtLink>
        <NuxtLink
          to="/favoritos"
          class="block px-3 py-2 rounded-md text-base font-medium text-teal-100 hover:text-white hover:bg-teal-600 transition-colors duration-300"
          active-class="text-white bg-teal-800"
          @click="isOpen = false"
        >
          Alert System
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)
const toggleMenu = () => {
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
/* Efeito de sublinhado animado para desktop */
@media (min-width: 768px) {
  .router-link-active:not(.bg-teal-800) {
    position: relative;
  }
  
  .router-link-active:not(.bg-teal-800)::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 50%;
    background-color: white;
    transition: all 0.3s ease;
  }
  
  .router-link-active:not(.bg-teal-800):hover::after {
    width: 70%;
    left: 15%;
  }
}

/* Melhor transição para o menu mobile */
.max-h-0 {
  transition: max-height 0.3s ease-out;
}

.max-h-screen {
  transition: max-height 0.5s ease-in;
}

/* Melhor legibilidade para links ativos */
.router-link-active {
  font-weight: 500;
}
</style>