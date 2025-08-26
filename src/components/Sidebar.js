import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Video, 
  Edit3, 
  Folder, 
  Settings, 
  Play, 
  Square, 
  Pause,
  Menu,
  Volume2,
  Monitor,
  Maximize2,
  Crop
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const SidebarContainer = styled(motion.aside)`
  position: fixed;
  left: 0;
  top: 32px; /* Account for menubar height */
  width: 280px;
  height: calc(100vh - 32px); /* Subtract menubar height */
  background: ${props => props.theme.colors.bgSecondary};
  border-right: 1px solid ${props => props.theme.colors.borderPrimary};
  z-index: ${props => props.theme.zIndex.fixed};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const SidebarHeader = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.borderPrimary};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.primary};
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.bgTertiary};
  color: ${props => props.theme.colors.textSecondary};
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.bgQuaternary};
    color: ${props => props.theme.colors.textPrimary};
  }
`;

const SidebarContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const NavigationSection = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const SectionTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const NavItem = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.textInverse : props.theme.colors.textPrimary};
  font-size: ${props => props.theme.typography.fontSize.md};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  transition: all ${props => props.theme.transitions.fast};
  margin-bottom: ${props => props.theme.spacing.xs};
  
  &:hover {
    background: ${props => props.active ? props.theme.colors.primaryDark : props.theme.colors.bgTertiary};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const RecordingSection = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-top: 1px solid ${props => props.theme.colors.borderPrimary};
`;

const RecordingControls = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ControlButton = styled(motion.button)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
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
  font-size: ${props => props.theme.typography.fontSize.sm};
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
    width: 16px;
    height: 16px;
  }
`;

const RecordingStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.isRecording ? props.theme.colors.error : props.theme.colors.bgTertiary};
  color: ${props => props.isRecording ? props.theme.colors.textInverse : props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const RecordingTimer = styled.div`
  text-align: center;
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.textTertiary};
  margin-top: ${props => props.theme.spacing.sm};
`;

const QuickOptions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.sm};
`;

const QuickOption = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.bgTertiary};
  color: ${props => props.theme.colors.textSecondary};
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.bgQuaternary};
    color: ${props => props.theme.colors.textPrimary};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  span {
    font-size: ${props => props.theme.typography.fontSize.xs};
    font-weight: ${props => props.theme.typography.fontWeight.medium};
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

function Sidebar() {
  const { 
    currentView, 
    sidebarOpen, 
    isRecording, 
    isPaused, 
    recordingDuration,
    recordingOptions,
    actions 
  } = useApp();

  const navigationItems = [
    { id: 'recorder', label: 'Recorder', icon: Video },
    { id: 'editor', label: 'Editor', icon: Edit3 },
    { id: 'library', label: 'Library', icon: Folder },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleStartRecording = () => {
    actions.startRecording();
  };

  const handleStopRecording = () => {
    actions.stopRecording();
  };

  const handlePauseRecording = () => {
    // Toggle pause state
    actions.updateRecordingOptions({ paused: !isPaused });
  };

  const handleQuickRecord = (type) => {
    const options = { ...recordingOptions };
    
    switch (type) {
      case 'screen':
        options.source = 'screen';
        break;
      case 'window':
        options.source = 'window';
        break;
      case 'area':
        options.source = 'area';
        break;
      case 'audio':
        options.video = false;
        options.audio = true;
        break;
    }
    
    actions.startRecording(options);
  };

  return (
    <SidebarContainer
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      exit={{ x: -280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <SidebarHeader>
        <Logo>
          <Video size={24} />
          Movami
        </Logo>
        <ToggleButton onClick={() => actions.toggleSidebar()}>
          <Menu size={16} />
        </ToggleButton>
      </SidebarHeader>

      <SidebarContent>
        <NavigationSection>
          <SectionTitle>Navigation</SectionTitle>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavItem
                key={item.id}
                active={currentView === item.id}
                onClick={() => actions.setCurrentView(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon size={20} />
                {item.label}
              </NavItem>
            );
          })}
        </NavigationSection>

        <RecordingSection>
          <SectionTitle>Recording</SectionTitle>
          
          <RecordingControls>
            {!isRecording ? (
              <ControlButton
                variant="primary"
                onClick={handleStartRecording}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play size={16} />
                Start
              </ControlButton>
            ) : (
              <>
                <ControlButton
                  variant="secondary"
                  onClick={handlePauseRecording}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isPaused ? <Play size={16} /> : <Pause size={16} />}
                  {isPaused ? 'Resume' : 'Pause'}
                </ControlButton>
                <ControlButton
                  variant="danger"
                  onClick={handleStopRecording}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Square size={16} />
                  Stop
                </ControlButton>
              </>
            )}
          </RecordingControls>

          <RecordingStatus isRecording={isRecording}>
            {isRecording ? (
              <>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor', animation: 'pulse 1s infinite' }} />
                Recording
              </>
            ) : (
              <>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor' }} />
                Ready
              </>
            )}
          </RecordingStatus>

          {isRecording && (
            <RecordingTimer>
              {formatDuration(recordingDuration)}
            </RecordingTimer>
          )}

          <QuickOptions>
            <QuickOption onClick={() => handleQuickRecord('screen')}>
              <Monitor size={20} />
              <span>Screen</span>
            </QuickOption>
            <QuickOption onClick={() => handleQuickRecord('window')}>
              <Maximize2 size={20} />
              <span>Window</span>
            </QuickOption>
            <QuickOption onClick={() => handleQuickRecord('area')}>
              <Crop size={20} />
              <span>Area</span>
            </QuickOption>
            <QuickOption onClick={() => handleQuickRecord('audio')}>
              <Volume2 size={20} />
              <span>Audio</span>
            </QuickOption>
          </QuickOptions>
          
          <QuickOptions>
            <QuickOption onClick={() => actions.openRecordingFolder()}>
              <Folder size={20} />
              <span>Open Recordings</span>
            </QuickOption>
          </QuickOptions>
        </RecordingSection>
      </SidebarContent>
    </SidebarContainer>
  );
}

export default Sidebar;
