import { readFile } from 'fs/promises';
import { join } from 'path';
import { getRouterParam, sendError, createError } from 'h3';
import type { EquipmentPositionHistory } from '~/interface/equipmentPositionHistory';

export default defineEventHandler(async (event) => {
  try {
    const filePath = join(process.cwd(), 'data/equipmentPositionHistory.json');
    const data = await readFile(filePath, 'utf-8');

    const raw = JSON.parse(data);

    const positions: EquipmentPositionHistory[] = raw.map((item: any) => ({
      equipmentId: item.equipmentId,
      positions: item.positions.map((pos: any) => ({
        date: new Date(pos.date),
        lat: pos.lat,
        lon: pos.lon,
      })),
    }));

    const id = getRouterParam(event, 'id');
    const equipment = positions.find((eq) => eq.equipmentId === id);

    if (!equipment) {
      return sendError(event, createError({ statusCode: 404, statusMessage: 'Posições do equipamento não encontradas.' }));
    }

    return equipment;
  } catch (error) {
    return {
      error: 'Não foi possível carregar os dados de posições do equipamento.',
      details: error instanceof Error ? error.message : error,
    };
  }
});
