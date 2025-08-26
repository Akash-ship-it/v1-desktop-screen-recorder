import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Menu, 
  Sidebar, 
  Settings, 
  HelpCircle, 
  Info,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const MenubarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 32px;
  background: ${props => props.theme.colors.bgSecondary};
  border-bottom: 1px solid ${props => props.theme.colors.borderPrimary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${props => props.theme.spacing.md};
  z-index: ${props => props.theme.zIndex.fixed + 1};
  -webkit-app-region: drag;
  user-select: none;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  -webkit-app-region: no-drag;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  -webkit-app-region: no-drag;
`;

const MenubarButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${props => props.theme.borderRadius.sm};
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.bgTertiary};
    color: ${props => props.theme.colors.textPrimary};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const SidebarToggleButton = styled(MenubarButton)`
  color: ${props => props.isOpen ? props.theme.colors.primary : props.theme.colors.textSecondary};
  
  &:hover {
    color: ${props => props.isOpen ? props.theme.colors.primaryDark : props.theme.colors.textPrimary};
  }
`;

const WindowControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1px;
`;

const WindowButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 32px;
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.bgTertiary};
    color: ${props => props.theme.colors.textPrimary};
  }
  
  &.close:hover {
    background: #e81123;
    color: white;
  }
  
  svg {
    width: 12px;
    height: 12px;
  }
`;

const AppTitle = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.textSecondary};
  margin-left: ${props => props.theme.spacing.md};
`;

function Menubar() {
  const { sidebarOpen, actions } = useApp();

  const handleSidebarToggle = () => {
    try {
      actions.toggleSidebar();
    } catch (error) {
      console.log('Sidebar toggle not available:', error.message);
    }
  };

  const handleMinimize = () => {
    console.log('Minimize button clicked');
    if (window.require) {
      try {
        // Try multiple approaches to get the window
        let win = null;
        
        // Method 1: Try @electron/remote
        try {
          const { remote } = window.require('@electron/remote');
          console.log('@electron/remote available:', !!remote);
          if (remote && remote.getCurrentWindow) {
            win = remote.getCurrentWindow();
            console.log('Got window via @electron/remote:', !!win);
          }
        } catch (e) {
          console.log('@electron/remote not available:', e.message);
        }
        
        // Method 2: Try electron directly
        if (!win) {
          try {
            const electron = window.require('electron');
            console.log('electron available:', !!electron);
            if (electron && electron.remote) {
              win = electron.remote.getCurrentWindow();
              console.log('Got window via electron.remote:', !!win);
            }
          } catch (e) {
            console.log('electron.remote not available:', e.message);
          }
        }
        
        // Method 3: Try to access window through global
        if (!win && window.electronAPI) {
          win = window.electronAPI.getCurrentWindow();
          console.log('Got window via window.electronAPI:', !!win);
        }
        
        if (win && win.minimize) {
          win.minimize();
          console.log('Window minimized successfully via direct call');
        } else {
          // Fallback: Try IPC communication
          try {
            const { ipcRenderer } = window.require('electron');
            if (ipcRenderer) {
              ipcRenderer.send('window-minimize');
              console.log('Minimize request sent via IPC');
            }
          } catch (e) {
            console.log('IPC not available for minimize:', e.message);
          }
        }
      } catch (error) {
        console.log('Minimize not available:', error.message);
      }
    } else {
      console.log('window.require not available');
    }
  };

  const handleMaximize = () => {
    if (window.require) {
      try {
        // Try multiple approaches to get the window
        let win = null;
        
        // Method 1: Try @electron/remote
        try {
          const { remote } = window.require('@electron/remote');
          if (remote && remote.getCurrentWindow) {
            win = remote.getCurrentWindow();
          }
        } catch (e) {
          console.log('@electron/remote not available, trying alternative...');
        }
        
        // Method 2: Try electron directly
        if (!win) {
          try {
            const electron = window.require('electron');
            if (electron && electron.remote) {
              win = electron.remote.getCurrentWindow();
            }
          } catch (e) {
            console.log('electron.remote not available, trying alternative...');
          }
        }
        
        // Method 3: Try to access window through global
        if (!win && window.electronAPI) {
          win = window.electronAPI.getCurrentWindow();
        }
        
        if (win) {
          if (win.isMaximized && win.isMaximized()) {
            win.unmaximize();
            console.log('Window unmaximized successfully');
          } else {
            win.maximize();
            console.log('Window maximized successfully');
          }
        } else {
          // Fallback: Try IPC communication
          try {
            const { ipcRenderer } = window.require('electron');
            if (ipcRenderer) {
              ipcRenderer.send('window-maximize');
              console.log('Maximize request sent via IPC');
            }
          } catch (e) {
            console.log('IPC not available for maximize');
          }
        }
      } catch (error) {
        console.log('Maximize not available:', error.message);
      }
    }
  };

  const handleClose = () => {
    if (window.require) {
      try {
        // Try multiple approaches to get the window
        let win = null;
        
        // Method 1: Try @electron/remote
        try {
          const { remote } = window.require('@electron/remote');
          if (remote && remote.getCurrentWindow) {
            win = remote.getCurrentWindow();
          }
        } catch (e) {
          console.log('@electron/remote not available, trying alternative...');
        }
        
        // Method 2: Try electron directly
        if (!win) {
          try {
            const electron = window.require('electron');
            if (electron && electron.remote) {
              win = electron.remote.getCurrentWindow();
            }
          } catch (e) {
            console.log('electron.remote not available, trying alternative...');
          }
        }
        
        // Method 3: Try to access window through global
        if (!win && window.electronAPI) {
          win = window.electronAPI.getCurrentWindow();
        }
        
        if (win && win.close) {
          win.close();
          console.log('Window close requested successfully');
        } else {
          // Fallback: Try IPC communication
          try {
            const { ipcRenderer } = window.require('electron');
            if (ipcRenderer) {
              ipcRenderer.send('window-close');
              console.log('Close request sent via IPC');
            }
          } catch (e) {
            console.log('IPC not available for close');
          }
        }
      } catch (error) {
        console.log('Close not available:', error.message);
      }
    }
  };

  const handleSettings = () => {
    actions.setCurrentView('settings');
  };

  const handleHelp = () => {
    // Open help documentation or about dialog
    if (window.require) {
      try {
        const { shell } = window.require('electron');
        if (shell && shell.openExternal) {
          shell.openExternal('https://github.com/your-repo/movami-screen-recorder');
        }
      } catch (error) {
        console.log('Help not available:', error.message);
        // Fallback: open in default browser
        window.open('https://github.com/your-repo/movami-screen-recorder', '_blank');
      }
    } else {
      // Fallback for non-Electron environment
      window.open('https://github.com/your-repo/movami-screen-recorder', '_blank');
    }
  };

  return (
    <MenubarContainer>
      <LeftSection>
        <SidebarToggleButton
          onClick={handleSidebarToggle}
          isOpen={sidebarOpen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={`${sidebarOpen ? 'Hide' : 'Show'} Sidebar (Ctrl+B)`}
        >
          <Sidebar size={16} />
        </SidebarToggleButton>
        
        <AppTitle>Movami Screen Recorder</AppTitle>
      </LeftSection>

      <RightSection>
        <MenubarButton
          onClick={handleSettings}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Settings"
        >
          <Settings size={16} />
        </MenubarButton>
        
        <MenubarButton
          onClick={handleHelp}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Help"
        >
          <HelpCircle size={16} />
        </MenubarButton>

        {/* <WindowControls>
          <WindowButton onClick={handleMinimize} title="Minimize">
            <Minimize2 size={12} />
          </WindowButton>
          <WindowButton onClick={handleMaximize} title="Maximize">
            <Maximize2 size={12} />
          </WindowButton>
          <WindowButton className="close" onClick={handleClose} title="Close">
            <X size={12} />
          </WindowButton>
        </WindowControls> */}
      </RightSection>
    </MenubarContainer>
  );
}

export default Menubar;
