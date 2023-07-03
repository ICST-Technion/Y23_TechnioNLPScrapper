import React from "react";
import { useNProgress } from '@tanem/react-nprogress'
import LinearProgress from '@mui/material/LinearProgress'
import Container from '@mui/material/Container'
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export interface LoadingComponentProps {
    isAnimating: boolean;
    message?: string;
  }
  
  export const LoadingComponent: React.FC<LoadingComponentProps>
   = ({isAnimating, message}) => {

    const { animationDuration, isFinished, progress } = useNProgress({
        incrementDuration: 8000,
        isAnimating,
      })
    

    return (
        <>
        <Container className="loading-container" hidden={isFinished} disableGutters={true} style={{transition: `opacity ${animationDuration}ms linear`}}>
          <Container className="loading-bar-container">
          <LinearProgress className="loading-bar" variant="determinate" value={progress * 100} style={{transitionDuration: `${animationDuration}ms`}} />
            <Typography variant="body2" color="text.secondary">{`${Math.round(
              progress * 100,
            )}%`}</Typography>
            </Container>
        <Typography variant="h6" className="loading-message">{message}</Typography>
        </Container>
        </>
    );
   };