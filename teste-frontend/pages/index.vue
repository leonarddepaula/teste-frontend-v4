<template>
  <div class="flex h-screen">
    <!-- Card com mapa (70%) -->
    <UCard class="w-[70%] flex flex-col h-full">
      <template #header>
        <div
          class="h-12 bg-blue-200 text-blue-900 flex items-center justify-center font-semibold"
        >
          Monitoramento
        </div>
      </template>

      <div class="flex-1 bg-green-200 text-green-900 h-180 font-medium p-2">
        <LMap
          class="w-full h-full rounded"
          :zoom="12"
          :center="[-32.0336, -52.0986]"
          :use-global-leaflet="false"
        >
          <LTileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
            layer-type="base"
            name="OpenStreetMap"
          />
        </LMap>
      </div>

      <template #footer>
        <div
          class="h-12 bg-yellow-200 text-yellow-900 flex items-center justify-center font-semibold"
        >
          Rodapé
        </div>
      </template>
    </UCard>

    <!-- Menu lateral (30%) dentro de UCard -->
    <UCard class="w-[30%] flex flex-col h-full">
      <template #header>
        <div
          class="h-12 bg-gray-300 text-gray-800 flex items-center justify-center font-semibold"
        >
          Dispositivos
        </div>
      </template>

      <div class="flex-1 overflow-y-auto p-4 space-y-2 h-180 bg-gray-100">
        <ul class="space-y-2">
          <li class="p-3 bg-white rounded shadow text-sm">
            🌲 Sensor 1 — <span class="text-green-600 font-medium">Ativo</span>
          </li>
          <li class="p-3 bg-white rounded shadow text-sm">
            🔋 Sensor 2 — <span class="text-red-600 font-medium">Inativo</span>
          </li>
          <li class="p-3 bg-white rounded shadow text-sm">
            📡 Sensor 3 —
            <span class="text-yellow-600 font-medium">Instável</span>
          </li>
        </ul>
      </div>

      <template #footer>
        <div
          class="h-12 bg-gray-200 text-gray-700 flex items-center justify-center font-semibold"
        >
          Status Geral
        </div>
      </template>
    </UCard>
  </div>
</template>
