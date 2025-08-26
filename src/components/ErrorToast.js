import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';

const ToastContainer = styled(motion.div)`
  position: fixed;
  top: ${props => props.theme.spacing.lg};
  right: ${props => props.theme.spacing.lg};
  z-index: ${props => props.theme.zIndex.tooltip};
  max-width: 400px;
  min-width: 300px;
`;

const Toast = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.error};
  color: ${props => props.theme.colors.textInverse};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.lg};
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ToastIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: ${props => props.theme.borderRadius.sm};
  background: rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const ToastContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ToastTitle = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  margin-bottom: ${props => props.theme.spacing.xs};
  line-height: ${props => props.theme.typography.lineHeight.tight};
`;

const ToastMessage = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  opacity: 0.9;
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  word-break: break-word;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: ${props => props.theme.borderRadius.sm};
  background: rgba(255, 255, 255, 0.2);
  color: ${props => props.theme.colors.textInverse};
  border: none;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  flex-shrink: 0;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 0 0 ${props => props.theme.borderRadius.md} ${props => props.theme.borderRadius.md};
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 0 0 ${props => props.theme.borderRadius.md} ${props => props.theme.borderRadius.md};
`;

function ErrorToast({ message, onClose, duration = 5000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      <ToastContainer
        initial={{ opacity: 0, x: 300, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 300, scale: 0.8 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <Toast>
          <ToastIcon>
            <AlertTriangle size={16} />
          </ToastIcon>
          
          <ToastContent>
            <ToastTitle>Error</ToastTitle>
            <ToastMessage>{message}</ToastMessage>
          </ToastContent>
          
          <CloseButton onClick={onClose}>
            <X size={16} />
          </CloseButton>
          
          {duration > 0 && (
            <ProgressBar>
              <ProgressFill
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
              />
            </ProgressBar>
          )}
        </Toast>
      </ToastContainer>
    </AnimatePresence>
  );
}

export default ErrorToast;
