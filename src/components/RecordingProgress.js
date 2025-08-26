import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Video, Clock, HardDrive } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const ProgressContainer = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 300px;
  background: ${props => props.theme.colors.bgSecondary};
  border: 1px solid ${props => props.theme.colors.borderPrimary};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.lg};
  z-index: ${props => props.theme.zIndex.modal};
`;

const ProgressHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.textPrimary};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${props => props.theme.colors.bgTertiary};
  border-radius: ${props => props.theme.borderRadius.full};
  overflow: hidden;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.full};
`;

const ProgressStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.textSecondary};
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const formatTime = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}:${minutes % 60}:${seconds % 60}`;
  }
  return `${minutes}:${seconds % 60}`;
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

function RecordingProgress() {
  const { recordingProgress, isRecording } = useApp();

  if (!isRecording || !recordingProgress) return null;

  const { percent = 0, timemark = '00:00:00', fps = 0 } = recordingProgress;

  return (
    <ProgressContainer
      initial={{ opacity: 0, y: 100, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 100, scale: 0.8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <ProgressHeader>
        <Video size={16} />
        Recording in Progress
      </ProgressHeader>
      
      <ProgressBar>
        <ProgressFill
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percent, 100)}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </ProgressBar>
      
      <ProgressStats>
        <StatItem>
          <Clock size={14} />
          {timemark}
        </StatItem>
        <StatItem>
          <Video size={14} />
          {fps.toFixed(1)} FPS
        </StatItem>
        <StatItem>
          <HardDrive size={14} />
          {percent.toFixed(1)}%
        </StatItem>
      </ProgressStats>
    </ProgressContainer>
  );
}

export default RecordingProgress;
