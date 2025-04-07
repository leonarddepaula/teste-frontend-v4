import { readFile } from 'fs/promises';
import { join } from 'path';
import { getRouterParam, sendError, createError } from 'h3';
import type { EquipmentStateHistory } from '~/interface/equipmentStateHistory';

export default defineEventHandler(async (event) => {
  try {
    const filePath = join(process.cwd(), 'data/equipmentStateHistory.json');
    const data = await readFile(filePath, 'utf-8');

    const raw = JSON.parse(data);

    const histories: EquipmentStateHistory[] = raw.map((item: any) => ({
      equipmentId: item.equipmentId,
      states: item.states.map((state: any) => ({
        date: new Date(state.date),
        equipmentStateId: state.equipmentStateId,
      })),
    }));

    const id = getRouterParam(event, 'id');
    const equipmentHistory = histories.find((eq) => eq.equipmentId === id);

    if (!equipmentHistory) {
      return sendError(event, createError({
        statusCode: 404,
        message: 'Histórico de estados do equipamento não encontrado.'
      }));
    }

    return equipmentHistory;
  } catch (error) {
    return {
      error: 'Não foi possível carregar o histórico de estados.',
      details: error instanceof Error ? error.message : error,
    };
  }
});
