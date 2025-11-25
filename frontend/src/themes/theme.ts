export const theme = {
  colors: {
    primary: '#0084ff',
    primaryHover: '#0073e6',
    primaryActive: '#0062cc',
    secondary: '#667eea',
    secondaryDark: '#764ba2',
    
    bgPrimary: '#ffffff',
    bgSecondary: '#f5f5f5',
    bgTertiary: '#f0f0f0',
    
    textPrimary: '#000000',
    textSecondary: '#999999',
    textTertiary: '#666666',
    textInverse: '#ffffff',
    
    borderLight: '#f0f0f0',
    borderMedium: '#d9d9d9',
    borderDark: '#cccccc',
    
    messageOwn: '#0084ff',
    messageOther: '#ffffff',
    
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    info: '#1890ff',
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
  },
  
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '18px',
    round: '50%',
  },
  
  fontSize: {
    xs: '11px',
    sm: '12px',
    base: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
  },
  
  shadow: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
    md: '0 4px 12px rgba(0, 0, 0, 0.15)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.2)',
  },
  
  transition: {
    fast: '0.15s ease',
    base: '0.3s ease',
    slow: '0.5s ease',
  },
}

export type Theme = typeof theme
