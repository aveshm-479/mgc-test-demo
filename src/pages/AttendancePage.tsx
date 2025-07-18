import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  TextField
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  CheckCircle as CheckIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useApp } from '../hooks/useApp';
import type { Attendance } from '../types';

// NEW: Attendance management system
export const AttendancePage: React.FC = () => {
  const { visitors, attendance, currentClub, refreshData } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Filter attendance for current club and date
  const clubVisitors = visitors.filter(v => v.clubId === currentClub?.id);
  const todayAttendance = attendance.filter(a => {
    const attendanceDate = new Date(a.date);
    return a.clubId === currentClub?.id && 
           attendanceDate.toDateString() === selectedDate.toDateString();
  });

  // Get attendance stats
  const stats = {
    totalMembers: clubVisitors.filter(v => v.type === 'member').length,
    present: todayAttendance.filter(a => a.status === 'present').length,
    absent: todayAttendance.filter(a => a.status === 'absent').length,
    attendanceRate: todayAttendance.length > 0 
      ? Math.round((todayAttendance.filter(a => a.status === 'present').length / todayAttendance.length) * 100)
      : 0
  };

  const getAttendanceStatus = (visitorId: string) => {
    const record = todayAttendance.find(a => a.visitorId === visitorId);
    return record?.status || 'not_marked';
  };

  const handleMarkAttendance = (visitorId: string, status: 'present' | 'absent') => {
    // NEW: Create or update attendance record
    const existingRecord = todayAttendance.find(a => a.visitorId === visitorId);
    
    if (existingRecord) {
      // Update existing record
      attendance.map(a => 
        a.id === existingRecord.id 
          ? { ...a, status, date: selectedDate }
          : a
      );
      // In real app, this would be an API call
      refreshData();
    } else {
      // Create new record
      const newAttendance: Attendance = {
        id: `att-${Date.now()}`,
        visitorId,
        clubId: currentClub?.id || '',
        date: selectedDate,
        status
      };
      // In real app, this would be an API call
      console.log('Creating attendance:', newAttendance);
      refreshData();
    }
  };

  const handleBulkAttendance = (status: 'present' | 'absent') => {
    // NEW: Mark all members at once
    const members = clubVisitors.filter(v => v.type === 'member');
    members.forEach(member => {
      if (getAttendanceStatus(member.id) === 'not_marked') {
        handleMarkAttendance(member.id, status);
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'present': return '#4CAF50';
      case 'absent': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'present': return 'Present';
      case 'absent': return 'Absent';
      default: return 'Not Marked';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%)',
        p: 3
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
              Attendance Tracking
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {currentClub?.name}
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{
                background: 'rgba(255, 215, 0, 0.1)',
                border: '1px solid rgba(255, 215, 0, 0.2)',
                borderRadius: '12px'
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                    {stats.totalMembers}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Total Members
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{
                background: 'rgba(76, 175, 80, 0.1)',
                border: '1px solid rgba(76, 175, 80, 0.2)',
                borderRadius: '12px'
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                    {stats.present}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Present Today
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{
                background: 'rgba(244, 67, 54, 0.1)',
                border: '1px solid rgba(244, 67, 54, 0.2)',
                borderRadius: '12px'
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#F44336', fontWeight: 'bold' }}>
                    {stats.absent}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Absent Today
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{
                background: 'rgba(33, 150, 243, 0.1)',
                border: '1px solid rgba(33, 150, 243, 0.2)',
                borderRadius: '12px'
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#2196F3', fontWeight: 'bold' }}>
                    {stats.attendanceRate}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Attendance Rate
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Date Selector and Bulk Actions */}
          <Card sx={{
            background: 'rgba(26, 26, 26, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 215, 0, 0.2)',
            borderRadius: '12px',
            mb: 3
          }}>
            <CardContent>
              <Grid container spacing={3} alignItems="center">
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                    Select Date
                  </Typography>
                  <TextField
                    type="date"
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#FFD700',
                        '& fieldset': { borderColor: 'rgba(255, 215, 0, 0.3)' },
                        '&:hover fieldset': { borderColor: '#FFD700' },
                      }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 8 }}>
                  <Typography variant="h6" sx={{ color: '#FFD700', mb: 2 }}>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<CheckIcon />}
                      onClick={() => handleBulkAttendance('present')}
                      sx={{
                        background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                        color: 'white',
                        fontWeight: 600
                      }}
                    >
                      Mark All Present
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<CancelIcon />}
                      onClick={() => handleBulkAttendance('absent')}
                      sx={{
                        background: 'linear-gradient(135deg, #F44336, #e53935)',
                        color: 'white',
                        fontWeight: 600
                      }}
                    >
                      Mark All Absent
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Attendance Table */}
          <Card sx={{
            background: 'rgba(26, 26, 26, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 215, 0, 0.2)',
            borderRadius: '12px'
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#FFD700', mb: 3 }}>
                Member Attendance for {selectedDate.toLocaleDateString()}
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: 'rgba(255, 215, 0, 0.1)' }}>
                      <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Member</TableCell>
                      <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Contact</TableCell>
                      <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {clubVisitors
                      .filter(v => v.type === 'member')
                      .map((visitor, index) => {
                        const status = getAttendanceStatus(visitor.id);
                        return (
                          <motion.tr
                            key={visitor.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: '#FFD700', color: '#000' }}>
                                  {visitor.name.charAt(0)}
                                </Avatar>
                                <Box>
                                  <Typography sx={{ color: '#FFD700', fontWeight: 'medium' }}>
                                    {visitor.name}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Member ID: {visitor.id.slice(-4)}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                {visitor.mobile}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={getStatusLabel(status)}
                                sx={{
                                  backgroundColor: getStatusColor(status),
                                  color: status === 'not_marked' ? '#000' : '#fff',
                                  fontWeight: 600
                                }}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton
                                  onClick={() => handleMarkAttendance(visitor.id, 'present')}
                                  sx={{
                                    color: '#4CAF50',
                                    '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.1)' }
                                  }}
                                >
                                  <CheckIcon />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleMarkAttendance(visitor.id, 'absent')}
                                  sx={{
                                    color: '#F44336',
                                    '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' }
                                  }}
                                >
                                  <CancelIcon />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </motion.tr>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </LocalizationProvider>
  );
};
