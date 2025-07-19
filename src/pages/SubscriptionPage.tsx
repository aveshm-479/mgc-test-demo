import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Fab,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  CheckCircle as CheckIcon,
  Block as BlockIcon,
  Check as FeatureIcon
} from '@mui/icons-material';
import { useApp } from '../hooks/useApp';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import type { Subscription } from '../types';

interface SubscriptionFormData {
  name: string;
  price: number;
  duration: number;
  description: string;
  features: string[];
}

export const SubscriptionPage: React.FC = () => {
  const { user } = useAuth();
  const { mode } = useTheme();
  const { subscriptions, addSubscription, updateSubscription, toggleSubscriptionStatus } = useApp();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [formData, setFormData] = useState<SubscriptionFormData>({
    name: '',
    price: 0,
    duration: 1,
    description: '',
    features: []
  });
  const [newFeature, setNewFeature] = useState('');

  const handleOpenDialog = (subscription?: Subscription) => {
    if (subscription) {
      setEditingSubscription(subscription);
      setFormData({
        name: subscription.name,
        price: subscription.price,
        duration: subscription.duration,
        description: subscription.description,
        features: [...subscription.features]
      });
    } else {
      setEditingSubscription(null);
      setFormData({
        name: '',
        price: 0,
        duration: 1,
        description: '',
        features: []
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSubscription(null);
    setNewFeature('');
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    if (editingSubscription) {
      updateSubscription(editingSubscription.id, formData);
    } else {
      addSubscription(formData);
    }
    handleCloseDialog();
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
            Subscription Management
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
        {/* Subscriptions Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {subscriptions.map((subscription, index) => (
            <motion.div
              key={subscription.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut"
              }}
            >
              <Card 
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: mode === 'dark' ? '#1E293B' : '#F8FAFC',
                  border: mode === 'dark' ? '1px solid #475569' : '1px solid #E2E8F0',
                  borderRadius: '16px',
                  boxShadow: mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: mode === 'dark' ? '0 12px 40px rgba(0, 0, 0, 0.4)' : '0 12px 40px rgba(0, 0, 0, 0.15)',
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: mode === 'dark' ? '#3B82F6' : '#2563EB',
                        fontWeight: 'bold'
                      }}
                    >
                      {subscription.name}
                    </Typography>
                    <Chip 
                      label={subscription.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={subscription.isActive ? 'success' : 'error'}
                      sx={{ fontWeight: 'medium' }}
                    />
                  </Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      color: mode === 'dark' ? '#F8FAFC' : '#0F172A',
                      fontWeight: 'bold',
                      mb: 1
                    }}
                  >
                    ₹{subscription.price.toLocaleString()}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: mode === 'dark' ? '#94A3B8' : '#64748B',
                      mb: 2
                    }}
                  >
                    {subscription.duration} {subscription.duration === 1 ? 'month' : 'months'}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: mode === 'dark' ? '#F8FAFC' : '#0F172A',
                      mb: 2
                    }}
                  >
                    {subscription.description}
                  </Typography>
                  <List dense>
                    {subscription.features.map((feature, idx) => (
                      <ListItem key={idx} disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <FeatureIcon sx={{ color: mode === 'dark' ? '#3B82F6' : '#2563EB', fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={feature} 
                          sx={{ 
                            '& .MuiListItemText-primary': { 
                              color: mode === 'dark' ? '#F8FAFC' : '#0F172A'
                            }
                          }} 
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                {user?.role === 'super_admin' && (
                  <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                    <IconButton 
                      onClick={() => handleOpenDialog(subscription)}
                      sx={{ 
                        color: mode === 'dark' ? '#3B82F6' : '#2563EB',
                        '&:hover': {
                          background: mode === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(37, 99, 235, 0.1)',
                        }
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => toggleSubscriptionStatus(subscription.id)}
                      sx={{ 
                        color: subscription.isActive 
                          ? (mode === 'dark' ? '#EF4444' : '#DC2626')
                          : (mode === 'dark' ? '#10B981' : '#059669'),
                        '&:hover': {
                          background: subscription.isActive
                            ? 'rgba(239, 68, 68, 0.1)'
                            : 'rgba(16, 185, 129, 0.1)',
                        }
                      }}
                    >
                      {subscription.isActive ? <BlockIcon /> : <CheckIcon />}
                    </IconButton>
                  </CardActions>
                )}
              </Card>
            </motion.div>
          ))}
        </Box>
      </Box>

      {/* Floating Action Button */}
      {user?.role === 'super_admin' && (
        <Tooltip title="Add Subscription" placement="left">
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
      )}

      {/* Add/Edit Subscription Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: mode === 'dark' ? '#1E293B' : '#F8FAFC',
            backdropFilter: 'blur(20px)',
            border: mode === 'dark' ? '1px solid #475569' : '1px solid #E2E8F0',
            borderRadius: '16px',
            boxShadow: mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{ 
          color: mode === 'dark' ? '#F8FAFC' : '#0F172A',
          fontWeight: 'bold',
          borderBottom: mode === 'dark' ? '1px solid #475569' : '1px solid #E2E8F0',
          p: 3
        }}>
          {editingSubscription ? 'Edit Subscription' : 'Add New Subscription'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              InputLabelProps={{ 
                sx: { color: mode === 'dark' ? '#94A3B8' : '#64748B' }
              }}
              InputProps={{
                sx: { 
                  color: mode === 'dark' ? '#F8FAFC' : '#0F172A',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: mode === 'dark' ? '#475569' : '#E2E8F0'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: mode === 'dark' ? '#94A3B8' : '#64748B'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: mode === 'dark' ? '#3B82F6' : '#2563EB'
                  }
                }
              }}
            />
            <TextField
              label="Price (₹)"
              type="number"
              fullWidth
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              InputLabelProps={{ 
                sx: { color: mode === 'dark' ? '#94A3B8' : '#64748B' }
              }}
              InputProps={{
                sx: { 
                  color: mode === 'dark' ? '#F8FAFC' : '#0F172A',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: mode === 'dark' ? '#475569' : '#E2E8F0'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: mode === 'dark' ? '#94A3B8' : '#64748B'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: mode === 'dark' ? '#3B82F6' : '#2563EB'
                  }
                }
              }}
            />
            <TextField
              label="Duration (months)"
              type="number"
              fullWidth
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
              InputLabelProps={{ 
                sx: { color: mode === 'dark' ? '#94A3B8' : '#64748B' }
              }}
              InputProps={{
                sx: { 
                  color: mode === 'dark' ? '#F8FAFC' : '#0F172A',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: mode === 'dark' ? '#475569' : '#E2E8F0'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: mode === 'dark' ? '#94A3B8' : '#64748B'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: mode === 'dark' ? '#3B82F6' : '#2563EB'
                  }
                }
              }}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              InputLabelProps={{ 
                sx: { color: mode === 'dark' ? '#94A3B8' : '#64748B' }
              }}
              InputProps={{
                sx: { 
                  color: mode === 'dark' ? '#F8FAFC' : '#0F172A',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: mode === 'dark' ? '#475569' : '#E2E8F0'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: mode === 'dark' ? '#94A3B8' : '#64748B'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: mode === 'dark' ? '#3B82F6' : '#2563EB'
                  }
                }
              }}
            />
            <Box>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  color: mode === 'dark' ? '#F8FAFC' : '#0F172A',
                  mb: 1
                }}
              >
                Features
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  size="small"
                  placeholder="Add a feature"
                  fullWidth
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                  InputProps={{
                    sx: { 
                      color: mode === 'dark' ? '#F8FAFC' : '#0F172A',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: mode === 'dark' ? '#475569' : '#E2E8F0'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: mode === 'dark' ? '#94A3B8' : '#64748B'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: mode === 'dark' ? '#3B82F6' : '#2563EB'
                      }
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleAddFeature}
                  sx={{
                    background: mode === 'dark'
                      ? 'linear-gradient(135deg, #3B82F6, #2563EB)'
                      : 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                    color: 'white',
                    '&:hover': {
                      background: mode === 'dark'
                        ? 'linear-gradient(135deg, #2563EB, #1D4ED8)'
                        : 'linear-gradient(135deg, #1D4ED8, #0C4A6E)',
                    }
                  }}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.features.map((feature, index) => (
                  <Chip
                    key={index}
                    label={feature}
                    onDelete={() => handleRemoveFeature(index)}
                    sx={{
                      background: mode === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(37, 99, 235, 0.1)',
                      color: mode === 'dark' ? '#3B82F6' : '#2563EB',
                      borderColor: mode === 'dark' ? '#3B82F6' : '#2563EB',
                      '& .MuiChip-deleteIcon': {
                        color: mode === 'dark' ? '#3B82F6' : '#2563EB',
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          p: 3, 
          pt: 0,
          borderTop: mode === 'dark' ? '1px solid #475569' : '1px solid #E2E8F0'
        }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ color: mode === 'dark' ? '#94A3B8' : '#64748B' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
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
            {editingSubscription ? 'Update' : 'Add'} Subscription
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 