import { readFile } from 'fs/promises'
import { join } from 'path'
import { getRouterParam } from 'h3'
import type { Equipment } from '~/interface/equipment'

export default defineEventHandler(async (event) => {
  try {
    const filePath = join(process.cwd(), 'data/equipment.json')
    const data = await readFile(filePath, 'utf-8')
    const equipments: Equipment[] = JSON.parse(data)

    const id = getRouterParam(event, 'id')
    const equipment = equipments.find((eq) => eq.id === id)

    if (!equipment) {
      return sendError(event, createError({ statusCode: 404, statusMessage: 'Equipamento não encontrado' }))
    }

    return equipment
  } catch (error) {
    return {
      error: 'Não foi possível carregar os dados de equipamento.',
      details: error instanceof Error ? error.message : error,
    }
  }
})
