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
          border: '1px solid rgba(255, 215, 0, 0.2)',
          borderRadius: '12px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'rgba(255, 215, 0, 0.1)',
            borderColor: 'rgba(255, 215, 0, 0.4)',
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
        navigate('/mgc-test-demo/dashboard');
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
    { role: 'Super Admin', email: 'super@magicalcommunity.com', password: 'admin123', color: '#FFD700' },
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
          <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold', mb: 1 }}>
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
            border: '1px solid rgba(255, 215, 0, 0.2)',
            borderRadius: '16px',
            p: 4,
          }}
        >
          <form ref={formRef} onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="body2" sx={{ color: '#FFD700', mb: 1, fontWeight: 600 }}>
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
                        <EmailIcon sx={{ color: 'rgba(255, 215, 0, 0.7)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#FFD700',
                      '& fieldset': {
                        borderColor: 'rgba(255, 215, 0, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 215, 0, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FFD700',
                      },
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'rgba(255, 215, 0, 0.5)',
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography variant="body2" sx={{ color: '#FFD700', mb: 1, fontWeight: 600 }}>
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
                        <LockIcon sx={{ color: 'rgba(255, 215, 0, 0.7)' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: 'rgba(255, 215, 0, 0.7)' }}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#FFD700',
                      '& fieldset': {
                        borderColor: 'rgba(255, 215, 0, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 215, 0, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FFD700',
                      },
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'rgba(255, 215, 0, 0.5)',
                    },
                  }}
                />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 1, textAlign: 'right' }}>
                  <a href="#" style={{ color: 'rgba(255, 215, 0, 0.7)', textDecoration: 'none' }}>
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
                disabled={loading}
                fullWidth
                sx={{
                  background: 'linear-gradient(135deg, #FFD700, #FFCA28)',
                  color: '#000000',
                  fontWeight: 'bold',
                  py: 1.5,
                  borderRadius: '8px',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #FFCA28, #FFD700)',
                  },
                  '&:disabled': {
                    background: 'rgba(255, 215, 0, 0.3)',
                    color: 'rgba(0, 0, 0, 0.5)',
                  },
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Box>
          </form>

          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(255, 215, 0, 0.2)' }}>
            <Typography variant="h6" sx={{ color: '#FFD700', textAlign: 'center', mb: 2 }}>
              Demo Credentials
            </Typography>
            <Grid container spacing={2}>
              {demoCredentials.map((cred, index) => (
                <Grid size={{ xs: 12, md: 8 }} key={index}>
                  <CredentialCard
                    role={cred.role}
                    email={cred.email}
                    password={cred.password}
                    color={cred.color}
                    onClick={() => fillCredentials(cred.email, cred.password)}
                  />
                </Grid>
              ))}
            </Grid>
            <Button
              fullWidth
              onClick={() => fillCredentials(demoCredentials[0].email, demoCredentials[0].password)}
              sx={{
                mt: 2,
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#FFD700',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                '&:hover': {
                  background: 'rgba(255, 215, 0, 0.1)',
                },
              }}
            >
              Use Demo Credentials
            </Button>
          </Box>
        </Card>
      </motion.div>
    </Box>
  );
};
