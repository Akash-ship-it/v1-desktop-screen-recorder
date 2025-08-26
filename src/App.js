import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from './contexts/AppContext';
import Sidebar from './components/Sidebar';
import Menubar from './components/Menubar';
import RecorderView from './views/RecorderView';
import EditorView from './views/EditorView';
import LibraryView from './views/LibraryView';
import SettingsView from './views/SettingsView';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorToast from './components/ErrorToast';
import CountdownOverlay from './components/CountdownOverlay';
import RecordingIndicator from './components/RecordingIndicator';
import ErrorDisplay from './components/ErrorDisplay';
import SuccessMessage from './components/SuccessMessage';
import RecordingProgress from './components/RecordingProgress';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background: ${props => props.theme.colors.bgPrimary};
  color: ${props => props.theme.colors.textPrimary};
  overflow: hidden;
`;

const MainContent = styled(motion.main)`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  margin-top: 32px; /* Account for menubar height */
`;

const ContentArea = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const viewVariants = {
  initial: {
    opacity: 0,
    x: 20
  },
  animate: {
    opacity: 1,
    x: 0
  },
  exit: {
    opacity: 0,
    x: -20
  }
};

function App() {
  const { 
    currentView, 
    sidebarOpen, 
    error, 
    successMessage,
    countdown, 
    isRecording, 
    actions 
  } = useApp();

  const renderView = () => {
    switch (currentView) {
      case 'recorder':
        return <RecorderView />;
      case 'editor':
        return <EditorView />;
      case 'library':
        return <LibraryView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <RecorderView />;
    }
  };

  return (
    <ErrorBoundary>
      <AppContainer>
        <Menubar />
        <AnimatePresence>
          {sidebarOpen && <Sidebar />}
        </AnimatePresence>
        
        <MainContent
          initial={false}
          animate={{ 
            marginLeft: sidebarOpen ? '280px' : '0px' 
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          style={{
            position: 'relative'
          }}
        >
          <ContentArea>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                variants={viewVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{ height: '100%' }}
              >
                {renderView()}
              </motion.div>
            </AnimatePresence>
          </ContentArea>
        </MainContent>

        {/* Overlays */}
        {countdown !== null && countdown > 0 && (
          <CountdownOverlay count={countdown} />
        )}
        
        {isRecording && (
          <RecordingIndicator />
        )}
        
        {/* Recording Progress */}
        <RecordingProgress />

        {/* Error Display */}
        <ErrorDisplay />
        
        {/* Success Message */}
        {successMessage && (
          <SuccessMessage 
            message={successMessage} 
            onClose={() => actions.clearSuccessMessage()} 
          />
        )}
        
        {/* Error Toast */}
        {error && (
          <ErrorToast 
            message={error} 
            onClose={() => actions.clearError()} 
          />
        )}
      </AppContainer>
    </ErrorBoundary>
  );
}

export default App;
