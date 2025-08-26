import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Video, Square } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const IndicatorContainer = styled(motion.div)`
  position: fixed;
  top: ${props => props.theme.spacing.lg};
  left: 50%;
  transform: translateX(-50%);
  z-index: ${props => props.theme.zIndex.fixed};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.error};
  color: ${props => props.theme.colors.textInverse};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.lg};
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;

const RecordingDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 1s infinite;
`;

const RecordingText = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const RecordingTimer = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-family: ${props => props.theme.typography.fontFamily.mono};
  background: rgba(255, 255, 255, 0.2);
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  min-width: 60px;
  text-align: center;
`;

const StopButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: rgba(255, 255, 255, 0.2);
  color: ${props => props.theme.colors.textInverse};
  border: none;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const formatDuration = (ms) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
};

function RecordingIndicator() {
  const { recordingDuration, actions } = useApp();

  const handleStopRecording = () => {
    actions.stopRecording();
  };

  return (
    <IndicatorContainer
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <RecordingDot />
      <Video size={16} />
      <RecordingText>Recording</RecordingText>
      <RecordingTimer>{formatDuration(recordingDuration)}</RecordingTimer>
      <StopButton
        onClick={handleStopRecording}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Square size={16} />
      </StopButton>
    </IndicatorContainer>
  );
}

export default RecordingIndicator;
