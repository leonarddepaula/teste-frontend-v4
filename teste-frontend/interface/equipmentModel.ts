export interface HourlyEarning {
    equipmentStateId: string; // Id do estado :  0808344c-454b-4c36-89e8-d7687e692d57
    value: number;
}

export interface EquipmentModel {
    id: string; // Id do modelo : a3540227-2f0e-4362-9517-92f41dabbfdf
    name: string;
    hourlyEarnings: HourlyEarning[];
}
