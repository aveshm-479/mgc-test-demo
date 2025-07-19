import React, { useState, useEffect } from 'react';
import type { Club } from '../types';
import { TextField, Button, Grid, Typography, Box } from '@mui/material';
import { useTheme } from '../hooks/useTheme';

interface ClubFormProps {
  club: Club | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ClubForm: React.FC<ClubFormProps> = ({ club, onSuccess, onCancel }) => {
  const { mode } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    contact: '',
    email: '',
  });

  useEffect(() => {
    if (club) {
      setFormData({
        name: club.name,
        location: club.location,
        contact: club.contact,
        email: club.email,
      });
    }
  }, [club]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically make an API call
    console.log('Submitting club:', formData);
    
    // For now, we'll just simulate success
    onSuccess();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 4 }}>
      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid size={{xs:12}}>
          <Typography variant="h6" sx={{ color: mode === 'dark' ? '#3B82F6' : '#2563EB', mb: 2 }}>
            Basic Information
          </Typography>
        </Grid>

        <Grid size={{xs:12,sm:6}}>
          <TextField
            fullWidth
            label="Club Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
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
        </Grid>

        <Grid size={{xs:12,sm:6}}>
          <TextField
            fullWidth
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
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
        </Grid>

        <Grid size={{xs:12,sm:6}}>
          <TextField
            fullWidth
            label="Contact Number"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            required
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
        </Grid>

        <Grid size={{xs:12,sm:6}}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
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
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 3 }}>
        <Button 
          variant="outlined" 
          onClick={onCancel} 
          sx={{
            color: mode === 'dark' ? '#94A3B8' : '#64748B',
            borderColor: mode === 'dark' ? '#475569' : '#E2E8F0',
            '&:hover': { 
              borderColor: mode === 'dark' ? '#94A3B8' : '#64748B'
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
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
          {club ? 'Update Club' : 'Create Club'}
        </Button>
      </Box>
    </Box>
  );
};
