import React from 'react';
import styled from 'styled-components';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.bgPrimary};
  color: ${props => props.theme.colors.textPrimary};
  text-align: center;
`;

const ErrorIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.theme.colors.error};
  color: ${props => props.theme.colors.textInverse};
  margin-bottom: ${props => props.theme.spacing.lg};
  
  svg {
    width: 40px;
    height: 40px;
  }
`;

const ErrorTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSize.xxxl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.textPrimary};
`;

const ErrorMessage = styled.p`
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.xl};
  max-width: 600px;
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
`;

const ErrorDetails = styled.details`
  margin-bottom: ${props => props.theme.spacing.xl};
  text-align: left;
  max-width: 600px;
  width: 100%;
`;

const ErrorSummary = styled.summary`
  font-size: ${props => props.theme.typography.fontSize.md};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.textPrimary};
  cursor: pointer;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.bgSecondary};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.borderPrimary};
  
  &:hover {
    background: ${props => props.theme.colors.bgTertiary};
  }
`;

const ErrorStack = styled.pre`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
  background: ${props => props.theme.colors.bgSecondary};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.borderPrimary};
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
  margin-top: ${props => props.theme.spacing.md};
  font-family: ${props => props.theme.typography.fontFamily.mono};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  flex-wrap: wrap;
  justify-content: center;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.primary ? props.theme.colors.primary : props.theme.colors.bgTertiary};
  color: ${props => props.primary ? props.theme.colors.textInverse : props.theme.colors.textPrimary};
  border: 1px solid ${props => props.primary ? props.theme.colors.primary : props.theme.colors.borderPrimary};
  font-size: ${props => props.theme.typography.fontSize.md};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.primary ? props.theme.colors.primaryDark : props.theme.colors.bgQuaternary};
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true,
      errorId: Date.now().toString()
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    // In a real app, you might want to send this to an error reporting service
    // this.logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReportError = () => {
    const { error, errorInfo, errorId } = this.state;
    
    // Create error report
    const errorReport = {
      id: errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      error: {
        name: error?.name,
        message: error?.message,
        stack: error?.stack
      },
      errorInfo: errorInfo
    };

    // In a real app, you would send this to your error reporting service
    console.log('Error report:', errorReport);
    
    // For now, just copy to clipboard
    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2))
      .then(() => {
        alert('Error report copied to clipboard. Please report this to the development team.');
      })
      .catch(() => {
        alert('Error report generated. Please report this to the development team.');
      });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorIcon>
            <AlertTriangle size={40} />
          </ErrorIcon>
          
          <ErrorTitle>Something went wrong</ErrorTitle>
          
          <ErrorMessage>
            We're sorry, but something unexpected happened. The application has encountered an error and needs to be reloaded.
          </ErrorMessage>

          <ErrorDetails>
            <ErrorSummary>Technical Details</ErrorSummary>
            <ErrorStack>
              {this.state.error && this.state.error.toString()}
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </ErrorStack>
          </ErrorDetails>

          <ActionButtons>
            <ActionButton primary onClick={this.handleReload}>
              <RefreshCw size={18} />
              Reload Application
            </ActionButton>
            
            <ActionButton onClick={this.handleGoHome}>
              <Home size={18} />
              Try Again
            </ActionButton>
            
            <ActionButton onClick={this.handleReportError}>
              <AlertTriangle size={18} />
              Report Error
            </ActionButton>
          </ActionButtons>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
