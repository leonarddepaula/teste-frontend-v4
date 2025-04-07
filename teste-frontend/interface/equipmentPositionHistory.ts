export interface Position {
    date: Date;
    lat: number;
    lon: number;
}

export interface EquipmentPositionHistory {
    equipmentId: string;
    positions: Position[];
}