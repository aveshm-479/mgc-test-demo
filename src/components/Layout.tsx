import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useApp } from '../hooks/useApp';
import { useTheme } from '../hooks/useTheme';
import {
  Box,
  IconButton,
  Typography,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Fade,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Inventory as InventoryIcon,
  CalendarMonth as CalendarIcon,
  AttachMoney as MoneyIcon,
  AdminPanelSettings as AdminIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Notifications as NotificationsIcon,
  Brightness4 as DarkModeIcon, // Aliased for clarity
  Brightness7 as LightModeIcon, // Aliased for clarity
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  CardMembership as SubscriptionIcon,
} from '@mui/icons-material';

export const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { currentClub } = useApp();
  const { mode, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Updated navigation with black and yellow accent colors
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: <DashboardIcon />, color: '#F59E0B' },
    { name: 'Visitors', href: '/visitors', icon: <PeopleIcon />, color: '#F59E0B' },
    { name: 'Clubs', href: '/clubs', icon: <BusinessIcon />, color: '#F59E0B' },
    { name: 'Inventory', href: '/inventory', icon: <InventoryIcon />, color: '#F59E0B' },
    { name: 'Attendance', href: '/attendance', icon: <CalendarIcon />, color: '#F59E0B' },
    { name: 'Expenses', href: '/expenses', icon: <MoneyIcon />, color: '#F59E0B' },
    { name: 'Subscriptions', href: '/subscriptions', icon: <SubscriptionIcon />, color: '#F59E0B' },
    ...(user?.role === 'super_admin' ? [{ name: 'Admin Management', href: '/admin-management', icon: <AdminIcon />, color: '#F59E0B' }] : []),
  ];

  const drawerWidth = 280;
  const collapsedWidth = 80;

  const drawer = (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: mode === 'dark' 
        ? '#1E293B' /* --bg-secondary */
        : '#F8FAFC' /* --bg-secondary */,
      position: 'relative',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      width: sidebarCollapsed ? collapsedWidth : drawerWidth,
      borderRight: mode === 'dark' 
        ? '1px solid #475569' /* --border */
        : '1px solid #E2E8F0' /* --border */,
      boxShadow: mode === 'dark'
        ? '4px 0 20px rgba(0, 0, 0, 0.5)'
        : '4px 0 20px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: sidebarCollapsed ? 'center' : 'space-between',
        px: sidebarCollapsed ? 1 : 2,
        py: 1.5,
        background: mode === 'dark'
          ? '#1E293B' /* --bg-secondary */
          : '#F8FAFC' /* --bg-secondary */,
        backdropFilter: 'blur(20px)',
        borderBottom: mode === 'dark'
          ? '1px solid #475569' /* --border */
          : '1px solid #E2E8F0' /* --border */,
        flexShrink: 0
      }}>
        {!sidebarCollapsed && (
          <Typography variant="h6" sx={{
            background: mode === 'dark'
              ? 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)' /* --primary-gold */
              : 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)' /* --primary-gold */,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800,
            fontSize: '1.1rem',
            letterSpacing: '0.3px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textShadow: mode === 'dark' 
              ? '0 0 20px rgba(255, 193, 7, 0.3)'
              : '0 0 20px rgba(33, 33, 33, 0.2)'
          }}>
            ✨ Magical CMS
          </Typography>
        )}
        <Tooltip title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"} placement="right">
          <IconButton
            onClick={toggleSidebar}
            sx={{
              background: mode === 'dark'
                ? 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)' /* --primary-gold */
                : 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)' /* --primary-gold */,
              color: mode === 'dark' ? '#000' : '#fff',
              width: 32,
              height: 32,
              boxShadow: mode === 'dark'
                ? '0 4px 12px rgba(255, 193, 7, 0.3)'
                : '0 4px 12px rgba(33, 33, 33, 0.3)',
              '&:hover': {
                background: mode === 'dark'
                  ? 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)'
                  : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                transform: 'scale(1.05)',
                boxShadow: mode === 'dark'
                  ? '0 6px 16px rgba(255, 193, 7, 0.4)'
                  : '0 6px 16px rgba(33, 33, 33, 0.4)'
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {sidebarCollapsed ? <ChevronRightIcon sx={{ fontSize: 20 }} /> : <ChevronLeftIcon sx={{ fontSize: 20 }} />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Navigation */}
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <List sx={{ 
          px: sidebarCollapsed ? 1 : 2, 
          py: 1.5
        }}>
        {navigation.map((item) => (
          <Tooltip
            key={item.name}
            title={sidebarCollapsed ? item.name : ''}
            placement="right"
            arrow
          >
            <ListItem
              component={Link}
              to={item.href}
              sx={{
                  mb: 1,
                  borderRadius: '10px',
                color: location.pathname === item.href 
                  ? mode === 'dark' ? '#000' : '#fff'
                  : mode === 'dark' 
                    ? '#F8FAFC' /* --text-primary */ 
                      : '#0F172A' /* --text-primary */,
                background: location.pathname === item.href
                  ? mode === 'dark'
                    ? 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)' /* --primary-gold */
                    : 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)' /* --primary-gold */
                  : 'transparent',
                border: location.pathname === item.href
                  ? 'none'
                  : mode === 'dark'
                    ? '1px solid #475569' /* --border */
                      : '1px solid #E2E8F0' /* --border */,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  px: sidebarCollapsed ? 1 : 2,
                  py: 1.25,
                position: 'relative',
                  minHeight: 42,
                '&:hover': {
                  background: location.pathname === item.href
                    ? mode === 'dark'
                      ? 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)'
                      : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                    : mode === 'dark'
                      ? 'rgba(245, 158, 11, 0.1)' /* --primary-gold with opacity */
                        : 'rgba(217, 119, 6, 0.05)' /* --primary-gold (darker) with opacity */,
                  transform: 'translateX(4px)',
                  boxShadow: location.pathname === item.href
                    ? mode === 'dark'
                      ? '0 8px 25px rgba(245, 158, 11, 0.3)'
                      : '0 8px 25px rgba(217, 119, 6, 0.3)'
                    : mode === 'dark'
                      ? '0 4px 20px rgba(245, 158, 11, 0.1)'
                        : '0 4px 20px rgba(217, 119, 6, 0.1)'
                  }
              }}
            >
              <ListItemIcon sx={{
                color: 'inherit',
                  minWidth: sidebarCollapsed ? 'auto' : 36,
                  mr: sidebarCollapsed ? 0 : 1.5,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                justifyContent: 'center',
                '& svg': {
                    fontSize: '1.25rem',
                  filter: location.pathname === item.href 
                    ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                      : 'none'
                }
              }}>
                {item.icon}
              </ListItemIcon>
              {!sidebarCollapsed && (
                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{
                    fontWeight: location.pathname === item.href ? 700 : 500,
                    fontSize: '0.95rem',
                    letterSpacing: '0.3px',
                    whiteSpace: 'nowrap',
                      overflow: 'hidden'
                  }}
                />
              )}
            </ListItem>
          </Tooltip>
        ))}
      </List>
        </Box>
    </Box>
  );

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      width: '100vw',
      overflowX: 'hidden',
      background: mode === 'dark'
        ? '#0F172A' /* --bg-primary */
        : '#FFFFFF', /* --bg-primary */
    }}>
      {/* Desktop Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { sm: sidebarCollapsed ? collapsedWidth : drawerWidth },
          flexShrink: { sm: 0 },
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '& .MuiDrawer-paper': {
            width: sidebarCollapsed ? collapsedWidth : drawerWidth,
            boxSizing: 'border-box',
            background: 'transparent',
            border: 'none',
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: 'hidden'
          },
          position: 'fixed',
          top: 0,
          bottom: 0,
          zIndex: (theme) => theme.zIndex.drawer + 2,
        }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: mode === 'dark' 
                ? '#1E293B' /* --bg-secondary */
                : '#F8FAFC', /* --bg-secondary */
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: sidebarCollapsed ? collapsedWidth : drawerWidth,
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              overflow: 'hidden',
              background: mode === 'dark' 
                ? '#1E293B' /* --bg-secondary */
                : '#F8FAFC', /* --bg-secondary */
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { sm: sidebarCollapsed ? `${collapsedWidth}px` : `${drawerWidth}px` },
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          width: { sm: `calc(100% - ${sidebarCollapsed ? collapsedWidth : drawerWidth}px)` },
        }}
      >
        <AppBar
          position="fixed"
          sx={{
            ml: { sm: sidebarCollapsed ? collapsedWidth : drawerWidth },
            width: { sm: `calc(100% - ${sidebarCollapsed ? collapsedWidth : drawerWidth}px)` },
            boxShadow: 'none',
            background: mode === 'dark' 
              ? '#1E293B' /* --bg-secondary */ 
              : '#F8FAFC', /* --bg-secondary */
            backdropFilter: 'blur(20px)',
            borderBottom: mode === 'dark' 
              ? '1px solid #475569' /* --border */ 
              : '1px solid #E2E8F0', /* --border */
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar
            sx={{
              pr: { xs: 2, sm: 3 },
              pl: { xs: 2, sm: 3 },
              minHeight: '72px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* Mobile menu button */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              sx={{ 
                mr: 2, 
                display: { sm: 'none' },
                color: mode === 'dark' ? '#F59E0B' : '#D97706',
              }}
            >
              <MenuIcon />
            </IconButton>

            <Box sx={{ flexGrow: 1 }} />

            {/* Header actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Current Club */}
              {currentClub && (
                <Chip
                  label={currentClub.name}
                  size="small"
                  sx={{
                    background: mode === 'dark'
                      ? 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)' /* --primary-gold */
                      : 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)', /* --primary-gold */
                    color: mode === 'dark' ? '#000' : '#fff',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    '& .MuiChip-label': {
                      px: 1.5,
                    },
                    boxShadow: mode === 'dark'
                      ? '0 2px 8px rgba(245, 158, 11, 0.3)'
                      : '0 2px 8px rgba(217, 119, 6, 0.3)',
                  }}
                />
              )}

              {/* Theme toggle */}
              <IconButton onClick={toggleTheme} color="inherit" sx={{ color: mode === 'dark' ? '#F59E0B' : '#D97706' }}>
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>

              {/* Notifications */}
              <IconButton color="inherit" sx={{ color: mode === 'dark' ? '#F59E0B' : '#D97706' }}>
                <NotificationsIcon />
                <Chip label="3" size="small" sx={{
                  backgroundColor: '#F59E0B',
                  color: '#000',
                  height: 18,
                  minWidth: 18,
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  borderRadius: '50%',
                  p: '0 4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }} />
              </IconButton>

              {/* User Profile */}
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                sx={{ p: 0 }}
              >
                <Avatar sx={{ 
                  bgcolor: mode === 'dark' ? '#F59E0B' : '#D97706',
                  color: mode === 'dark' ? '#000' : '#fff',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  width: 36,
                  height: 36,
                }}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : <AccountCircleIcon sx={{ color: mode === 'dark' ? '#000' : '#fff' }} />}
                </Avatar>
              </IconButton>
              <Typography variant="subtitle1" sx={{
                color: mode === 'dark' ? '#F8FAFC' : '#0F172A',
                fontWeight: 600,
                display: { xs: 'none', sm: 'block' }
              }}>
                {user?.name || 'Super Admin'}
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          TransitionComponent={Fade}
          PaperProps={{
            sx: {
              borderRadius: '16px',
              mt: 1,
              minWidth: 200,
              background: mode === 'dark'
                ? '#1E293B' /* --bg-secondary */
                : '#F8FAFC', /* --bg-secondary */
              backdropFilter: 'blur(20px)',
              border: mode === 'dark'
                ? '1px solid #475569' /* --border */
                : '1px solid #E2E8F0', /* --border */
              boxShadow: mode === 'dark'
                ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                : '0 8px 32px rgba(0, 0, 0, 0.1)',
            }
          }}
        >
          <MenuItem 
            onClick={handleProfileMenuClose}
            sx={{
              color: mode === 'dark' ? '#F8FAFC' /* --text-primary */ : '#0F172A', /* --text-primary */
              '&:hover': {
                background: mode === 'dark' 
                  ? 'rgba(245, 158, 11, 0.1)' 
                  : 'rgba(217, 119, 6, 0.05)',
              },
            }}
          >
            <ListItemIcon>
              <PersonIcon fontSize="small" sx={{ color: 'inherit' }} />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem 
            onClick={handleProfileMenuClose}
            sx={{
              color: mode === 'dark' ? '#F8FAFC' /* --text-primary */ : '#0F172A', /* --text-primary */
              '&:hover': {
                background: mode === 'dark' 
                  ? 'rgba(245, 158, 11, 0.1)' 
                  : 'rgba(217, 119, 6, 0.05)',
              },
            }}
          >
            <ListItemIcon>
              <SettingsIcon fontSize="small" sx={{ color: 'inherit' }} />
            </ListItemIcon>
            Settings
          </MenuItem>
          <Divider sx={{ 
            borderColor: mode === 'dark' 
              ? '#475569' /* --border */ 
              : '#E2E8F0', /* --border */
          }} />
          <MenuItem 
            onClick={handleLogout}
            sx={{
              color: '#dc2626', // error.main
              '&:hover': {
                background: 'rgba(220, 38, 38, 0.1)',
              },
            }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" sx={{ color: '#dc2626' }} />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>

        {/* Main Content */}
        <Box sx={{
          pt: '72px',
          background: mode === 'dark'
            ? '#0F172A' /* --bg-primary */
            : '#FFFFFF', /* --bg-primary */
          minHeight: 'calc(100vh - 72px)',
          paddingBottom: 3, // Add some padding to the bottom
        }}>
          {/* Content from router */}
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};