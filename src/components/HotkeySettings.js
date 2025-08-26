import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Keyboard, Play, Square, Pause, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const HotkeySettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const HotkeyInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.bgTertiary};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.borderPrimary};
`;

const InfoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textInverse};
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const InfoText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const InfoTitle = styled.span`
  font-size: ${props => props.theme.typography.fontSize.md};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.textPrimary};
`;

const InfoDescription = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
`;

const HotkeyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const HotkeyItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.bgTertiary};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.borderPrimary};
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.bgQuaternary};
  }
`;

const HotkeyDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const HotkeyLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.textPrimary};
`;

const HotkeyDescription = styled.span`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.textSecondary};
`;

const HotkeyDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const KeyCombo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
`;

const Key = styled.span`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.bgQuaternary};
  border: 1px solid ${props => props.theme.colors.borderPrimary};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.textPrimary};
  min-width: 20px;
  text-align: center;
  font-family: ${props => props.theme.typography.fontFamily.mono};
`;

const KeySeparator = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.xs};
`;

const EditButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  background: ${props => props.theme.colors.bgQuaternary};
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.xs};
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.borderSecondary};
    color: ${props => props.theme.colors.textPrimary};
  }
  
  svg {
    width: 12px;
    height: 12px;
  }
`;

const RecordingIndicator = styled.div`
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

const ResetButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.bgTertiary};
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.bgQuaternary};
    color: ${props => props.theme.colors.textPrimary};
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const defaultHotkeys = {
  startStop: 'CommandOrControl+Shift+R',
  pause: 'CommandOrControl+Shift+P',
  showHide: 'CommandOrControl+Shift+H'
};

const hotkeyActions = [
  {
    id: 'startStop',
    label: 'Start/Stop Recording',
    description: 'Start or stop the current recording',
    icon: Play,
    defaultKey: 'CommandOrControl+Shift+R'
  },
  {
    id: 'pause',
    label: 'Pause/Resume',
    description: 'Pause or resume the current recording',
    icon: Pause,
    defaultKey: 'CommandOrControl+Shift+P'
  },
  {
    id: 'showHide',
    label: 'Show/Hide App',
    description: 'Show or hide the application window',
    icon: Eye,
    defaultKey: 'CommandOrControl+Shift+H'
  }
];

function HotkeySettings() {
  const { settings, isRecording, actions } = useApp();
  const [editingHotkey, setEditingHotkey] = useState(null);
  const [listening, setListening] = useState(false);

  const formatHotkey = (hotkey) => {
    return hotkey
      .replace('CommandOrControl', '⌘/Ctrl')
      .replace('Shift', '⇧')
      .replace('Alt', '⌥')
      .replace('+', ' + ');
  };

  const parseHotkey = (hotkey) => {
    return hotkey.split(' + ').map(key => {
      switch (key) {
        case '⌘/Ctrl': return 'CommandOrControl';
        case '⇧': return 'Shift';
        case '⌥': return 'Alt';
        default: return key;
      }
    }).join('+');
  };

  const handleEditHotkey = (hotkeyId) => {
    setEditingHotkey(hotkeyId);
    setListening(true);
  };

  const handleKeyPress = (event) => {
    if (!listening) return;

    event.preventDefault();
    
    const keys = [];
    if (event.metaKey || event.ctrlKey) keys.push('CommandOrControl');
    if (event.shiftKey) keys.push('Shift');
    if (event.altKey) keys.push('Alt');
    
    if (event.key && event.key !== 'Meta' && event.key !== 'Control' && event.key !== 'Shift' && event.key !== 'Alt') {
      keys.push(event.key.toUpperCase());
    }
    
    if (keys.length > 0) {
      const newHotkey = keys.join('+');
      const newSettings = { ...settings, hotkeys: { ...settings.hotkeys, [editingHotkey]: newHotkey } };
      actions.updateSettings(newSettings);
      setEditingHotkey(null);
      setListening(false);
    }
  };

  const handleResetHotkeys = () => {
    const newSettings = { ...settings, hotkeys: defaultHotkeys };
    actions.updateSettings(newSettings);
  };

  React.useEffect(() => {
    if (listening) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [listening, editingHotkey]);

  return (
    <HotkeySettingsContainer>
      <HotkeyInfo>
        <InfoIcon>
          <Keyboard size={20} />
        </InfoIcon>
        <InfoText>
          <InfoTitle>Keyboard Shortcuts</InfoTitle>
          <InfoDescription>
            Customize keyboard shortcuts for quick access to recording controls
          </InfoDescription>
        </InfoText>
      </HotkeyInfo>

      {isRecording && (
        <RecordingIndicator>
          <div className="recording-dot" />
          Recording in progress - hotkeys are active
        </RecordingIndicator>
      )}

      <HotkeyList>
        {hotkeyActions.map((action) => {
          const Icon = action.icon;
          const currentHotkey = settings.hotkeys[action.id] || action.defaultKey;
          const isEditing = editingHotkey === action.id;
          
          return (
            <HotkeyItem key={action.id}>
              <HotkeyDetails>
                <HotkeyLabel>{action.label}</HotkeyLabel>
                <HotkeyDescription>{action.description}</HotkeyDescription>
              </HotkeyDetails>
              
              <HotkeyDisplay>
                <KeyCombo>
                  {formatHotkey(currentHotkey).split(' + ').map((key, index) => (
                    <React.Fragment key={index}>
                      <Key>{key}</Key>
                      {index < formatHotkey(currentHotkey).split(' + ').length - 1 && (
                        <KeySeparator>+</KeySeparator>
                      )}
                    </React.Fragment>
                  ))}
                </KeyCombo>
                
                <EditButton
                  onClick={() => handleEditHotkey(action.id)}
                  disabled={isEditing}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isEditing ? 'Press keys...' : 'Edit'}
                </EditButton>
              </HotkeyDisplay>
            </HotkeyItem>
          );
        })}
      </HotkeyList>

      <ResetButton
        onClick={handleResetHotkeys}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Keyboard size={14} />
        Reset to Defaults
      </ResetButton>
    </HotkeySettingsContainer>
  );
}

export default HotkeySettings;
