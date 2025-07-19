/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Avatar,
  Fab,
  Tooltip
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useApp } from '../hooks/useApp';
import { useTheme } from '../hooks/useTheme';

interface VisitorFormData {
  name: string;
  mobile: string;
  email: string;
  address: string;
  referralSource: string;
  type: 'visitor' | 'trial' | 'member';
  clubId: string;
  amount: number;
  paymentStatus: 'pending' | 'partial' | 'completed';
}

export const VisitorsPage: React.FC = () => {
  const { visitors, clubs, addVisitor, updateVisitor } = useApp();
  const { mode } = useTheme(); // Use the theme hook
  const [openDialog, setOpenDialog] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState<any>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState<VisitorFormData>({
    name: '',
    mobile: '',
    email: '',
    address: '',
    referralSource: '',
    type: 'visitor',
    clubId: '',
    amount: 0,
    paymentStatus: 'pending'
  });

  const filteredVisitors = visitors.filter(visitor => {
    const matchesType = filterType === 'all' || visitor.type === filterType;
    const matchesSearch = visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visitor.mobile.includes(searchTerm);
    return matchesType && matchesSearch;
  });

  const getStatusColor = (type: string) => {
    switch(type) {
      case 'member': return mode === 'dark' ? '#3B82F6' : '#2563EB'; 
      case 'trial': return mode === 'dark' ? '#F59E0B' : '#D97706';
      default: return mode === 'dark' ? '#94A3B8' : '#64748B'; 
    }
  };

  const getStatusLabel = (type: string) => {
    switch(type) {
      case 'member': return 'Member';
      case 'trial': return 'Trial';
      default: return 'Visitor';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return '#4CAF50';
      case 'partial': return '#FF9800';
      default: return '#F44336';
    }
  };

  const handleOpenDialog = (visitor?: any) => {
    if (visitor) {
      setEditingVisitor(visitor);
      setFormData({
        name: visitor.name,
        mobile: visitor.mobile,
        email: visitor.email || '',
        address: visitor.address || '',
        referralSource: visitor.referralSource || '',
        type: visitor.type,
        clubId: visitor.clubId,
        amount: visitor.payments?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0,
        paymentStatus: visitor.payments?.[0]?.status || 'pending'
      });
    } else {
      setEditingVisitor(null);
      setFormData({
        name: '',
        mobile: '',
        email: '',
        address: '',
        referralSource: '',
        type: 'visitor',
        clubId: clubs[0]?.id || '',
        amount: 0,
        paymentStatus: 'pending'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingVisitor(null);
  };

  const handleSubmit = () => {
    const now = new Date();
    const paymentType: 'trial' | 'membership' | 'other' = 
      formData.type === 'trial' ? 'trial' : 
      formData.type === 'member' ? 'membership' : 
      'other';
    
    const visitorData = {
      ...formData,
      visitDate: now,
      payments: [{
        id: editingVisitor?.payments?.[0]?.id || `payment_${Date.now()}`,
        amount: formData.amount,
        type: paymentType,
        status: formData.paymentStatus,
        date: now,
        visitorId: editingVisitor?.id || `visitor_${Date.now()}`,
        clubId: formData.clubId
      }]
    };

    if (editingVisitor) {
      updateVisitor(editingVisitor.id, visitorData);
    } else {
      addVisitor(visitorData);
    }
    handleCloseDialog();
  };


  const stats = {
    total: filteredVisitors.length,
    visitors: filteredVisitors.filter(v => v.type === 'visitor').length,
    trials: filteredVisitors.filter(v => v.type === 'trial').length,
    members: filteredVisitors.filter(v => v.type === 'member').length,
    revenue: filteredVisitors.reduce((sum, v) => 
      sum + (v.payments?.filter((p: any) => p.status === 'completed').reduce((s: number, p: any) => s + p.amount, 0) || 0), 0
    )
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: mode === 'dark' ? '#0F172A' : '#FFFFFF',
      position: 'relative'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        borderBottom: mode === 'dark' ? '1px solid #475569' : '1px solid #E2E8F0',
        background: mode === 'dark' ? '#1E293B' : '#F8FAFC',
        backdropFilter: 'blur(20px)'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ color: mode === 'dark' ? '#3B82F6' : '#2563EB', fontWeight: 'bold' }}>
            Visitor Management
          </Typography>
        </Box>

        {/* Stats */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mt: 3 }}>
          {[
            {
              title: 'Total Visitors',
              value: stats.total
            },
            {
              title: 'Members',
              value: stats.members
            },
            {
              title: 'Trials',
              value: stats.trials
            },
            {
              title: 'Revenue',
              value: `₹${stats.revenue.toLocaleString()}`
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut"
              }}
            >
              <Card sx={{
                background: mode === 'dark' ? '#1E293B' : '#F8FAFC',
                border: mode === 'dark' ? '1px solid #475569' : '1px solid #E2E8F0',
                borderRadius: '12px',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: mode === 'dark' ? '0 12px 40px rgba(0, 0, 0, 0.4)' : '0 12px 40px rgba(0, 0, 0, 0.15)',
                }
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: mode === 'dark' ? '#94A3B8' : '#64748B', mb: 0.5 }}>{stat.title}</Typography>
                  <Typography variant="h4" sx={{ color: mode === 'dark' ? '#3B82F6' : '#2563EB', fontWeight: 'bold' }}>{stat.value}</Typography>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
        {/* Filters and Search */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <TextField
            fullWidth
            placeholder="Search visitors by name or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            size="small"
            InputProps={{
              style: { 
                color: mode === 'dark' ? '#F8FAFC' : '#0F172A',
              },
              sx: {
                '& fieldset': { 
                  borderColor: mode === 'dark' ? '#475569' : '#E2E8F0',
                  borderWidth: 1
                },
                '&:hover fieldset': { 
                  borderColor: mode === 'dark' ? '#94A3B8' : '#64748B'
                },
                '&.Mui-focused fieldset': { 
                  borderColor: mode === 'dark' ? '#3B82F6' : '#2563EB',
                  borderWidth: 2
                },
                borderRadius: 2
              }
            }}
            sx={{
              mr: { xs: 0, sm: 2 },
              mb: { xs: 2, sm: 0 },
              '& .MuiInputBase-input::placeholder': {
                color: mode === 'dark' ? '#94A3B8' : '#64748B',
                opacity: 1
              },
            }}
          />
          <FormControl sx={{ minWidth: 120, mb: { xs: 2, sm: 0 } }} size="small">
            <InputLabel sx={{ color: mode === 'dark' ? '#94A3B8' : '#64748B' }}>Filter by Type</InputLabel>
            <Select
              value={filterType}
              label="Filter by Type"
              onChange={(e) => setFilterType(e.target.value as string)}
              sx={{
                color: mode === 'dark' ? '#F8FAFC' : '#0F172A',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: mode === 'dark' ? '#475569' : '#E2E8F0',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: mode === 'dark' ? '#94A3B8' : '#64748B'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: mode === 'dark' ? '#3B82F6' : '#2563EB'
                },
                '& .MuiSvgIcon-root': {
                  color: mode === 'dark' ? '#94A3B8' : '#64748B'
                },
              }}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="visitor">Visitor</MenuItem>
              <MenuItem value="trial">Trial</MenuItem>
              <MenuItem value="member">Member</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Visitors Table */}
        <TableContainer component={Card} sx={{
          background: mode === 'dark' ? '#1E293B' : '#F8FAFC',
          border: mode === 'dark' ? '1px solid #475569' : '1px solid #E2E8F0',
          borderRadius: '16px',
          boxShadow: mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
          maxHeight: 'calc(100vh - 300px)', // Adjust height as needed
        }}>
          <Table stickyHeader aria-label="visitors table">
            <TableHead>
              <TableRow sx={{
                background: mode === 'dark' ? '#334155' : '#F1F5F9',
              }}>
                <TableCell sx={{
                  color: mode === 'dark' ? '#F8FAFC' : '#0F172A',
                  fontWeight: 'bold',
                  borderBottom: 'none'
                }}>Name</TableCell>
                <TableCell sx={{
                  color: mode === 'dark' ? '#F8FAFC' : '#0F172A',
                  fontWeight: 'bold',
                  borderBottom: 'none'
                }}>Club & Location</TableCell>
                <TableCell sx={{
                  color: mode === 'dark' ? '#F8FAFC' : '#0F172A',
                  fontWeight: 'bold'
                }}>Contact</TableCell>
                <TableCell sx={{
                  color: mode === 'dark' ? '#F8FAFC' : '#0F172A',
                  fontWeight: 'bold'
                }}>Type</TableCell>
                <TableCell sx={{
                  color: mode === 'dark' ? '#F8FAFC' : '#0F172A',
                  fontWeight: 'bold'
                }}>Payment Status</TableCell>
                <TableCell sx={{
                  color: mode === 'dark' ? '#F8FAFC' : '#0F172A',
                  fontWeight: 'bold'
                }}>Date</TableCell>
                <TableCell align="right" sx={{
                  color: mode === 'dark' ? '#F8FAFC' : '#0F172A',
                  fontWeight: 'bold'
                }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVisitors.map((visitor, index) => (
                <TableRow
                  key={visitor.id}
                  component={motion.tr}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  sx={{
                    '&:nth-of-type(even)': {
                      background: mode === 'dark' ? 'rgba(0,0,0,0.1)' : 'rgba(241,245,249,0.5)' // subtle zebra striping
                    }
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: getStatusColor(visitor.type), color: '#000' }}>
                        {visitor.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography sx={{ color: mode === 'dark' ? '#F8FAFC' : '#0F172A', fontWeight: 'medium' }}>
                          {visitor.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: mode === 'dark' ? '#94A3B8' : '#64748B' }}>
                          {visitor.mobile}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ color: mode === 'dark' ? '#F8FAFC' : '#0F172A', fontWeight: 'medium' }}>{clubs.find(c => c.id === visitor.clubId)?.name || 'N/A'}</Typography>
                      <Typography variant="body2" sx={{ color: mode === 'dark' ? '#94A3B8' : '#64748B' }}>{visitor.address}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: mode === 'dark' ? '#94A3B8' : '#64748B' }}>
                        <PhoneIcon fontSize="small" />
                        <Typography variant="body2" sx={{ color: 'inherit' }}>{visitor.mobile}</Typography>
                      </Box>
                      {visitor.email && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: mode === 'dark' ? '#94A3B8' : '#64748B' }}>
                          <EmailIcon fontSize="small" />
                          <Typography variant="body2" sx={{ color: 'inherit' }}>{visitor.email}</Typography>
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(visitor.type)}
                      size="small"
                      sx={{
                        bgcolor: getStatusColor(visitor.type),
                        color: mode === 'dark' ? '#000' : '#fff',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={visitor.payments?.[0]?.status || 'N/A'}
                      size="small"
                      sx={{
                        bgcolor: getPaymentStatusColor(visitor.payments?.[0]?.status || 'pending'),
                        color: '#fff',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: mode === 'dark' ? '#F8FAFC' : '#0F172A' }}>{new Date(visitor.visitDate).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpenDialog(visitor)} sx={{ color: mode === 'dark' ? '#3B82F6' : '#2563EB' }}>
                      <EditIcon />
                    </IconButton>
                    {/* <IconButton sx={{ color: '#ef4444' }}>
                      <DeleteIcon />
                    </IconButton> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Add/Edit Visitor Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{
        sx: {
          background: mode === 'dark' ? '#1E293B' : '#F8FAFC',
          backdropFilter: 'blur(20px)',
          border: mode === 'dark' ? '1px solid #475569' : '1px solid #E2E8F0',
          borderRadius: '16px',
          boxShadow: mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
          color: mode === 'dark' ? '#F8FAFC' : '#0F172A'
        }
      }}>
        <DialogTitle sx={{ 
          color: mode === 'dark' ? '#F8FAFC' : '#0F172A',
          borderBottom: mode === 'dark' ? '1px solid #475569' : '1px solid #E2E8F0',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          {editingVisitor ? 'Edit Visitor' : 'Add New Visitor'}
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: mode === 'dark' ? '#475569' : '#E2E8F0' }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{xs:12,sm:6}}>
              <TextField
                margin="dense"
                label="Name"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                InputLabelProps={{ style: { color: mode === 'dark' ? '#94A3B8' : '#64748B' } }}
                InputProps={{ style: { color: mode === 'dark' ? '#F8FAFC' : '#0F172A' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: mode === 'dark' ? '#475569' : '#E2E8F0' },
                    '&:hover fieldset': { borderColor: mode === 'dark' ? '#94A3B8' : '#64748B' },
                    '&.Mui-focused fieldset': { borderColor: mode === 'dark' ? '#3B82F6' : '#2563EB' },
                  },
                }}
              />
            </Grid>
            <Grid size={{xs:12,sm:6}}>
              <TextField
                margin="dense"
                label="Mobile Number"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                required
                InputLabelProps={{ style: { color: mode === 'dark' ? '#94A3B8' : '#64748B' } }}
                InputProps={{ style: { color: mode === 'dark' ? '#F8FAFC' : '#0F172A' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: mode === 'dark' ? '#475569' : '#E2E8F0' },
                    '&:hover fieldset': { borderColor: mode === 'dark' ? '#94A3B8' : '#64748B' },
                    '&.Mui-focused fieldset': { borderColor: mode === 'dark' ? '#3B82F6' : '#2563EB' },
                  },
                }}
              />
            </Grid>
            <Grid size={{xs:12}}>
              <TextField
                margin="dense"
                label="Email Address (Optional)"
                type="email"
                fullWidth
                variant="outlined"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                InputLabelProps={{ style: { color: mode === 'dark' ? '#94A3B8' : '#64748B' } }}
                InputProps={{ style: { color: mode === 'dark' ? '#F8FAFC' : '#0F172A' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: mode === 'dark' ? '#475569' : '#E2E8F0' },
                    '&:hover fieldset': { borderColor: mode === 'dark' ? '#94A3B8' : '#64748B' },
                    '&.Mui-focused fieldset': { borderColor: mode === 'dark' ? '#3B82F6' : '#2563EB' },
                  },
                }}
              />
            </Grid>
            <Grid size={{xs:12}}>
              <TextField
                margin="dense"
                label="Address"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                InputLabelProps={{ style: { color: mode === 'dark' ? '#94A3B8' : '#64748B' } }}
                InputProps={{ style: { color: mode === 'dark' ? '#F8FAFC' : '#0F172A' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: mode === 'dark' ? '#475569' : '#E2E8F0' },
                    '&:hover fieldset': { borderColor: mode === 'dark' ? '#94A3B8' : '#64748B' },
                    '&.Mui-focused fieldset': { borderColor: mode === 'dark' ? '#3B82F6' : '#2563EB' },
                  },
                }}
              />
            </Grid>
            <Grid size={{xs:12,sm:6}}>
              <TextField
                margin="dense"
                label="Referral Source"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.referralSource}
                onChange={(e) => setFormData({ ...formData, referralSource: e.target.value })}
                InputLabelProps={{ style: { color: mode === 'dark' ? '#94A3B8' : '#64748B' } }}
                InputProps={{ style: { color: mode === 'dark' ? '#F8FAFC' : '#0F172A' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: mode === 'dark' ? '#475569' : '#E2E8F0' },
                    '&:hover fieldset': { borderColor: mode === 'dark' ? '#94A3B8' : '#64748B' },
                    '&.Mui-focused fieldset': { borderColor: mode === 'dark' ? '#3B82F6' : '#2563EB' },
                  },
                }}
              />
            </Grid>
            <Grid size={{xs:12,sm:6}}>
              <FormControl margin="dense" fullWidth variant="outlined">
                <InputLabel sx={{ color: mode === 'dark' ? '#94A3B8' : '#64748B' }}>Visitor Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'visitor' | 'trial' | 'member' })}
                  label="Visitor Type"
                  sx={{
                    color: mode === 'dark' ? '#F8FAFC' : '#0F172A',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: mode === 'dark' ? '#475569' : '#E2E8F0' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: mode === 'dark' ? '#94A3B8' : '#64748B' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: mode === 'dark' ? '#3B82F6' : '#2563EB' },
                    '& .MuiSvgIcon-root': { color: mode === 'dark' ? '#94A3B8' : '#64748B' },
                  }}
                >
                  <MenuItem value="visitor">Visitor</MenuItem>
                  <MenuItem value="trial">Trial</MenuItem>
                  <MenuItem value="member">Member</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{xs:12,sm:6}}>
              <FormControl margin="dense" fullWidth variant="outlined">
                <InputLabel sx={{ color: mode === 'dark' ? '#94A3B8' : '#64748B' }}>Club</InputLabel>
                <Select
                  value={formData.clubId}
                  onChange={(e) => setFormData({ ...formData, clubId: e.target.value as string })}
                  label="Club"
                  required
                  sx={{
                    color: mode === 'dark' ? '#F8FAFC' : '#0F172A',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: mode === 'dark' ? '#475569' : '#E2E8F0' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: mode === 'dark' ? '#94A3B8' : '#64748B' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: mode === 'dark' ? '#3B82F6' : '#2563EB' },
                    '& .MuiSvgIcon-root': { color: mode === 'dark' ? '#94A3B8' : '#64748B' },
                  }}
                >
                  {clubs.map(club => (
                    <MenuItem key={club.id} value={club.id}>{club.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{xs:12,sm:6}}>
              <TextField
                margin="dense"
                label="Amount (INR)"
                type="number"
                fullWidth
                variant="outlined"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                InputLabelProps={{ style: { color: mode === 'dark' ? '#94A3B8' : '#64748B' } }}
                InputProps={{ style: { color: mode === 'dark' ? '#F8FAFC' : '#0F172A' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: mode === 'dark' ? '#475569' : '#E2E8F0' },
                    '&:hover fieldset': { borderColor: mode === 'dark' ? '#94A3B8' : '#64748B' },
                    '&.Mui-focused fieldset': { borderColor: mode === 'dark' ? '#3B82F6' : '#2563EB' },
                  },
                }}
              />
            </Grid>
            <Grid size={{xs:12,sm:6}} >
              <FormControl margin="dense" fullWidth variant="outlined">
                <InputLabel sx={{ color: mode === 'dark' ? '#94A3B8' : '#64748B' }}>Payment Status</InputLabel>
                <Select
                  value={formData.paymentStatus}
                  onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as 'pending' | 'partial' | 'completed' })}
                  label="Payment Status"
                  sx={{
                    color: mode === 'dark' ? '#F8FAFC' : '#0F172A',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: mode === 'dark' ? '#475569' : '#E2E8F0' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: mode === 'dark' ? '#94A3B8' : '#64748B' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: mode === 'dark' ? '#3B82F6' : '#2563EB' },
                    '& .MuiSvgIcon-root': { color: mode === 'dark' ? '#94A3B8' : '#64748B' },
                  }}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="partial">Partial</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ background: mode === 'dark' ? '#1E293B' : '#F8FAFC', borderTop: mode === 'dark' ? '1px solid #475569' : '1px solid #E2E8F0' }}>
          <Button onClick={handleCloseDialog} sx={{ color: mode === 'dark' ? '#94A3B8' : '#64748B' }}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              background: mode === 'dark'
                ? 'linear-gradient(135deg, #3B82F6, #2563EB)'
                : 'linear-gradient(135deg, #2563EB, #1D4ED8)',
              color: 'white',
              fontWeight: 600,
              '&:hover': {
                background: mode === 'dark'
                  ? 'linear-gradient(135deg, #2563EB, #1D4ED8)'
                  : 'linear-gradient(135deg, #1D4ED8, #0C4A6E)',
              }
            }}
          >
            {editingVisitor ? 'Update Visitor' : 'Add Visitor'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Tooltip title="Add Visitor" placement="left">
        <Fab
          color="primary"
          onClick={() => handleOpenDialog()}
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
          <AddIcon />
        </Fab>
      </Tooltip>
    </Box>
  );
};
