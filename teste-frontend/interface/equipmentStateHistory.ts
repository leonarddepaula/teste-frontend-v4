export interface EquipmentStateHistory {
  equipmentId: string; // Id do equipamento :  a7c53eb1-4f5e-4eba-9764-ad205d0891f9
  states: {
    date: Date;
    equipmentStateId: string; // Id do estado: 0808344c-454b-4c36-89e8-d7687e692d57
  }[];
}
