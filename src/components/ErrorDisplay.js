import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const ErrorContainer = styled(motion.div)`
  position: fixed;
  top: 50px;
  right: 20px;
  max-width: 400px;
  background: ${props => props.theme.colors.error};
  color: ${props => props.theme.colors.textInverse};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.lg};
  z-index: ${props => props.theme.zIndex.modal + 1};
  display: flex;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.sm};
`;

const ErrorIcon = styled.div`
  flex-shrink: 0;
  margin-top: 2px;
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const ErrorContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ErrorTitle = styled.div`
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  margin-bottom: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const ErrorMessage = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  line-height: ${props => props.theme.typography.lineHeight.tight};
  word-break: break-word;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 2px;
  border-radius: ${props => props.theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color ${props => props.theme.transitions.fast};
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

function ErrorDisplay() {
  const { error, actions } = useApp();

  if (!error) return null;

  const handleClose = () => {
    actions.clearError();
  };

  return (
    <AnimatePresence>
      <ErrorContainer
        initial={{ opacity: 0, x: 300, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 300, scale: 0.8 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <ErrorIcon>
          <AlertCircle size={20} />
        </ErrorIcon>
        
        <ErrorContent>
          <ErrorTitle>Error</ErrorTitle>
          <ErrorMessage>{error}</ErrorMessage>
        </ErrorContent>
        
        <CloseButton onClick={handleClose} title="Close">
          <X size={16} />
        </CloseButton>
      </ErrorContainer>
    </AnimatePresence>
  );
}

export default ErrorDisplay;
