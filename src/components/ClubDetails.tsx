import React from 'react';
import type { Club } from '../types';
import { Box, Typography, Button } from '@mui/material';
import {
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { ModernCard } from './ui/ModernCard';
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

interface ClubDetailsProps {
  club: Club;
  stats: ClubStats;
  onClose: () => void;
}

export const ClubDetails: React.FC<ClubDetailsProps> = ({ club, stats, onClose }) => {
  const profit = stats.totalRevenue - stats.totalExpenses;
  const profitMargin = stats.totalRevenue > 0 ? ((profit / stats.totalRevenue) * 100).toFixed(1) : '0';
  const { mode } = useTheme();

  return (
    <Box sx={{ maxHeight: '90vh', overflow: 'auto' }}>
      {/* Header */}
      <Box sx={{
        p: 3,
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1))',
        borderBottom: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        backdropFilter: 'blur(10px)'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <Box>
            <Typography variant="h4" sx={{ color: '#3b82f6', fontWeight: 'bold', mb: 1 }}>
              {club.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <LocationIcon sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#000000', fontSize: 20 }} />
              <Typography variant="body1" sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : '#000000' }}>
                {club.location}
              </Typography>
            </Box>
          </Box>
          <Button
            onClick={onClose}
            sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#000000', minWidth: 'auto' }}
          >
            <CloseIcon />
          </Button>
        </Box>
      </Box>

      <Box sx={{ p: 3 }}>
        {/* Contact Information */}
        <Box sx={{ mb: 4 }}>
          <ModernCard>
            <Typography variant="h6" sx={{ color: '#3b82f6', mb: 2 }}>
              Contact Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon sx={{ color: '#3b82f6' }} />
                <Typography sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : '#000000' }}>
                  {club.contact}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ color: '#3b82f6' }} />
                <Typography sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : '#000000' }}>
                  {club.email}
                </Typography>
              </Box>
            </Box>
          </ModernCard>
        </Box>

        {/* Key Metrics */}
        <Typography variant="h6" sx={{ color: '#3b82f6', mb: 2 }}>
          Performance Overview
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 3, mb: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <ModernCard>
              <PeopleIcon sx={{ color: '#3b82f6', fontSize: 32, mb: 1 }} />
              <Typography variant="h4" sx={{ color: '#3b82f6', fontWeight: 'bold' }}>
                {stats.totalVisitors}
              </Typography>
              <Typography variant="body2" sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#000000' }}>
                Total Visitors
              </Typography>
            </ModernCard>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <ModernCard>
              <PeopleIcon sx={{ color: '#22c55e', fontSize: 32, mb: 1 }} />
              <Typography variant="h4" sx={{ color: '#22c55e', fontWeight: 'bold' }}>
                {stats.totalMembers}
              </Typography>
              <Typography variant="body2" sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#000000' }}>
                Active Members
              </Typography>
            </ModernCard>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <ModernCard>
              <MoneyIcon sx={{ color: '#3b82f6', fontSize: 32, mb: 1 }} />
              <Typography variant="h4" sx={{ color: '#3b82f6', fontWeight: 'bold' }}>
                ₹{(stats.totalRevenue / 1000).toFixed(0)}k
              </Typography>
              <Typography variant="body2" sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#000000' }}>
                Total Revenue
              </Typography>
            </ModernCard>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <ModernCard>
              <TrendingIcon sx={{ color: '#8b5cf6', fontSize: 32, mb: 1 }} />
              <Typography variant="h4" sx={{ color: '#8b5cf6', fontWeight: 'bold' }}>
                ₹{(stats.monthlyRevenue / 1000).toFixed(0)}k
              </Typography>
              <Typography variant="body2" sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#000000' }}>
                This Month
              </Typography>
            </ModernCard>
          </Box>
        </Box>

        {/* Financial Summary */}
        <Box sx={{ mb: 4 }}>
          <ModernCard>
            <Typography variant="h6" sx={{ color: '#3b82f6', mb: 2 }}>
              Financial Summary
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 3 }}>
              <Box>
                <Typography variant="body2" sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#000000' }}>
                  Total Revenue
                </Typography>
                <Typography variant="h5" sx={{ color: '#22c55e', fontWeight: 'bold' }}>
                  ₹{stats.totalRevenue.toLocaleString()}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#000000' }}>
                  Total Expenses
                </Typography>
                <Typography variant="h5" sx={{ color: '#ef4444', fontWeight: 'bold' }}>
                  ₹{stats.totalExpenses.toLocaleString()}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#000000' }}>
                  Net Profit
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: profit >= 0 ? '#22c55e' : '#ef4444',
                    fontWeight: 'bold'
                  }}
                >
                  ₹{profit.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#000000' }}>
                  {profitMargin}% margin
                </Typography>
              </Box>
            </Box>
          </ModernCard>
        </Box>

        {/* Inventory Status */}
        <Box>
          <ModernCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <InventoryIcon sx={{ color: '#3b82f6', fontSize: 24 }} />
              <Box>
                <Typography variant="h6" sx={{ color: '#3b82f6' }}>
                  Inventory Status
                </Typography>
                <Typography variant="body2" sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#000000' }}>
                  {stats.totalProducts} total products
                </Typography>
              </Box>
            </Box>
          </ModernCard>
        </Box>
      </Box>
    </Box>
  );
};
