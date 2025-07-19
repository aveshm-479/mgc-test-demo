import { createTheme } from '@mui/material/styles';

export const createAppTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    ...(mode === 'dark' ? {
      primary: {
        main: '#F59E0B', // --primary-gold
        light: '#FBBF24',
        dark: '#D97706',
      },
      secondary: {
        main: '#3B82F6', // --action-blue
        light: '#60A5FA',
        dark: '#2563EB',
      },
      background: {
        default: '#0F172A', // --bg-primary
        paper: '#1E293B', // --bg-secondary
      },
      surface: {
        main: '#1E293B', // --bg-secondary
        light: '#334155', // --bg-tertiary
        dark: '#0F172A', // --bg-primary
      },
      text: {
        primary: '#F8FAFC', // --text-primary
        secondary: '#94A3B8', // --text-secondary
        disabled: '#64748B',
      },
      success: {
        main: '#10b981',
        light: '#34d399',
        dark: '#059669',
      },
      warning: {
        main: '#f59e0b',
        light: '#fbbf24',
        dark: '#d97706',
      },
      error: {
        main: '#ef4444',
        light: '#f87171',
        dark: '#dc2626',
      },
      info: {
        main: '#06b6d4',
        light: '#22d3ee',
        dark: '#0891b2',
      },
    } : {
      primary: {
        main: '#D97706', // --primary-gold
        light: '#FBBF24',
        dark: '#B45309',
      },
      secondary: {
        main: '#2563EB', // --action-blue
        light: '#60A5FA',
        dark: '#1D4ED8',
      },
      background: {
        default: '#FFFFFF', // --bg-primary
        paper: '#F8FAFC', // --bg-secondary
      },
      surface: {
        main: '#F8FAFC', // --bg-secondary
        light: '#F1F5F9', // --bg-tertiary
        dark: '#E2E8F0', // --border (light mode)
      },
      text: {
        primary: '#0F172A', // --text-primary
        secondary: '#64748B', // --text-secondary
        disabled: '#94a3b8',
      },
      success: {
        main: '#16a34a',
        light: '#22c55e',
        dark: '#15803d',
      },
      warning: {
        main: '#ea580c',
        light: '#f97316',
        dark: '#c2410c',
      },
      error: {
        main: '#dc2626',
        light: '#ef4444',
        dark: '#b91c1c',
      },
      info: {
        main: '#0284c7',
        light: '#0ea5e9',
        dark: '#0369a1',
      },
    }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: mode === 'dark' 
              ? '0 4px 12px rgba(0, 0, 0, 0.15)' 
              : '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          background: mode === 'dark' 
            ? 'linear-gradient(135deg, #3B82F6, #2563EB)' 
            : 'linear-gradient(135deg, #2563EB, #1D4ED8)',
          '&:hover': {
            background: mode === 'dark' 
              ? 'linear-gradient(135deg, #2563EB, #1D4ED8)' 
              : 'linear-gradient(135deg, #1D4ED8, #0C4A6E)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: mode === 'dark' 
            ? '#1E293B' /* --bg-secondary */ 
            : '#F8FAFC', /* --bg-secondary */
          backdropFilter: 'blur(10px)',
          border: mode === 'dark' 
            ? '1px solid #475569' /* --border */
            : '1px solid #E2E8F0', /* --border */
          boxShadow: mode === 'dark' 
            ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
            : '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: mode === 'dark' 
            ? '#1E293B' /* --bg-secondary */ 
            : '#F8FAFC', /* --bg-secondary */
          backdropFilter: 'blur(20px)',
          borderBottom: mode === 'dark' 
            ? '1px solid #F59E0B' /* --primary-gold */ 
            : '1px solid #E2E8F0', /* --border */
          boxShadow: mode === 'dark' 
            ? '0 4px 30px rgba(255, 215, 0, 0.1)' 
            : '0 4px 30px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

declare module '@mui/material/styles' {
  interface Palette {
    surface: {
      main: string;
      light: string;
      dark: string;
    };
  }
  interface PaletteOptions {
    surface?: {
      main: string;
      light: string;
      dark: string;
    };
  }
}
