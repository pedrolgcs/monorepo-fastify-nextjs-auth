export function getBrowserDevice(userAgent?: string): {
  name: string
  version: string
} {
  if (!userAgent) {
    return {
      name: 'Unknown',
      version: 'unknown',
    }
  }

  if (
    userAgent.includes('Chrome') &&
    !userAgent.includes('Edge') &&
    !userAgent.includes('Opera')
  ) {
    const version = userAgent.match(/Chrome\/(\d+)/)
    return {
      name: 'Chrome',
      version: version ? version[1] : 'unknown',
    }
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    const version = userAgent.match(/Version\/(\d+)/)
    return {
      name: 'Safari',
      version: version ? version[1] : 'unknown',
    }
  } else if (userAgent.includes('Firefox')) {
    const version = userAgent.match(/Firefox\/(\d+)/)
    return {
      name: 'Firefox',
      version: version ? version[1] : 'unknown',
    }
  } else if (userAgent.includes('Edge')) {
    const version = userAgent.match(/Edge\/(\d+)/)
    return {
      name: 'Edge',
      version: version ? version[1] : 'unknown',
    }
  } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
    const version = userAgent.match(/(?:Opera|OPR)\/(\d+)/)
    return {
      name: 'Opera',
      version: version ? version[1] : 'unknown',
    }
  } else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
    const version = userAgent.match(/(?:MSIE |rv:)(\d+)/)
    return {
      name: 'Internet Explorer',
      version: version ? version[1] : 'unknown',
    }
  } else {
    return {
      name: 'Unknown',
      version: 'unknown',
    }
  }
}
