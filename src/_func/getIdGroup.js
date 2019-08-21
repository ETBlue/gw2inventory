import {AMOUNT_PER_PAGE} from '../SETTINGS'

const getIdGroup = (ids) => {
  const groupCount = Math.ceil(ids.length / AMOUNT_PER_PAGE)
  const groups = []
  for (let i = 0; i < groupCount; i++) {
    groups.push(ids.slice(i * AMOUNT_PER_PAGE, (i + 1) * AMOUNT_PER_PAGE))
  }
  return groups
}

export default getIdGroup
