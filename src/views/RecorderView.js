import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Monitor, 
  Maximize2, 
  Crop, 
  Volume2, 
  Settings,
  Play,
  Square,
  Pause,
  Clock,
  Video,
  Mic,
  MicOff,
  VolumeX,
  Volume1,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import RecordingPreview from '../components/RecordingPreview';
import SourceSelector from '../components/SourceSelector';
import QualitySettings from '../components/QualitySettings';
import AudioSettings from '../components/AudioSettings';
import CountdownSettings from '../components/CountdownSettings';
import HotkeySettings from '../components/HotkeySettings';

const RecorderContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${props => props.theme.spacing.lg};
  gap: ${props => props.theme.spacing.lg};
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.borderPrimary};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize.xxl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.textPrimary};
  margin: 0;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: ${props => props.theme.spacing.lg};
  flex: 1;
  overflow: hidden;
`;

const PreviewSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
  overflow: hidden;
`;

const ControlsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
  overflow-y: auto;
  padding-right: ${props => props.theme.spacing.sm};
`;

const ControlPanel = styled.div`
  background: ${props => props.theme.colors.bgSecondary};
  border: 1px solid ${props => props.theme.colors.borderPrimary};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const PanelTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.textPrimary};
  margin: 0;
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: ${props => props.theme.borderRadius.sm};
  background: ${props => props.theme.colors.bgTertiary};
  color: ${props => props.theme.colors.textSecondary};
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.bgQuaternary};
    color: ${props => props.theme.colors.textPrimary};
  }
`;

const RecordingControls = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.lg};
`;

const ControlButton = styled(motion.button)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => {
    if (props.variant === 'primary') return props.theme.colors.primary;
    if (props.variant === 'danger') return props.theme.colors.error;
    if (props.variant === 'secondary') return props.theme.colors.bgTertiary;
    return props.theme.colors.bgTertiary;
  }};
  color: ${props => {
    if (props.variant === 'primary' || props.variant === 'danger') return props.theme.colors.textInverse;
    return props.theme.colors.textPrimary;
  }};
  font-size: ${props => props.theme.typography.fontSize.md};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => {
      if (props.variant === 'primary') return props.theme.colors.primaryDark;
      if (props.variant === 'danger') return props.theme.colors.error;
      if (props.variant === 'secondary') return props.theme.colors.bgQuaternary;
      return props.theme.colors.bgQuaternary;
    }};
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

const StatusBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.bgSecondary};
  border: 1px solid ${props => props.theme.colors.borderPrimary};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-top: ${props => props.theme.spacing.lg};
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
`;

const StatusIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.active ? props.theme.colors.success : props.theme.colors.textTertiary};
  animation: ${props => props.active ? 'pulse 1s infinite' : 'none'};
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

function RecorderView() {
  const { 
    isRecording, 
    isPaused, 
    recordingDuration,
    recordingOptions,
    screens,
    windows,
    loading,
    actions 
  } = useApp();

  const [expandedPanels, setExpandedPanels] = useState({
    source: true,
    quality: true,
    audio: true,
    countdown: false,
    hotkeys: false
  });

  const togglePanel = (panel) => {
    setExpandedPanels(prev => ({
      ...prev,
      [panel]: !prev[panel]
    }));
  };

  const handleStartRecording = () => {
    actions.startRecording();
  };

  const handleStopRecording = () => {
    actions.stopRecording();
  };

  const handlePauseRecording = () => {
    actions.updateRecordingOptions({ paused: !isPaused });
  };

  const updateRecordingOptions = (options) => {
    actions.updateRecordingOptions(options);
  };

  return (
    <RecorderContainer>
      <Header>
        <Title>Screen Recorder</Title>
        <StatusBar>
          <StatusItem>
            <StatusIndicator active={!isRecording} />
            {isRecording ? 'Recording' : 'Ready'}
          </StatusItem>
          {isRecording && (
            <>
              <StatusItem>
                <Clock size={14} />
                {formatDuration(recordingDuration)}
              </StatusItem>
              <StatusItem>
                <Video size={14} />
                {recordingOptions.video ? 'Video' : 'Audio Only'}
              </StatusItem>
              <StatusItem>
                {recordingOptions.audio ? <Mic size={14} /> : <MicOff size={14} />}
                {recordingOptions.audio ? 'Audio' : 'No Audio'}
              </StatusItem>
            </>
          )}
        </StatusBar>
      </Header>

      <MainContent>
        <PreviewSection>
          <RecordingPreview />
          
          <RecordingControls>
            {!isRecording ? (
              <ControlButton
                variant="primary"
                onClick={handleStartRecording}
                disabled={loading.recording}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play size={18} />
                Start Recording
              </ControlButton>
            ) : (
              <>
                <ControlButton
                  variant="secondary"
                  onClick={handlePauseRecording}
                  disabled={loading.recording}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isPaused ? <Play size={18} /> : <Pause size={18} />}
                  {isPaused ? 'Resume' : 'Pause'}
                </ControlButton>
                <ControlButton
                  variant="danger"
                  onClick={handleStopRecording}
                  disabled={loading.recording}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Square size={18} />
                  Stop Recording
                </ControlButton>
              </>
            )}
          </RecordingControls>
        </PreviewSection>

        <ControlsSection>
          {/* Source Selection */}
          <ControlPanel>
            <PanelHeader>
              <PanelTitle>Recording Source</PanelTitle>
              <ToggleButton onClick={() => togglePanel('source')}>
                {expandedPanels.source ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </ToggleButton>
            </PanelHeader>
            {expandedPanels.source && (
              <SourceSelector
                screens={screens}
                windows={windows}
                selectedSource={recordingOptions.source}
                selectedWindow={recordingOptions.selectedWindow}
                selectedArea={recordingOptions.selectedArea}
                onSourceChange={(source) => updateRecordingOptions({ source })}
                onWindowChange={(windowId) => updateRecordingOptions({ selectedWindow: windowId })}
                onAreaChange={(area) => updateRecordingOptions({ selectedArea: area })}
                loading={loading.screens || loading.windows}
              />
            )}
          </ControlPanel>

          {/* Quality Settings */}
          <ControlPanel>
            <PanelHeader>
              <PanelTitle>Quality Settings</PanelTitle>
              <ToggleButton onClick={() => togglePanel('quality')}>
                {expandedPanels.quality ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </ToggleButton>
            </PanelHeader>
            {expandedPanels.quality && (
              <QualitySettings
                quality={recordingOptions.quality}
                frameRate={recordingOptions.frameRate}
                resolution={recordingOptions.resolution}
                onQualityChange={(quality) => updateRecordingOptions({ quality })}
                onFrameRateChange={(frameRate) => updateRecordingOptions({ frameRate })}
                onResolutionChange={(resolution) => updateRecordingOptions({ resolution })}
              />
            )}
          </ControlPanel>

          {/* Audio Settings */}
          <ControlPanel>
            <PanelHeader>
              <PanelTitle>Audio Settings</PanelTitle>
              <ToggleButton onClick={() => togglePanel('audio')}>
                {expandedPanels.audio ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </ToggleButton>
            </PanelHeader>
            {expandedPanels.audio && (
              <AudioSettings
                audioEnabled={recordingOptions.audio}
                onAudioToggle={(audio) => updateRecordingOptions({ audio })}
              />
            )}
          </ControlPanel>

          {/* Countdown Settings */}
          <ControlPanel>
            <PanelHeader>
              <PanelTitle>Countdown Timer</PanelTitle>
              <ToggleButton onClick={() => togglePanel('countdown')}>
                {expandedPanels.countdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </ToggleButton>
            </PanelHeader>
            {expandedPanels.countdown && (
              <CountdownSettings
                countdown={recordingOptions.countdown}
                onCountdownChange={(countdown) => updateRecordingOptions({ countdown })}
              />
            )}
          </ControlPanel>

          {/* Hotkey Settings */}
          <ControlPanel>
            <PanelHeader>
              <PanelTitle>Hotkeys</PanelTitle>
              <ToggleButton onClick={() => togglePanel('hotkeys')}>
                {expandedPanels.hotkeys ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </ToggleButton>
            </PanelHeader>
            {expandedPanels.hotkeys && (
              <HotkeySettings />
            )}
          </ControlPanel>
        </ControlsSection>
      </MainContent>
    </RecorderContainer>
  );
}

export default RecorderView;
