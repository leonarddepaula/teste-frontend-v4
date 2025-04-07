<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
    <!-- Conteúdo Principal -->
    <div class="max-w-7xl w-full">
      <!-- Logo Centralizado -->
      <div class="flex justify-center mb-16">
        <img 
          src="/assets/img/aiko.png" 
          alt="Logo da Empresa" 
          class="h-32 w-auto"
          @error="handleLogoError"
        >
      </div>

      <!-- Cards de Serviços -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Card 1 -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
          <div class="p-6">
            <div class="flex items-center mb-4">
              <div class="bg-blue-100 p-3 rounded-full">
                <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 class="ml-3 text-lg font-medium text-gray-900">Monitoramento Inteligente</h3>
            </div>
            <p class="text-gray-600">
              Solução completa para monitoramento de ativos em tempo real com alertas inteligentes e relatórios personalizados.
            </p>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
          <div class="p-6">
            <div class="flex items-center mb-4">
              <div class="bg-green-100 p-3 rounded-full">
                <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 class="ml-3 text-lg font-medium text-gray-900">Segurança Avançada</h3>
            </div>
            <p class="text-gray-600">
              Proteção de dados e sistemas com criptografia de ponta a ponta e protocolos de segurança de última geração.
            </p>
          </div>
        </div>

        <!-- Card 3 -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
          <div class="p-6">
            <div class="flex items-center mb-4">
              <div class="bg-purple-100 p-3 rounded-full">
                <svg class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="ml-3 text-lg font-medium text-gray-900">Soluções Mobile</h3>
            </div>
            <p class="text-gray-600">
              Aplicativos personalizados para gestão remota com interface intuitiva e sincronização em tempo real.
            </p>
          </div>
        </div>

        <!-- Card 4 -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
          <div class="p-6">
            <div class="flex items-center mb-4">
              <div class="bg-yellow-100 p-3 rounded-full">
                <svg class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 class="ml-3 text-lg font-medium text-gray-900">Análise de Dados</h3>
            </div>
            <p class="text-gray-600">
              Business Intelligence com dashboards interativos e relatórios automatizados para tomada de decisão estratégica.
            </p>
          </div>
        </div>

        <!-- Card 5 -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
          <div class="p-6">
            <div class="flex items-center mb-4">
              <div class="bg-red-100 p-3 rounded-full">
                <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="ml-3 text-lg font-medium text-gray-900">Suporte 24/7</h3>
            </div>
            <p class="text-gray-600">
              Equipe especializada disponível a qualquer momento para garantir a continuidade dos seus negócios.
            </p>
          </div>
        </div>

        <!-- Card 6 -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
          <div class="p-6">
            <div class="flex items-center mb-4">
              <div class="bg-indigo-100 p-3 rounded-full">
                <svg class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 class="ml-3 text-lg font-medium text-gray-900">Infraestrutura</h3>
            </div>
            <p class="text-gray-600">
              Hospedagem em cloud com alta disponibilidade e redundância para máxima performance e segurança.
            </p>
          </div>
        </div>
      </div>

      <!-- Seção de Destaque -->
      <div class="mt-20 bg-white rounded-xl shadow-md overflow-hidden">
        <div class="md:flex">
          <div class="md:flex-shrink-0">
          </div>
          <div class="p-8">
            <div class="uppercase tracking-wide text-sm text-blue-600 font-semibold">Inovação</div>
            <h2 class="mt-2 text-2xl font-semibold text-gray-900">Soluções Personalizadas para seu Negócio</h2>
            <p class="mt-3 text-gray-600">
              Nossa equipe de especialistas está pronta para desenvolver a solução perfeita para suas necessidades específicas, 
              combinando tecnologia de ponta com anos de experiência no mercado.
            </p>
            <div class="mt-6 flex items-center justify-center">
              <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                Fale com nossos especialistas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const handleLogoError = (e) => {
  const img = e.target
  img.src = '/default-logo.png'
}
</script>

<style scoped>
/* Transição suave para hover nos cards */
.transition-transform {
  transition-property: transform;
}
.duration-300 {
  transition-duration: 300ms;
}
</style>