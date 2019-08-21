const getDictionary = (array, key = 'id') => {
  const result = {}
  for (const item of array) {
    result[item[key]] = item
  }
  return result
}

export default getDictionary
