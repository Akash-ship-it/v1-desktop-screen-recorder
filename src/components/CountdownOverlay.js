import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const OverlayContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.colors.overlay};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${props => props.theme.zIndex.modal};
`;

const CountdownContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.xl};
  padding: ${props => props.theme.spacing.xxxl};
  background: ${props => props.theme.colors.bgSecondary};
  border-radius: ${props => props.theme.borderRadius.xl};
  border: 1px solid ${props => props.theme.colors.borderPrimary};
  box-shadow: ${props => props.theme.shadows.xl};
  max-width: 400px;
  text-align: center;
`;

const CountdownNumber = styled(motion.div)`
  font-size: 120px;
  font-weight: ${props => props.theme.typography.fontWeight.extrabold};
  color: ${props => props.theme.colors.primary};
  line-height: 1;
  text-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
`;

const CountdownText = styled.div`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.textPrimary};
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const RecordingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.error};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.textInverse};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  
  .recording-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
    animation: pulse 1s infinite;
  }
`;

const ProgressRing = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProgressCircle = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
`;

const ProgressBackground = styled.circle`
  fill: none;
  stroke: ${props => props.theme.colors.bgTertiary};
  stroke-width: 8;
`;

const ProgressFill = styled(motion.circle)`
  fill: none;
  stroke: ${props => props.theme.colors.primary};
  stroke-width: 8;
  stroke-linecap: round;
  filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.5));
`;

const numberVariants = {
  initial: { scale: 0.5, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 1.5, opacity: 0 }
};

const containerVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
};

function CountdownOverlay({ count }) {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progress = ((3 - count) / 3) * circumference;

  return (
    <AnimatePresence>
      <OverlayContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <CountdownContent
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <ProgressRing>
            <ProgressCircle>
              <ProgressBackground cx="100" cy="100" r={radius} />
              <ProgressFill
                cx="100"
                cy="100"
                r={radius}
                strokeDasharray={circumference}
                strokeDashoffset={circumference - progress}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference - progress }}
                transition={{ duration: 1, ease: 'easeInOut' }}
              />
            </ProgressCircle>
            
            <CountdownNumber
              key={count}
              variants={numberVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {count}
            </CountdownNumber>
          </ProgressRing>
          
          <CountdownText>
            Recording starts in...
          </CountdownText>
          
          <RecordingIndicator>
            <div className="recording-dot" />
            Get ready to record
          </RecordingIndicator>
        </CountdownContent>
      </OverlayContainer>
    </AnimatePresence>
  );
}

export default CountdownOverlay;
