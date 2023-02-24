export function validString(strs: string[]): boolean {
  let isValid = true 

  strs.map(str => {
    if (str === undefined || str.length === 0)
      isValid = false
  })

  return isValid
}
