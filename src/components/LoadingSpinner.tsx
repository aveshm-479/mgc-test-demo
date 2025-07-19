import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, CircularProgress } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 40 
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%)',
        color: '#FFD700',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <CircularProgress
          size={size}
          sx={{
            color: '#FFD700',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Typography
          variant="body1"
          sx={{
            mt: 2,
            color: 'rgba(255, 215, 0, 0.8)',
            fontWeight: 500,
            letterSpacing: '0.5px',
          }}
        >
          {message}
        </Typography>
      </motion.div>
    </Box>
  );
};
