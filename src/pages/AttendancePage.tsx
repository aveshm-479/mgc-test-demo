import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  TextField,
  Fab,
  Tooltip
} from '@mui/material';
import {
  Groups as GroupsIcon,
  HowToReg as PresentIcon,
  PersonOff as AbsentIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { useApp } from '../hooks/useApp';
import { useTheme } from '../hooks/useTheme';
import { ModernCard } from '../components/ui/ModernCard';
import { useAuth } from '../hooks/useAuth';

export const AttendancePage: React.FC = () => {
  const { visitors, attendance, currentClub, clubs } = useApp();
  const { mode } = useTheme();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Get clubs based on user role
  const visibleClubs = user?.role === 'super_admin' 
    ? clubs 
    : clubs.filter(club => club.id === currentClub?.id || club.createdBy === user?.id);

  // Get attendance stats for each club
  const clubStats = visibleClubs.map(club => {
    const clubMembers = visitors.filter(v => v.clubId === club.id && v.type === 'member');
    const clubAttendance = attendance.filter(a => {
    const attendanceDate = new Date(a.date);
      return a.clubId === club.id && attendanceDate.toDateString() === selectedDate.toDateString();
    });

    return {
      club,
      totalMembers: clubMembers.length,
      present: clubAttendance.filter(a => a.status === 'present').length,
      absent: clubAttendance.filter(a => a.status === 'absent').length,
      attendanceRate: clubMembers.length > 0 
        ? Math.round((clubAttendance.filter(a => a.status === 'present').length / clubMembers.length) * 100)
        : 0
    };
  });

  // Calculate total stats
  const totalStats = {
    totalMembers: clubStats.reduce((sum, stat) => sum + stat.totalMembers, 0),
    present: clubStats.reduce((sum, stat) => sum + stat.present, 0),
    absent: clubStats.reduce((sum, stat) => sum + stat.absent, 0),
    attendanceRate: clubStats.length > 0
      ? Math.round(clubStats.reduce((sum, stat) => sum + stat.attendanceRate, 0) / clubStats.length)
      : 0
  };

  return (
    <Box sx={{ p: 3, position: 'relative', minHeight: '100%' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
        <Typography variant="h4" sx={{ 
          color: mode === 'dark' ? '#3b82f6' : '#2563eb',
          fontWeight: 'bold',
          mb: 4 
        }}>
          Attendance Overview
        </Typography>
      </motion.div>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <ModernCard>
            <Box sx={{ textAlign: 'center' }}>
              <BusinessIcon sx={{ color: mode === 'dark' ? '#3b82f6' : '#2563eb', fontSize: 32, mb: 1 }} />
              <Typography variant="h4" sx={{ 
                color: mode === 'dark' ? '#3b82f6' : '#2563eb',
                fontWeight: 'bold' 
              }}>
                {visibleClubs.length}
            </Typography>
              <Typography variant="body2" sx={{ color: mode === 'dark' ? '#94A3B8' : '#64748B' }}>
                Total Clubs
            </Typography>
          </Box>
          </ModernCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <ModernCard>
            <Box sx={{ textAlign: 'center' }}>
              <GroupsIcon sx={{ color: mode === 'dark' ? '#3b82f6' : '#2563eb', fontSize: 32, mb: 1 }} />
              <Typography variant="h4" sx={{ 
                color: mode === 'dark' ? '#3b82f6' : '#2563eb',
                fontWeight: 'bold' 
              }}>
                {totalStats.totalMembers}
                  </Typography>
              <Typography variant="body2" sx={{ color: mode === 'dark' ? '#94A3B8' : '#64748B' }}>
                    Total Members
                  </Typography>
            </Box>
          </ModernCard>
            </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <ModernCard>
            <Box sx={{ textAlign: 'center' }}>
              <PresentIcon sx={{ color: mode === 'dark' ? '#3b82f6' : '#2563eb', fontSize: 32, mb: 1 }} />
              <Typography variant="h4" sx={{ 
                color: mode === 'dark' ? '#3b82f6' : '#2563eb',
                fontWeight: 'bold' 
              }}>
                {totalStats.present}
                  </Typography>
              <Typography variant="body2" sx={{ color: mode === 'dark' ? '#94A3B8' : '#64748B' }}>
                    Present Today
                  </Typography>
            </Box>
          </ModernCard>
            </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <ModernCard>
            <Box sx={{ textAlign: 'center' }}>
              <AbsentIcon sx={{ color: mode === 'dark' ? '#3b82f6' : '#2563eb', fontSize: 32, mb: 1 }} />
              <Typography variant="h4" sx={{ 
                color: mode === 'dark' ? '#3b82f6' : '#2563eb',
                fontWeight: 'bold' 
              }}>
                {totalStats.absent}
                  </Typography>
              <Typography variant="body2" sx={{ color: mode === 'dark' ? '#94A3B8' : '#64748B' }}>
                    Absent Today
                  </Typography>
            </Box>
          </ModernCard>
            </Grid>
          </Grid>

      {/* Combined Club List with Date Selection */}
      <ModernCard>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ 
              color: mode === 'dark' ? '#3b82f6' : '#2563eb'
            }}>
              Club Attendance for {selectedDate.toLocaleDateString()}
                  </Typography>
            <Box sx={{ width: '200px' }}>
                  <TextField
                    type="date"
                fullWidth
                size="small"
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                InputProps={{
                  sx: { 
                    color: mode === 'dark' ? '#F8FAFC' : '#0F172A',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: mode === 'dark' ? '#475569' : '#E2E8F0'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: mode === 'dark' ? '#3b82f6' : '#2563eb'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: mode === 'dark' ? '#3b82f6' : '#2563eb'
                    }
                      }
                    }}
                  />
            </Box>
          </Box>
                  </Box>

              <TableContainer>
                <Table>
                  <TableHead>
              <TableRow>
                <TableCell sx={{ 
                  color: mode === 'dark' ? '#3b82f6' : '#2563eb',
                  borderBottom: `1px solid ${mode === 'dark' ? '#475569' : '#E2E8F0'}`
                }}>
                  Club Name
                </TableCell>
                <TableCell sx={{ 
                  color: mode === 'dark' ? '#3b82f6' : '#2563eb',
                  borderBottom: `1px solid ${mode === 'dark' ? '#475569' : '#E2E8F0'}`
                }}>
                  Total Members
                </TableCell>
                <TableCell sx={{ 
                  color: mode === 'dark' ? '#3b82f6' : '#2563eb',
                  borderBottom: `1px solid ${mode === 'dark' ? '#475569' : '#E2E8F0'}`
                }}>
                  Present
                </TableCell>
                <TableCell sx={{ 
                  color: mode === 'dark' ? '#3b82f6' : '#2563eb',
                  borderBottom: `1px solid ${mode === 'dark' ? '#475569' : '#E2E8F0'}`
                }}>
                  Absent
                </TableCell>
                <TableCell sx={{ 
                  color: mode === 'dark' ? '#3b82f6' : '#2563eb',
                  borderBottom: `1px solid ${mode === 'dark' ? '#475569' : '#E2E8F0'}`
                }}>
                  Attendance Rate
                </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
              {clubStats.map((stat) => (
                <TableRow key={stat.club.id}>
                  <TableCell sx={{
                    borderBottom: `1px solid ${mode === 'dark' ? '#475569' : '#E2E8F0'}`
                  }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ 
                        bgcolor: mode === 'dark' ? '#3b82f6' : '#2563eb'
                      }}>
                        {stat.club.name.charAt(0)}
                                </Avatar>
                      <Typography sx={{ 
                        color: mode === 'dark' ? '#F8FAFC' : '#0F172A'
                      }}>
                        {stat.club.name}
                                  </Typography>
                              </Box>
                            </TableCell>
                  <TableCell sx={{
                    color: mode === 'dark' ? '#F8FAFC' : '#0F172A',
                    borderBottom: `1px solid ${mode === 'dark' ? '#475569' : '#E2E8F0'}`
                  }}>
                    {stat.totalMembers}
                            </TableCell>
                  <TableCell sx={{
                    borderBottom: `1px solid ${mode === 'dark' ? '#475569' : '#E2E8F0'}`
                  }}>
                              <Chip
                      label={stat.present}
                                sx={{
                        bgcolor: mode === 'dark' ? '#3b82f620' : '#2563eb20',
                        color: mode === 'dark' ? '#3b82f6' : '#2563eb',
                        fontWeight: 600,
                        borderRadius: '6px'
                      }}
                              />
                            </TableCell>
                  <TableCell sx={{
                    borderBottom: `1px solid ${mode === 'dark' ? '#475569' : '#E2E8F0'}`
                  }}>
                    <Chip
                      label={stat.absent}
                                  sx={{
                        bgcolor: mode === 'dark' ? '#3b82f620' : '#2563eb20',
                        color: mode === 'dark' ? '#3b82f6' : '#2563eb',
                        fontWeight: 600,
                        borderRadius: '6px'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{
                    borderBottom: `1px solid ${mode === 'dark' ? '#475569' : '#E2E8F0'}`
                  }}>
                    <Typography sx={{ 
                      color: mode === 'dark' ? '#3b82f6' : '#2563eb',
                      fontWeight: 'bold'
                    }}>
                      {stat.attendanceRate}%
                    </Typography>
                            </TableCell>
                </TableRow>
              ))}
                  </TableBody>
                </Table>
              </TableContainer>
      </ModernCard>

      {/* Floating Action Button */}
      <Tooltip title="Mark Attendance" placement="left">
        <Fab
          color="primary"
          onClick={() => {/* Add your attendance marking logic here */}}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            background: mode === 'dark'
              ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
              : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: 'white',
            boxShadow: mode === 'dark'
              ? '0 4px 12px rgba(59, 130, 246, 0.5)'
              : '0 4px 12px rgba(37, 99, 235, 0.5)',
            '&:hover': {
              background: mode === 'dark'
                ? 'linear-gradient(135deg, #2563eb, #1d4ed8)'
                : 'linear-gradient(135deg, #1d4ed8, #1e40af)',
              boxShadow: mode === 'dark'
                ? '0 6px 16px rgba(59, 130, 246, 0.6)'
                : '0 6px 16px rgba(37, 99, 235, 0.6)'
            }
          }}
        >
          <PresentIcon />
        </Fab>
      </Tooltip>
      </Box>
  );
};