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
import {
  People as PeopleIcon,
  MonetizationOn as MoneyIcon,
  Star as StarIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useApp } from '../hooks/useApp';
import { useTheme } from '../hooks/useTheme';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, trend }) => {
  const { mode } = useTheme();
  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.02,
        y: -4,
        boxShadow: mode === 'dark' 
          ? '0 12px 40px rgba(0, 0, 0, 0.4)' 
          : '0 12px 40px rgba(0, 0, 0, 0.15)'
      }}
      transition={{ 
        duration: 0.2,
        ease: "easeOut"
      }}
      sx={{
        p: 3,
        textAlign: 'center',
        background: mode === 'dark' ? '#1E293B' : '#F8FAFC',
        backdropFilter: 'blur(10px)',
        border: mode === 'dark' ? '1px solid #475569' : '1px solid #E2E8F0',
        borderRadius: '16px',
        boxShadow: mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer'
      }}
    >
      <Box sx={{ mb: 1.5, color: mode === 'dark' ? '#3B82F6' : '#2563EB' }}>
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
      </Box>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Typography variant="h4" sx={{ color: mode === 'dark' ? '#3B82F6' : '#2563EB', fontWeight: 'bold', mb: 0.5 }}>
        {value}
      </Typography>
        <Typography variant="body1" sx={{ color: mode === 'dark' ? '#94A3B8' : '#64748B', fontWeight: 'medium' }}>
        {title}
      </Typography>
      {trend && (
          <Typography variant="caption" sx={{ color: mode === 'dark' ? '#94A3B8' : '#64748B', mt: 1, display: 'block' }}>
          {trend}
        </Typography>
      )}
      </motion.div>
    </Card>
  );
};

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { visitors, clubs, getOverallConsumedProductCount } = useApp();
  const { mode } = useTheme(); // Use the theme hook

  // Calculate stats
  const today = new Date();
  const todayVisitors = visitors.filter(v => 
    v.visitDate.toDateString() === today.toDateString()
  );

  const consumedProductsToday = getOverallConsumedProductCount();
  
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

  const stats = [
    { 
      title: 'Consumed Today', 
      value: consumedProductsToday, 
      icon: <CheckIcon sx={{ fontSize: 32 }} />, 
      trend: '',
      color: mode === 'dark' ? '#3B82F6' : '#2563EB'
    },
    { 
      title: 'Today Visitors', 
      value: todayStats.visitors, 
      icon: <PeopleIcon sx={{ fontSize: 32 }} />, 
      trend: '+12% from yesterday',
      color: mode === 'dark' ? '#3B82F6' : '#2563EB'
    },
    { 
      title: 'Today Trials', 
      value: todayStats.trials, 
      icon: <StarIcon sx={{ fontSize: 32 }} />, 
      trend: '+5% from yesterday',
      color: mode === 'dark' ? '#3B82F6' : '#2563EB'
    },
    { 
      title: 'Today Members', 
      value: todayStats.members, 
      icon: <CheckIcon sx={{ fontSize: 32 }} />, 
      trend: '+8% from yesterday',
      color: mode === 'dark' ? '#3B82F6' : '#2563EB'
    },
    { 
      title: 'Total Members', 
      value: totalMembers, 
      icon: <PeopleIcon sx={{ fontSize: 32 }} />, 
      trend: 'All time',
      color: mode === 'dark' ? '#3B82F6' : '#2563EB'
    },
    { 
      title: 'Monthly Revenue', 
      value: `₹${monthlyRevenue.toLocaleString()}`, 
      icon: <MoneyIcon sx={{ fontSize: 32 }} />, 
      trend: '+15% from last month',
      color: mode === 'dark' ? '#3B82F6' : '#2563EB'
    },
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
      case 'member': return mode === 'dark' ? '#3B82F6' : '#2563EB'; 
      case 'trial': return mode === 'dark' ? '#F59E0B' : '#D97706';
      default: return mode === 'dark' ? '#94A3B8' : '#64748B'; 
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
      background: mode === 'dark' ? '#0F172A' /* --bg-primary */ : '#FFFFFF', /* --bg-primary */
      p: 3
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: mode === 'dark' ? '#3B82F6' : '#2563EB', fontWeight: 'bold', mb: 1 }}>
          Welcome back, {user?.name}
        </Typography>
        <Typography variant="body1" sx={{ color: mode === 'dark' ? '#94A3B8' : '#64748B', fontWeight: 'medium' }}>
          Here's what's happening with your wellness clubs today
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5,
              delay: index * 0.1,
              ease: "easeOut"
            }}
          >
            <MetricCard {...stat} />
          </motion.div>
        ))}
      </Box>

      {/* Recent Activity & Top Clubs */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
        {/* Recent Visitors */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card sx={{
            background: mode === 'dark' ? '#1E293B' : '#F8FAFC',
            backdropFilter: 'blur(20px)',
            border: mode === 'dark' ? '1px solid #475569' : '1px solid #E2E8F0',
            borderRadius: '16px'
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: mode === 'dark' ? '#F8FAFC' : '#0F172A', fontWeight: 'bold', mb: 2 }}>
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
                          <Typography sx={{ color: mode === 'dark' ? '#F8FAFC' : '#0F172A', fontWeight: 'medium' }}>
                            {visitor.name}
                          </Typography>
                        }
                        secondary={
                          <React.Fragment>
                            <Chip
                              label={getStatusLabel(visitor.type)}
                              size="small"
                              component="span"
                              sx={{
                                bgcolor: getStatusColor(visitor.type),
                                color: mode === 'dark' ? '#000' : '#fff',
                                fontWeight: 600,
                                mr: 1
                              }}
                            />
                            <Typography component="span" variant="body2" sx={{ color: mode === 'dark' ? '#94A3B8' : '#64748B' }}>
                              {new Date(visitor.visitDate).toLocaleDateString()}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    {index < recentVisitors.length - 1 && (
                      <Divider sx={{ borderColor: mode === 'dark' ? '#475569' : '#E2E8F0' }} />
                    )}
                  </motion.div>
                ))}
              </List>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Clubs */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card sx={{
            background: mode === 'dark' ? '#1E293B' : '#F8FAFC',
            backdropFilter: 'blur(20px)',
            border: mode === 'dark' ? '1px solid #475569' : '1px solid #E2E8F0',
            borderRadius: '16px'
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: mode === 'dark' ? '#F8FAFC' : '#0F172A', fontWeight: 'bold', mb: 2 }}>
                Top Performing Clubs
              </Typography>
              <List>
                {topClubs.map((club, index) => (
                  <motion.div
                    key={club.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: mode === 'dark' ? '#3B82F6' : '#2563EB', color: '#fff' }}>
                          {club.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography sx={{ color: mode === 'dark' ? '#F8FAFC' : '#0F172A', fontWeight: 'medium' }}>
                            {club.name}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" sx={{ color: mode === 'dark' ? '#94A3B8' : '#64748B' }}>
                              {club.visitorCount} Visitors • ₹{club.revenue.toLocaleString()} Revenue
                            </Typography>
                        }
                      />
                    </ListItem>
                    {index < topClubs.length - 1 && (
                      <Divider sx={{ borderColor: mode === 'dark' ? '#475569' : '#E2E8F0' }} />
                    )}
                  </motion.div>
                ))}
              </List>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </Box>
  );
};
