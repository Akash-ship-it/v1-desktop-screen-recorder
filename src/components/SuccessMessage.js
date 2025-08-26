import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

const SuccessContainer = styled(motion.div)`
  position: fixed;
  top: 50px;
  right: 20px;
  max-width: 400px;
  background: ${props => props.theme.colors.success || '#10b981'};
  color: ${props => props.theme.colors.textInverse};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.lg};
  z-index: ${props => props.theme.zIndex.modal + 1};
  display: flex;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.sm};
`;

const SuccessIcon = styled.div`
  flex-shrink: 0;
  margin-top: 2px;
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const SuccessContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const SuccessTitle = styled.div`
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  margin-bottom: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const SuccessMessageText = styled.div`
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

function SuccessMessage({ message, duration = 5000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  if (!message) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <SuccessContainer
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <SuccessIcon>
            <CheckCircle size={20} />
          </SuccessIcon>
          
          <SuccessContent>
            <SuccessTitle>Success</SuccessTitle>
            <SuccessMessageText>{message}</SuccessMessageText>
          </SuccessContent>
          
          <CloseButton onClick={handleClose} title="Close">
            <X size={16} />
          </CloseButton>
        </SuccessContainer>
      )}
    </AnimatePresence>
  );
}

export default SuccessMessage;
