<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Lista de Equipamentos</h1>

    <input
      v-model="search"
      type="text"
      placeholder="Buscar por nome ou modelo..."
      class="mb-4 p-2 border rounded w-full"
    />

    <div v-if="loading" class="text-center text-gray-500">Carregando...</div>

    <div v-if="!loading">
      <div v-if="filteredEquipments.length === 0" class="text-center text-gray-500">
        Nenhum equipamento encontrado.
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="equipment in filteredEquipments"
          :key="equipment.id"
          class="border p-4 rounded shadow"
        >
          <p><strong>Name:</strong> {{ equipment.name }}</p>
          <p><strong>Id:</strong> {{ equipment.id }}</p>
          <p><strong>Modelo:</strong> {{ getModelName(equipment.equipmentModelId) }}</p>
          <p><strong>Descrição:</strong> {{ equipment.description || 'Sem descrição' }}</p>

          <div v-if="showDetails">
            <img
              :src="equipment.imageUrl"
              alt="Imagem"
              class="my-3 w-full max-w-[550px] h-[350px] object-cover bg-gray-100 rounded cursor-pointer transition hover:brightness-90"
              @click="equipment.imageUrl && openImageModal(equipment.imageUrl)"
              @error="handleImageError"
            />

            <div>
              <h3 class="font-bold text-md mb-1">Ganhos por estado:</h3>
              <ul>
                <li
                  v-for="earning in getModelEarnings(equipment.equipmentModelId)"
                  :key="earning.equipmentStateId"
                  class="flex items-center gap-2"
                >
                  <span
                    class="w-3 h-3 rounded-full"
                    :style="{ backgroundColor: getStateColor(earning.equipmentStateId) }"
                  ></span>
                  <span>
                    <strong>{{ getStateName(earning.equipmentStateId) }}</strong>:
                    {{ earning.value.toFixed(2) }} R$
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Imagem com botão de sair -->
    <div
      v-if="selectedImage"
      class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      @click="closeImageModal"
    >
      <div class="relative">
        <!-- Botão de sair -->
        <button
          @click.stop="closeImageModal"
          class="absolute top-2 right-2 bg-teal-300 text-black px-2 py-1 rounded hover:bg-red-400 z-10"
        >
          Fechar
        </button>

        <img
          :src="selectedImage"
          alt="Imagem ampliada"
          class="max-w-[90vw] max-h-[90vh] rounded shadow-lg"
          @click.stop
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFetch } from 'nuxt/app'

interface Equipment {
  id: string
  equipmentModelId: string
  name: string
  description?: string
  imageUrl?: string
}

interface HourlyEarning {
  equipmentStateId: string
  value: number
}

interface EquipmentModel {
  id: string
  name: string
  hourlyEarnings: HourlyEarning[]
}

interface EquipmentState {
  id: string
  name: string
  color: string
}

const search = ref('')
const loading = ref(true)
const rawEquipments = ref<Equipment[]>([])
const equipmentModels = ref<EquipmentModel[]>([])
const equipmentStates = ref<EquipmentState[]>([])

const selectedImage = ref<string | null>(null)

function openImageModal(url: string) {
  selectedImage.value = url
}

function closeImageModal() {
  selectedImage.value = null
}

const imageMap: Record<string, string> = {
  'CA-0001': '/img/img01.jpg',
  'CA-0002': '/img/img02.jpg',
  'CA-0003': '/img/img03.png',
  'CA-0004': '/img/img04.jpg',
  'HV-1001': '/img/img05.jpg',
  'HV-1002': '/img/img06.jpg',
  'GT-2001': '/img/img07.jpg',
  'GT-2002': '/img/img08.jpg',
  'GT-2003': '/img/img09.png'
}

onMounted(async () => {
  const start = Date.now()

  const [equipmentsRes, modelsRes, statesRes] = await Promise.all([
    useFetch<Equipment[]>('/api/equipment/equipments'),
    useFetch<EquipmentModel[]>('/api/equipmentModel/models'),
    useFetch<EquipmentState[]>('/api/equipmentState/states')
  ])

  rawEquipments.value = (equipmentsRes.data.value ?? []).map(e => ({
    ...e,
    imageUrl: imageMap[e.name] || '/img/default.png'
  }))
  equipmentModels.value = modelsRes.data.value ?? []
  equipmentStates.value = statesRes.data.value ?? []

  const elapsed = Date.now() - start
  if (elapsed < 500) await new Promise(res => setTimeout(res, 500 - elapsed))
  loading.value = false
})

const isSearching = computed(() => search.value.trim().length > 0)
const showDetails = computed(() => isSearching.value)

const filteredEquipments = computed(() => {
  if (!isSearching.value) return rawEquipments.value
  const term = search.value.toLowerCase()
  return rawEquipments.value.filter(e =>
    e.name.toLowerCase().includes(term) ||
    getModelName(e.equipmentModelId).toLowerCase().includes(term)
  )
})

function getModelName(modelId: string) {
  return equipmentModels.value.find(m => m.id === modelId)?.name || 'Desconhecido'
}

function getModelEarnings(modelId: string): HourlyEarning[] {
  return equipmentModels.value.find(m => m.id === modelId)?.hourlyEarnings || []
}

function getStateName(stateId: string): string {
  return equipmentStates.value.find(s => s.id === stateId)?.name || 'Estado desconhecido'
}

function getStateColor(stateId: string): string {
  return equipmentStates.value.find(s => s.id === stateId)?.color || '#ccc'
}

function handleImageError(e: Event) {
  const img = e.target as HTMLImageElement
  img.src = '/img/default.png'
}
</script>