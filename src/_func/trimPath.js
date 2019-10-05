const trimPath = ({level, path}) => {
  const segments = path.split('/').filter(item => item.length !== 0)
  return `/${segments.slice(0, level).join('/')}`
}

export default trimPath
