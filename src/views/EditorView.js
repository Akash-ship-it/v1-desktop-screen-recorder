import React from 'react';
import { useApp } from '../contexts/AppContext';
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
  const { selectedRecording, recentRecordings, actions } = useApp();
  const videoRef = React.useRef(null);
  const [inputPath, setInputPath] = React.useState('');
  const [startSec, setStartSec] = React.useState(0);
  const [endSec, setEndSec] = React.useState(0);
  const [mergeList, setMergeList] = React.useState([]);
  const [exporting, setExporting] = React.useState(false);
  const [exportProgress, setExportProgress] = React.useState({ percent: 0, timemark: '00:00:00' });

  const pickFile = async () => {
    try {
      const res = await window.api.invoke('pick-video-file');
      if (res && res.success) setInputPath(res.path);
    } catch {}
  };

  const doTrim = async () => {
    if (!inputPath) return alert('Set input file');
    const out = inputPath.replace(/\.(\w+)$/, '.trim.$1');
    const res = await window.api.invoke('edit-trim', { input: inputPath, output: out, startSec: Number(startSec), endSec: Number(endSec) });
    alert(res.success ? `Trimmed -> ${out}` : `Error: ${res.error}`);
  };

  const doMerge = async () => {
    if (mergeList.length < 2) return alert('Add at least two files');
    const out = mergeList[0].replace(/\.(\w+)$/, '.merged.$1');
    const res = await window.api.invoke('edit-merge', { inputs: mergeList, output: out });
    alert(res.success ? `Merged -> ${out}` : `Error: ${res.error}`);
  };

  const doExport = async (preset) => {
    if (!inputPath) return alert('Set input file');
    setExporting(true);
    const ext = preset.container || 'mp4';
    const out = inputPath.replace(/\.(\w+)$/, `.export.${ext}`);
    const res = await window.api.invoke('export-transcode', { input: inputPath, output: out, preset });
    setExporting(false);
    alert(res.success ? `Exported -> ${out}` : `Error: ${res.error}`);
  };

  const cancelExport = async () => {
    await window.api.invoke('cancel-export');
    setExporting(false);
  };

  React.useEffect(() => {
    const off = window.api.on('export-progress', (data) => {
      setExportProgress({ percent: Math.min(100, Math.max(0, Math.round(data.percent || 0))), timemark: data.timemark || '00:00:00' });
    });
    return () => { if (typeof off === 'function') off(); };
  }, []);

  React.useEffect(() => {
    if (selectedRecording && selectedRecording.path) {
      setInputPath(selectedRecording.path);
    }
  }, [selectedRecording]);

  React.useEffect(() => {
    actions.getRecentRecordings();
  }, []);

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
            <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 560 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={pickFile} style={{ padding: 8 }}>Load file</button>
                <input placeholder="or paste file path" value={inputPath} onChange={(e) => setInputPath(e.target.value)} style={{ flex: 1 }} />
              </div>
              <video ref={videoRef} src={inputPath || undefined} style={{ width: '100%', maxHeight: 260, background: '#000' }} controls />
              {recentRecordings && recentRecordings.length > 0 && (
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '4px 0' }}>
                  {recentRecordings.slice(0, 10).map((r) => (
                    <button key={r.id} onClick={() => setInputPath(r.path)} style={{ padding: '6px 10px', borderRadius: 6, background: '#1f1f1f', color: '#ddd', whiteSpace: 'nowrap' }}>
                      {r.path.split(/[/\\]/).pop()}
                    </button>
                  ))}
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#b3b3b3' }}>Trim Start (sec)</label>
                  <input type="number" value={startSec} onChange={(e) => setStartSec(e.target.value)} style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#b3b3b3' }}>Trim End (sec)</label>
                  <input type="number" value={endSec} onChange={(e) => setEndSec(e.target.value)} style={{ width: '100%' }} />
                </div>
                <button onClick={doTrim} style={{ gridColumn: 'span 2', padding: 8 }}>Trim</button>
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#b3b3b3' }}>Merge List (one path per line)</label>
                <textarea rows={4} value={mergeList.join('\n')} onChange={(e) => setMergeList(e.target.value.split('\n').filter(Boolean))} style={{ width: '100%' }} />
                <button onClick={doMerge} style={{ marginTop: 8, padding: 8 }}>Merge</button>
              </div>
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
            <SectionTitle>Export Presets</SectionTitle>
            <ExportSection>
              {exporting && (
                <div style={{ display: 'grid', gap: 8 }}>
                  <div style={{ fontSize: 12, color: '#b3b3b3' }}>Progress: {exportProgress.percent}% ({exportProgress.timemark})</div>
                  <div style={{ height: 8, background: '#333', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${exportProgress.percent}%`, height: '100%', background: '#4caf50' }} />
                  </div>
                  <button onClick={cancelExport} style={{ padding: 8 }}>Cancel Export</button>
                </div>
              )}
              <ExportButton disabled={exporting} onClick={() => doExport({ container: 'mp4', vcodec: 'libx264', acodec: 'aac', videoBitrate: '8000k', audioBitrate: '192k', fps: 30 })} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Download size={18} />
                MP4 1080p (Balanced)
              </ExportButton>
              <ExportButton disabled={exporting} onClick={() => doExport({ container: 'mp4', vcodec: 'libx264', acodec: 'aac', videoBitrate: '12000k', audioBitrate: '192k', fps: 60 })} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Download size={18} />
                MP4 1080p60 (High)
              </ExportButton>
              <ExportButton disabled={exporting} onClick={() => doExport({ container: 'mkv', vcodec: 'libx264', acodec: 'aac', videoBitrate: '16000k', audioBitrate: '256k' })} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Download size={18} />
                MKV High Quality
              </ExportButton>
              <ExportButton disabled={exporting} onClick={() => doExport({ container: 'webm', vcodec: 'libvpx-vp9', acodec: 'libopus', videoBitrate: '0', audioBitrate: '128k', fps: 30 })} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Download size={18} />
                WebM VP9 (Web)
              </ExportButton>
              <ExportButton disabled={exporting} onClick={() => doExport({ container: 'mp3', vcodec: null, acodec: 'libmp3lame', videoBitrate: null, audioBitrate: '192k' })} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Download size={18} />
                MP3 (Audio Only)
              </ExportButton>
              <ExportButton disabled={exporting} onClick={() => doExport({ container: 'wav', vcodec: null, acodec: 'pcm_s16le', videoBitrate: null, audioBitrate: null })} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Download size={18} />
                WAV (Audio Only)
              </ExportButton>
              <ExportButton disabled={exporting} onClick={() => doExport({ container: 'gif' })} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Download size={18} />
                GIF (Clip)
              </ExportButton>
              <ExportButton disabled={exporting} onClick={() => doExport({ container: 'pngseq', fps: 10 })} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Download size={18} />
                PNG Sequence (10 fps)
              </ExportButton>
              <ExportButton disabled={exporting} onClick={() => doExport({ container: 'jpgseq', fps: 10 })} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Download size={18} />
                JPG Sequence (10 fps)
              </ExportButton>
              <ExportButton disabled={exporting} onClick={() => doExport({ container: 'mp4', vcodec: 'libx265', acodec: 'aac', videoBitrate: '20000k', audioBitrate: '192k', fps: 30, scale: '3840:2160' })} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Download size={18} />
                HEVC 4K (High Quality)
              </ExportButton>
              <ExportButton disabled={exporting} onClick={() => doExport({ container: 'm4a', vcodec: null, acodec: 'aac', videoBitrate: null, audioBitrate: '192k' })} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Download size={18} />
                M4A (Audio Only)
              </ExportButton>
            </ExportSection>
          </ToolSection>
        </ToolsPanel>
      </EditorContent>
    </EditorContainer>
  );
}

export default EditorView;
