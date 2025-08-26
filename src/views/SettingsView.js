import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Settings, Folder, Monitor, Volume2, Keyboard, Palette, Globe, Info } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const SettingsContainer = styled.div`
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

const SettingsContent = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: ${props => props.theme.spacing.lg};
  flex: 1;
  overflow: hidden;
`;

const SettingsSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  overflow-y: auto;
`;

const SettingsTab = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.bgTertiary};
  color: ${props => props.active ? props.theme.colors.textInverse : props.theme.colors.textPrimary};
  border: none;
  font-size: ${props => props.theme.typography.fontSize.md};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.active ? props.theme.colors.primaryDark : props.theme.colors.bgQuaternary};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const SettingsPanel = styled.div`
  background: ${props => props.theme.colors.bgSecondary};
  border: 1px solid ${props => props.theme.colors.borderPrimary};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  overflow-y: auto;
`;

const PanelTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.textPrimary};
  margin: 0 0 ${props => props.theme.spacing.lg} 0;
`;

const SettingGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const SettingLabel = styled.label`
  display: block;
  font-size: ${props => props.theme.typography.fontSize.md};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const SettingDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 ${props => props.theme.spacing.md} 0;
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.bgTertiary};
  color: ${props => props.theme.colors.textPrimary};
  border: 1px solid ${props => props.theme.colors.borderPrimary};
  font-size: ${props => props.theme.typography.fontSize.md};
  transition: all ${props => props.theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.bgTertiary};
  color: ${props => props.theme.colors.textPrimary};
  border: 1px solid ${props => props.theme.colors.borderPrimary};
  font-size: ${props => props.theme.typography.fontSize.md};
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

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${props => props.theme.colors.bgQuaternary};
    transition: 0.4s;
    border-radius: 24px;
    
    &:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      transition: 0.4s;
      border-radius: 50%;
    }
  }
  
  input:checked + span {
    background-color: ${props => props.theme.colors.primary};
  }
  
  input:checked + span:before {
    transform: translateX(24px);
  }
`;

const Button = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.bgTertiary};
  color: ${props => props.theme.colors.textPrimary};
  border: 1px solid ${props => props.theme.colors.borderPrimary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.bgQuaternary};
    transform: translateY(-1px);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const settingsTabs = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'output', label: 'Output', icon: Folder },
  { id: 'recording', label: 'Recording', icon: Monitor },
  { id: 'audio', label: 'Audio', icon: Volume2 },
  { id: 'hotkeys', label: 'Hotkeys', icon: Keyboard },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'language', label: 'Language', icon: Globe },
  { id: 'about', label: 'About', icon: Info }
];

function SettingsView() {
  const { settings, actions } = useApp();
  const [activeTab, setActiveTab] = React.useState('general');

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    actions.updateSettings(newSettings);
  };

  const handleOutputPathSelect = async () => {
    const path = await actions.selectOutputPath();
    if (path) {
      handleSettingChange('outputPath', path);
    }
  };

  const renderGeneralSettings = () => (
    <SettingGroup>
      <SettingLabel>Output Directory</SettingLabel>
      <SettingDescription>
        Choose where your recordings will be saved
      </SettingDescription>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Input 
          value={settings.outputPath} 
          onChange={(e) => handleSettingChange('outputPath', e.target.value)}
          placeholder="Select output directory"
        />
        <Button onClick={handleOutputPathSelect}>
          <Folder size={16} />
          Browse
        </Button>
      </div>
    </SettingGroup>
  );

  const renderRecordingSettings = () => (
    <>
      <SettingGroup>
        <SettingLabel>Default Quality</SettingLabel>
        <SettingDescription>
          Set the default quality for new recordings
        </SettingDescription>
        <Select 
          value={settings.quality} 
          onChange={(e) => handleSettingChange('quality', e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>
      </SettingGroup>

      <SettingGroup>
        <SettingLabel>Default Frame Rate</SettingLabel>
        <SettingDescription>
          Set the default frame rate for new recordings
        </SettingDescription>
        <Select 
          value={settings.frameRate} 
          onChange={(e) => handleSettingChange('frameRate', parseInt(e.target.value))}
        >
          <option value={15}>15 FPS</option>
          <option value={24}>24 FPS</option>
          <option value={30}>30 FPS</option>
          <option value={60}>60 FPS</option>
        </Select>
      </SettingGroup>

      <SettingGroup>
        <SettingLabel>Default Resolution</SettingLabel>
        <SettingDescription>
          Set the default resolution for new recordings
        </SettingDescription>
        <Select 
          value={settings.resolution} 
          onChange={(e) => handleSettingChange('resolution', e.target.value)}
        >
          <option value="720p">720p (HD)</option>
          <option value="1080p">1080p (Full HD)</option>
          <option value="1440p">1440p (2K)</option>
          <option value="4K">4K (Ultra HD)</option>
        </Select>
      </SettingGroup>
    </>
  );

  const renderAudioSettings = () => (
    <SettingGroup>
      <SettingLabel>Enable Audio Recording</SettingLabel>
      <SettingDescription>
        Record system audio and microphone by default
      </SettingDescription>
      <ToggleSwitch>
        <input 
          type="checkbox" 
          checked={settings.audioEnabled}
          onChange={(e) => handleSettingChange('audioEnabled', e.target.checked)}
        />
        <span></span>
      </ToggleSwitch>
    </SettingGroup>
  );

  const renderAppearanceSettings = () => (
    <SettingGroup>
      <SettingLabel>Theme</SettingLabel>
      <SettingDescription>
        Choose your preferred theme
      </SettingDescription>
      <Select 
        value={settings.theme} 
        onChange={(e) => handleSettingChange('theme', e.target.value)}
      >
        <option value="dark">Dark</option>
        <option value="light">Light</option>
        <option value="auto">Auto</option>
      </Select>
    </SettingGroup>
  );

  const renderLanguageSettings = () => (
    <SettingGroup>
      <SettingLabel>Language</SettingLabel>
      <SettingDescription>
        Choose your preferred language
      </SettingDescription>
      <Select 
        value={settings.language} 
        onChange={(e) => handleSettingChange('language', e.target.value)}
      >
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
        <option value="de">Deutsch</option>
        <option value="ja">日本語</option>
        <option value="zh">中文</option>
      </Select>
    </SettingGroup>
  );

  const renderAboutSettings = () => (
    <SettingGroup>
      <SettingLabel>Version</SettingLabel>
      <SettingDescription>
        Movami Screen Recorder v1.0.0
      </SettingDescription>
      <p style={{ fontSize: '14px', color: '#808080' }}>
        A professional-grade screen recording application with all premium features free.
        Built with Electron and React.
      </p>
    </SettingGroup>
  );

  const renderPanel = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'recording':
        return renderRecordingSettings();
      case 'audio':
        return renderAudioSettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'language':
        return renderLanguageSettings();
      case 'about':
        return renderAboutSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <SettingsContainer>
      <Header>
        <Title>Settings</Title>
      </Header>

      <SettingsContent>
        <SettingsSidebar>
          {settingsTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <SettingsTab
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon size={20} />
                {tab.label}
              </SettingsTab>
            );
          })}
        </SettingsSidebar>

        <SettingsPanel>
          <PanelTitle>{settingsTabs.find(tab => tab.id === activeTab)?.label}</PanelTitle>
          {renderPanel()}
        </SettingsPanel>
      </SettingsContent>
    </SettingsContainer>
  );
}

export default SettingsView;
