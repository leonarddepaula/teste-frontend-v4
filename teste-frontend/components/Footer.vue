<template>
    <footer class="mt-8 text-center text-gray-100 bg-gray-800 py-6 min-h-[140px]">
      <USeparator
        label="Leo de Paula"
        :ui="{ label: 'text-primary-300 dark:text-primary-400' }"
      />
  
      <div class="mt-4 space-y-2">
        <p class="text-green-400 font-semibold">Teste Frontend Aiko</p>
  
        <!-- Links com ícones -->
        <div class="flex justify-center space-x-6 text-sm">
          <NuxtLink
            to="https://github.com/leonardodepaula"
            target="_blank"
            class="flex items-center space-x-2 hover:text-white transition-colors"
          >
            <GithubIcon class="w-5 h-5" />
            <span>GitHub</span>
          </NuxtLink>
  
          <NuxtLink
            to="https://linkedin.com/in/leonardodepaula"
            target="_blank"
            class="flex items-center space-x-2 hover:text-white transition-colors"
          >
            <Linkedin class="w-5 h-5" />
            <span>LinkedIn</span>
          </NuxtLink>
  
          <NuxtLink
            to="mailto:leonardo@email.com"
            class="flex items-center space-x-2 hover:text-white transition-colors"
          >
            <Mail class="w-5 h-5" />
            <span>Contato</span>
          </NuxtLink>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup lang="ts">
  import { Github as GithubIcon, Linkedin, Mail } from 'lucide-vue-next'
  </script>
  