import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Box, Button,
  IconButton, Drawer, List, ListItem, ListItemButton,
  ListItemText, useMediaQuery, useTheme,
} from '@mui/material';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const navLinks = [
  { label: 'Home',                href: '#home' },
  { label: 'Skills',              href: '#skills' },
  { label: 'Experience',          href: '#experience' },
  { label: 'Projects',            href: '#projects' },
  { label: 'Certifications',      href: '#certifications' },
  { label: 'Education & Contact', href: '#education' },
];

export default function Navbar({ name }) {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [active, setActive] = useState('home');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const ids = ['home', 'skills', 'experience', 'projects', 'certifications', 'education', 'contact'];
    const observers = ids.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActive(id === 'contact' ? 'education' : id);
          }
        },
        { threshold: 0.4 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);

  const navbarBg = scrolled
    ? 'rgba(8,8,15,0.85)'
    : 'transparent';

  const handleNav = (href) => {
    setDrawerOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: navbarBg,
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
          transition: 'all 0.4s ease',
          zIndex: 1200,
        }}
      >
        <Toolbar sx={{ maxWidth: '1200px', width: '100%', mx: 'auto', px: { xs: 2, md: 4 }, py: 1 }}>
          {/* Logo */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: 'white',
              cursor: 'pointer',
              mr: 4,
              fontSize: '1.1rem',
              letterSpacing: '-0.01em',
            }}
            onClick={() => handleNav('#home')}
          >
            {name}
          </Typography>

          {/* Desktop Nav */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 0.5, flexGrow: 1, justifyContent: 'center' }}>
              {navLinks.map(({ label, href }) => {
                const id = href.replace('#', '');
                const isActive = active === id;
                return (
                  <Button
                    key={label}
                    onClick={() => handleNav(href)}
                    sx={{
                      color: isActive ? 'primary.main' : 'rgba(255,255,255,0.65)',
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 700 : 500,
                      px: 1.5,
                      py: 0.75,
                      borderRadius: '8px',
                      position: 'relative',
                      transition: 'color 0.2s',
                      '&:hover': { color: 'white', background: 'rgba(255,255,255,0.05)' },
                      '&::after': isActive ? {
                        content: '""',
                        position: 'absolute',
                        bottom: '4px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '20px',
                        height: '2px',
                        borderRadius: '1px',
                        background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)',
                      } : {},
                    }}
                  >
                    {label}
                  </Button>
                );
              })}
            </Box>
          )}

          {/* CTA */}
          {!isMobile && (
            <Button
              onClick={() => handleNav('#contact')}
              variant="outlined"
              endIcon={<ArrowUpRight size={16} />}
              sx={{
                borderColor: 'rgba(139,92,246,0.5)',
                color: 'white',
                px: 2.5,
                py: 0.75,
                fontSize: '0.875rem',
                borderRadius: '10px',
                '&:hover': {
                  borderColor: 'primary.main',
                  background: 'rgba(139,92,246,0.1)',
                },
              }}
            >
              Let's Connect
            </Button>
          )}

          {/* Mobile hamburger */}
          {isMobile && (
            <Box sx={{ ml: 'auto' }}>
              <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: 'white' }}>
                <Menu size={22} />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { background: '#0f0f1a', width: 260, border: 'none' } }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'white' }}>
            <X size={22} />
          </IconButton>
        </Box>
        <List>
          {navLinks.map(({ label, href }) => (
            <ListItem key={label} disablePadding>
              <ListItemButton onClick={() => handleNav(href)} sx={{ px: 3, py: 1.5 }}>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{ color: 'white', fontWeight: 500, fontSize: '1rem' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}
