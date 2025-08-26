import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    primary: '#667eea',
    primaryDark: '#5a6fd8',
    secondary: '#764ba2',
    accent: '#f093fb',
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
    
    // Background colors
    bgPrimary: '#0a0a0a',
    bgSecondary: '#1a1a1a',
    bgTertiary: '#2a2a2a',
    bgQuaternary: '#3a3a3a',
    
    // Text colors
    textPrimary: '#ffffff',
    textSecondary: '#b3b3b3',
    textTertiary: '#808080',
    textInverse: '#000000',
    
    // Border colors
    borderPrimary: '#333333',
    borderSecondary: '#404040',
    borderAccent: '#667eea',
    
    // Overlay colors
    overlay: 'rgba(0, 0, 0, 0.8)',
    overlayLight: 'rgba(0, 0, 0, 0.5)',
    
    // Gradients
    gradientPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    gradientSecondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    gradientDark: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px',
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '50%',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    glow: '0 0 20px rgba(102, 126, 234, 0.5)',
  },
  
  typography: {
    fontFamily: {
      primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: 'SF Mono, Monaco, Inconsolata, "Roboto Mono", "Source Code Pro", Menlo, Consolas, "DejaVu Sans Mono", monospace',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      xxl: '24px',
      xxxl: '32px',
      display: '48px',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  transitions: {
    fast: '0.15s ease-in-out',
    normal: '0.3s ease-in-out',
    slow: '0.5s ease-in-out',
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    xxl: '1536px',
  },
  
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }
  
  body {
    font-family: ${props => props.theme.typography.fontFamily.primary};
    font-size: ${props => props.theme.typography.fontSize.md};
    font-weight: ${props => props.theme.typography.fontWeight.normal};
    line-height: ${props => props.theme.typography.lineHeight.normal};
    color: ${props => props.theme.colors.textPrimary};
    background-color: ${props => props.theme.colors.bgPrimary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }
  
  #root {
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
  }
  
  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
    line-height: ${props => props.theme.typography.lineHeight.tight};
    margin-bottom: ${props => props.theme.spacing.md};
  }
  
  h1 { font-size: ${props => props.theme.typography.fontSize.xxxl}; }
  h2 { font-size: ${props => props.theme.typography.fontSize.xxl}; }
  h3 { font-size: ${props => props.theme.typography.fontSize.xl}; }
  h4 { font-size: ${props => props.theme.typography.fontSize.lg}; }
  h5 { font-size: ${props => props.theme.typography.fontSize.md}; }
  h6 { font-size: ${props => props.theme.typography.fontSize.sm}; }
  
  p {
    margin-bottom: ${props => props.theme.spacing.md};
    line-height: ${props => props.theme.typography.lineHeight.relaxed};
  }
  
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    transition: color ${props => props.theme.transitions.fast};
    
    &:hover {
      color: ${props => props.theme.colors.primaryDark};
    }
  }
  
  /* Buttons */
  button {
    font-family: inherit;
    font-size: inherit;
    border: none;
    background: none;
    cursor: pointer;
    transition: all ${props => props.theme.transitions.fast};
    
    &:focus {
      outline: 2px solid ${props => props.theme.colors.primary};
      outline-offset: 2px;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  /* Inputs */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    border: 1px solid ${props => props.theme.colors.borderPrimary};
    border-radius: ${props => props.theme.borderRadius.md};
    background-color: ${props => props.theme.colors.bgSecondary};
    color: ${props => props.theme.colors.textPrimary};
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
    transition: all ${props => props.theme.transitions.fast};
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    &::placeholder {
      color: ${props => props.theme.colors.textTertiary};
    }
  }
  
  /* Scrollbars */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.bgSecondary};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.borderPrimary};
    border-radius: ${props => props.theme.borderRadius.sm};
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.borderSecondary};
  }
  
  /* Selection */
  ::selection {
    background-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.textInverse};
  }
  
  /* Focus styles */
  *:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }
  
  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% {
      transform: translate3d(0, 0, 0);
    }
    40%, 43% {
      transform: translate3d(0, -30px, 0);
    }
    70% {
      transform: translate3d(0, -15px, 0);
    }
    90% {
      transform: translate3d(0, -4px, 0);
    }
  }
  
  /* Utility classes */
  .fade-in { animation: fadeIn 0.3s ease-in-out; }
  .slide-in-up { animation: slideInUp 0.3s ease-in-out; }
  .slide-in-down { animation: slideInDown 0.3s ease-in-out; }
  .slide-in-left { animation: slideInLeft 0.3s ease-in-out; }
  .slide-in-right { animation: slideInRight 0.3s ease-in-out; }
  .pulse { animation: pulse 2s infinite; }
  .spin { animation: spin 1s linear infinite; }
  .bounce { animation: bounce 1s infinite; }
  
  /* Responsive utilities */
  .hidden { display: none !important; }
  .block { display: block !important; }
  .inline-block { display: inline-block !important; }
  .flex { display: flex !important; }
  .inline-flex { display: inline-flex !important; }
  .grid { display: grid !important; }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    .sm\\:hidden { display: none !important; }
    .sm\\:block { display: block !important; }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    .md\\:hidden { display: none !important; }
    .md\\:block { display: block !important; }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    .lg\\:hidden { display: none !important; }
    .lg\\:block { display: block !important; }
  }
`;
