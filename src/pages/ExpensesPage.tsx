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
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon
} from '@mui/icons-material';
import { useApp } from '../hooks/useApp';

// NEW: Complete expense management system
export const ExpensesPage: React.FC = () => {
  const { expenses, currentClub } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const clubExpenses = expenses.filter(e => e.clubId === currentClub?.id);
  const filteredExpenses = filterCategory === 'all' 
    ? clubExpenses 
    : clubExpenses.filter(e => e.category === filterCategory);

  const categories = ['Utilities', 'Maintenance', 'Supplies', 'Marketing', 'Staff', 'Equipment', 'Other'];
  
  const stats = {
    total: filteredExpenses.reduce((sum, e) => sum + e.amount, 0),
    monthly: filteredExpenses
      .filter(e => new Date(e.date).getMonth() === new Date().getMonth())
      .reduce((sum, e) => sum + e.amount, 0),
    count: filteredExpenses.length
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Utilities': '#FF9800',
      'Maintenance': '#2196F3',
      'Supplies': '#4CAF50',
      'Marketing': '#9C27B0',
      'Staff': '#F44336',
      'Equipment': '#FF5722',
      'Other': '#607D8B'
    };
    return colors[category] || '#9E9E9E';
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%)',
      p: 3
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
            Expense Management
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            {currentClub?.name}
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{
              background: 'rgba(255, 215, 0, 0.1)',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              borderRadius: '12px'
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                  {formatCurrency(stats.total)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Total Expenses
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{
              background: 'rgba(244, 67, 54, 0.1)',
              border: '1px solid rgba(244, 67, 54, 0.2)',
              borderRadius: '12px'
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#F44336', fontWeight: 'bold' }}>
                  {formatCurrency(stats.monthly)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  This Month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{
              background: 'rgba(76, 175, 80, 0.1)',
              border: '1px solid rgba(76, 175, 80, 0.2)',
              borderRadius: '12px'
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                  {stats.count}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Total Entries
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Controls */}
        <Card sx={{
          background: 'rgba(26, 26, 26, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 215, 0, 0.2)',
          borderRadius: '12px',
          mb: 3
        }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid size={{ xs: 12, sm: 6 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {}}
                  fullWidth
                  sx={{
                    background: 'linear-gradient(135deg, #FFD700, #FFCA28)',
                    color: '#000000',
                    fontWeight: 600
                  }}
                >
                  Add Expense
                </Button>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#FFD700' }}>Category</InputLabel>
                  <Select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    sx={{
                      color: '#FFD700',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 215, 0, 0.3)',
                      },
                    }}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    {categories.map(cat => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Expenses Table */}
        <Card sx={{
          background: 'rgba(26, 26, 26, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 215, 0, 0.2)',
          borderRadius: '12px'
        }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#FFD700', mb: 3 }}>
              Expense Records
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: 'rgba(255, 215, 0, 0.1)' }}>
                    <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Description</TableCell>
                    <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Amount</TableCell>
                    <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Category</TableCell>
                    <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredExpenses.map((expense, index) => (
                    <TableRow
                      key={expense.id}
                      component={motion.tr}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <TableCell>
                        <Typography sx={{ color: '#FFD700', fontWeight: 'medium' }}>
                          {expense.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                          {formatCurrency(expense.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={expense.category}
                          sx={{
                            backgroundColor: getCategoryColor(expense.category),
                            color: '#fff',
                            fontWeight: 600
                          }}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {new Date(expense.date).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};
