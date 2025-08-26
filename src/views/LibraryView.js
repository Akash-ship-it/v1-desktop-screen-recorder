import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Folder, Play, Trash2, Download, Share2, Calendar, Clock, FileVideo } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const LibraryContainer = styled.div`
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

const LibraryContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: ${props => props.theme.spacing.lg};
  flex: 1;
  overflow: hidden;
`;

const RecordingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  overflow-y: auto;
  padding-right: ${props => props.theme.spacing.sm};
`;

const RecordingCard = styled(motion.div)`
  background: ${props => props.theme.colors.bgSecondary};
  border: 1px solid ${props => props.theme.colors.borderPrimary};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const ThumbnailContainer = styled.div`
  position: relative;
  width: 100%;
  height: 160px;
  background: ${props => props.theme.colors.bgTertiary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textSecondary};
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlayOverlay = styled.div`
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
  transition: opacity ${props => props.theme.transitions.fast};
  
  ${RecordingCard}:hover & {
    opacity: 1;
  }
`;

const PlayButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textInverse};
  border: none;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: scale(1.1);
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const CardContent = styled.div`
  padding: ${props => props.theme.spacing.md};
`;

const CardTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.md};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.textPrimary};
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const CardActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const ActionButton = styled(motion.button)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.xs};
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
  
  &.danger:hover {
    background: ${props => props.theme.colors.error};
    color: ${props => props.theme.colors.textInverse};
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
  overflow-y: auto;
`;

const SidebarSection = styled.div`
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

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.xxxl};
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  
  svg {
    width: 64px;
    height: 64px;
    opacity: 0.5;
  }
  
  h3 {
    font-size: ${props => props.theme.typography.fontSize.xl};
    font-weight: ${props => props.theme.typography.fontWeight.medium};
    color: ${props => props.theme.colors.textPrimary};
    margin: 0;
  }
  
  p {
    font-size: ${props => props.theme.typography.fontSize.md};
    max-width: 400px;
    line-height: ${props => props.theme.typography.lineHeight.relaxed};
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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

function LibraryView() {
  const { recordings, actions } = useApp();

  const handlePlayRecording = (recording) => {
    actions.openFile(recording.path);
  };

  const handleDeleteRecording = (recordingId) => {
    if (window.confirm('Are you sure you want to delete this recording?')) {
      actions.removeRecording(recordingId);
    }
  };

  const handleDownloadRecording = (recording) => {
    // In a real app, this would trigger a download
    console.log('Downloading:', recording.path);
  };

  const handleShareRecording = (recording) => {
    // In a real app, this would open sharing options
    console.log('Sharing:', recording.path);
  };

  return (
    <LibraryContainer>
      <Header>
        <Title>Video Library</Title>
      </Header>

      <LibraryContent>
        {recordings.length === 0 ? (
          <EmptyState>
            <Folder size={64} />
            <h3>No recordings yet</h3>
            <p>
              Start recording your screen to see your videos here. 
              All your recordings will be saved and organized in this library.
            </p>
          </EmptyState>
        ) : (
          <RecordingsGrid>
            {recordings.map((recording) => (
              <RecordingCard
                key={recording.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ThumbnailContainer>
                  <FileVideo size={48} />
                  <PlayOverlay>
                    <PlayButton onClick={() => handlePlayRecording(recording)}>
                      <Play size={24} />
                    </PlayButton>
                  </PlayOverlay>
                </ThumbnailContainer>
                
                <CardContent>
                  <CardTitle>{recording.name}</CardTitle>
                  
                  <CardMeta>
                    <MetaItem>
                      <Calendar size={14} />
                      {formatDate(recording.createdAt)}
                    </MetaItem>
                    <MetaItem>
                      <Clock size={14} />
                      {formatDuration(recording.duration)}
                    </MetaItem>
                  </CardMeta>
                  
                  <CardActions>
                    <ActionButton onClick={() => handleDownloadRecording(recording)}>
                      <Download size={14} />
                      Download
                    </ActionButton>
                    <ActionButton onClick={() => handleShareRecording(recording)}>
                      <Share2 size={14} />
                      Share
                    </ActionButton>
                    <ActionButton 
                      className="danger"
                      onClick={() => handleDeleteRecording(recording.id)}
                    >
                      <Trash2 size={14} />
                      Delete
                    </ActionButton>
                  </CardActions>
                </CardContent>
              </RecordingCard>
            ))}
          </RecordingsGrid>
        )}

        <Sidebar>
          <SidebarSection>
            <SectionTitle>Library Stats</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Recordings:</span>
                <span>{recordings.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Duration:</span>
                <span>{formatDuration(recordings.reduce((acc, rec) => acc + rec.duration, 0))}</span>
              </div>
            </div>
          </SidebarSection>

          <SidebarSection>
            <SectionTitle>Quick Actions</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <ActionButton>
                <Folder size={14} />
                Open Library Folder
              </ActionButton>
              <ActionButton>
                <Download size={14} />
                Export All
              </ActionButton>
            </div>
          </SidebarSection>
        </Sidebar>
      </LibraryContent>
    </LibraryContainer>
  );
}

export default LibraryView;
