import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Edit3, Scissors, Play, Square, Download, Share2 } from 'lucide-react';

const EditorContainer = styled.div`
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

const EditorContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: ${props => props.theme.spacing.lg};
  flex: 1;
  overflow: hidden;
`;

const VideoPreview = styled.div`
  background: ${props => props.theme.colors.bgSecondary};
  border: 1px solid ${props => props.theme.colors.borderPrimary};
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.borderPrimary};
`;

const PreviewTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.textPrimary};
  margin: 0;
`;

const PreviewControls = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const ControlButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.bgTertiary};
  color: ${props => props.theme.colors.textPrimary};
  border: none;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.bgQuaternary};
    transform: scale(1.05);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const PreviewArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.lg};
`;

const Timeline = styled.div`
  height: 120px;
  background: ${props => props.theme.colors.bgTertiary};
  border-top: 1px solid ${props => props.theme.colors.borderPrimary};
  padding: ${props => props.theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textSecondary};
`;

const ToolsPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
  overflow-y: auto;
`;

const ToolSection = styled.div`
  background: ${props => props.theme.colors.bgSecondary};
  border: 1px solid ${props => props.theme.colors.borderPrimary};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
`;

const SectionTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.textPrimary};
  margin: 0 0 ${props => props.theme.spacing.md} 0;
`;

const ToolGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${props => props.theme.spacing.sm};
`;

const ToolButton = styled(motion.button)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.bgTertiary};
  color: ${props => props.theme.colors.textPrimary};
  border: 1px solid ${props => props.theme.colors.borderPrimary};
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.bgQuaternary};
    transform: translateY(-2px);
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

const ExportSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const ExportButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textInverse};
  border: none;
  font-size: ${props => props.theme.typography.fontSize.md};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
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

const editingTools = [
  { id: 'trim', label: 'Trim', icon: Scissors },
  { id: 'cut', label: 'Cut', icon: Scissors },
  { id: 'merge', label: 'Merge', icon: Edit3 },
  { id: 'speed', label: 'Speed', icon: Play },
  { id: 'volume', label: 'Volume', icon: Edit3 },
  { id: 'annotate', label: 'Annotate', icon: Edit3 },
  { id: 'effects', label: 'Effects', icon: Edit3 },
  { id: 'filters', label: 'Filters', icon: Edit3 }
];

function EditorView() {
  return (
    <EditorContainer>
      <Header>
        <Title>Video Editor</Title>
      </Header>

      <EditorContent>
        <VideoPreview>
          <PreviewHeader>
            <PreviewTitle>Video Preview</PreviewTitle>
            <PreviewControls>
              <ControlButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Play size={16} />
              </ControlButton>
              <ControlButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Square size={16} />
              </ControlButton>
            </PreviewControls>
          </PreviewHeader>
          
          <PreviewArea>
            <div style={{ textAlign: 'center' }}>
              <Edit3 size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p>Select a recording from the library to start editing</p>
            </div>
          </PreviewArea>
          
          <Timeline>
            Timeline - Drag and drop clips here
          </Timeline>
        </VideoPreview>

        <ToolsPanel>
          <ToolSection>
            <SectionTitle>Editing Tools</SectionTitle>
            <ToolGrid>
              {editingTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <ToolButton
                    key={tool.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon size={24} />
                    <span>{tool.label}</span>
                  </ToolButton>
                );
              })}
            </ToolGrid>
          </ToolSection>

          <ToolSection>
            <SectionTitle>Export</SectionTitle>
            <ExportSection>
              <ExportButton whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Download size={18} />
                Export Video
              </ExportButton>
              <ExportButton whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Share2 size={18} />
                Share
              </ExportButton>
            </ExportSection>
          </ToolSection>
        </ToolsPanel>
      </EditorContent>
    </EditorContainer>
  );
}

export default EditorView;
