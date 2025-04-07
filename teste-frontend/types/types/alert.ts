// types/alert.ts
export interface Alert {
    equipmentId: string
    description: string
    severity: 'baixa' | 'media' | 'alta' | 'critica'
    timestamp: number
  }