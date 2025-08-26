import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const QualitySettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const SettingGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const SettingLabel = styled.label`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const SettingDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
`;

const Select = styled.select`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.bgTertiary};
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

const QualityPresetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${props => props.theme.spacing.sm};
`;

const QualityPreset = styled(motion.button)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.bgTertiary};
  color: ${props => props.selected ? props.theme.colors.textInverse : props.theme.colors.textPrimary};
  border: 2px solid ${props => props.selected ? props.theme.colors.primary : 'transparent'};
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.selected ? props.theme.colors.primaryDark : props.theme.colors.bgQuaternary};
    transform: translateY(-1px);
  }
  
  .preset-name {
    font-size: ${props => props.theme.typography.fontSize.sm};
    font-weight: ${props => props.theme.typography.fontWeight.medium};
  }
  
  .preset-details {
    font-size: ${props => props.theme.typography.fontSize.xs};
    opacity: 0.8;
    text-align: center;
  }
`;

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const SliderLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.textPrimary};
`;

const Slider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: ${props => props.theme.colors.bgTertiary};
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary};
    cursor: pointer;
    transition: all ${props => props.theme.transitions.fast};
    
    &:hover {
      transform: scale(1.1);
    }
  }
  
  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary};
    cursor: pointer;
    border: none;
    transition: all ${props => props.theme.transitions.fast};
    
    &:hover {
      transform: scale(1.1);
    }
  }
`;

const qualityPresets = [
  {
    id: 'low',
    name: 'Low',
    description: 'Small file size',
    quality: 'low',
    frameRate: 15,
    resolution: '720p'
  },
  {
    id: 'medium',
    name: 'Medium',
    description: 'Balanced quality',
    quality: 'medium',
    frameRate: 30,
    resolution: '1080p'
  },
  {
    id: 'high',
    name: 'High',
    description: 'Best quality',
    quality: 'high',
    frameRate: 30,
    resolution: '1080p'
  },
  {
    id: 'ultra',
    name: 'Ultra',
    description: 'Maximum quality',
    quality: 'high',
    frameRate: 60,
    resolution: '1440p'
  }
];

const frameRateOptions = [
  { value: 15, label: '15 FPS' },
  { value: 24, label: '24 FPS' },
  { value: 30, label: '30 FPS' },
  { value: 60, label: '60 FPS' }
];

const resolutionOptions = [
  { value: '720p', label: '720p (HD)' },
  { value: '1080p', label: '1080p (Full HD)' },
  { value: '1440p', label: '1440p (2K)' },
  { value: '4K', label: '4K (Ultra HD)' }
];

function QualitySettings({
  quality,
  frameRate,
  resolution,
  onQualityChange,
  onFrameRateChange,
  onResolutionChange
}) {
  const handlePresetChange = (preset) => {
    onQualityChange(preset.quality);
    onFrameRateChange(preset.frameRate);
    onResolutionChange(preset.resolution);
  };

  const getCurrentPreset = () => {
    return qualityPresets.find(preset => 
      preset.quality === quality && 
      preset.frameRate === frameRate && 
      preset.resolution === resolution
    ) || qualityPresets[2]; // Default to high
  };

  const currentPreset = getCurrentPreset();

  return (
    <QualitySettingsContainer>
      <SettingGroup>
        <SettingLabel>Quality Preset</SettingLabel>
        <SettingDescription>
          Choose a preset or customize individual settings below
        </SettingDescription>
        <QualityPresetGrid>
          {qualityPresets.map((preset) => (
            <QualityPreset
              key={preset.id}
              selected={currentPreset.id === preset.id}
              onClick={() => handlePresetChange(preset)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="preset-name">{preset.name}</div>
              <div className="preset-details">{preset.description}</div>
            </QualityPreset>
          ))}
        </QualityPresetGrid>
      </SettingGroup>

      <SettingGroup>
        <SettingLabel>Frame Rate</SettingLabel>
        <SettingDescription>
          Higher frame rates provide smoother motion but increase file size
        </SettingDescription>
        <Select 
          value={frameRate} 
          onChange={(e) => onFrameRateChange(parseInt(e.target.value))}
        >
          {frameRateOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </SettingGroup>

      <SettingGroup>
        <SettingLabel>Resolution</SettingLabel>
        <SettingDescription>
          Higher resolutions provide better image quality but increase file size
        </SettingDescription>
        <Select 
          value={resolution} 
          onChange={(e) => onResolutionChange(e.target.value)}
        >
          {resolutionOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </SettingGroup>

      <SettingGroup>
        <SettingLabel>Quality Level</SettingLabel>
        <SettingDescription>
          Adjust the compression quality (affects file size vs quality)
        </SettingDescription>
        <SliderContainer>
          <SliderLabel>
            <span>File Size</span>
            <span>Quality</span>
          </SliderLabel>
          <Slider
            type="range"
            min="1"
            max="3"
            step="1"
            value={quality === 'low' ? 1 : quality === 'medium' ? 2 : 3}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              const qualityMap = { 1: 'low', 2: 'medium', 3: 'high' };
              onQualityChange(qualityMap[value]);
            }}
          />
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: '12px', 
            color: '#808080' 
          }}>
            <span>Smaller</span>
            <span>Larger</span>
          </div>
        </SliderContainer>
      </SettingGroup>
    </QualitySettingsContainer>
  );
}

export default QualitySettings;
