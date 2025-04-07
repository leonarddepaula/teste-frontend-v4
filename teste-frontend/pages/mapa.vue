<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useFetch } from "nuxt/app";
import { LMap, LTileLayer, LMarker, LPopup, LPolyline } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression } from "leaflet";

interface Position {
  date: string;
  lat: number;
  lon: number;
}

interface EquipmentPositionData {
  equipmentId: string;
  positions: Position[];
}

interface Equipment {
  id: string;
  equipmentModelId: string;
  name: string;
}

interface EquipmentModel {
  id: string;
  name: string;
  hourlyEarnings: {
    equipmentStateId: string;
    value: number;
  }[];
}

interface EquipmentState {
  id: string;
  name: string;
  color: string;
}

interface EquipmentStateHistory {
  equipmentId: string;
  states: {
    date: string;
    equipmentStateId: string;
  }[];
}

interface EquipmentPath {
  equipmentId: string;
  path: LatLngExpression[];
}

// Configurações iniciais
const DEFAULT_ZOOM = 8;
const DEFAULT_CENTER: [number, number] = [-15.788, -47.879];

// Estado do componente
const equipmentPositionsData = ref<EquipmentPositionData[]>([]);
const equipmentsList = ref<Equipment[]>([]);
const equipmentModels = ref<EquipmentModel[]>([]);
const equipmentStates = ref<EquipmentState[]>([]);
const equipmentStateHistory = ref<EquipmentStateHistory[]>([]);
const mapCenter = ref<[number, number]>(DEFAULT_CENTER);
const mapZoom = ref(DEFAULT_ZOOM);
const loading = ref(true);
const dateFilter = ref("");
const nameFilter = ref("");
const showPolylines = ref(false);
const mapBounds = ref<LatLngExpression[]>([]);

// Carrega todos os dados necessários
const loadData = async () => {
  try {
    loading.value = true;
    
    const [positionsRes, equipmentsRes, modelsRes, statesRes, historyRes] = await Promise.all([
      useFetch<EquipmentPositionData[]>("/api/equipmentPositionHistory/equipmentPositions"),
      useFetch<Equipment[]>("/api/equipment/equipments"),
      useFetch<EquipmentModel[]>("/api/equipmentModel/models"),
      useFetch<EquipmentState[]>("/api/equipmentState/states"),
      useFetch<EquipmentStateHistory[]>("/api/equipmentStateHistory/equipmentStateHistory")
    ]);

    if (positionsRes.data.value) {
      equipmentPositionsData.value = Array.isArray(positionsRes.data.value) 
        ? positionsRes.data.value 
        : [positionsRes.data.value];
    }

    if (equipmentsRes.data.value) {
      equipmentsList.value = Array.isArray(equipmentsRes.data.value)
        ? equipmentsRes.data.value
        : [equipmentsRes.data.value];
    }

    if (modelsRes.data.value) equipmentModels.value = modelsRes.data.value;
    if (statesRes.data.value) equipmentStates.value = statesRes.data.value;
    if (historyRes.data.value) equipmentStateHistory.value = historyRes.data.value;

    fitMapToMarkers();
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  } finally {
    loading.value = false;
  }
};

// Obtém o nome do equipamento pelo ID
const getEquipmentName = (equipmentId: string) => {
  const equipment = equipmentsList.value.find(e => e.id === equipmentId);
  return equipment ? equipment.name : 'Equipamento Desconhecido';
};

// Obtém o modelo do equipamento pelo ID
const getEquipmentModel = (equipmentId: string) => {
  const equipment = equipmentsList.value.find(e => e.id === equipmentId);
  if (!equipment) return null;
  return equipmentModels.value.find(m => m.id === equipment.equipmentModelId);
};

// Calcula o faturamento para um equipamento em um período
const calculateRevenue = (equipmentId: string, startDate: Date, endDate: Date) => {
  const history = equipmentStateHistory.value.find(h => h.equipmentId === equipmentId);
  const model = getEquipmentModel(equipmentId);
  
  if (!history || !model) return 0;

  let revenue = 0;
  const states = [...history.states].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  for (let i = 0; i < states.length - 1; i++) {
    const currentState = states[i];
    const nextState = states[i + 1];
    const stateStart = new Date(currentState.date);
    const stateEnd = new Date(nextState.date);

    // Verifica se o período de estado está dentro do filtro
    if (stateEnd < startDate || stateStart > endDate) continue;

    const effectiveStart = stateStart < startDate ? startDate : stateStart;
    const effectiveEnd = stateEnd > endDate ? endDate : stateEnd;

    const hours = (effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60);
    const stateEarning = model.hourlyEarnings.find(e => e.equipmentStateId === currentState.equipmentStateId);
    
    if (stateEarning) {
      revenue += hours * stateEarning.value;
    }
  }

  return parseFloat(revenue.toFixed(2));
};

// Transforma os dados para uma estrutura plana de marcadores com nome
const allPositions = computed(() => {
  return equipmentPositionsData.value.flatMap((equipment) =>
    equipment.positions.map((pos) => ({
      equipmentId: equipment.equipmentId,
      equipmentName: getEquipmentName(equipment.equipmentId),
      date: pos.date,
      lat: pos.lat,
      lng: pos.lon,
    }))
  );
});

// Ajusta o mapa para mostrar todos os marcadores
const fitMapToMarkers = () => {
  if (filteredPositions.value.length > 0) {
    mapBounds.value = filteredPositions.value.map(pos => [pos.lat, pos.lng]);
    mapCenter.value = [
      filteredPositions.value[0].lat,
      filteredPositions.value[0].lng,
    ];
  }
};

// Filtra posições por data e nome selecionados
const filteredPositions = computed(() => {
  let result = allPositions.value;

  if (dateFilter.value) {
    const filterDate = new Date(dateFilter.value);
    const nextDay = new Date(filterDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    result = result.filter((position) => {
      const positionDate = new Date(position.date);
      return positionDate >= filterDate && positionDate < nextDay;
    });
  }

  if (nameFilter.value) {
    const searchTerm = nameFilter.value.toLowerCase();
    result = result.filter((position) =>
      position.equipmentName.toLowerCase().includes(searchTerm)
    );
  }

  return result;
});

// Filtra paths por data e nome selecionados
const filteredPaths = computed<EquipmentPath[]>(() => {
  if (!dateFilter.value && !nameFilter.value) return [];

  return equipmentPositionsData.value
    .map((equipment) => {
      const equipmentName = getEquipmentName(equipment.equipmentId);
      
      // Filtra por nome se houver filtro
      if (nameFilter.value && !equipmentName.toLowerCase().includes(nameFilter.value.toLowerCase())) {
        return null;
      }

      // Filtra por data se houver filtro
      const filteredPositions = equipment.positions.filter((pos) => {
        if (!dateFilter.value) return true;
        const positionDate = new Date(pos.date);
        const filterDate = new Date(dateFilter.value);
        const nextDay = new Date(filterDate);
        nextDay.setDate(nextDay.getDate() + 1);
        return positionDate >= filterDate && positionDate < nextDay;
      });

      return {
        equipmentId: equipment.equipmentId,
        path: filteredPositions.map((pos) => [pos.lat, pos.lon])
      };
    })
    .filter(path => path && path.path.length > 1) as EquipmentPath[];
});

// Calcula o faturamento total para os equipamentos filtrados
const filteredRevenue = computed(() => {
  if (!dateFilter.value) return 0;

  const filterDate = new Date(dateFilter.value);
  const nextDay = new Date(filterDate);
  nextDay.setDate(nextDay.getDate() + 1);

  const uniqueEquipmentIds = [...new Set(filteredPositions.value.map(p => p.equipmentId))];
  
  return uniqueEquipmentIds.reduce((total, equipmentId) => {
    return total + calculateRevenue(equipmentId, filterDate, nextDay);
  }, 0);
});

// Observa mudanças nos filtros
watch([dateFilter, nameFilter], () => {
  showPolylines.value = !!dateFilter.value || !!nameFilter.value;
  fitMapToMarkers();
});

// Carrega os dados quando o componente é montado
onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="equipment-dashboard">
    <div class="dashboard-header">
      <h1>Monitoramento de Equipamentos</h1>
      <div class="filters">
        <div class="filter-group text-gray-800">
          <label for="nameFilter">Nome:</label>
          <input
            id="nameFilter"
            type="text"
            v-model="nameFilter"
            placeholder="Filtrar por nome"
            class="filter-input"
          />
        </div>
        <div class="filter-group text-gray-800">
          <label for="dateFilter">Data:</label>
          <input
            id="dateFilter"
            type="date"
            v-model="dateFilter"
            class="filter-input"
          />
        </div>
        <div class="revenue-display" v-if="dateFilter">
          <strong>Faturamento Total:</strong> R$ {{ filteredRevenue.toLocaleString('pt-BR') }}
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Carregando dados do mapa...</p>
    </div>

    <div v-else class="map-wrapper">
      <div class="map-container">
        <l-map
          ref="map"
          :zoom="mapZoom"
          :center="mapCenter"
          :bounds="mapBounds"
          @update:zoom="(value) => (mapZoom = value)"
          :use-global-leaflet="false"
          :options="{ zoomControl: true }"
        >
          <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            layer-type="base"
            name="OpenStreetMap"
          />

          <l-marker
            v-for="(position, index) in filteredPositions"
            :key="`marker-${position.equipmentId}-${index}`"
            :lat-lng="[position.lat, position.lng]"
          >
            <l-popup>
              <div class="marker-popup">
                <h3>{{ position.equipmentName }}</h3>
                <p><strong>ID:</strong> {{ position.equipmentId }}</p>
                <p><strong>Data:</strong> {{ new Date(position.date).toLocaleString() }}</p>
                <p><strong>Coordenadas:</strong> {{ position.lat.toFixed(4) }}, {{ position.lng.toFixed(4) }}</p>
                <p v-if="dateFilter">
                  <strong>Faturamento no dia:</strong> R$ {{
                    calculateRevenue(
                      position.equipmentId,
                      new Date(dateFilter),
                      new Date(new Date(dateFilter).setDate(new Date(dateFilter).getDate() + 1))
                    ).toLocaleString('pt-BR')
                  }}
                </p>
              </div>
            </l-popup>
          </l-marker>

          <template v-if="showPolylines">
            <l-polyline
              v-for="(path, index) in filteredPaths"
              :key="`path-${path.equipmentId}-${index}`"
              :lat-lngs="path.path"
              color="#3388ff"
              :weight="3"
              :opacity="0.7"
            />
          </template>
        </l-map>
      </div>
    </div>
  </div>
</template>

<style scoped>
.equipment-dashboard {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dashboard-header h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.filters {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-weight: 500;
  color: #555;
  white-space: nowrap;
}

.filter-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  min-width: 120px;
}

.revenue-display {
  padding: 8px 12px;
  background-color: #67a4f9;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-left: auto;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
  gap: 15px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #3388ff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.map-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.map-container {
  height: 100%;
  width: 100%;
}

.marker-popup {
  min-width: 240px;
}

.marker-popup h3 {
  margin-top: 0;
  color: #3388ff;
  font-size: 1rem;
}

.marker-popup p {
  margin: 5px 0;
  font-size: 0.9rem;
}

.marker-popup strong {
  color: #555;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .filters {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .filter-input {
    width: 100%;
  }
  
  .revenue-display {
    margin-left: 0;
    width: 100%;
  }
}
</style>