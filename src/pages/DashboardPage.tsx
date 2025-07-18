import React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Divider
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  People as PeopleIcon,
  Star as StarIcon,
  CheckCircle as CheckIcon,
  AttachMoney as MoneyIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useApp } from '../hooks/useApp';
import { useAuth } from '../hooks/useAuth';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, trend, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card sx={{
        background: 'linear-gradient(135deg, #000000, #1a1a1a)',
        border: '1px solid rgba(255, 215, 0, 0.2)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(255, 215, 0, 0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 12px 40px rgba(255, 215, 0, 0.2)',
          transform: 'translateY(-4px)'
        }
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', mb: 1 }}>
                {title}
              </Typography>
              <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold', mb: 0.5 }}>
                {value}
              </Typography>
              {trend && (
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  {trend}
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${color}, ${color}80)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000000',
                fontSize: '1.5rem',
                boxShadow: '0 4px 20px rgba(255, 215, 0, 0.3)'
              }}
            >
              {icon}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { visitors, products, clubs } = useApp();

  // Calculate stats
  const today = new Date();
  const todayVisitors = visitors.filter(v => 
    v.visitDate.toDateString() === today.toDateString()
  );
  
  const todayStats = {
    visitors: todayVisitors.filter(v => v.type === 'visitor').length,
    trials: todayVisitors.filter(v => v.type === 'trial').length,
    members: todayVisitors.filter(v => v.type === 'member').length,
    revenue: todayVisitors.reduce((sum, visitor) => {
      return sum + (visitor.payments?.filter((p: {status: string, amount: number}) => p.status === 'completed').reduce((s: number, p: {amount: number}) => s + p.amount, 0) || 0);
    }, 0)
  };

  const totalMembers = visitors.filter(v => v.type === 'member').length;
  const monthlyRevenue = visitors.reduce((sum, visitor) => {
    const paymentMonth = new Date(visitor.visitDate).getMonth();
    const currentMonth = new Date().getMonth();
    if (paymentMonth === currentMonth) {
      return sum + (visitor.payments?.filter((p: {status: string, amount: number}) => p.status === 'completed').reduce((s: number, p: {amount: number}) => s + p.amount, 0) || 0);
    }
    return sum;
  }, 0);
  const lowStockProducts = products.filter(p => p.stock <= p.minStock).length;

  const stats = [
    { 
      title: 'Today Visitors', 
      value: todayStats.visitors, 
      icon: <PeopleIcon />, 
      trend: '+12% from yesterday',
      color: '#FFD700'
    },
    { 
      title: 'Today Trials', 
      value: todayStats.trials, 
      icon: <StarIcon />, 
      trend: '+5% from yesterday',
      color: '#FFEB3B'
    },
    { 
      title: 'Today Members', 
      value: todayStats.members, 
      icon: <CheckIcon />, 
      trend: '+8% from yesterday',
      color: '#FFCA28'
    },
    { 
      title: 'Total Members', 
      value: totalMembers, 
      icon: <PeopleIcon />, 
      trend: 'All time',
      color: '#FFC107'
    },
    { 
      title: 'Monthly Revenue', 
      value: `₹${monthlyRevenue.toLocaleString()}`, 
      icon: <MoneyIcon />, 
      trend: '+15% from last month',
      color: '#FFD700'
    },
    { 
      title: 'Low Stock Items', 
      value: lowStockProducts, 
      icon: <WarningIcon />, 
      trend: 'Need attention',
      color: '#FFCA28'
    }
  ];

  const recentVisitors = visitors.slice(0, 5);
  const topClubs = clubs.map(club => {
    const clubVisitors = visitors.filter(v => v.clubId === club.id);
    const clubRevenue = clubVisitors.reduce((sum, visitor) => {
      return sum + (visitor.payments?.filter((p: {status: string, amount: number}) => p.status === 'completed').reduce((s: number, p: {amount: number}) => s + p.amount, 0) || 0);
    }, 0);
    
    return {
      ...club,
      visitorCount: clubVisitors.length,
      revenue: clubRevenue
    };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 3);

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

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%)',
      p: 3
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold', mb: 1 }}>
          Welcome back, {user?.name}
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Here's what's happening with your wellness clubs today
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <MetricCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity & Top Clubs */}
      <Grid container spacing={3}>
        {/* Recent Visitors */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{
            background: 'rgba(26, 26, 26, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 215, 0, 0.2)',
            borderRadius: '16px'
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 'bold', mb: 2 }}>
                Recent Activity
              </Typography>
              <List>
                {recentVisitors.map((visitor, index) => (
                  <motion.div
                    key={visitor.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: getStatusColor(visitor.type), color: '#000' }}>
                          {visitor.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography sx={{ color: '#FFD700', fontWeight: 'medium' }}>
                            {visitor.name}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Chip
                              label={getStatusLabel(visitor.type)}
                              size="small"
                              sx={{
                                backgroundColor: getStatusColor(visitor.type),
                                color: '#000000',
                                fontSize: '0.75rem'
                              }}
                            />
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              {visitor.visitDate.toLocaleDateString()}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentVisitors.length - 1 && (
                      <Divider sx={{ borderColor: 'rgba(255, 215, 0, 0.2)' }} />
                    )}
                  </motion.div>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Performing Clubs */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{
            background: 'rgba(26, 26, 26, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 215, 0, 0.2)',
            borderRadius: '16px'
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 'bold', mb: 2 }}>
                Top Performing Clubs
              </Typography>
              <List>
                {topClubs.map((club, index) => (
                  <motion.div
                    key={club.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: '#FFD700', color: '#000' }}>
                          {index + 1}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography sx={{ color: '#FFD700', fontWeight: 'medium' }}>
                            {club.name}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              ₹{club.revenue.toLocaleString()} revenue
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              {club.visitorCount} visitors
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < topClubs.length - 1 && (
                      <Divider sx={{ borderColor: 'rgba(255, 215, 0, 0.2)' }} />
                    )}
                  </motion.div>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
