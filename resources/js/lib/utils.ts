import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Menyederhanakan User-Agent agar lebih mudah dibaca.
 */
export const simplifyUserAgent = (userAgent: string): string => {
  try {
    const browserMatch = userAgent.match(/(Chrome|Firefox|Safari|Edg)\/([\d.]+)/)
    const browser = browserMatch ? `${browserMatch[1]} ${browserMatch[2]}` : 'Unknown Browser'

    let os = 'Unknown OS'
    if (userAgent.includes('Windows NT 10.0')) os = 'Windows 10/11'
    else if (userAgent.includes('Windows')) os = 'Windows'
    else if (userAgent.includes('Macintosh')) os = 'macOS'
    else if (userAgent.includes('Linux')) os = 'Linux'
    else if (userAgent.includes('Android')) os = 'Android'
    else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS'

    return `${browser} on ${os}`
  } catch {
    return userAgent
  }
}
