import { readFile } from 'fs/promises';
import { join } from 'path';
import type { EquipmentModel } from '~/interface/equipmentModel';

export default defineEventHandler(async () => {
  try {
    const filePath = join(process.cwd(), 'data/equipmentModel.json'); // está lendo da raiz do projeto
    const data = await readFile(filePath, 'utf-8');
    const models: EquipmentModel[] = JSON.parse(data);

    return models;
  } catch (error) {
    return {
      error: 'Não foi possível carregar os dados de modelos de equipamento.',
      details: error instanceof Error ? error.message : error,
    };
  }
});
