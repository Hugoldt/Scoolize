// Design System - Scoolize
// À compléter avec les valeurs finales après validation UX

export const theme = {
  // Couleurs
  colors: {
    // Primaire (basé sur l'existant - bleu)
    primary: {
      main: '#2563eb',
      dark: '#1d4ed8',
      light: '#60a5fa',
      hover: '#1d4ed8',
    },
    
    // Secondaire
    secondary: {
      main: '#64748b',
      dark: '#475569',
      light: '#94a3b8',
    },
    
    // Backgrounds
    background: {
      main: '#1e293b',
      card: '#ffffff',
      light: '#f7fafc',
      hover: '#edf2f7',
    },
    
    // Text
    text: {
      primary: '#1a202c',
      secondary: '#718096',
      light: '#a0aec0',
      inverse: '#ffffff',
    },
    
    // Borders
    border: {
      default: '#e2e8f0',
      focus: '#2563eb',
      light: '#f1f5f9',
    },
    
    // États
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
  
  // Typographie
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    
    // Tailles
    sizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2rem',    // 32px
    },
    
    // Poids
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    
    // Line heights
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  // Espacements
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem',  // 48px
    '3xl': '4rem',  // 64px
  },
  
  // Bordures
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '20px',
    full: '9999px',
  },
  
  // Ombres
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 20px rgba(0, 0, 0, 0.15)',
    xl: '0 20px 60px rgba(0, 0, 0, 0.3)',
    focus: '0 0 0 3px rgba(37, 99, 235, 0.1)',
  },
  
  // Transitions
  transitions: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
  },
  
  // Breakpoints (pour responsive)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
};

// Composants réutilisables - Styles de base
export const componentStyles = {
  button: {
    primary: {
      padding: '1rem',
      background: theme.colors.primary.main,
      color: theme.colors.text.inverse,
      borderRadius: theme.borderRadius.md,
      fontWeight: theme.typography.weights.bold,
      fontSize: theme.typography.sizes.lg,
      transition: theme.transitions.normal,
      '&:hover': {
        background: theme.colors.primary.hover,
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows.lg,
      },
    },
    secondary: {
      padding: '0.75rem 1.5rem',
      background: 'transparent',
      color: theme.colors.text.secondary,
      border: `2px solid ${theme.colors.border.default}`,
      borderRadius: theme.borderRadius.md,
      fontWeight: theme.typography.weights.semibold,
      transition: theme.transitions.normal,
      '&:hover': {
        background: theme.colors.background.hover,
        borderColor: theme.colors.primary.main,
      },
    },
  },
  
  input: {
    base: {
      padding: '0.875rem 1rem',
      border: `2px solid ${theme.colors.border.default}`,
      borderRadius: theme.borderRadius.md,
      fontSize: theme.typography.sizes.base,
      transition: theme.transitions.fast,
      '&:focus': {
        outline: 'none',
        borderColor: theme.colors.border.focus,
        boxShadow: theme.shadows.focus,
      },
      '&::placeholder': {
        color: theme.colors.text.light,
      },
    },
  },
  
  card: {
    base: {
      background: theme.colors.background.card,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing['2xl'],
      boxShadow: theme.shadows.xl,
    },
  },
};

export default theme;



