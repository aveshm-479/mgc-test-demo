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
  Divider
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
      assignedClubs: []
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

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
            Admin Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              }
            }}
          >
            Create New Admin
          </Button>
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
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {admin.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
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

                  <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ color: '#3b82f6', fontWeight: 'bold' }}>
                        {stats.clubs}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Clubs
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 'bold' }}>
                        {stats.visitors}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Visitors
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ color: '#f59e0b', fontWeight: 'bold' }}>
                        ₹{(stats.revenue / 1000).toFixed(0)}k
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Revenue
                      </Typography>
                    </Box>
                  </Box>

                  {adminClubs.length > 0 && (
                    <>
                      <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                      <Typography variant="h6" sx={{ color: 'white', mb: 1, fontSize: '0.875rem' }}>
                        Assigned Clubs
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {adminClubs.map((club) => (
                          <Chip
                            key={club.id}
                            label={club.name}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(59, 130, 246, 0.2)',
                              color: '#3b82f6',
                              border: '1px solid rgba(59, 130, 246, 0.3)'
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
      </motion.div>

      {/* Create/Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
          }
        }}
      >
        <DialogTitle sx={{ color: 'white', fontWeight: 'bold' }}>
          {editingAdmin ? 'Edit Admin' : 'Create New Admin'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              }}
            />
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
              Default password: password123
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateAdmin}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              fontWeight: 600,
            }}
          >
            {editingAdmin ? 'Update' : 'Create'} Admin
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
