import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Container,
  Card,
  TextField,
  Dialog,
  DialogContent,
  Fab,
  Tooltip
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Add as AddIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useApp } from '../hooks/useApp';
import { useAuth } from '../hooks/useAuth';
import { ClubForm } from '../components/ClubForm';
import { ClubDetails } from '../components/ClubDetails';
import type { Club } from '../types';
import { useTheme } from '../hooks/useTheme';
import { ClubCard } from '../components/ClubCard';

export const ClubsPage: React.FC = () => {
  const { clubs, visitors, products, expenses, refreshData } = useApp();
  const { user } = useAuth();
  const [openForm, setOpenForm] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const { mode } = useTheme(); // Use the theme hook

  // Filter clubs based on user role
  const filteredClubs = clubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (user?.role === 'super_admin') {
      return matchesSearch;
    } else {
      // Admin can see clubs they created or are assigned to
      return matchesSearch && (club.assignedAdminId === user?.id || 
             clubs.find(c => c.id === club.id && c.assignedAdminId === user?.id));
    }
  });

  const getClubStats = (clubId: string) => {
    const clubVisitors = visitors.filter(v => v.clubId === clubId);
    const clubProducts = products.filter(p => p.clubId === clubId);
    const clubExpenses = expenses.filter(e => e.clubId === clubId);
    
    const totalRevenue = clubVisitors.reduce((sum, visitor) => {
      return sum + visitor.payments.reduce((paymentSum, payment) => paymentSum + payment.amount, 0);
    }, 0);

    const monthlyRevenue = clubVisitors.reduce((sum, visitor) => {
      const monthlyPayments = visitor.payments.filter(
        payment => payment.date.getMonth() === new Date().getMonth() && 
                   payment.date.getFullYear() === new Date().getFullYear()
      );
      return sum + monthlyPayments.reduce((paymentSum, payment) => paymentSum + payment.amount, 0);
    }, 0);

    const lowStockProducts = clubProducts.filter(p => p.stock <= p.minStock).length;

    return {
      totalVisitors: clubVisitors.length,
      totalMembers: clubVisitors.filter(v => v.type === 'member').length,
      totalRevenue,
      monthlyRevenue,
      totalProducts: clubProducts.length,
      lowStockProducts,
      totalExpenses: clubExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    };
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3, position: 'relative', minHeight: '100%' }}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ 
            color: mode === 'dark' ? '#3b82f6' : '#2563eb',
            fontWeight: 'bold' 
          }}>
            Club Management
          </Typography>
        </Box>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card sx={{
          mb: 4,
          p: 2,
          background: mode === 'dark' ? '#1E293B' /* --bg-secondary */ : '#F8FAFC' /* --bg-secondary */,
          backdropFilter: 'blur(20px)',
          border: mode === 'dark' ? '1px solid #475569' /* --border */ : '1px solid #E2E8F0' /* --border */,
          borderRadius: '16px',
          color: mode === 'dark' ? '#F8FAFC' /* --text-primary */ : '#0F172A' /* --text-primary */
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SearchIcon sx={{ color: mode === 'dark' ? '#94A3B8' /* --text-secondary */ : '#64748B' /* --text-secondary */, fontSize: 24 }} />
            <TextField
              fullWidth
              placeholder="Search clubs by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
              size="medium"
              InputProps={{
                style: { 
                  color: mode === 'dark' ? '#F8FAFC' /* --text-primary */ : '#0F172A' /* --text-primary */,
                  fontSize: '1rem'
                },
                sx: {
                  '& fieldset': { 
                    borderColor: mode === 'dark' ? '#475569' /* --border */ : '#E2E8F0' /* --border */,
                    borderWidth: 1
                  },
                  '&:hover fieldset': { 
                    borderColor: mode === 'dark' ? '#94A3B8' /* --text-secondary */ : '#64748B' /* --text-secondary */
                  },
                  '&.Mui-focused fieldset': { 
                    borderColor: mode === 'dark' ? '#3B82F6' /* --action-blue */ : '#2563EB' /* --action-blue */,
                    borderWidth: 2
                  },
                  borderRadius: 2
                }
              }}
              sx={{
                '& .MuiInputBase-input::placeholder': {
                  color: mode === 'dark' ? '#94A3B8' /* --text-secondary */ : '#64748B' /* --text-secondary */,
                  opacity: 1
                },
              }}
            />
          </Box>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{xs:12,sm:6,md:3}}>
            <Card sx={{
              p: 3,
              textAlign: 'center',
              background: mode === 'dark' ? '#1E293B' : '#F8FAFC',
              backdropFilter: 'blur(20px)',
              border: mode === 'dark' ? '1px solid #475569' : '1px solid #E2E8F0',
              borderRadius: '16px'
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: mode === 'dark' ? '#94A3B8' : '#64748B',
                  fontWeight: 'medium',
                  mb: 1
                }}
              >
                Total Clubs
              </Typography>
              <Typography 
                variant="h3" 
                sx={{ 
                  color: mode === 'dark' ? '#3B82F6' : '#2563EB',
                  fontWeight: 'bold',
                  fontSize: '2.5rem'
                }}
              >
                {filteredClubs.length}
              </Typography>
            </Card>
          </Grid>
          <Grid size={{xs:12,sm:6,md:3}}>
            <Card sx={{
              p: 3,
              textAlign: 'center',
              background: mode === 'dark' ? '#1E293B' : '#F8FAFC',
              backdropFilter: 'blur(20px)',
              border: mode === 'dark' ? '1px solid #475569' : '1px solid #E2E8F0',
              borderRadius: '16px'
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: mode === 'dark' ? '#94A3B8' : '#64748B',
                  fontWeight: 'medium',
                  mb: 1
                }}
              >
                Total Revenue
              </Typography>
              <Typography 
                variant="h3" 
                sx={{ 
                  color: mode === 'dark' ? '#3B82F6' : '#2563EB',
                  fontWeight: 'bold',
                  fontSize: '2.5rem'
                }}
              >
                ₹{filteredClubs.reduce((sum, club) => sum + getClubStats(club.id).totalRevenue, 0).toLocaleString()}
              </Typography>
            </Card>
          </Grid>
          <Grid size={{xs:12,sm:6,md:3}}>
            <Card sx={{
              p: 3,
              textAlign: 'center',
              background: mode === 'dark' ? '#1E293B' : '#F8FAFC',
              backdropFilter: 'blur(20px)',
              border: mode === 'dark' ? '1px solid #475569' : '1px solid #E2E8F0',
              borderRadius: '16px'
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: mode === 'dark' ? '#94A3B8' : '#64748B',
                  fontWeight: 'medium',
                  mb: 1
                }}
              >
                Total Members
              </Typography>
              <Typography 
                variant="h3" 
                sx={{ 
                  color: mode === 'dark' ? '#3B82F6' : '#2563EB',
                  fontWeight: 'bold',
                  fontSize: '2.5rem'
                }}
              >
                {filteredClubs.reduce((sum, club) => sum + getClubStats(club.id).totalMembers, 0)}
              </Typography>
            </Card>
          </Grid>
          <Grid size={{xs:12,sm:6,md:3}}>
            <Card sx={{
              p: 3,
              textAlign: 'center',
              background: mode === 'dark' ? '#1E293B' : '#F8FAFC',
              backdropFilter: 'blur(20px)',
              border: mode === 'dark' ? '1px solid #475569' : '1px solid #E2E8F0',
              borderRadius: '16px'
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: mode === 'dark' ? '#94A3B8' : '#64748B',
                  fontWeight: 'medium',
                  mb: 1
                }}
              >
                Low Stock Alerts
              </Typography>
              <Typography 
                variant="h3" 
                sx={{ 
                  color: mode === 'dark' ? '#3B82F6' : '#2563EB',
                  fontWeight: 'bold',
                  fontSize: '2.5rem'
                }}
              >
                {filteredClubs.reduce((sum, club) => sum + getClubStats(club.id).lowStockProducts, 0)}
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Clubs Grid */}
      <Grid container spacing={3}>
        {filteredClubs.map((club) => (
          <Grid size={{xs:12, sm:4, md:4, lg:5}}  key={club.id}>
            {/* //  <Grid item xs={12} sm={6} md={4} lg={3} key={club.id} component="div"> */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ClubCard
                club={club}
                stats={getClubStats(club.id)}
                onViewDetails={() => setSelectedClub(club)}
                onEdit={() => setEditingClub(club)}
                canEdit={user?.role === 'super_admin'}
              />
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {filteredClubs.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card sx={{ 
            p: 6, 
            textAlign: 'center',
            background: mode === 'dark' ? '#1E293B' /* --bg-secondary */ : '#F8FAFC' /* --bg-secondary */,
            backdropFilter: 'blur(20px)',
            border: mode === 'dark' ? '1px solid #475569' /* --border */ : '1px solid #E2E8F0' /* --border */,
            borderRadius: '16px',
            color: mode === 'dark' ? '#F8FAFC' /* --text-primary */ : '#0F172A' /* --text-primary */
          }}>
            <Typography 
              variant="h5" 
              sx={{ 
                color: mode === 'dark' ? '#94A3B8' /* --text-secondary */ : '#64748B' /* --text-secondary */, 
                mb: 2,
                fontWeight: 500
              }}
            >
              No clubs found
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: mode === 'dark' ? '#94A3B8' /* --text-secondary */ : '#64748B' /* --text-secondary */,
                fontSize: '1.1rem'
              }}
            >
              {searchTerm ? 'Try adjusting your search criteria' : 'Get started by adding your first club'}
            </Typography>
          </Card>
        </motion.div>
      )}

      {/* Create/Edit Club Dialog */}
      <Dialog
        open={openForm || !!editingClub}
        onClose={() => { setOpenForm(false); setEditingClub(null); }}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: mode === 'dark' ? '#1E293B' /* --bg-secondary */ : '#F8FAFC' /* --bg-secondary */,
            backdropFilter: 'blur(20px)',
            border: mode === 'dark' ? '1px solid #475569' /* --border */ : '1px solid #E2E8F0' /* --border */,
            borderRadius: '16px',
            color: mode === 'dark' ? '#F8FAFC' /* --text-primary */ : '#0F172A' /* --text-primary */
          },
        }}
      >
        <DialogContent>
          <ClubForm
            club={editingClub}
            onCancel={() => { setOpenForm(false); setEditingClub(null); }}
            onSuccess={() => { setOpenForm(false); setEditingClub(null); refreshData(); }}
          />
        </DialogContent>
      </Dialog>

      {/* Club Details Dialog */}
      <Dialog
        open={!!selectedClub}
        onClose={() => setSelectedClub(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: mode === 'dark' ? '#1E293B' /* --bg-secondary */ : '#F8FAFC' /* --bg-secondary */,
            backdropFilter: 'blur(20px)',
            border: mode === 'dark' ? '1px solid #475569' /* --border */ : '1px solid #E2E8F0' /* --border */,
            borderRadius: '16px',
            color: mode === 'dark' ? '#F8FAFC' /* --text-primary */ : '#0F172A' /* --text-primary */
          },
        }}
      >
        {selectedClub && (
          <ClubDetails
            club={selectedClub}
            stats={getClubStats(selectedClub.id)}
            onClose={() => setSelectedClub(null)}
          />
        )}
      </Dialog>

      {/* Floating Action Button */}
      {user?.role === 'super_admin' && (
        <Tooltip title="Add New Club" placement="left">
          <Fab
            color="primary"
            onClick={() => setOpenForm(true)}
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
    </Container>
  );
};