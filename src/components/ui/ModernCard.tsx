import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(() => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
}));

interface ModernCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const ModernCard: React.FC<ModernCardProps> = ({ children, className, hover = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { scale: 1.02 } : {}}
    >
      <StyledCard className={className}>
        <CardContent>
          {children}
        </CardContent>
      </StyledCard>
    </motion.div>
  );
};

export const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  trend?: string;
}> = ({ title, value, icon, color = '#3b82f6', trend }) => {
  return (
    <ModernCard>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mt: 1 }}>
            {value}
          </Typography>
          {trend && (
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: 0.5 }}>
              {trend}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${color}, ${color}88)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.5rem',
          }}
        >
          {icon}
        </Box>
      </Box>
    </ModernCard>
  );
};
