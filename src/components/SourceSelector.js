import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Monitor, Maximize2, Crop, Volume2, RefreshCw } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const SourceSelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const SourceTypeSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${props => props.theme.spacing.sm};
`;

const SourceTypeButton = styled(motion.button)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
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
  
  svg {
    width: 24px;
    height: 24px;
  }
  
  span {
    font-size: ${props => props.theme.typography.fontSize.sm};
    font-weight: ${props => props.theme.typography.fontWeight.medium};
    text-align: center;
  }
`;

const SourceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  max-height: 200px;
  overflow-y: auto;
`;

const SourceItem = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.bgTertiary};
  color: ${props => props.selected ? props.theme.colors.textInverse : props.theme.colors.textPrimary};
  border: 1px solid ${props => props.selected ? props.theme.colors.primary : props.theme.colors.borderPrimary};
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.selected ? props.theme.colors.primaryDark : props.theme.colors.bgQuaternary};
  }
  
  .source-thumbnail {
    width: 60px;
    height: 40px;
    border-radius: ${props => props.theme.borderRadius.sm};
    object-fit: cover;
    background: ${props => props.theme.colors.bgQuaternary};
  }
  
  .source-info {
    flex: 1;
    text-align: left;
  }
  
  .source-name {
    font-size: ${props => props.theme.typography.fontSize.sm};
    font-weight: ${props => props.theme.typography.fontWeight.medium};
    margin-bottom: ${props => props.theme.spacing.xs};
  }
  
  .source-details {
    font-size: ${props => props.theme.typography.fontSize.xs};
    color: ${props => props.selected ? props.theme.colors.textInverse : props.theme.colors.textSecondary};
  }
`;

const RefreshButton = styled.button`
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

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.textSecondary};
  
  svg {
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  
  svg {
    width: 32px;
    height: 32px;
  }
  
  p {
    font-size: ${props => props.theme.typography.fontSize.sm};
  }
`;

const sourceTypes = [
  { id: 'screen', label: 'Screen', icon: Monitor, description: 'Full screen recording' },
  { id: 'window', label: 'Window', icon: Maximize2, description: 'Specific application' },
  { id: 'area', label: 'Area', icon: Crop, description: 'Custom selection' },
  { id: 'audio', label: 'Audio', icon: Volume2, description: 'Audio only' }
];

function SourceSelector({
  screens,
  windows,
  selectedSource,
  selectedWindow,
  selectedArea,
  onSourceChange,
  onWindowChange,
  onAreaChange,
  loading
}) {
  const { actions } = useApp();

  const handleSourceTypeChange = (sourceType) => {
    onSourceChange(sourceType);
    
    // Clear previous selections when changing source type
    if (sourceType !== 'window') {
      onWindowChange(null);
    }
    if (sourceType !== 'area') {
      onAreaChange(null);
    }
  };

  const handleRefresh = () => {
    if (selectedSource === 'screen') {
      actions.refreshScreens();
    } else if (selectedSource === 'window') {
      actions.refreshWindows();
    }
  };

  const renderSourceList = () => {
    if (loading) {
      return (
        <LoadingSpinner>
          <RefreshCw size={20} />
          Loading sources...
        </LoadingSpinner>
      );
    }

    if (selectedSource === 'screen') {
      if (screens.length === 0) {
        return (
          <EmptyState>
            <Monitor size={32} />
            <p>No screens detected</p>
            <RefreshButton onClick={handleRefresh}>
              <RefreshCw size={14} />
              Refresh
            </RefreshButton>
          </EmptyState>
        );
      }

      return (
        <SourceList>
          {screens.map((screen, index) => (
            <SourceItem
              key={screen.id}
              selected={index === 0} // Primary screen is always selected
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="source-thumbnail" />
              <div className="source-info">
                <div className="source-name">
                  {screen.primary ? 'Primary Screen' : `Screen ${index + 1}`}
                </div>
                <div className="source-details">
                  {screen.bounds.width} × {screen.bounds.height}
                  {screen.primary && ' (Primary)'}
                </div>
              </div>
            </SourceItem>
          ))}
        </SourceList>
      );
    }

    if (selectedSource === 'window') {
      if (windows.length === 0) {
        return (
          <EmptyState>
            <Maximize2 size={32} />
            <p>No windows detected</p>
            <RefreshButton onClick={handleRefresh}>
              <RefreshCw size={14} />
              Refresh
            </RefreshButton>
          </EmptyState>
        );
      }

      return (
        <SourceList>
          {windows.map((window) => (
            <SourceItem
              key={window.id}
              selected={selectedWindow === window.id}
              onClick={() => onWindowChange(window.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <img 
                src={window.thumbnail} 
                alt={window.name}
                className="source-thumbnail"
              />
              <div className="source-info">
                <div className="source-name">{window.name}</div>
                <div className="source-details">Application window</div>
              </div>
            </SourceItem>
          ))}
        </SourceList>
      );
    }

    if (selectedSource === 'area') {
      return (
        <EmptyState>
          <Crop size={32} />
          <p>Click and drag to select a custom area</p>
          <p>This feature will be available in the next update</p>
        </EmptyState>
      );
    }

    if (selectedSource === 'audio') {
      return (
        <EmptyState>
          <Volume2 size={32} />
          <p>Audio-only recording mode</p>
          <p>System audio and microphone will be captured</p>
        </EmptyState>
      );
    }

    return null;
  };

  return (
    <SourceSelectorContainer>
      <SourceTypeSelector>
        {sourceTypes.map((sourceType) => {
          const Icon = sourceType.icon;
          return (
            <SourceTypeButton
              key={sourceType.id}
              selected={selectedSource === sourceType.id}
              onClick={() => handleSourceTypeChange(sourceType.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon size={24} />
              <span>{sourceType.label}</span>
            </SourceTypeButton>
          );
        })}
      </SourceTypeSelector>

      {selectedSource && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>
              Available {selectedSource === 'screen' ? 'Screens' : selectedSource === 'window' ? 'Windows' : 'Options'}
            </h4>
            {(selectedSource === 'screen' || selectedSource === 'window') && (
              <RefreshButton onClick={handleRefresh}>
                <RefreshCw size={14} />
                Refresh
              </RefreshButton>
            )}
          </div>
          {renderSourceList()}
        </>
      )}
    </SourceSelectorContainer>
  );
}

export default SourceSelector;
