import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Settings } from 'lucide-react';

const AudioSettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const AudioToggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.bgTertiary};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.borderPrimary};
`;

const ToggleInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const ToggleIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.enabled ? props.theme.colors.primary : props.theme.colors.bgQuaternary};
  color: ${props => props.enabled ? props.theme.colors.textInverse : props.theme.colors.textSecondary};
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const ToggleText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const ToggleLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSize.md};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.textPrimary};
`;

const ToggleDescription = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
`;

const ToggleSwitch = styled(motion.button)`
  position: relative;
  width: 48px;
  height: 24px;
  border-radius: 12px;
  background: ${props => props.enabled ? props.theme.colors.primary : props.theme.colors.bgQuaternary};
  border: none;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.enabled ? props.theme.colors.primaryDark : props.theme.colors.borderSecondary};
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.enabled ? '26px' : '2px'};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    transition: all ${props => props.theme.transitions.fast};
  }
`;

const AudioOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.bgTertiary};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.borderPrimary};
`;

const AudioOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.sm} 0;
`;

const AudioOptionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const AudioOptionIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${props => props.theme.borderRadius.sm};
  background: ${props => props.theme.colors.bgQuaternary};
  color: ${props => props.theme.colors.textSecondary};
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const AudioOptionText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const AudioOptionLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.textPrimary};
`;

const AudioOptionDescription = styled.span`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.textSecondary};
`;

const AudioLevelIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const LevelBar = styled.div`
  width: 60px;
  height: 8px;
  background: ${props => props.theme.colors.bgQuaternary};
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

const LevelFill = styled.div`
  height: 100%;
  width: ${props => props.level}%;
  background: ${props => props.theme.colors.success};
  border-radius: 4px;
  transition: width 0.1s ease;
`;

const LevelText = styled.span`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.textSecondary};
  min-width: 30px;
  text-align: right;
`;

const AudioDeviceSelect = styled.select`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.bgQuaternary};
  color: ${props => props.theme.colors.textPrimary};
  border: 1px solid ${props => props.theme.colors.borderPrimary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  transition: all ${props => props.theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
  }
  
  option {
    background: ${props => props.theme.colors.bgSecondary};
    color: ${props => props.theme.colors.textPrimary};
  }
`;

const AdvancedButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.bgQuaternary};
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.borderSecondary};
    color: ${props => props.theme.colors.textPrimary};
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

function AudioSettings({ audioEnabled, onAudioToggle }) {
  const [systemAudioLevel, setSystemAudioLevel] = React.useState(0);
  const [microphoneLevel, setMicrophoneLevel] = React.useState(0);
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  // Simulate audio level monitoring
  React.useEffect(() => {
    if (audioEnabled) {
      const interval = setInterval(() => {
        setSystemAudioLevel(Math.random() * 100);
        setMicrophoneLevel(Math.random() * 100);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [audioEnabled]);

  const audioDevices = [
    { id: 'default', name: 'Default Audio Device' },
    { id: 'speakers', name: 'Speakers' },
    { id: 'headphones', name: 'Headphones' }
  ];

  const microphoneDevices = [
    { id: 'default', name: 'Default Microphone' },
    { id: 'mic1', name: 'Built-in Microphone' },
    { id: 'mic2', name: 'External Microphone' }
  ];

  return (
    <AudioSettingsContainer>
      <AudioToggle>
        <ToggleInfo>
          <ToggleIcon enabled={audioEnabled}>
            {audioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
          </ToggleIcon>
          <ToggleText>
            <ToggleLabel>Audio Recording</ToggleLabel>
            <ToggleDescription>
              {audioEnabled ? 'System audio and microphone will be recorded' : 'No audio will be recorded'}
            </ToggleDescription>
          </ToggleText>
        </ToggleInfo>
        <ToggleSwitch
          enabled={audioEnabled}
          onClick={() => onAudioToggle(!audioEnabled)}
          whileTap={{ scale: 0.95 }}
        />
      </AudioToggle>

      {audioEnabled && (
        <AudioOptions>
          <AudioOption>
            <AudioOptionInfo>
              <AudioOptionIcon>
                <Volume2 size={16} />
              </AudioOptionIcon>
              <AudioOptionText>
                <AudioOptionLabel>System Audio</AudioOptionLabel>
                <AudioOptionDescription>Audio from your computer</AudioOptionDescription>
              </AudioOptionText>
            </AudioOptionInfo>
            <AudioLevelIndicator>
              <LevelBar>
                <LevelFill level={systemAudioLevel} />
              </LevelBar>
              <LevelText>{Math.round(systemAudioLevel)}%</LevelText>
            </AudioLevelIndicator>
          </AudioOption>

          <AudioOption>
            <AudioOptionInfo>
              <AudioOptionIcon>
                <Mic size={16} />
              </AudioOptionIcon>
              <AudioOptionText>
                <AudioOptionLabel>Microphone</AudioOptionLabel>
                <AudioOptionDescription>Audio from your microphone</AudioOptionDescription>
              </AudioOptionText>
            </AudioOptionInfo>
            <AudioLevelIndicator>
              <LevelBar>
                <LevelFill level={microphoneLevel} />
              </LevelBar>
              <LevelText>{Math.round(microphoneLevel)}%</LevelText>
            </AudioLevelIndicator>
          </AudioOption>

          <AdvancedButton onClick={() => setShowAdvanced(!showAdvanced)}>
            <Settings size={14} />
            Advanced Settings
          </AdvancedButton>

          {showAdvanced && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#b3b3b3', marginBottom: '4px', display: 'block' }}>
                  System Audio Device
                </label>
                <AudioDeviceSelect>
                  {audioDevices.map(device => (
                    <option key={device.id} value={device.id}>
                      {device.name}
                    </option>
                  ))}
                </AudioDeviceSelect>
              </div>
              
              <div>
                <label style={{ fontSize: '12px', color: '#b3b3b3', marginBottom: '4px', display: 'block' }}>
                  Microphone Device
                </label>
                <AudioDeviceSelect>
                  {microphoneDevices.map(device => (
                    <option key={device.id} value={device.id}>
                      {device.name}
                    </option>
                  ))}
                </AudioDeviceSelect>
              </div>
            </div>
          )}
        </AudioOptions>
      )}
    </AudioSettingsContainer>
  );
}

export default AudioSettings;
