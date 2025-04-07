<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Estado de Equipamentos</h1>

    <!-- Filtro principal -->
    <div class="flex flex-col md:flex-row gap-4 mb-4">
      <input
        v-model="equipmentSearch"
        type="text"
        placeholder="Buscar equipamento por nome ou ID..."
        class="p-2 border rounded w-full"
      />
    </div>

    <!-- Mostrar apenas quando um equipamento está selecionado -->
    <div v-if="selectedEquipment" class="mb-6 p-4 border rounded bg-gray-50">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-400">
          Analisando: {{ selectedEquipment.name }} ({{ selectedEquipment.id }})
        </h2>
        <button
          @click="selectedEquipment = null"
          class="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Limpar seleção
        </button>
      </div>

      <!-- Filtros para o equipamento selecionado -->
      <div class="flex flex-col md:flex-row gap-4 mb-4 text-gray-600">
        <select v-model="stateFilter" class="p-2 border rounded w-full">
          <option value="">Todos os estados</option>
          <option
            v-for="state in availableStates"
            :key="state.id"
            :value="state.id"
          >
            {{ state.name }}
          </option>
        </select>

        <input
          v-model="dateFilter"
          type="date"
          class="p-2 border rounded w-full"
          placeholder="Filtrar por data"
        />
      </div>

      <!-- Resumo financeiro -->
      <div class="mb-4 p-4 bg-white border rounded shadow">
        <h3 class="font-bold text-lg mb-3 text-gray-400">Resumo Financeiro</h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div class="p-3 border rounded bg-blue-50">
            <h4 class="font-medium text-sm text-blue-700 mb-1">Ganho Total</h4>
            <p
              class="text-2xl font-bold"
              :class="{
                'text-green-600': totalEarnings >= 0,
                'text-red-600': totalEarnings < 0,
              }"
            >
              {{ formatCurrency(totalEarnings) }}
            </p>
          </div>

          <div class="p-3 border rounded bg-purple-50">
            <h4 class="font-medium text-sm text-purple-700 mb-1">
              Tempo Produtivo
            </h4>
            <p class="text-2xl font-bold text-gray-400">
              {{ productiveTime.toFixed(2) }}h
            </p>
          </div>

          <div class="p-3 border rounded bg-amber-50">
            <h4 class="font-medium text-sm text-amber-700 mb-1">
              Tempo Improdutivo
            </h4>
            <p class="text-2xl font-bold text-gray-400">
              {{ unproductiveTime.toFixed(2) }}h
            </p>
          </div>
        </div>

        <!-- Detalhamento por estado -->
        <div class="border rounded overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-100">
              <tr>
                <th
                  class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Estado
                </th>
                <th
                  class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Tempo
                </th>
                <th
                  class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Valor/Hora
                </th>
                <th
                  class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Total
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(earning, stateId) in earningsByState" :key="stateId">
                <td class="px-4 py-2 whitespace-nowrap text-gray-400">
                  <span
                    class="inline-block w-3 h-3 rounded-full mr-2"
                    text
                    :style="{ backgroundColor: getStateColor(stateId) }"
                  ></span>
                  {{ getStateName(stateId) }}
                </td>
                <td class="px-4 py-2 whitespace-nowrap text-gray-400">
                  {{ earning.hours.toFixed(2) }}h
                </td>
                <td class="px-4 py-2 whitespace-nowrap text-gray-400">
                  {{ formatCurrency(earning.hourlyRate) }}
                </td>
                <td
                  class="px-4 py-2 whitespace-nowrap font-medium"
                  :class="{
                    'text-green-600': earning.total >= 0,
                    'text-red-600': earning.total < 0,
                  }"
                >
                {{ getTimeInState(selectedEquipment.id, stateId).toFixed(2) }}h
            </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Resumo do tempo por estado -->
      <div class="mb-4 p-4 bg-white border rounded shadow">
        <h3 class="font-bold text-lg mb-3 text-gray-400">
          Tempo Total em Cada Estado
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div
            v-for="state in equipmentStates"
            :key="state.id"
            class="flex items-center justify-between p-2 border rounded text-gray-400"
            :style="{ backgroundColor: state.color + '20' }"
          >
            <span class="flex items-center">
              <span
                class="w-3 h-3 rounded-full mr-2"
                :style="{ backgroundColor: state.color }"
              ></span>
              {{ state.name }}:
            </span>
            <span class="font-medium">
              {{ getTimeInState(selectedEquipment.id, state.id).toFixed(2) }}h
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center text-gray-500">Carregando...</div>

    <!-- Lista de equipamentos -->
    <div v-if="!selectedEquipment">
      <div
        v-if="filteredEquipments.length === 0 && !loading"
        class="text-center text-gray-500"
      >
        Nenhum equipamento encontrado.
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="equipment in filteredEquipments"
          :key="equipment.id"
          class="border p-4 rounded shadow hover:shadow-md transition-shadow cursor-pointer"
          @click="selectEquipment(equipment)"
        >
          <div class="flex justify-between items-start">
            <div>
              <p class="font-bold text-l">
                <strong>Name:</strong> {{ equipment.name }}
              </p>
              <p class="text-sm"><strong>ID:</strong> {{ equipment.id }}</p>
            </div>
            <span
              class="px-2 py-1 rounded-full text-xs font-medium"
              :style="{
                backgroundColor: getCurrentStateColor(equipment.id),
                color: getTextColorForState(getCurrentStateColor(equipment.id)),
              }"
            >
              {{ getCurrentStateName(equipment.id) }}
            </span>
          </div>
          <p class="mt-2">
            <strong>Modelo:</strong>
            {{ getModelName(equipment.equipmentModelId) }}
          </p>

          <!-- Pré-visualização do ganho total -->
          <div class="mt-2 text-sm">
            <span class="font-medium">Ganho Total: </span>
            <span
              :class="{
                'text-green-300': getEquipmentTotalEarnings(equipment.id) >= 0,
                'text-red-300': getEquipmentTotalEarnings(equipment.id) < 0,
              }"
            >
              R$ XXX XXX XX
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Histórico do equipamento selecionado -->
    <div v-else>
      <div class="bg-white p-4 rounded shadow mb-4">
        <h3 class="font-bold text-lg mb-3 text-gray-400">
          Histórico de Estados
        </h3>

        <div
          v-if="filteredStateHistory.length === 0"
          class="text-center text-gray-500 py-4"
        >
          Nenhum registro encontrado com os filtros atuais
        </div>

        <div
          v-else
          class="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar"
        >
          <div
            v-for="(record, index) in filteredStateHistory"
            :key="index"
            class="border-l-4 pl-3 py-2"
            :style="{ borderColor: getStateColor(record.equipmentStateId) }"
          >
            <div class="flex justify-between items-center">
              <span class="font-medium">{{
                getStateName(record.equipmentStateId)
              }}</span>
              <span class="text-sm text-gray-400">{{
                formatDate(record.date)
              }}</span>
            </div>

            <div
              v-if="index < filteredStateHistory.length - 1"
              class="mt-1 text-sm"
            >
              <span class="text-gray-400">
                Duração:
                {{
                  calculateDuration(
                    record.date,
                    filteredStateHistory[index + 1].date
                  )
                }}
              </span>
              <span class="ml-2 text-gray-400">
                • Ganho:
                <span
                  :class="{
                    'text-green-600':
                      getStateEarning(
                        record.equipmentStateId,
                        record.date,
                        filteredStateHistory[index + 1].date
                      ) >= 0,
                    'text-red-600':
                      getStateEarning(
                        record.equipmentStateId,
                        record.date,
                        filteredStateHistory[index + 1].date
                      ) < 0,
                  }"
                >
                  {{
                    formatCurrency(
                      getStateEarning(
                        record.equipmentStateId,
                        record.date,
                        filteredStateHistory[index + 1].date
                      )
                    )
                  }}
                </span>
              </span>
            </div>
            <div v-else class="mt-1 text-sm">
              <span class="text-gray-600">
                Duração: {{ calculateDuration(record.date, new Date()) }} (até
                agora)
              </span>
              <span class="ml-2">
                • Ganho:
                <span
                  :class="{
                    'text-green-600':
                      getStateEarning(
                        record.equipmentStateId,
                        record.date,
                        new Date()
                      ) >= 0,
                    'text-red-600':
                      getStateEarning(
                        record.equipmentStateId,
                        record.date,
                        new Date()
                      ) < 0,
                  }"
                >
                  {{
                    formatCurrency(
                      getStateEarning(
                        record.equipmentStateId,
                        record.date,
                        new Date()
                      )
                    )
                  }}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useFetch } from "nuxt/app";

interface EquipmentStateHistory {
  equipmentId: string;
  states: {
    date: Date;
    equipmentStateId: string;
  }[];
}

interface Equipment {
  id: string;
  equipmentModelId: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

interface EquipmentState {
  id: string;
  name: string;
  color: string;
}

interface EquipmentModel {
  id: string;
  name: string;
  hourlyEarnings: {
    equipmentStateId: string;
    value: number;
  }[];
}

const equipmentSearch = ref("");
const stateFilter = ref("");
const dateFilter = ref("");
const selectedEquipment = ref<Equipment | null>(null);
const loading = ref(true);
const rawEquipments = ref<Equipment[]>([]);
const equipmentModels = ref<EquipmentModel[]>([]);
const equipmentStates = ref<EquipmentState[]>([]);
const equipmentStateHistory = ref<EquipmentStateHistory[]>([]);

onMounted(async () => {
  const [equipmentsRes, modelsRes, statesRes, stateHistoryRes] =
    await Promise.all([
      useFetch<Equipment[]>("/api/equipment/equipments"),
      useFetch<EquipmentModel[]>("/api/equipmentModel/models"),
      useFetch<EquipmentState[]>("/api/equipmentState/states"),
      useFetch<EquipmentStateHistory[]>(
        "/api/equipmentStateHistory/equipmentStateHistory"
      ),
    ]);

  rawEquipments.value = equipmentsRes.data.value ?? [];
  equipmentModels.value = modelsRes.data.value ?? [];
  equipmentStates.value = statesRes.data.value ?? [];
  equipmentStateHistory.value = stateHistoryRes.data.value ?? [];

  loading.value = false;
});

// Filtra equipamentos para a busca inicial
const filteredEquipments = computed(() => {
  if (!equipmentSearch.value.trim()) return rawEquipments.value;

  const term = equipmentSearch.value.toLowerCase();
  return rawEquipments.value.filter(
    (e) =>
      e.name.toLowerCase().includes(term) || e.id.toLowerCase().includes(term)
  );
});

// Estados disponíveis para o equipamento selecionado
const availableStates = computed(() => {
  if (!selectedEquipment.value) return [];
  const history = getEquipmentHistory(selectedEquipment.value.id);
  const stateIds = new Set(history.map((h) => h.equipmentStateId));
  return equipmentStates.value.filter((s) => stateIds.has(s.id));
});

// Histórico filtrado para o equipamento selecionado
const filteredStateHistory = computed(() => {
  if (!selectedEquipment.value) return [];

  let history = getEquipmentHistory(selectedEquipment.value.id);

  // Aplica filtro de estado
  if (stateFilter.value) {
    history = history.filter((h) => h.equipmentStateId === stateFilter.value);
  }

  // Aplica filtro de data
  if (dateFilter.value) {
    const filterDateStr = new Date(dateFilter.value)
      .toISOString()
      .split("T")[0];
    history = history.filter((h) => {
      const recordDateStr = new Date(h.date).toISOString().split("T")[0];
      return recordDateStr === filterDateStr;
    });
  }

  return history;
});

// Cálculos financeiros
const earningsByState = computed(() => {
  const result: Record<string, { hours: number; hourlyRate: number; total: number }> = {};

  if (!selectedEquipment.value) return result;

  const history = filteredStateHistory.value;
  const model = equipmentModels.value.find(
    m => m.id === selectedEquipment.value?.equipmentModelId
  );

  if (!model || !history.length) return result;

  // Ordenação garantida
  const sortedHistory = [...history].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Data máxima para o último registro (opcional: pode usar new Date() se for o comportamento desejado)
  const maxEndDate = new Date();
  maxEndDate.setHours(23, 59, 59, 999); // Fim do dia atual

  for (let i = 0; i < sortedHistory.length; i++) {
    const current = sortedHistory[i];
    const startDate = new Date(current.date);
    
    // Verifica data de início válida
    if (isNaN(startDate.getTime())) {
      console.error("Data inválida no histórico:", current.date);
      continue;
    }

    const endDate = i < sortedHistory.length - 1 
      ? new Date(sortedHistory[i + 1].date)
      : maxEndDate;

    // Verifica intervalo válido
    if (endDate <= startDate) {
      console.warn("Intervalo inválido:", startDate, endDate);
      continue;
    }

    const hours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    
    // Ignora intervalos negativos ou muito grandes
    if (hours <= 0 || hours > 744) { // 744h = 31 dias
      console.warn("Intervalo inválido calculado:", hours, "horas entre", startDate, "e", endDate);
      continue;
    }

    const hourlyRate = model.hourlyEarnings.find(
      e => e.equipmentStateId === current.equipmentStateId
    )?.value || 0;
    const total = hours * hourlyRate;

    if (!result[current.equipmentStateId]) {
      result[current.equipmentStateId] = { hours: 0, hourlyRate, total: 0 };
    }

    result[current.equipmentStateId].hours += hours;
    result[current.equipmentStateId].total += total;
  }

  return result;
});

const totalEarnings = computed(() => {
  return Object.values(earningsByState.value).reduce(
    (sum, earning) => sum + earning.total,
    0
  );
});

const productiveTime = computed(() => {
  if (!selectedEquipment.value) return 0;

  const model = equipmentModels.value.find(
    (m) => m.id === selectedEquipment.value?.equipmentModelId
  );
  if (!model) return 0;

  return Object.entries(earningsByState.value)
    .filter(([stateId]) => {
      const earning = model.hourlyEarnings.find(
        (e) => e.equipmentStateId === stateId
      );
      return earning && earning.value > 0;
    })
    .reduce((sum, [, { hours }]) => sum + hours, 0);
});

const unproductiveTime = computed(() => {
  if (!selectedEquipment.value) return 0;

  const model = equipmentModels.value.find(
    (m) => m.id === selectedEquipment.value?.equipmentModelId
  );
  if (!model) return 0;

  return Object.entries(earningsByState.value)
    .filter(([stateId]) => {
      const earning = model.hourlyEarnings.find(
        (e) => e.equipmentStateId === stateId
      );
      return !earning || earning.value <= 0;
    })
    .reduce((sum, [, { hours }]) => sum + hours, 0);
});

function selectEquipment(equipment: Equipment) {
  selectedEquipment.value = equipment;
  stateFilter.value = "";
  dateFilter.value = "";
}

function getEquipmentHistory(equipmentId: string) {
  const history = equipmentStateHistory.value.find(
    h => h.equipmentId === equipmentId
  );
  
  if (!history) return [];
  
  return [...history.states]
    .map(state => ({
      ...state,
      date: new Date(state.date) // Garante que é Date object
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .filter(state => !isNaN(state.date.getTime())); // Filtra datas inválidas
}

function getTimeInState(equipmentId: string, stateId: string): number {
  const history = getEquipmentHistory(equipmentId);
  let totalHours = 0;

  // Adiciona validação do histórico
  if (!history || history.length === 0) return 0;

  // Garante a ordenação correta por data
  const sortedHistory = [...history].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Define uma data máxima razoável (opcional: pode ser ajustada)
  const maxEndDate = new Date();
  maxEndDate.setHours(23, 59, 59, 999); // Fim do dia atual

  for (let i = 0; i < sortedHistory.length; i++) {
    const current = sortedHistory[i];
    
    // Verifica se é o estado que queremos calcular
    if (current.equipmentStateId !== stateId) continue;

    // Converte e valida a data de início
    const startDate = new Date(current.date);
    if (isNaN(startDate.getTime())) {
      console.warn(`Data inválida no equipamento ${equipmentId}:`, current.date);
      continue;
    }

    // Determina a data final
    let endDate: Date;
    if (i < sortedHistory.length - 1) {
      endDate = new Date(sortedHistory[i + 1].date);
      if (isNaN(endDate.getTime())) {
        console.warn(`Data final inválida no equipamento ${equipmentId}:`, sortedHistory[i + 1].date);
        continue;
      }
    } else {
      endDate = maxEndDate;
    }

    // Verifica se o intervalo é válido
    if (endDate <= startDate) {
      console.warn(`Intervalo inválido no equipamento ${equipmentId}:`, startDate, endDate);
      continue;
    }

    // Calcula as horas
    const hours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    
    // Adiciona validação para intervalos muito grandes
    if (hours > 744) { // 31 dias = 744 horas
      console.warn(`Intervalo excessivo no equipamento ${equipmentId}:`, hours, 'horas entre', startDate, 'e', endDate);
      continue;
    }

    totalHours += hours;
  }

  return parseFloat(totalHours.toFixed(2)); // Retorna com 2 casas decimais
}

function getStateEarning(
  stateId: string,
  startDate: Date,
  endDate: Date
): number {
  if (!selectedEquipment.value) return 0;

  const model = equipmentModels.value.find(
    (m) => m.id === selectedEquipment.value?.equipmentModelId
  );
  if (!model) return 0;

  const hourlyRate =
    model.hourlyEarnings.find((e) => e.equipmentStateId === stateId)?.value ||
    0;
  const hours =
    (new Date(endDate).getTime() - new Date(startDate).getTime()) /
    (1000 * 60 * 60);

  return hours * hourlyRate;
}

function getEquipmentTotalEarnings(equipmentId: string): number {
  const history = getEquipmentHistory(equipmentId);
  const equipment = rawEquipments.value.find((e) => e.id === equipmentId);
  if (!equipment) return 0;

  const model = equipmentModels.value.find(
    (m) => m.id === equipment.equipmentModelId
  );
  if (!model) return 0;

  let total = 0;

  for (let i = 0; i < history.length; i++) {
    const current = history[i];
    const endDate =
      i < history.length - 1 ? new Date(history[i + 1].date) : new Date();
    const startDate = new Date(current.date);
    const hours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

    const hourlyRate =
      model.hourlyEarnings.find(
        (e) => e.equipmentStateId === current.equipmentStateId
      )?.value || 0;
    total += hours * hourlyRate;
  }

  return total;
}
function calculateDuration(start: Date, end: Date): string {
  // Validação rigorosa das datas
  if (!(start instanceof Date)) start = new Date(start);
  if (!(end instanceof Date)) end = new Date(end);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    console.error("Datas inválidas:", start, end);
    return "Datas inválidas";
  }

  const diffMs = end.getTime() - start.getTime();
  
  if (diffMs < 0) {
    console.warn("Data final anterior à data inicial:", start, end);
    return "Intervalo inválido";
  }

  const hours = diffMs / (1000 * 60 * 60);
  
  // Limitação realista (2 meses = 1440 horas)
  if (hours > 1440) {
    console.warn("Duração excessiva:", hours, "horas entre", start, "e", end);
    return "Período muito longo";
  }

  // Formatação aprimorada
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} min${minutes !== 1 ? 's' : ''}`;
  } else if (hours < 24) {
    const formatted = hours % 1 === 0 ? hours.toString() : hours.toFixed(1);
    return `${formatted} hora${formatted === '1' ? '' : 's'}`;
  } else {
    const days = (hours / 24);
    const formatted = days % 1 === 0 ? days.toString() : days.toFixed(1);
    return `${formatted} dia${formatted === '1' ? '' : 's'}`;
  }
}

function getStateName(stateId: string): string {
  return (
    equipmentStates.value.find((s) => s.id === stateId)?.name || "Desconhecido"
  );
}

function getStateColor(stateId: string): string {
  return equipmentStates.value.find((s) => s.id === stateId)?.color || "#ccc";
}

function getCurrentStateId(equipmentId: string): string | null {
  const history = getEquipmentHistory(equipmentId);
  return history.length > 0
    ? history[history.length - 1].equipmentStateId
    : null;
}

function getCurrentStateName(equipmentId: string): string {
  const stateId = getCurrentStateId(equipmentId);
  return stateId ? getStateName(stateId) : "Estado não disponível";
}

function getCurrentStateColor(equipmentId: string): string {
  const stateId = getCurrentStateId(equipmentId);
  return stateId ? getStateColor(stateId) : "#999";
}

function getModelName(modelId: string) {
  return (
    equipmentModels.value.find((m) => m.id === modelId)?.name || "Desconhecido"
  );
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getTextColorForState(bgColor: string): string {
  const r = parseInt(bgColor.substring(1, 3), 16);
  const g = parseInt(bgColor.substring(3, 5), 16);
  const b = parseInt(bgColor.substring(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const equipmentEarningsPreview = computed(() => {
  return rawEquipments.value.map(equipment => {
    const history = getEquipmentHistory(equipment.id);
    const model = equipmentModels.value.find(m => m.id === equipment.equipmentModelId);
    
    if (!model) return { id: equipment.id, earnings: 0 };

    let earnings = 0;
    const maxEndDate = new Date();

    for (let i = 0; i < history.length; i++) {
      const current = history[i];
      const endDate = i < history.length - 1 
        ? new Date(history[i + 1].date) 
        : maxEndDate;
      
      const hours = (endDate.getTime() - new Date(current.date).getTime()) / (1000 * 60 * 60);
      const hourlyRate = model.hourlyEarnings.find(
        e => e.equipmentStateId === current.equipmentStateId
      )?.value || 0;
      
      earnings += hours * hourlyRate;
    }

    return { id: equipment.id, earnings };
  });
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
