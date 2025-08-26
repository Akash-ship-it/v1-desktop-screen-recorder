import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Clock, Play, Square } from 'lucide-react';

const CountdownSettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const CountdownToggle = styled.div`
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

const CountdownOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.bgTertiary};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.borderPrimary};
`;

const TimeSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const TimeLabel = styled.label`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.textPrimary};
`;

const TimeInput = styled.input`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.bgQuaternary};
  color: ${props => props.theme.colors.textPrimary};
  border: 1px solid ${props => props.theme.colors.borderPrimary};
  font-size: ${props => props.theme.typography.fontSize.md};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  text-align: center;
  transition: all ${props => props.theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
  }
  
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  &[type=number] {
    -moz-appearance: textfield;
  }
`;

const QuickTimeButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${props => props.theme.spacing.sm};
`;

const QuickTimeButton = styled(motion.button)`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.bgQuaternary};
  color: ${props => props.selected ? props.theme.colors.textInverse : props.theme.colors.textPrimary};
  border: 1px solid ${props => props.selected ? props.theme.colors.primary : props.theme.colors.borderPrimary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.selected ? props.theme.colors.primaryDark : props.theme.colors.borderSecondary};
  }
`;

const PreviewSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.bgQuaternary};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.borderPrimary};
`;

const PreviewTitle = styled.h4`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.textPrimary};
  margin: 0;
`;

const CountdownDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textInverse};
  font-size: ${props => props.theme.typography.fontSize.xxxl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  animation: ${props => props.active ? 'pulse 1s infinite' : 'none'};
`;

const PreviewButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.bgTertiary};
  color: ${props => props.theme.colors.textPrimary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.bgQuaternary};
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const quickTimeOptions = [
  { value: 3, label: '3s' },
  { value: 5, label: '5s' },
  { value: 10, label: '10s' }
];

function CountdownSettings({ countdown, onCountdownChange }) {
  const [previewCount, setPreviewCount] = React.useState(countdown);
  const [isPreviewActive, setIsPreviewActive] = React.useState(false);

  const enabled = countdown > 0;

  const handleToggle = () => {
    if (enabled) {
      onCountdownChange(0);
    } else {
      onCountdownChange(3);
    }
  };

  const handleTimeChange = (value) => {
    const numValue = parseInt(value) || 0;
    onCountdownChange(numValue);
  };

  const handleQuickTime = (seconds) => {
    onCountdownChange(seconds);
  };

  const startPreview = () => {
    if (countdown > 0) {
      setIsPreviewActive(true);
      setPreviewCount(countdown);
      
      const interval = setInterval(() => {
        setPreviewCount(prev => {
          if (prev <= 1) {
            setIsPreviewActive(false);
            clearInterval(interval);
            return countdown;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const stopPreview = () => {
    setIsPreviewActive(false);
    setPreviewCount(countdown);
  };

  return (
    <CountdownSettingsContainer>
      <CountdownToggle>
        <ToggleInfo>
          <ToggleIcon enabled={enabled}>
            <Clock size={20} />
          </ToggleIcon>
          <ToggleText>
            <ToggleLabel>Countdown Timer</ToggleLabel>
            <ToggleDescription>
              {enabled ? `${countdown} second countdown before recording starts` : 'No countdown timer'}
            </ToggleDescription>
          </ToggleText>
        </ToggleInfo>
        <ToggleSwitch
          enabled={enabled}
          onClick={handleToggle}
          whileTap={{ scale: 0.95 }}
        />
      </CountdownToggle>

      {enabled && (
        <CountdownOptions>
          <TimeSelector>
            <TimeLabel>Countdown Duration (seconds)</TimeLabel>
            <TimeInput
              type="number"
              min="1"
              max="60"
              value={countdown}
              onChange={(e) => handleTimeChange(e.target.value)}
            />
          </TimeSelector>

          <QuickTimeButtons>
            {quickTimeOptions.map(option => (
              <QuickTimeButton
                key={option.value}
                selected={countdown === option.value}
                onClick={() => handleQuickTime(option.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {option.label}
              </QuickTimeButton>
            ))}
          </QuickTimeButtons>

          <PreviewSection>
            <PreviewTitle>Preview Countdown</PreviewTitle>
            <CountdownDisplay active={isPreviewActive}>
              {previewCount}
            </CountdownDisplay>
            {!isPreviewActive ? (
              <PreviewButton onClick={startPreview}>
                <Play size={14} />
                Start Preview
              </PreviewButton>
            ) : (
              <PreviewButton onClick={stopPreview}>
                <Square size={14} />
                Stop Preview
              </PreviewButton>
            )}
          </PreviewSection>
        </CountdownOptions>
      )}
    </CountdownSettingsContainer>
  );
}

export default CountdownSettings;
