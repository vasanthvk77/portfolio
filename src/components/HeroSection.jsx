import React from 'react';
import { Box, Typography, Button, Avatar, IconButton, Stack } from '@mui/material';
import { Download, ArrowUpRight, Mail } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import ThreeSphere from './ThreeSphere';

const pdfDownload = async () => {
  try {
    const basePath = window.location.pathname.includes('/portfolio') ? '/portfolio' : '';
    const filePath = `/files/Vasanthakumar_CV.pdf?v=2`;
    const response = await fetch(filePath);
    if (!response.ok) throw new Error('not found');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'Vasanthakumar_CV.pdf'; a.click();
    setTimeout(() => { window.URL.revokeObjectURL(url); }, 100);
  } catch {
    const basePath = window.location.pathname.includes('/portfolio') ? '/portfolio' : '';
    const a = document.createElement('a');
    a.href = `/files/Vasanthakumar_CV.pdf?v=2`;
    a.download = 'Vasanthakumar_CV.pdf';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};

// Iridescent Sphere Wrapper — clamped for mobile
const HeroSphere = () => (
  <Box sx={{
    position: 'relative',
    // On mobile: full-width capped at 260px; tablet: 340px; desktop: 420px
    width: { xs: '100%', sm: 340, md: 420 },
    maxWidth: { xs: 260, sm: 340, md: 420 },
    height: { xs: 240, sm: 340, md: 420 },
    flexShrink: 0,
    mx: { xs: 'auto', md: 0 },
  }}>
    {/* Outer glow ring */}
    <Box className="anim-rotate" sx={{
      position: 'absolute', inset: '-20px', borderRadius: '50%',
      border: '1px dashed rgba(139,92,246,0.2)',
      pointerEvents: 'none',
    }} />
    {/* 3D Sphere Canvas */}
    <Box sx={{ width: '100%', height: '100%' }}>
      <ThreeSphere />
    </Box>
    {/* Small satellite sphere */}
    <Box sx={{
      position: 'absolute', bottom: '10%', left: '-4%',
      width: { xs: 50, md: 80 }, height: { xs: 50, md: 80 }, borderRadius: '50%',
      background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.15) 0%, transparent 50%), conic-gradient(from 90deg, #7c3aed, #06b6d4, #7c3aed)`,
      boxShadow: '0 0 30px rgba(124,58,237,0.3)',
      opacity: 0.8,
      pointerEvents: 'none',
    }} />
  </Box>
);

export default function HeroSection({ personalInfo }) {
  return (
    <Box
      id="home"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        pt: { xs: 10, md: 12 },
        pb: { xs: 6, md: 6 },
        px: { xs: 2, md: 4 },
        maxWidth: '1200px',
        mx: 'auto',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      {/* Main hero row: stacks vertically on mobile (sphere first via column-reverse) */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column-reverse', md: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        gap: { xs: 5, md: 4 },
        mb: { xs: 5, md: 6 },
      }}>

        {/* Left Content */}
        <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1, fontWeight: 500, fontSize: { xs: '0.9rem', md: '1rem' } }}>
            Hi, I'm
          </Typography>

          <Typography variant="h1" sx={{
            fontSize: { xs: '2.2rem', sm: '3rem', md: '4rem' },
            fontWeight: 800,
            lineHeight: 1.05,
            mb: 0.5,
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 60%, #8b5cf6 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            {personalInfo.name}
          </Typography>

          <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.75)', mb: 2.5, fontWeight: 500, fontSize: { xs: '1rem', md: '1.35rem' } }}>
            {personalInfo.title}
          </Typography>

          <Typography variant="body1" sx={{
            color: 'rgba(255,255,255,0.45)',
            maxWidth: '100%',
            lineHeight: 1.8,
            mb: 4,
            fontSize: { xs: '0.88rem', md: '0.95rem' },
            textAlign: 'justify',
          }}>
            {personalInfo.profileSummary.slice(0, 600)}
          </Typography>

          {/* CTA Buttons — wrap on mobile */}
          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mb: 4, gap: 1.5 }}>
            <Button
              variant="contained"
              endIcon={<ArrowUpRight size={16} />}
              onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
              sx={{
                background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                color: 'white', px: { xs: 2, md: 3 }, py: 1.25, borderRadius: '10px', fontWeight: 600,
                fontSize: { xs: '0.85rem', md: '0.95rem' },
                '&:hover': { opacity: 0.9, transform: 'translateY(-1px)' },
                transition: 'all 0.2s',
              }}
            >
              View My Work
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download size={16} />}
              onClick={pdfDownload}
              sx={{
                borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)',
                px: { xs: 2, md: 3 }, py: 1.25, borderRadius: '10px',
                fontSize: { xs: '0.85rem', md: '0.95rem' },
                '&:hover': { borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.04)' },
              }}
            >
              Download CV
            </Button>
          </Stack>

          {/* Social Links */}
          <Box>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', display: 'block', mb: 1.5, textTransform: 'uppercase', letterSpacing: 2 }}>
              Connect with me
            </Typography>
            <Stack direction="row" spacing={1}>
              {[
                { icon: <FaGithub size={18} />, href: personalInfo.github, label: 'GitHub' },
                { icon: <FaLinkedin size={18} />, href: personalInfo.linkedin, label: 'LinkedIn' },
                { icon: <Mail size={18} />, href: `mailto:${personalInfo.email}`, label: 'Email' },
              ].map(({ icon, href, label }) => (
                <IconButton
                  key={label}
                  component="a" href={href} target="_blank" aria-label={label}
                  sx={{
                    color: 'rgba(255,255,255,0.6)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px', width: 38, height: 38,
                    '&:hover': { color: 'white', border: '1px solid rgba(139,92,246,0.4)', background: 'rgba(139,92,246,0.1)' },
                    transition: 'all 0.2s',
                  }}
                >
                  {icon}
                </IconButton>
              ))}
            </Stack>
          </Box>
        </Box>

        {/* Right — Sphere (shrinks properly on mobile) */}
        <Box sx={{ display: 'flex', justifyContent: 'center', width: { xs: '100%', md: 'auto' } }}>
          <HeroSphere />
        </Box>
      </Box>

      {/* About strip at bottom — fully responsive */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' },
        gap: { xs: 2.5, md: 3 },
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px',
        p: { xs: 2, md: 2.5 },
        backdropFilter: 'blur(10px)',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        {/* Row 1 / Left side: Avatar + About info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          <Avatar
            src="https://lh3.googleusercontent.com/a/ACg8ocL8jX34L86_593Xw2-e1d8G6o4E1H1vY2vM0K6j2F6cR4v98A=s288-c-no"
            sx={{ width: 48, height: 48, border: '2px solid rgba(139,92,246,0.5)', flexShrink: 0 }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 700, mb: 0.25, fontSize: { xs: '0.85rem', md: '0.875rem' } }}>About Me</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, display: 'block', fontSize: { xs: '0.75rem', md: '0.8rem' } }}>
              {personalInfo.profileSummary.slice(0, 100)}...
            </Typography>
          </Box>
        </Box>

        {/* Row 2 / Right side: Stats */}
        <Box sx={{
          display: 'flex',
          gap: { xs: 3, md: 3 },
          justifyContent: { xs: 'space-around', md: 'flex-end' },
          borderTop: { xs: '1px solid rgba(255,255,255,0.05)', md: 'none' },
          pt: { xs: 2, md: 0 },
          flexShrink: 0,
        }}>
          {[['1+', 'Yrs Exp'], ['5+', 'Projects'], ['15+', 'Tech']].map(([val, label]) => (
            <Box key={label} sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 800, lineHeight: 1, fontSize: { xs: '1rem', md: '1.25rem' } }}>{val}</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: { xs: '0.65rem', md: '0.7rem' } }}>{label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
