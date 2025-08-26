import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Monitor, Maximize2, Crop, Volume2, Play, Square } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const PreviewContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  background: ${props => props.theme.colors.bgSecondary};
  border: 2px solid ${props => props.theme.colors.borderPrimary};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PreviewContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.xl};
`;

const PreviewIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.theme.colors.bgTertiary};
  color: ${props => props.theme.colors.textSecondary};
  
  svg {
    width: 40px;
    height: 40px;
  }
`;

const PreviewText = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
`;

const PreviewTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  margin-bottom: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.textPrimary};
`;

const PreviewDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.md};
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
  max-width: 400px;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: ${props => props.theme.borderRadius.md};
`;

const PreviewOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.colors.overlay};
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity ${props => props.theme.transitions.normal};
  
  &:hover {
    opacity: 1;
  }
`;

const OverlayButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textInverse};
  font-size: ${props => props.theme.typography.fontSize.md};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-1px);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const SourceInfo = styled.div`
  position: absolute;
  top: ${props => props.theme.spacing.md};
  left: ${props => props.theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.overlay};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.textPrimary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const RecordingIndicator = styled.div`
  position: absolute;
  top: ${props => props.theme.spacing.md};
  right: ${props => props.theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.error};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.textInverse};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  
  .recording-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
    animation: pulse 1s infinite;
  }
`;

function RecordingPreview() {
  const { 
    recordingOptions, 
    screens, 
    windows, 
    isRecording,
    actions 
  } = useApp();

  const [previewImage, setPreviewImage] = useState(null);
  const [sourceName, setSourceName] = useState('');
  const [sourceIcon, setSourceIcon] = useState(Monitor);

  useEffect(() => {
    updatePreview();
  }, [recordingOptions.source, recordingOptions.selectedWindow, recordingOptions.selectedArea, screens, windows]);

  const updatePreview = () => {
    const { source, selectedWindow, selectedArea } = recordingOptions;
    
    switch (source) {
      case 'screen':
        if (screens.length > 0) {
          const primaryScreen = screens.find(s => s.primary) || screens[0];
          setSourceName(primaryScreen.primary ? 'Primary Screen' : `Screen ${primaryScreen.id + 1}`);
          setSourceIcon(Monitor);
          // In a real implementation, you would capture a screenshot here
          setPreviewImage(null);
        }
        break;
        
      case 'window':
        if (selectedWindow && windows.length > 0) {
          const window = windows.find(w => w.id === selectedWindow);
          if (window) {
            setSourceName(window.name);
            setSourceIcon(Maximize2);
            setPreviewImage(window.thumbnail);
          }
        } else {
          setSourceName('Select a window');
          setSourceIcon(Maximize2);
          setPreviewImage(null);
        }
        break;
        
      case 'area':
        if (selectedArea) {
          setSourceName('Custom Area');
          setSourceIcon(Crop);
          setPreviewImage(null);
        } else {
          setSourceName('Select an area');
          setSourceIcon(Crop);
          setPreviewImage(null);
        }
        break;
        
      case 'audio':
        setSourceName('Audio Only');
        setSourceIcon(Volume2);
        setPreviewImage(null);
        break;
        
      default:
        setSourceName('Select source');
        setSourceIcon(Monitor);
        setPreviewImage(null);
    }
  };

  const getPreviewContent = () => {
    if (previewImage) {
      return (
        <>
          <PreviewImage src={previewImage} alt="Preview" />
          <PreviewOverlay>
            <OverlayButton
              onClick={() => actions.startRecording()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play size={18} />
              Start Recording
            </OverlayButton>
          </PreviewOverlay>
        </>
      );
    }

    const Icon = sourceIcon;
    
    return (
      <PreviewContent>
        <PreviewIcon>
          <Icon size={40} />
        </PreviewIcon>
        <PreviewText>
          <PreviewTitle>{sourceName}</PreviewTitle>
          <PreviewDescription>
            {recordingOptions.source === 'screen' && 'Full screen recording will capture your entire desktop'}
            {recordingOptions.source === 'window' && 'Select a specific application window to record'}
            {recordingOptions.source === 'area' && 'Drag to select a custom area of your screen'}
            {recordingOptions.source === 'audio' && 'Audio-only recording for podcasts and voice notes'}
          </PreviewDescription>
        </PreviewText>
      </PreviewContent>
    );
  };

  return (
    <PreviewContainer>
      {getPreviewContent()}
      
      <SourceInfo>
        <sourceIcon size={16} />
        {sourceName}
      </SourceInfo>
      
      {isRecording && (
        <RecordingIndicator>
          <div className="recording-dot" />
          Recording
        </RecordingIndicator>
      )}
    </PreviewContainer>
  );
}

export default RecordingPreview;
