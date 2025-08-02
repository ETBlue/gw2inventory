type CSSModule = { [key: string]: string }
type BindCssModule = (css: CSSModule, baseClassName: string) => ClassNames
type ClassNames = (className?: string) => string

export const bindCssModule: BindCssModule = (css, baseClassName) => {
  const classNames = (className = "") => {
    const mappedClassNames = className
      .split(" ")
      .concat(baseClassName)
      .map((className) => {
        return css[className] ?? className
      })

    return mappedClassNames.join(" ")
  }
  return classNames
}
