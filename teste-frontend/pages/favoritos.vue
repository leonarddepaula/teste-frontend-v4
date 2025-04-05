<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Frases Favoritas</h1>

    <input
      v-model="newPhrase"
      type="text"
      placeholder="Digite uma frase..."
      class="border border-gray-300 rounded px-4 py-2 mb-2 w-full"
    />
    <button
      @click="savePhrase"
      class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
    >
      Salvar Frase
    </button>

    <div class="mt-6">
      <h2 class="text-xl font-semibold mb-2">Frases salvas:</h2>
      <ul class="list-disc list-inside">
        <li v-for="(phrase, index) in store.phrases" :key="index">{{ phrase }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStore } from '../stores/main'
import { useNuxtApp } from 'nuxt/app'

const { $toast } = useNuxtApp()

onMounted(() => {
  $toast.success('Olá, seja bem-vindo ao sistema de frases favoritas!')
})

const store = useStore()
const newPhrase = ref('')

const savePhrase = () => {
  if (newPhrase.value.trim()) {
    store.addPhrase(newPhrase.value)
    $toast.success('Frase adicionada com sucesso!')
    newPhrase.value = ''
  } else {
    $toast.error('Digite uma frase antes de salvar.')
  }
}
</script>
