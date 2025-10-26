export function getFileName(url: string): string {
  try {
    return decodeURIComponent(url.split('/').pop() || '')
  } catch {
    return url
  }
}

export function createFileObjectFromURL(url: string): File {
  const filename = url.substring(url.lastIndexOf('/') + 1)
  const emptyBlob = new Blob([], { type: 'application/octet-stream' })
  const file = new File([emptyBlob], filename)

  return file
}

export function formatDateToYYYYMMDD(date: Date): string {
  const year: number = date.getFullYear()
  const month: string = String(date.getMonth() + 1).padStart(2, '0')
  const day: string = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function formatToDatetime(date: Date): string {
  const year: number = date.getFullYear()
  const month: string = String(date.getMonth() + 1).padStart(2, '0')
  const day: string = String(date.getDate()).padStart(2, '0')

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`
}

export function formatToDatetime2(date: Date): string {
  const year: number = date.getFullYear()

  // Array of month names
  const monthNames: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  // Get the month name from the array
  const month: string = monthNames[date.getMonth()]
  const day: string = String(date.getDate()).padStart(2, '0')

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${day} ${month} ${year}, ${hours}:${minutes}`
}

export function formatToDate(date: Date): string {
  const year: number = date.getFullYear()

  // Array of month names
  const monthNames: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  // Get the month name from the array
  const month: string = monthNames[date.getMonth()]
  const day: string = String(date.getDate()).padStart(2, '0')

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${month} ${day}, ${year}`
}

export function formatToDDMMYYYY(date: Date): string {
  const year: number = date.getFullYear()
  const month: string = String(date.getMonth() + 1).padStart(2, '0')
  const day: string = String(date.getDate()).padStart(2, '0')

  return `${day}-${month}-${year}`
}

export function capitalizeFirstLetter(str: string): string {
  if (!str) return '' // handle empty string
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function toTitleCaseFromSnakeOrKebab(input: string): string {
  const words = input.replace(/[_-]/g, ' ').split(' ')

  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
}

export function isExpired(dateStr: string): boolean {
  const inputDate = new Date(dateStr)
  const today = new Date()

  // Normalize both dates to ignore the time portion
  inputDate.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  return inputDate < today
}

export function obscureText(text: string) {
  if (!text) return '-'

  if (text.length === 1) return text
  if (text.length <= 3) return text[0] + '*'.repeat(text.length - 1)
  // length 4 or more
  return text.substring(0, 2) + '*'.repeat(text.length - 3) + text.charAt(text.length - 1)
}

export function handleDownload(url: string) {
  const link = document.createElement('a')
  link.href = url
  link.download = getFileName(url)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
