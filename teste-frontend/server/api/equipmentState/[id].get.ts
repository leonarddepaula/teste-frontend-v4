import { readFile } from 'fs/promises'
import { join } from 'path'
import { getRouterParam } from 'h3'
import type { EquipmentState } from '~/interface/equipmentState'

export default defineEventHandler(async (event) => {
  try {
    const filePath = join(process.cwd(), 'data/equipmentState.json')
    const data = await readFile(filePath, 'utf-8')
    const states: EquipmentState[] = JSON.parse(data)

    const id = getRouterParam(event, 'id')
    const state = states.find((eq) => eq.id === id)

    if (!state) {
      return sendError(event, createError({ statusCode: 404, statusMessage: 'estado do equipamento não encontrado' }))
    }

    return state
  } catch (error) {
    return {
      error: 'Não foi possível carregar os dados de estado do equipamento.',
      details: error instanceof Error ? error.message : error,
    }
  }
})
