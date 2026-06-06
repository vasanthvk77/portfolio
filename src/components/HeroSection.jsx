import React from 'react';
import { Box, Typography, Button, Avatar, IconButton, Stack } from '@mui/material';
import { Download, ArrowUpRight, Mail } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import ThreeSphere from './ThreeSphere';

const pdfDownload = async () => {
  try {
    const basePath = window.location.pathname.includes('/portfolio') ? '/portfolio' : '';
    const filePath = `${basePath}/files/VASANTHAKUMAR_B.pdf`;
    const response = await fetch(filePath);
    if (!response.ok) throw new Error('not found');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'VASANTHAKUMAR_B.pdf'; a.click();
    setTimeout(() => { window.URL.revokeObjectURL(url); }, 100);
  } catch {
    const basePath = window.location.pathname.includes('/portfolio') ? '/portfolio' : '';
    const a = document.createElement('a');
    a.href = `${basePath}/files/VASANTHAKUMAR_B.pdf`;
    a.download = 'VASANTHAKUMAR_B.pdf'; a.target = '_blank'; a.click();
  }
};

// Iridescent Sphere Wrapper with 3D Three.js Model
const HeroSphere = () => (
  <Box sx={{ position: 'relative', width: { xs: 280, sm: 380, md: 460 }, height: { xs: 280, sm: 380, md: 460 }, flexShrink: 0 }}>
    {/* Outer glow ring */}
    <Box className="anim-rotate" sx={{
      position: 'absolute', inset: '-25px', borderRadius: '50%',
      border: '1px dashed rgba(139,92,246,0.2)',
      pointerEvents: 'none',
    }} />
    {/* 3D Sphere Canvas */}
    <Box sx={{ width: '100%', height: '100%' }}>
      <ThreeSphere />
    </Box>
    {/* Small satellite sphere */}
    <Box sx={{
      position: 'absolute', bottom: '10%', left: '-5%',
      width: { xs: 70, md: 90 }, height: { xs: 70, md: 90 }, borderRadius: '50%',
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
        pt: { xs: 12, md: 12 },
        pb: { xs: 6, md: 6 },
        px: { xs: 2, md: 4 },
        maxWidth: '1200px',
        mx: 'auto',
        position: 'relative',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 4, flexWrap: { xs: 'wrap', md: 'nowrap' }, mb: { xs: 5, md: 6 } }}>
 
        {/* Left Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1, fontWeight: 500, fontSize: '1rem' }}>
            Hi, I'm
          </Typography>
 
          <Typography variant="h1" sx={{
            fontSize: { xs: '3rem', sm: '4rem', md: '4rem' },
            fontWeight: 800,
            lineHeight: 1.05,
            mb: 0.5,
            background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 60%, #8b5cf6 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            {personalInfo.name}
          </Typography>
 
          <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.75)', mb: 2.5, fontWeight: 500, fontSize: { xs: '1.1rem', md: '1.35rem' } }}>
            {personalInfo.title}
          </Typography>
 
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.45)', maxWidth: '600px', lineHeight: 1.8, mb: 4, fontSize: '0.95rem', textAlign:"justify" }}>
            {personalInfo.profileSummary.slice(0, 600)}
          </Typography>
 
          {/* CTA Buttons */}
          <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 4 }}>
            <Button
              variant="contained"
              endIcon={<ArrowUpRight size={16} />}
              onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
              sx={{
                background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                color: 'white', px: 3, py: 1.25, borderRadius: '10px', fontWeight: 600,
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
                px: 3, py: 1.25, borderRadius: '10px',
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
                { icon: <FaGithub size={20} />, href: personalInfo.github, label: 'GitHub' },
                { icon: <FaLinkedin size={20} />, href: personalInfo.linkedin, label: 'LinkedIn' },
                { icon: <Mail size={20} />, href: `mailto:${personalInfo.email}`, label: 'Email' },
              ].map(({ icon, href, label }) => (
                <IconButton
                  key={label}
                  component="a" href={href} target="_blank" aria-label={label}
                  sx={{
                    color: 'rgba(255,255,255,0.6)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px', width: 40, height: 40,
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
 
        {/* Right — Sphere */}
        <Box sx={{ display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
          <HeroSphere />
        </Box>
      </Box>
 
      {/* About strip at bottom */}
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 3,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px', p: 2.5,
        backdropFilter: 'blur(10px)',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <Avatar
          src="https://lh3.googleusercontent.com/a/ACg8ocL8jX34L86_593Xw2-e1d8G6o4E1H1vY2vM0K6j2F6cR4v98A=s288-c-no"
          sx={{ width: 52, height: 52, border: '2px solid rgba(139,92,246,0.5)' }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 700, mb: 0.25 }}>About Me</Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, display: 'block' }}>
            {personalInfo.profileSummary.slice(0, 120)}...
          </Typography>
        </Box>
        <Stack direction="row" spacing={3} sx={{ flexShrink: 0, display: { xs: 'none', sm: 'flex' } }}>
          {[['1+', 'Years of Experience'], ['5+', 'Projects Completed'], ['10+', 'Technologies']].map(([val, label]) => (
            <Box key={label} sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 800, lineHeight: 1 }}>{val}</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>{label}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
