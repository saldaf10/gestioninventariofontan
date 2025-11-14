export function getOwnerTypeFromCode(code: string): string {
  const prefix = code.split('-')[0]?.toUpperCase()
  switch (prefix) {
    case 'CF':
      return 'Colegio Fontán'
    case 'RF':
      return 'Renting Fontán'
    case 'AF':
      return 'Asofontán'
    default:
      return 'Desconocido'
  }
}

export function validateDeviceCode(code: string): boolean {
  const pattern = /^(CF|RF|AF)-\d{3,}$/i
  return pattern.test(code)
}

