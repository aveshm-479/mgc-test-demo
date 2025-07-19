import React from 'react';
import type { Club } from '../types';
import { ModernCard } from './ui/ModernCard';
import { Box, Typography, Button, Grid } from '@mui/material';
import { LocationOn as LocationIcon, Phone as PhoneIcon, Email as EmailIcon } from '@mui/icons-material';
import { useTheme } from '../hooks/useTheme';

interface ClubStats {
  totalVisitors: number;
  totalMembers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalProducts: number;
  lowStockProducts: number;
  totalExpenses: number;
}

interface ClubCardProps {
  club: Club;
  stats: ClubStats;
  onViewDetails: () => void;
  onEdit: () => void;
  canEdit?: boolean;
}

export const ClubCard: React.FC<ClubCardProps> = ({
  club,
  stats,
  onViewDetails,
  onEdit,
  canEdit,
}) => {
  const { mode } = useTheme();

  return (
    <ModernCard>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ color: '#3b82f6', fontWeight: 'bold', mb: 1 }}>
              {club.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <LocationIcon sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#000000', fontSize: 16 }} />
              <Typography variant="body2" sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#000000' }}>
                {club.location}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Contact Info */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneIcon sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#000000', fontSize: 16 }} />
            <Typography variant="body2" sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#000000' }}>
              {club.contact}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#000000', fontSize: 16 }} />
            <Typography variant="body2" sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#000000' }}>
              {club.email}
            </Typography>
          </Box>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: '#3b82f6', fontWeight: 'bold' }}>
                {stats.totalVisitors}
              </Typography>
              <Typography variant="body2" sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#000000' }}>
                Total Visitors
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: '#22c55e', fontWeight: 'bold' }}>
                {stats.totalMembers}
              </Typography>
              <Typography variant="body2" sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#000000' }}>
                Members
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: '#3b82f6', fontWeight: 'bold' }}>
                ₹{(stats.monthlyRevenue / 1000).toFixed(0)}k
              </Typography>
              <Typography variant="body2" sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#000000' }}>
                This Month
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            size="small"
            onClick={onViewDetails}
            sx={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              fontWeight: 'bold',
              flex: 1,
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              },
            }}
          >
            View Details
          </Button>
          {canEdit && (
            <Button
              variant="outlined"
              size="small"
              onClick={onEdit}
              sx={{
                color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#000000',
                borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#000000',
                '&:hover': { borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : '#000000' },
              }}
            >
              Edit
            </Button>
          )}
        </Box>
      </Box>
    </ModernCard>
  );
};