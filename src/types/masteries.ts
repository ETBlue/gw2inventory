export interface MasteryLevel {
  name: string
  description: string
  instruction: string
  icon: string
  point_cost: number
  exp_cost: number
}

export interface Mastery {
  id: number
  name: string
  requirement: string
  order: number
  background: string
  region: string
  levels: MasteryLevel[]
}

export interface AccountMastery {
  id: number
  level: number
}
