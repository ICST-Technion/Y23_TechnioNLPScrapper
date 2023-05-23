import React from "react";
import { useNProgress } from '@tanem/react-nprogress'
import LinearProgress from '@mui/material/LinearProgress'
import Container from '@mui/material/Container'

export interface LoadingComponentProps {
    isAnimating: boolean;
  }
  
  export const LoadingComponent: React.FC<LoadingComponentProps>
   = ({isAnimating}) => {

    const { animationDuration, isFinished, progress } = useNProgress({
        isAnimating,
      })
    

    return (
        <>
        <Container hidden={isFinished} disableGutters={true} style={{transition: `opacity ${animationDuration}ms linear`}}>
        <LinearProgress className="loading-bar" variant="determinate" value={progress * 100} style={{transitionDuration: `${animationDuration}ms`}} />
        </Container>
        </>
    );
   };