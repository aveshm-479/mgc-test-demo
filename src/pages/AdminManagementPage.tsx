import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Typography,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
  MonetizationOn as MonetizationOnIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { ModernCard, StatCard } from '../components/ui/ModernCard';
import type { User, Club } from '../types';
import { sampleUsers, sampleClubs } from '../data/sampleData';
import { useTheme } from '../hooks/useTheme';

interface AdminFormData {
  name: string;
  email: string;
  role: 'admin';
  assignedClubs: string[];
}

export const AdminManagementPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [admins, setAdmins] = useState<User[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<User | null>(null);
  const [formData, setFormData] = useState<AdminFormData>({
    name: '',
    email: '',
    role: 'admin',
    assignedClubs: []
  });

  useEffect(() => {
    // Filter admins created by current super admin
    const filteredAdmins = sampleUsers.filter(u => 
      u.role === 'admin' && u.createdBy === currentUser?.id
    );
    setAdmins(filteredAdmins);
  }, [currentUser]);

  const handleCreateAdmin = () => {
    const newAdmin: User = {
      id: `admin-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      role: 'admin',
      createdAt: new Date(),
      createdBy: currentUser?.id
    };
    
    setAdmins([...admins, newAdmin]);
    setOpenDialog(false);
    resetForm();
  };

  const handleEditAdmin = (admin: User) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      role: 'admin',
      assignedClubs: admin.assignedClubs || []
    });
    setOpenDialog(true);
  };

  const handleDeleteAdmin = (adminId: string) => {
    setAdmins(admins.filter(a => a.id !== adminId));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'admin',
      assignedClubs: []
    });
    setEditingAdmin(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetForm();
  };

  const getAdminStats = (adminId: string) => {
    const adminClubs = sampleClubs.filter(club => club.assignedAdminId === adminId);
    const totalRevenue = adminClubs.reduce((sum) => {
      return sum + Math.floor(Math.random() * 50000) + 10000;
    }, 0);
    
    return {
      clubs: adminClubs.length,
      revenue: totalRevenue,
      visitors: Math.floor(Math.random() * 100) + 20
    };
  };

  const getAdminClubs = (adminId: string): Club[] => {
    return sampleClubs.filter(club => club.assignedAdminId === adminId);
  };

    const { mode } = useTheme();
  
  return (
    <Box sx={{ p: 3, position: 'relative', minHeight: '100%' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ color: '#3b82f6', fontWeight: 'bold' }}>
            Admin Management
          </Typography>
        </Box>

        {/* Stats Overview */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
          <StatCard
            title="Total Admins"
            value={admins.length}
            icon={<GroupIcon />}
            color="#3b82f6"
          />
          <StatCard
            title="Total Clubs"
            value={admins.reduce((sum, admin) => sum + getAdminStats(admin.id).clubs, 0)}
            icon={<BusinessIcon />}
            color="#8b5cf6"
          />
          <StatCard
            title="Total Revenue"
            value={`₹${admins.reduce((sum, admin) => sum + getAdminStats(admin.id).revenue, 0).toLocaleString()}`}
            icon={<MonetizationOnIcon />}
            color="#10b981"
          />
          <StatCard
            title="Total Visitors"
            value={admins.reduce((sum, admin) => sum + getAdminStats(admin.id).visitors, 0)}
            icon={<TrendingUpIcon />}
            color="#f59e0b"
          />
        </Box>

        {/* Admin Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
          {admins.map((admin, index) => {
            const stats = getAdminStats(admin.id);
            const adminClubs = getAdminClubs(admin.id);
            
            return (
              <motion.div
                key={admin.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ModernCard>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: '#3b82f6', mr: 2 }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ color: '#3b82f6', fontWeight: 'bold' }}>
                        {admin.name}
                      </Typography>
<Typography variant="body2" sx={{ color: '#888' }}>
                        {admin.email}
                      </Typography>
                    </Box>
                    <Box sx={{ ml: 'auto' }}>
                      <Tooltip title="Edit Admin">
                        <IconButton onClick={() => handleEditAdmin(admin)} sx={{ color: '#3b82f6' }}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Admin">
                        <IconButton onClick={() => handleDeleteAdmin(admin.id)} sx={{ color: '#ef4444' }}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2, borderColor: 'rgba(59, 130, 246, 0.2)' }} />

                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ color: '#3b82f6', fontWeight: 'bold' }}>
                        {stats.clubs}
                      </Typography>
                      <Typography variant="body2" sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#000000' }}>
                        Clubs
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 'bold' }}>
                        {stats.visitors}
                      </Typography>
                      <Typography variant="body2" sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#000000' }}>
                        Visitors
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ color: '#f59e0b', fontWeight: 'bold' }}>
                        ₹{(stats.revenue / 1000).toFixed(0)}k
                      </Typography>
                      <Typography variant="body2" sx={{ color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#000000' }}>
                        Revenue
                      </Typography>
                    </Box>
                  </Box>

                  {adminClubs.length > 0 && (
                    <>
                      <Divider sx={{ my: 2, borderColor: 'rgba(59, 130, 246, 0.2)' }} />
<Typography variant="h6" sx={{ color: '#888' }}>
                        Assigned Clubs
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {adminClubs.map((club) => (
                          <Chip
                            key={club.id}
                            label={club.name}
                            size="small"
                            sx={{
                              bgcolor: '#3b82f6',
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        ))}
                      </Box>
                    </>
                  )}
                </ModernCard>
              </motion.div>
            );
          })}
        </Box>

        {/* Empty State */}
        {admins.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <BusinessIcon sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
              No admins created yet
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 3 }}>
              Create your first admin to start managing clubs
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
            >
              Create Admin
            </Button>
          </Box>
        )}

        {/* Add/Edit Admin Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} PaperProps={{
          sx: {
            background: 'rgba(26, 26, 26, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '12px',
            color: 'white'
          }
        }}>
          <DialogTitle sx={{ color: '#3b82f6', fontWeight: 'bold' }}>{editingAdmin ? 'Edit Admin' : 'Create New Admin'}</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid size={{xs:12}}>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(59, 130, 246, 0.3)' },
                      '&:hover fieldset': { borderColor: '#3b82f6' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  }}
                />
              </Grid>
              <Grid size={{xs:12}}>
                <TextField
                  margin="dense"
                  label="Email"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(59, 130, 246, 0.3)' },
                      '&:hover fieldset': { borderColor: '#3b82f6' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  }}
                />
              </Grid>
              <Grid size={{xs:12}}>
                <FormControl margin="dense" fullWidth>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Assigned Clubs</InputLabel>
                  <Select
                    multiple
                    value={formData.assignedClubs}
                    onChange={(e) => setFormData({ ...formData, assignedClubs: e.target.value as string[] })}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={sampleClubs.find(club => club.id === value)?.name || value} size="small" sx={{ bgcolor: '#3b82f6', color: 'white', fontWeight: 600 }} />
                        ))}
                      </Box>
                    )}
                    sx={{
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(59, 130, 246, 0.3)' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
                      '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    }}
                  >
                    {sampleClubs.map((club) => (
                      <MenuItem key={club.id} value={club.id}>
                        {club.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ borderTop: '1px solid rgba(59, 130, 246, 0.2)', p: 2 }}>
            <Button onClick={handleCloseDialog} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Cancel</Button>
            <Button
              onClick={editingAdmin ? () => setAdmins(admins.map(a => a.id === editingAdmin.id ? { ...a, ...formData } : a)) : handleCreateAdmin}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                fontWeight: 600
              }}
            >
              {editingAdmin ? 'Save Changes' : 'Create Admin'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Floating Action Button */}
        <Tooltip title="Create New Admin" placement="left">
          <Fab
            color="primary"
            onClick={() => setOpenDialog(true)}
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.5)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                boxShadow: '0 6px 16px rgba(59, 130, 246, 0.6)'
              }
            }}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      </motion.div>
    </Box>
  );
};
