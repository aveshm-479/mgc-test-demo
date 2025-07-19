import React, { useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';

interface CredentialCardProps {
  role: string;
  email: string;
  password: string;
  color: string;
  onClick: () => void;
}

const CredentialCard: React.FC<CredentialCardProps> = ({ role, email, password, color, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        sx={{
          background: 'rgba(26, 26, 26, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(59, 130, 246, 0.2)', // Replaced gold
          borderRadius: '12px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgba(59, 130, 246, 0.4)',
            transform: 'translateY(-2px)',
          }
        }}
        onClick={onClick}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ color: color, fontWeight: 'bold' }}>
              {role}
            </Typography>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4CAF50' }} />
          </Box>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'monospace' }}>
            {email}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'monospace', mt: 1 }}>
            {password}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  const demoCredentials = [
    { role: 'Super Admin', email: 'super@magicalcommunity.com', password: 'admin123', color: '#3b82f6' }, // Replaced gold
    { role: 'Admin', email: 'admin1@magicalcommunity.com', password: 'admin123', color: '#4CAF50' },
    { role: 'Admin', email: 'admin2@magicalcommunity.com', password: 'admin123', color: '#2196F3' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 400 }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ color: '#3b82f6', fontWeight: 'bold', mb: 1 }}>
            Welcome Back
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Sign in to your account
          </Typography>
        </Box>

        <Card
          sx={{
            background: 'rgba(26, 26, 26, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(59, 130, 246, 0.2)', // Replaced gold
            borderRadius: '16px',
            p: 4,
          }}
        >
          <form ref={formRef} onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="body2" sx={{ color: '#3b82f6', mb: 1, fontWeight: 600 }}>
                  Email Address
                </Typography>
                <TextField
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: 'rgba(59, 130, 246, 0.7)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#3b82f6',
                      '& fieldset': {
                        borderColor: 'rgba(59, 130, 246, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(59, 130, 246, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#3b82f6',
                      },
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'rgba(59, 130, 246, 0.5)',
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography variant="body2" sx={{ color: '#3b82f6', mb: 1, fontWeight: 600 }}>
                  Password
                </Typography>
                <TextField
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: 'rgba(59, 130, 246, 0.7)' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: 'rgba(59, 130, 246, 0.7)' }}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#3b82f6',
                      '& fieldset': {
                        borderColor: 'rgba(59, 130, 246, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(59, 130, 246, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#3b82f6',
                      },
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'rgba(59, 130, 246, 0.5)',
                    },
                  }}
                />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 1, textAlign: 'right' }}>
                  <a href="#" style={{ color: 'rgba(59, 130, 246, 0.7)', textDecoration: 'none' }}>
                    Forgot password?
                  </a>
                </Typography>
              </Box>

              {error && (
                <Typography variant="body2" sx={{ color: '#F44336', textAlign: 'center' }}>
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  fontWeight: 600,
                  py: 1.5,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  }
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>

              <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid size={{ xs:12}}>
                  <Typography variant="h6" sx={{ color: '#3b82f6', textAlign: 'center', mb: 2 }}>
                    Quick Login (Demo Accounts)
                  </Typography>
                </Grid>
                {demoCredentials.map((cred, index) => (
                  <Grid size={{ xs:12,sm:4 }} key={index}>
                    <CredentialCard {...cred} onClick={() => fillCredentials(cred.email, cred.password)} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </form>
        </Card>
      </motion.div>
    </Box>
  );
};
