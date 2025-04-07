import { readFile } from 'fs/promises'
import { join } from 'path'
import { getRouterParam } from 'h3'
import type { EquipmentModel } from '~/interface/equipmentModel'

export default defineEventHandler(async (event) => {
  try {
    const filePath = join(process.cwd(), 'data/equipmentModel.json')
    const data = await readFile(filePath, 'utf-8')
    const models: EquipmentModel[] = JSON.parse(data)

    const id = getRouterParam(event, 'id')
    const model = models.find((eq) => eq.id === id)

    if (!model) {
      return sendError(event, createError({ statusCode: 404, statusMessage: 'Modelo não encontrado' }))
    }

    return model
  } catch (error) {
    return {
      error: 'Não foi possível carregar os dados de Modelo do equipamento.',
      details: error instanceof Error ? error.message : error,
    }
  }
})
