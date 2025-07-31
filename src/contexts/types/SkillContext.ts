import { Skill, Specialization } from "./Skill"

export interface Values {
  skills: Skills
  specializations: Specializations
  isFetching: boolean
}

export interface Skills {
  [key: number]: Skill
}

export interface Specializations {
  [key: number]: Specialization
}
