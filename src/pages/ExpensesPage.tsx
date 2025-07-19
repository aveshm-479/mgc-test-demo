import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Fab,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  AttachMoney as MoneyIcon,
  Payment as PaymentIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { useApp } from '../hooks/useApp';
import { useTheme } from '../hooks/useTheme';
import { ModernCard } from '../components/ui/ModernCard';
import { useAuth } from '../hooks/useAuth';

interface ExpenseFormData {
  name: string;
  amount: string;
  paymentType: 'cash' | 'upi';
  clubId: string;
}

export const ExpensesPage: React.FC = () => {
  const { expenses, clubs, currentClub } = useApp();
  const { mode } = useTheme();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ExpenseFormData>({
    name: '',
    amount: '',
    paymentType: 'cash',
    clubId: currentClub?.id || ''
  });

  // Get clubs based on user role
  const visibleClubs = user?.role === 'super_admin' 
    ? clubs 
    : clubs.filter(club => club.id === currentClub?.id || club.createdBy === user?.id);

  // Filter expenses based on date and visible clubs
  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const isDateMatch = expenseDate.toDateString() === selectedDate.toDateString();
    const isClubVisible = visibleClubs.some(club => club.id === expense.clubId);
    return isDateMatch && isClubVisible;
  });

  // Calculate stats
  const stats = {
    totalClubs: visibleClubs.length,
    totalExpenses: filteredExpenses.reduce((sum, e) => sum + e.amount, 0),
    cashTotal: filteredExpenses.filter(e => e.paymentType === 'cash').reduce((sum, e) => sum + e.amount, 0),
    upiTotal: filteredExpenses.filter(e => e.paymentType === 'upi').reduce((sum, e) => sum + e.amount, 0)
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleAddExpense = () => {
    // Here you would typically make an API call
    console.log('Adding expense:', formData);
    setIsAddDialogOpen(false);
    setFormData({
      name: '',
      amount: '',
      paymentType: 'cash',
      clubId: currentClub?.id || ''
    });
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
          Expense Management
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
                {stats.totalClubs}
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
              <MoneyIcon sx={{ color: mode === 'dark' ? '#3b82f6' : '#2563eb', fontSize: 32, mb: 1 }} />
              <Typography variant="h4" sx={{ 
                color: mode === 'dark' ? '#3b82f6' : '#2563eb',
                fontWeight: 'bold' 
              }}>
                {formatCurrency(stats.totalExpenses)}
              </Typography>
              <Typography variant="body2" sx={{ color: mode === 'dark' ? '#94A3B8' : '#64748B' }}>
                Total Expenses
              </Typography>
            </Box>
          </ModernCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <ModernCard>
            <Box sx={{ textAlign: 'center' }}>
              <PaymentIcon sx={{ color: mode === 'dark' ? '#3b82f6' : '#2563eb', fontSize: 32, mb: 1 }} />
              <Typography variant="h4" sx={{ 
                color: mode === 'dark' ? '#3b82f6' : '#2563eb',
                fontWeight: 'bold' 
              }}>
                {formatCurrency(stats.cashTotal)}
              </Typography>
              <Typography variant="body2" sx={{ color: mode === 'dark' ? '#94A3B8' : '#64748B' }}>
                Cash Payments
              </Typography>
            </Box>
          </ModernCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <ModernCard>
            <Box sx={{ textAlign: 'center' }}>
              <PaymentIcon sx={{ color: mode === 'dark' ? '#3b82f6' : '#2563eb', fontSize: 32, mb: 1 }} />
              <Typography variant="h4" sx={{ 
                color: mode === 'dark' ? '#3b82f6' : '#2563eb',
                fontWeight: 'bold' 
              }}>
                {formatCurrency(stats.upiTotal)}
              </Typography>
              <Typography variant="body2" sx={{ color: mode === 'dark' ? '#94A3B8' : '#64748B' }}>
                UPI Payments
              </Typography>
            </Box>
          </ModernCard>
        </Grid>
      </Grid>

      {/* Combined Expenses List with Date Selection */}
      <ModernCard>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ 
              color: mode === 'dark' ? '#3b82f6' : '#2563eb'
            }}>
              Expense Records for {selectedDate.toLocaleDateString()}
            </Typography>
            <Box sx={{ width: '200px' }}>
              <TextField
                type="date"
                size="small"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                fullWidth
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
                  Club
                </TableCell>
                <TableCell sx={{ 
                  color: mode === 'dark' ? '#3b82f6' : '#2563eb',
                  borderBottom: `1px solid ${mode === 'dark' ? '#475569' : '#E2E8F0'}`
                }}>
                  Expense Name
                </TableCell>
                <TableCell sx={{ 
                  color: mode === 'dark' ? '#3b82f6' : '#2563eb',
                  borderBottom: `1px solid ${mode === 'dark' ? '#475569' : '#E2E8F0'}`
                }}>
                  Amount
                </TableCell>
                <TableCell sx={{ 
                  color: mode === 'dark' ? '#3b82f6' : '#2563eb',
                  borderBottom: `1px solid ${mode === 'dark' ? '#475569' : '#E2E8F0'}`
                }}>
                  Payment Type
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExpenses.map((expense) => {
                const club = clubs.find(c => c.id === expense.clubId);
                return (
                  <TableRow key={expense.id}>
                    <TableCell sx={{
                      borderBottom: `1px solid ${mode === 'dark' ? '#475569' : '#E2E8F0'}`
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ 
                          bgcolor: mode === 'dark' ? '#3b82f6' : '#2563eb'
                        }}>
                          {club?.name.charAt(0)}
                        </Avatar>
                        <Typography sx={{ 
                          color: mode === 'dark' ? '#F8FAFC' : '#0F172A'
                        }}>
                          {club?.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{
                      color: mode === 'dark' ? '#F8FAFC' : '#0F172A',
                      borderBottom: `1px solid ${mode === 'dark' ? '#475569' : '#E2E8F0'}`
                    }}>
                      {expense.name}
                    </TableCell>
                    <TableCell sx={{
                      borderBottom: `1px solid ${mode === 'dark' ? '#475569' : '#E2E8F0'}`
                    }}>
                      <Typography sx={{ 
                        color: mode === 'dark' ? '#3b82f6' : '#2563eb',
                        fontWeight: 'bold'
                      }}>
                        {formatCurrency(expense.amount)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{
                      borderBottom: `1px solid ${mode === 'dark' ? '#475569' : '#E2E8F0'}`
                    }}>
                      <Chip
                        label={expense.paymentType.toUpperCase()}
                        sx={{
                          bgcolor: mode === 'dark' ? '#3b82f620' : '#2563eb20',
                          color: mode === 'dark' ? '#3b82f6' : '#2563eb',
                          fontWeight: 600,
                          borderRadius: '6px'
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </ModernCard>

      {/* Floating Action Button */}
      <Tooltip title="Add Expense" placement="left">
        <Fab
          color="primary"
          onClick={() => setIsAddDialogOpen(true)}
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

      {/* Add Expense Dialog */}
      <Dialog 
        open={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: mode === 'dark' ? '#1E293B' : '#FFFFFF',
            backgroundImage: 'none'
          }
        }}
      >
        <DialogTitle sx={{ 
          color: mode === 'dark' ? '#3b82f6' : '#2563eb',
          borderBottom: `1px solid ${mode === 'dark' ? '#475569' : '#E2E8F0'}`
        }}>
          Add New Expense
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {user?.role === 'super_admin' && (
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel sx={{ 
                    color: mode === 'dark' ? '#94A3B8' : '#64748B'
                  }}>
                    Club
                  </InputLabel>
                  <Select
                    value={formData.clubId}
                    onChange={(e) => setFormData({ ...formData, clubId: e.target.value })}
                    sx={{
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
                    }}
                  >
                    {clubs.map(club => (
                      <MenuItem key={club.id} value={club.id}>{club.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Expense Name"
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
                      borderColor: mode === 'dark' ? '#3b82f6' : '#2563eb'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: mode === 'dark' ? '#3b82f6' : '#2563eb'
                    }
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
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
                      borderColor: mode === 'dark' ? '#3b82f6' : '#2563eb'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: mode === 'dark' ? '#3b82f6' : '#2563eb'
                    }
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ 
                  color: mode === 'dark' ? '#94A3B8' : '#64748B'
                }}>
                  Payment Type
                </InputLabel>
                <Select
                  value={formData.paymentType}
                  onChange={(e) => setFormData({ ...formData, paymentType: e.target.value as 'cash' | 'upi' })}
                  sx={{
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
                  }}
                >
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="upi">UPI</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ 
          p: 2,
          borderTop: `1px solid ${mode === 'dark' ? '#475569' : '#E2E8F0'}`
        }}>
          <Button 
            onClick={() => setIsAddDialogOpen(false)}
            sx={{
              color: mode === 'dark' ? '#94A3B8' : '#64748B'
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddExpense}
            sx={{
              background: mode === 'dark'
                ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: 'white',
              fontWeight: 600,
              '&:hover': {
                background: mode === 'dark'
                  ? 'linear-gradient(135deg, #2563eb, #1d4ed8)'
                  : 'linear-gradient(135deg, #1d4ed8, #1e40af)'
              }
            }}
          >
            Add Expense
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};