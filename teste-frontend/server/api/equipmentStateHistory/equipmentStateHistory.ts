import { readFile } from 'fs/promises';
import { join } from 'path';
import type { EquipmentStateHistory } from '~/interface/equipmentStateHistory';

export default defineEventHandler(async () => {
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

    return histories;
  } catch (error) {
    return {
      error: 'Não foi possível carregar o histórico de estados.',
      details: error instanceof Error ? error.message : error,
    };
  }
});
