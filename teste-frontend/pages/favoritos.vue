<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-4">Registro de Alerta</h1>

    <div class="space-y-4 mb-6">
      <input
        v-model="newAlert.equipmentId"
        type="text"
        placeholder="Digite o ID do equipamento"
        class="border border-gray-300 rounded px-4 py-2 w-full"
      />
      
      <textarea
        v-model="newAlert.description"
        placeholder="Descreva o alerta"
        class="border border-gray-300 rounded px-4 py-2 w-full h-32"
      ></textarea>
      
      <select
        v-model="newAlert.severity"
        class="border border-gray-300 rounded px-4 py-2 w-full"
      >
        <option value="" disabled selected>Selecione a gravidade</option>
        <option value="baixa">Baixa</option>
        <option value="media">Média</option>
        <option value="alta">Alta</option>
        <option value="critica">Crítica</option>
      </select>
      
      <button
        @click="saveAlert"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
      >
        Salvar Alerta
      </button>
    </div>

    <div class="mt-6">
      <h2 class="text-2xl font-semibold mb-4">Alertas Registrados:</h2>
      <div class="grid gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar text-blue-300">
        <div 
          v-for="(alert, index) in store.alerts" 
          :key="index"
          class="border rounded-lg p-4 shadow-sm min-w-0"
          :class="{
            'border-green-300 bg-green-50': alert.severity === 'baixa',
            'border-yellow-300 bg-yellow-50': alert.severity === 'media',
            'border-orange-300 bg-orange-50': alert.severity === 'alta',
            'border-red-300 bg-red-50': alert.severity === 'critica'
          }"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-bold text-lg">Equipamento: {{ alert.equipmentId }}</h3>
              <p class="text-gray-700 mt-1 whitespace-pre-wrap">{{ alert.description }}</p>
            </div>
            <span 
              class="px-2 py-1 rounded text-xs font-semibold whitespace-nowrap"
              :class="{
                'bg-green-200 text-green-800': alert.severity === 'baixa',
                'bg-yellow-200 text-yellow-800': alert.severity === 'media',
                'bg-orange-200 text-orange-800': alert.severity === 'alta',
                'bg-red-200 text-red-800': alert.severity === 'critica'
              }"
            >
              {{ alert.severity.toUpperCase() }}
            </span>
          </div>
          <p class="text-sm text-gray-500 mt-2">
            {{ formatDate(alert.timestamp) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "../stores/main";
import { useNuxtApp } from "nuxt/app";

// solução local para tipagem.
const { $toast } = useNuxtApp() as unknown as {
  $toast: { success: (msg: string) => void; error: (msg: string) => void };
};

const store = useStore();
const newAlert = ref<{
  equipmentId: string;
  description: string;
  severity: "baixa" | "media" | "alta" | "critica" | "";
  timestamp: number;
}>({
  equipmentId: "",
  description: "",
  severity: "",
  timestamp: Date.now()
});

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const saveAlert = () => {
  if (!newAlert.value.equipmentId.trim()) {
    $toast.error("Digite o ID do equipamento.");
    return;
  }
  
  if (!newAlert.value.description.trim()) {
    $toast.error("Descreva o alerta.");
    return;
  }
  
  if (!newAlert.value.severity) {
    $toast.error("Selecione a gravidade do alerta.");
    return;
  }

  const alertToSave = {
    ...newAlert.value,
    severity: newAlert.value.severity as "baixa" | "media" | "alta" | "critica", // Ensure severity is valid
    timestamp: Date.now()
  };
  
  store.addAlert(alertToSave);
  $toast.success("Alerta registrado com sucesso!");
  
  // Reset form
  newAlert.value = {
    equipmentId: "",
    description: "",
    severity: "",
    timestamp: Date.now()
  };
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}
</style>