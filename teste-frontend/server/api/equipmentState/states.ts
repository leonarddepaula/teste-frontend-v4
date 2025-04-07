import { readFile } from 'fs/promises';
import { join } from 'path';
import type { EquipmentState } from '~/interface/equipmentState';

export default defineEventHandler(async () => {
  try {
    const filePath = join(process.cwd(), 'data/equipmentState.json'); // está lendo da raiz do projeto
    const data = await readFile(filePath, 'utf-8');
    const states: EquipmentState[] = JSON.parse(data);

    return states;
  } catch (error) {
    return {
      error: 'Não foi possível carregar os dados de modelos de equipamento.',
      details: error instanceof Error ? error.message : error,
    };
  }
});
