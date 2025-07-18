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
  Badge,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Inventory as InventoryIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Notifications as NotificationsIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon
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

  const navigation = [
    { name: 'Dashboard', href: '/mgc-test-demo/dashboard', icon: <DashboardIcon />, color: '#FFD700' },
    { name: 'Visitors', href: '/mgc-test-demo/visitors', icon: <PeopleIcon />, color: '#FFEB3B' },
    { name: 'Clubs', href: '/mgc-test-demo/clubs', icon: <BusinessIcon />, color: '#FFF176' },
    { name: 'Inventory', href: '/mgc-test-demo/inventory', icon: <InventoryIcon />, color: '#FFCA28' },
    { name: 'Attendance', href: '/mgc-test-demo/attendance', icon: <CalendarIcon />, color: '#FFC107' },
    { name: 'Expenses', href: '/mgc-test-demo/expenses', icon: <MoneyIcon />, color: '#FFD700' },
    ...(user?.role === 'super_admin' ? [{ name: 'Admin Management', href: '/mgc-test-demo/admin-management', icon: <AdminIcon />, color: '#FFEB3B' }] : []),
  ];

  const drawerWidth = 280;
  const collapsedWidth = 80;

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      background: 'linear-gradient(180deg, #000000 0%, #1a1a1a 100%)',
      borderRight: '1px solid rgba(255, 215, 0, 0.2)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'width 0.3s ease',
      width: sidebarCollapsed ? collapsedWidth : drawerWidth
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: sidebarCollapsed ? 'center' : 'space-between',
        px: sidebarCollapsed ? 1 : 3,
        py: 2,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
        position: 'relative',
        zIndex: 1
      }}>
        {!sidebarCollapsed && (
          <Typography variant="h6" sx={{ 
            color: '#FFD700', 
            fontWeight: 'bold',
            fontSize: '1.2rem',
            letterSpacing: '0.5px',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
          }}>
            <span style={{ 
              background: 'linear-gradient(135deg, #FFD700, #FFEB3B)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800,
              textShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
            }}>
              Magical CMS
            </span>
          </Typography>
        )}
        <IconButton 
          onClick={toggleSidebar} 
          sx={{ 
            color: '#FFD700',
            '&:hover': {
              backgroundColor: 'rgba(255, 215, 0, 0.1)',
              transform: sidebarCollapsed ? 'rotate(180deg)' : 'rotate(180deg)',
              transition: 'all 0.3s ease'
            }
          }}
        >
          {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(255, 215, 0, 0.2)' }} />
      
      <List sx={{ px: sidebarCollapsed ? 1 : 2, py: 2 }}>
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
                borderRadius: '12px',
                color: location.pathname === item.href ? '#FFD700' : 'rgba(255, 255, 255, 0.7)',
                backgroundColor: location.pathname === item.href 
                  ? 'rgba(255, 215, 0, 0.15)' 
                  : 'transparent',
                border: location.pathname === item.href 
                  ? '1px solid rgba(255, 215, 0, 0.4)' 
                  : '1px solid transparent',
                transition: 'all 0.3s ease',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                px: sidebarCollapsed ? 1.5 : 2,
                py: 1.5,
                '&:hover': {
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  color: '#FFD700',
                  transform: 'translateX(4px)',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  boxShadow: '0 4px 20px rgba(255, 215, 0, 0.2)'
                },
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <ListItemIcon sx={{ 
                color: location.pathname === item.href ? item.color : 'rgba(255, 255, 255, 0.7)',
                minWidth: sidebarCollapsed ? 'auto' : 40,
                mr: sidebarCollapsed ? 0 : 2,
                transition: 'all 0.3s ease',
                justifyContent: 'center'
              }}>
                {item.icon}
              </ListItemIcon>
              {!sidebarCollapsed && (
                <ListItemText 
                  primary={item.name} 
                  primaryTypographyProps={{ 
                    fontWeight: location.pathname === item.href ? 600 : 400,
                    fontSize: '0.9rem',
                    letterSpacing: '0.3px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                  }} 
                />
              )}
              {location.pathname === item.href && !sidebarCollapsed && (
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(90deg, transparent, ${item.color}20, transparent)`,
                  animation: 'slide-in 0.5s ease-out'
                }} />
              )}
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      position: 'relative'
    }}>
      {/* Desktop Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { sm: sidebarCollapsed ? collapsedWidth : drawerWidth },
          flexShrink: { sm: 0 },
          transition: 'width 0.3s ease',
          '& .MuiDrawer-paper': {
            width: sidebarCollapsed ? collapsedWidth : drawerWidth,
            boxSizing: 'border-box',
            background: 'transparent',
            border: 'none',
            transition: 'width 0.3s ease',
            overflow: 'hidden'
          },
        }}
      >
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
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: sidebarCollapsed ? collapsedWidth : drawerWidth,
              transition: 'width 0.3s ease',
              overflow: 'hidden'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: { sm: `calc(100% - ${sidebarCollapsed ? collapsedWidth : drawerWidth}px)` },
          minHeight: '100vh',
          position: 'relative',
          transition: 'width 0.3s ease'
        }}
      >
        {/* Header */}
        <AppBar
          position="sticky"
          sx={{
            backdropFilter: 'blur(20px)',
            ml: { sm: `${sidebarCollapsed ? collapsedWidth : drawerWidth}px` },
            transition: 'margin-left 0.3s ease',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            
            <Box sx={{ flexGrow: 1 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {currentClub && (
                <Chip 
                  label={currentClub.name} 
                  size="small"
                  sx={{ 
                    fontWeight: 600
                  }} 
                />
              )}
              
              <IconButton onClick={toggleTheme} color="inherit">
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
              
              <IconButton color="inherit">
                <Badge badgeContent={3} color="warning">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ 
                  width: 32,
                  height: 32,
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}>
                  {user?.name.charAt(0)}
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {user?.name}
                </Typography>
              </Box>

              <IconButton
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <SettingsIcon />
              </IconButton>
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
              borderRadius: '12px',
              mt: 1,
            }
          }}
        >
          <MenuItem onClick={handleProfileMenuClose}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={handleProfileMenuClose}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>

        {/* Page Content */}
        <Box sx={{ 
          flex: 1,
          overflow: 'auto',
          p: 3,
          position: 'relative',
          zIndex: 1
        }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
