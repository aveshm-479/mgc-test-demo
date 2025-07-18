import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useApp } from '../hooks/useApp';

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
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingVisitor, setEditingVisitor] = useState<any>(null);

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
      case 'member': return '#FFD700';
      case 'trial': return '#FFCA28';
      default: return '#FFEB3B';
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

  const handleExport = () => {
    const csvContent = [
      ['Name', 'Mobile', 'Email', 'Type', 'Status', 'Amount', 'Date'],
      ...filteredVisitors.map(v => [
        v.name,
        v.mobile,
        v.email || '',
        v.type,
        v.payments?.[0]?.status || 'pending',
        v.payments?.[0]?.amount || 0,
        v.visitDate.toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'visitors.csv';
    a.click();
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
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%)'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(20px)'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
            Visitor Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                background: 'linear-gradient(135deg, #FFD700, #FFCA28)',
                color: '#000000',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #FFCA28, #FFD700)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Add Visitor
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              sx={{
                borderColor: '#FFD700',
                color: '#FFD700',
                '&:hover': {
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  borderColor: '#FFCA28'
                }
              }}
            >
              Export
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ background: 'rgba(255, 215, 0, 0.1)', border: '1px solid rgba(255, 215, 0, 0.2)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                  {stats.total}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Total Visitors
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ background: 'rgba(255, 235, 59, 0.1)', border: '1px solid rgba(255, 235, 59, 0.2)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#FFEB3B', fontWeight: 'bold' }}>
                  {stats.visitors}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Visitors
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ background: 'rgba(255, 202, 40, 0.1)', border: '1px solid rgba(255, 202, 40, 0.2)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#FFCA28', fontWeight: 'bold' }}>
                  {stats.trials}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Trials
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ background: 'rgba(255, 193, 7, 0.1)', border: '1px solid rgba(255, 193, 7, 0.2)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#FFC107', fontWeight: 'bold' }}>
                  ₹{stats.revenue.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Revenue
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Filters and Search */}
      <Box sx={{ 
        p: 3, 
        borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(10px)'
      }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              placeholder="Search by name or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#FFD700',
                  '& fieldset': {
                    borderColor: 'rgba(255, 215, 0, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#FFD700',
                  },
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#FFD700' }}>Filter by Type</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                sx={{
                  color: '#FFD700',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 215, 0, 0.3)',
                  },
                }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="visitor">Visitors</MenuItem>
                <MenuItem value="trial">Trials</MenuItem>
                <MenuItem value="member">Members</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Tabs
              value={selectedTab}
              onChange={(_, newValue) => setSelectedTab(newValue)}
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(255, 215, 0, 0.7)',
                  '&.Mui-selected': {
                    color: '#FFD700',
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#FFD700',
                },
              }}
            >
              <Tab label="All" />
              <Tab label="Today" />
              <Tab label="This Week" />
            </Tabs>
          </Grid>
        </Grid>
      </Box>

      {/* Visitors Table */}
      <Box sx={{ 
        flex: 1,
        overflow: 'auto',
        p: 3
      }}>
        <TableContainer component={Paper} sx={{ 
          background: 'rgba(26, 26, 26, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 215, 0, 0.2)',
          borderRadius: '12px'
        }}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'rgba(255, 215, 0, 0.1)' }}>
                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Visitor</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Contact</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Type</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Payment</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVisitors.map((visitor, index) => (
                <motion.tr
                  key={visitor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: getStatusColor(visitor.type), color: '#000' }}>
                        {visitor.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography sx={{ color: '#FFD700', fontWeight: 'medium' }}>
                          {visitor.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {visitor.referralSource}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography sx={{ color: '#FFD700', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon fontSize="small" /> {visitor.mobile}
                      </Typography>
                      {visitor.email && (
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailIcon fontSize="small" /> {visitor.email}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(visitor.type)}
                      sx={{
                        backgroundColor: getStatusColor(visitor.type),
                        color: '#000000',
                        fontWeight: 600
                      }}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                        ₹{visitor.payments?.reduce((sum: number, p: any) => sum + p.amount, 0).toLocaleString()}
                      </Typography>
                      <Chip
                        label={visitor.payments?.[0]?.status || 'pending'}
                        size="small"
                        sx={{
                          backgroundColor: getPaymentStatusColor(visitor.payments?.[0]?.status || 'pending'),
                          color: '#fff',
                          fontSize: '0.75rem'
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {visitor.visitDate.toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        onClick={() => handleOpenDialog(visitor)}
                        sx={{ color: '#FFD700', '&:hover': { backgroundColor: 'rgba(255, 215, 0, 0.1)' } }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(26, 26, 26, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            borderRadius: '16px'
          }
        }}
      >
        <DialogTitle sx={{ color: '#FFD700', fontWeight: 'bold' }}>
          {editingVisitor ? 'Edit Visitor' : 'Add New Visitor'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#FFD700',
                    '& fieldset': { borderColor: 'rgba(255, 215, 0, 0.3)' },
                    '&:hover fieldset': { borderColor: '#FFD700' },
                  },
                  '& .MuiInputLabel-root': { color: '#FFD700' }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Mobile Number"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#FFD700',
                    '& fieldset': { borderColor: 'rgba(255, 215, 0, 0.3)' },
                    '&:hover fieldset': { borderColor: '#FFD700' },
                  },
                  '& .MuiInputLabel-root': { color: '#FFD700' }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#FFD700',
                    '& fieldset': { borderColor: 'rgba(255, 215, 0, 0.3)' },
                    '&:hover fieldset': { borderColor: '#FFD700' },
                  },
                  '& .MuiInputLabel-root': { color: '#FFD700' }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#FFD700' }}>Visit Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  sx={{
                    color: '#FFD700',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 215, 0, 0.3)',
                    },
                  }}
                >
                  <MenuItem value="visitor">Visitor (Free)</MenuItem>
                  <MenuItem value="trial">Trial (₹700)</MenuItem>
                  <MenuItem value="member">Member (₹7500)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#FFD700' }}>Club</InputLabel>
                <Select
                  value={formData.clubId}
                  onChange={(e) => setFormData({ ...formData, clubId: e.target.value })}
                  sx={{
                    color: '#FFD700',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 215, 0, 0.3)',
                    },
                  }}
                >
                  {clubs.map(club => (
                    <MenuItem key={club.id} value={club.id}>{club.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#FFD700',
                    '& fieldset': { borderColor: 'rgba(255, 215, 0, 0.3)' },
                    '&:hover fieldset': { borderColor: '#FFD700' },
                  },
                  '& .MuiInputLabel-root': { color: '#FFD700' }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#FFD700',
                    '& fieldset': { borderColor: 'rgba(255, 215, 0, 0.3)' },
                    '&:hover fieldset': { borderColor: '#FFD700' },
                  },
                  '& .MuiInputLabel-root': { color: '#FFD700' }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#FFD700' }}>Referral Source</InputLabel>
                <Select
                  value={formData.referralSource}
                  onChange={(e) => setFormData({ ...formData, referralSource: e.target.value })}
                  sx={{
                    color: '#FFD700',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 215, 0, 0.3)',
                    },
                  }}
                >
                  <MenuItem value="friend">Friend</MenuItem>
                  <MenuItem value="family">Family</MenuItem>
                  <MenuItem value="google">Google</MenuItem>
                  <MenuItem value="facebook">Facebook</MenuItem>
                  <MenuItem value="instagram">Instagram</MenuItem>
                  <MenuItem value="walk-in">Walk-in</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: '#FFD700' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #FFD700, #FFCA28)',
              color: '#000000',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #FFCA28, #FFD700)'
              }
            }}
          >
            {editingVisitor ? 'Update' : 'Add'} Visitor
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
