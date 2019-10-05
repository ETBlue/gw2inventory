const sortByName = ({array, dictionary}) => {
  return array.sort((a, b) => {
    if (dictionary[a].name > dictionary[b].name) {
      return 1
    } else if (dictionary[a].name < dictionary[b].name) {
      return -1
    } else {
      return 0
    }
  })
}

const getList = ({array, dictionary}) => {
  const sorted = sortByName({array, dictionary})
  const all = sortByName({array: Object.keys(dictionary).map(key => dictionary[key].id), dictionary})
  const locked = []
  for (const id of all) {
    if (!sorted.includes(id)) {
      locked.push(id)
    }
  }
  return {sorted, locked}
}

export default getList
