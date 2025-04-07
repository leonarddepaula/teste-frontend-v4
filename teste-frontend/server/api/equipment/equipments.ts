import { readFile } from 'fs/promises';
import { join } from 'path';
import type { Equipment } from '~/interface/equipment';

export default defineEventHandler(async () => {
  try {
    const filePath = join(process.cwd(), 'data/equipment.json'); // está lendo da raiz do projeto
    const data = await readFile(filePath, 'utf-8');
    const equipments: Equipment[] = JSON.parse(data);

    return equipments;
  } catch (error) {
    return {
      error: 'Não foi possível carregar os dados de equipamento.',
      details: error instanceof Error ? error.message : error,
    };
  }
});
