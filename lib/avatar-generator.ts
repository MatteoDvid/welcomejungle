export interface AvatarStyle {
  id: string
  name: string
  background: string
  primary: string
  secondary: string
  pattern?: string
}

export const avatarStyles: AvatarStyle[] = [
  {
    id: "professional-blue",
    name: "Professional Blue", 
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    primary: "#ffffff",
    secondary: "#e3f2fd"
  },
  {
    id: "creative-orange",
    name: "Creative Orange",
    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", 
    primary: "#ffffff",
    secondary: "#fff3e0"
  },
  {
    id: "tech-green",
    name: "Tech Green",
    background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    primary: "#ffffff", 
    secondary: "#e8f5e8"
  },
  {
    id: "modern-purple",
    name: "Modern Purple",
    background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    primary: "#4a148c",
    secondary: "#f3e5f5"
  },
  {
    id: "minimal-gray", 
    name: "Minimal Gray",
    background: "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)",
    primary: "#424242",
    secondary: "#f5f5f5"
  },
  {
    id: "vibrant-pink",
    name: "Vibrant Pink", 
    background: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
    primary: "#ffffff",
    secondary: "#fce4ec"
  }
]

export interface GeneratedAvatar {
  style: AvatarStyle
  initials: string
  icon?: string
  svg: string
}

export function generateAvatar(
  name: string, 
  role?: string,
  styleId?: string
): GeneratedAvatar {
  // Extract initials
  const nameParts = name.trim().split(" ")
  const initials = nameParts.length >= 2 
    ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
    : name.slice(0, 2).toUpperCase()

  // Select style based on role or random
  let selectedStyle: AvatarStyle
  if (styleId) {
    selectedStyle = avatarStyles.find(s => s.id === styleId) || avatarStyles[0]
  } else {
    const roleStyleMap: Record<string, string> = {
      "employee": "professional-blue",
      "manager": "tech-green", 
      "hr": "modern-purple",
      "office_manager": "creative-orange"
    }
    const defaultStyleId = role ? roleStyleMap[role] : undefined
    selectedStyle = defaultStyleId 
      ? avatarStyles.find(s => s.id === defaultStyleId) || avatarStyles[0]
      : avatarStyles[Math.floor(Math.random() * avatarStyles.length)]
  }

  // Role-based icons
  const roleIcons: Record<string, string> = {
    "employee": "👤",
    "manager": "👔", 
    "hr": "🛡️",
    "office_manager": "🏢"
  }

  const icon = role ? roleIcons[role] : undefined

  // Generate SVG
  const svg = generateAvatarSVG(initials, selectedStyle, icon)

  return {
    style: selectedStyle,
    initials,
    icon,
    svg
  }
}

function generateAvatarSVG(
  initials: string, 
  style: AvatarStyle, 
  icon?: string
): string {
  const size = 120
  const fontSize = size * 0.4
  const iconSize = size * 0.25

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          ${extractGradientColors(style.background)}
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- Background Circle -->
      <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="url(#bg-gradient)" />
      
      <!-- Subtle Pattern Overlay -->
      <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="rgba(255,255,255,0.1)" 
              stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      
      ${icon ? `
        <!-- Role Icon -->
        <text x="${size/2}" y="${size/2 - 10}" 
              text-anchor="middle" 
              dominant-baseline="middle" 
              font-size="${iconSize}" 
              filter="url(#glow)">
          ${icon}
        </text>
        
        <!-- Initials Below -->
        <text x="${size/2}" y="${size/2 + 20}" 
              text-anchor="middle" 
              dominant-baseline="middle" 
              font-family="system-ui, -apple-system, sans-serif" 
              font-weight="600" 
              font-size="${fontSize * 0.7}" 
              fill="${style.primary}"
              filter="url(#glow)">
          ${initials}
        </text>
      ` : `
        <!-- Initials Only -->
        <text x="${size/2}" y="${size/2}" 
              text-anchor="middle" 
              dominant-baseline="middle" 
              font-family="system-ui, -apple-system, sans-serif" 
              font-weight="700" 
              font-size="${fontSize}" 
              fill="${style.primary}"
              filter="url(#glow)">
          ${initials}
        </text>
      `}
    </svg>
  `.trim()
}

function extractGradientColors(gradientString: string): string {
  // Simple parser for linear-gradient
  const matches = gradientString.match(/#[a-fA-F0-9]{6}/g)
  if (matches && matches.length >= 2) {
    return `
      <stop offset="0%" stop-color="${matches[0]}"/>
      <stop offset="100%" stop-color="${matches[1]}"/>
    `
  }
  return `
    <stop offset="0%" stop-color="#667eea"/>
    <stop offset="100%" stop-color="#764ba2"/>
  `
}

export function getAvatarDataURL(avatar: GeneratedAvatar): string {
  const svgBlob = new Blob([avatar.svg], { type: 'image/svg+xml' })
  return URL.createObjectURL(svgBlob)
}

export function downloadAvatar(avatar: GeneratedAvatar, filename?: string): void {
  const dataURL = getAvatarDataURL(avatar)
  const link = document.createElement('a')
  link.href = dataURL
  link.download = filename || `avatar-${avatar.initials.toLowerCase()}.svg`
  link.click()
  URL.revokeObjectURL(dataURL)
} 