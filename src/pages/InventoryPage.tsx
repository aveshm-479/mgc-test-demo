import React, { useState } from 'react';
import { Add as AddIcon, HistoryEdu as HistoryIcon } from '@mui/icons-material';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  CardActions,
  Paper,
  Divider,
  Stack,
  Fab,
  Tooltip
} from '@mui/material';
import { useApp } from '../hooks/useApp';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import type { Product, StockUsage } from '../types';
import { motion } from 'framer-motion';

const InventoryPage: React.FC = () => {
  const { user } = useAuth();
  const { mode } = useTheme();
  const { products, clubs, addProduct, logConsumption, stockUsage } = useApp();

  const [openAddProductDialog, setOpenAddProductDialog] = useState(false);
  const [openLogConsumptionDialog, setOpenLogConsumptionDialog] = useState(false);
  const [openProductConsumptionDetailDialog, setOpenProductConsumptionDetailDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProductConsumptionDetails, setSelectedProductConsumptionDetails] = useState<{ clubName: string; quantity: number; }[]>([]);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
  });
  const [consumptionLog, setConsumptionLog] = useState<Partial<StockUsage>>({
    productId: '',
    quantity: 0,
    clubId: '',
  });
  const [consumptionDetailDate, setConsumptionDetailDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const handleOpenAddProductDialog = () => {
    setNewProduct({
      name: '',
    });
    setOpenAddProductDialog(true);
  };

  const handleCloseAddProductDialog = () => {
    setOpenAddProductDialog(false);
  };

  const handleAddProductSubmit = () => {
    if (newProduct.name) {
      addProduct(newProduct);
      handleCloseAddProductDialog();
    } else {
      alert('Please fill all required fields for product.');
    }
  };

  const handleOpenLogConsumptionDialog = (product: Product) => {
    setSelectedProduct(product);
    setConsumptionLog({
      productId: product.id,
      clubId: user?.role === 'admin' && clubs.length > 0 ? clubs[0].id : '', // Club Admin logs for their club
      quantity: 1,
    });
    setOpenLogConsumptionDialog(true);
  };

  const handleCloseLogConsumptionDialog = () => {
    setOpenLogConsumptionDialog(false);
    setSelectedProduct(null);
  };

  const handleLogConsumptionSubmit = () => {
    if (consumptionLog.productId && consumptionLog.clubId && consumptionLog.quantity && user?.id) {
      logConsumption({ ...consumptionLog, consumedBy: user.id, date: new Date() });
      handleCloseLogConsumptionDialog();
    } else {
      alert('Please fill all required fields for consumption log.');
    }
  };

  const handleOpenProductConsumptionDetailDialog = (product: Product) => {
    setSelectedProduct(product);
    setConsumptionDetailDate(new Date().toISOString().split('T')[0]); // Reset date to today
    setOpenProductConsumptionDetailDialog(true);
    // Data will be loaded in a useEffect or directly in the dialog content based on consumptionDetailDate
  };

  const handleCloseProductConsumptionDetailDialog = () => {
    setOpenProductConsumptionDetailDialog(false);
    setSelectedProduct(null);
    setSelectedProductConsumptionDetails([]);
  };

  // Effect to update consumption details when date or selected product changes
  React.useEffect(() => {
    if (openProductConsumptionDetailDialog && selectedProduct) {
      const targetDate = new Date(consumptionDetailDate).toDateString();
      const consumedByProductOnDate = stockUsage.filter(
        log => log.productId === selectedProduct.id && log.date.toDateString() === targetDate
      );

      const groupedByClub = consumedByProductOnDate.reduce((acc, log) => {
        const club = clubs.find(c => c.id === log.clubId);
        const clubName = club ? club.name : 'Unknown Club';
        if (acc[clubName]) {
          acc[clubName] += log.quantity;
        } else {
          acc[clubName] = log.quantity;
        }
        return acc;
      }, {} as { [key: string]: number });

      const details = Object.entries(groupedByClub).map(([clubName, quantity]) => ({
        clubName,
        quantity,
      }));
      setSelectedProductConsumptionDetails(details);
    }
  }, [consumptionDetailDate, selectedProduct, stockUsage, openProductConsumptionDetailDialog, clubs]);

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
            Inventory Management
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
        {/* Products Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut"
              }}
            >
              <Card 
                onClick={() => handleOpenProductConsumptionDetailDialog(product)}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
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
                  <Typography 
                    variant="h6" 
                    component="div"
                    sx={{ 
                      color: mode === 'dark' ? '#3B82F6' : '#2563EB',
                      fontWeight: 'bold',
                      mb: 1
                    }}
                  >
                    {product.name}
                  </Typography>
                </CardContent>
                    {user?.role === 'admin' && (
                  <CardActions sx={{ justifyContent: 'flex-end', p: 1 }}>
                    <IconButton 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleOpenLogConsumptionDialog(product); 
                      }} 
                      sx={{ 
                        color: mode === 'dark' ? '#3B82F6' : '#2563EB',
                        '&:hover': {
                          background: mode === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(37, 99, 235, 0.1)',
                        }
                      }}
                    >
                        <HistoryIcon />
                      </IconButton>
                  </CardActions>
                    )}
              </Card>
            </motion.div>
              ))}
        </Box>
      </Box>

      {/* Add Product Dialog (Super Admin Only) */}
      <Dialog open={openAddProductDialog} onClose={handleCloseAddProductDialog} maxWidth="sm" fullWidth PaperProps={{
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
          Add New Product
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: mode === 'dark' ? '#475569' : '#E2E8F0' }}>
          <TextField
            margin="dense"
            label="Product Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            required
            InputLabelProps={{ style: { color: mode === 'dark' ? '#94A3B8' : '#64748B' } }}
            InputProps={{ style: { color: mode === 'dark' ? '#F8FAFC' : '#0F172A' } }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: mode === 'dark' ? '#475569' : '#E2E8F0' },
                '&:hover fieldset': { borderColor: mode === 'dark' ? '#94A3B8' : '#64748B' },
                '&.Mui-focused fieldset': { borderColor: mode === 'dark' ? '#3B82F6' : '#2563EB' },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ background: mode === 'dark' ? '#1E293B' : '#F8FAFC', borderTop: mode === 'dark' ? '1px solid #475569' : '1px solid #E2E8F0' }}>
          <Button onClick={handleCloseAddProductDialog} sx={{ color: mode === 'dark' ? '#94A3B8' : '#64748B' }}>Cancel</Button>
          <Button
            onClick={handleAddProductSubmit}
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
            Add Product
          </Button>
        </DialogActions>
      </Dialog>

      {/* Log Consumption Dialog (Club Admin Only) */}
      <Dialog open={openLogConsumptionDialog} onClose={handleCloseLogConsumptionDialog} maxWidth="xs" fullWidth PaperProps={{
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
          Log Consumption - {selectedProduct?.name}
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: mode === 'dark' ? '#475569' : '#E2E8F0' }}>
          <Typography variant="body1" sx={{ color: mode === 'dark' ? '#F8FAFC' : '#0F172A', mb: 2 }}>
            Club: {clubs.find(c => c.id === consumptionLog.clubId)?.name || 'N/A'}
          </Typography>
          <TextField
            margin="dense"
            label="Quantity Consumed"
            type="number"
            fullWidth
            variant="outlined"
            value={consumptionLog.quantity}
            onChange={(e) => setConsumptionLog({ ...consumptionLog, quantity: parseInt(e.target.value) || 0 })}
            required
            InputLabelProps={{ style: { color: mode === 'dark' ? '#94A3B8' : '#64748B' } }}
            InputProps={{ style: { color: mode === 'dark' ? '#F8FAFC' : '#0F172A' } }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: mode === 'dark' ? '#475569' : '#E2E8F0' },
                '&:hover fieldset': { borderColor: mode === 'dark' ? '#94A3B8' : '#64748B' },
                '&.Mui-focused fieldset': { borderColor: mode === 'dark' ? '#3B82F6' : '#2563EB' },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ background: mode === 'dark' ? '#1E293B' : '#F8FAFC', borderTop: mode === 'dark' ? '1px solid #475569' : '1px solid #E2E8F0' }}>
          <Button onClick={handleCloseLogConsumptionDialog} sx={{ color: mode === 'dark' ? '#94A3B8' : '#64748B' }}>Cancel</Button>
          <Button
            onClick={handleLogConsumptionSubmit}
            variant="contained"
            sx={{
              background: mode === 'dark'
                ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                : 'linear-gradient(135deg, #D97706, #B45309)',
              color: 'white',
              fontWeight: 600,
              '&:hover': {
                background: mode === 'dark'
                  ? 'linear-gradient(135deg, #D97706, #B45309)'
                  : 'linear-gradient(135deg, #B45309, #9A3412)',
              }
            }}
          >
            Log Consumption
          </Button>
        </DialogActions>
      </Dialog>

      {/* Product Consumption Detail Dialog */}
      <Dialog 
        open={openProductConsumptionDetailDialog} 
        onClose={handleCloseProductConsumptionDetailDialog} 
        maxWidth="md" 
        fullWidth 
        PaperProps={{
        sx: {
          background: mode === 'dark' ? '#1E293B' : '#F8FAFC',
          backdropFilter: 'blur(20px)',
          border: mode === 'dark' ? '1px solid #475569' : '1px solid #E2E8F0',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          color: mode === 'dark' ? '#F8FAFC' : '#0F172A'
        }
        }}
      >
        <DialogTitle sx={{ 
          color: mode === 'dark' ? '#F8FAFC' : '#0F172A',
          borderBottom: mode === 'dark' ? '1px solid #475569' : '1px solid #E2E8F0',
          p: 3,
        }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
              {selectedProduct?.name} - Consumption Details
            </Typography>
          <TextField
            type="date"
            value={consumptionDetailDate}
            onChange={(e) => setConsumptionDetailDate(e.target.value)}
              InputProps={{ 
                sx: { 
                  color: mode === 'dark' ? '#F8FAFC' : '#0F172A',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: mode === 'dark' ? '#475569' : '#E2E8F0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: mode === 'dark' ? '#94A3B8' : '#64748B',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: mode === 'dark' ? '#3B82F6' : '#2563EB',
                  },
                }
              }}
              sx={{ width: 200 }}
            />
          </Stack>
        </DialogTitle>
        <DialogContent 
          dividers 
          sx={{ 
            borderColor: mode === 'dark' ? '#475569' : '#E2E8F0',
            p: 3
          }}
        >
          {selectedProductConsumptionDetails.length > 0 ? (
            <Stack spacing={2}>
              {selectedProductConsumptionDetails.map((detail, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    p: 2,
                    background: mode === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.5)',
                    border: mode === 'dark' ? '1px solid #475569' : '1px solid #E2E8F0',
                    borderRadius: 2,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: mode === 'dark' ? '#F8FAFC' : '#0F172A',
                          fontWeight: 'medium'
                        }}
                      >
                        {detail.clubName}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: mode === 'dark' ? '#94A3B8' : '#64748B',
                          mt: 0.5 
                        }}
                      >
                        Club Consumption
                      </Typography>
                    </Box>
                    <Box 
                      sx={{ 
                        background: mode === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(37, 99, 235, 0.1)',
                        px: 2,
                        py: 1,
                        borderRadius: 2
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: mode === 'dark' ? '#3B82F6' : '#2563EB',
                          fontWeight: 'bold'
                        }}
                      >
                        {detail.quantity} units
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              ))}
              <Box sx={{ mt: 3 }}>
                <Divider sx={{ borderColor: mode === 'dark' ? '#475569' : '#E2E8F0' }} />
                <Stack 
                  direction="row" 
                  justifyContent="space-between" 
                  alignItems="center"
                  sx={{ mt: 2 }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: mode === 'dark' ? '#F8FAFC' : '#0F172A',
                      fontWeight: 'bold'
                    }}
                  >
                    Total Consumption
                  </Typography>
                  <Box 
                    sx={{ 
                      background: mode === 'dark' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(217, 119, 6, 0.1)',
                      px: 3,
                      py: 1.5,
                      borderRadius: 2
                    }}
                  >
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: mode === 'dark' ? '#F59E0B' : '#D97706',
                        fontWeight: 'bold'
                      }}
                    >
                      {selectedProductConsumptionDetails.reduce((total, detail) => total + detail.quantity, 0)} units
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          ) : (
            <Box 
              sx={{ 
                py: 8,
                textAlign: 'center',
                color: mode === 'dark' ? '#94A3B8' : '#64748B'
              }}
            >
              <Typography variant="h6">
                No consumption recorded for this product on the selected date.
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Try selecting a different date to view consumption details.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          background: mode === 'dark' ? '#1E293B' : '#F8FAFC', 
          borderTop: mode === 'dark' ? '1px solid #475569' : '1px solid #E2E8F0',
          p: 2
        }}>
          <Button 
            onClick={handleCloseProductConsumptionDetailDialog} 
            variant="outlined"
            sx={{ 
              color: mode === 'dark' ? '#94A3B8' : '#64748B',
              borderColor: mode === 'dark' ? '#475569' : '#E2E8F0',
              '&:hover': {
                borderColor: mode === 'dark' ? '#94A3B8' : '#64748B',
                background: mode === 'dark' ? 'rgba(148, 163, 184, 0.1)' : 'rgba(100, 116, 139, 0.1)'
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      {user?.role === 'super_admin' && (
        <Tooltip title="Add Product" placement="left">
          <Fab
            color="primary"
            onClick={handleOpenAddProductDialog}
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
    </Box>
  );
};

export { InventoryPage };
