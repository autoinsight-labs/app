import { type ClassValue, clsx } from 'clsx'
import { Linking, Platform } from 'react-native'
import { twMerge } from 'tailwind-merge'

export function toCapital(input: string) {
  const words = input.match(/[A-Za-z][a-z]*/g) || []

  const result = words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return result
}

export function getInitials(name: string) {
  const nameParts = name.split(' ')

  if (nameParts.length === 1) {
    const firstLetter = nameParts[0].charAt(0).toUpperCase()
    const lastLetter = nameParts[0]
      .charAt(nameParts[0].length - 1)
      .toUpperCase()
    return `${firstLetter}${lastLetter}`
  }
  const firstInitial = nameParts[0].charAt(0).toUpperCase()
  const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase()
  return `${firstInitial}${lastInitial}`
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function openMaps(address: string) {
  const encodedAddress = encodeURIComponent(address)

  const url = Platform.select({
    ios: `maps:0,0?q=${encodedAddress}`,
    android: `geo:0,0?q=${encodedAddress}`,
    default: `https://maps.google.com/?q=${encodedAddress}`,
  })

  Linking.canOpenURL(url)
    .then(supported => {
      if (supported) {
        return Linking.openURL(url)
      }

      return Linking.openURL(`https://maps.google.com/?q=${encodedAddress}`)
    })
    .catch(err => console.error('Erro ao abrir mapa:', err))
}
