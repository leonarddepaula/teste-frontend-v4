import { readFile } from 'fs/promises';
import { join } from 'path';

import type { EquipmentPositionHistory } from '~/interface/equipmentPositionHistory';

export default defineEventHandler(async () => {
  try {
    const filePath = join(process.cwd(), 'data/equipmentPositionHistory.json');
    const data = await readFile(filePath, 'utf-8');

    const rawJson = JSON.parse(data);

    const equipmentPositions: EquipmentPositionHistory[] = rawJson.map((item: any) => ({
      equipmentId: item.equipmentId,
      positions: item.positions.map((pos: any) => ({
        date: new Date(pos.date),
        lat: pos.lat,
        lon: pos.lon,
      })),
    }));

    return equipmentPositions;
  } catch (error) {
    return {
      error: 'Não foi possível carregar os dados de posições.',
      details: error instanceof Error ? error.message : error,
    };
  }
});
