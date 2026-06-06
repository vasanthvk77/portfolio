import React from 'react';
import { ThemeProvider, CssBaseline, Box, Typography, Divider } from '@mui/material';
import theme from './theme';
import { portfolioData } from './data';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import SkillsSection from './components/SkillsSection';
import ExperienceSection from './components/ExperienceSection';
import ProjectsSection from './components/ProjectsSection';
import EducationSection from './components/EducationSection';
import CertificationsSection from './components/CertificationsSection';
import ContactSection from './components/ContactSection';

const { personalInfo, skills, experience, projects, education, certifications } = portfolioData;

const sectionDivider = (
  <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, md: 4 } }}>
    <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
  </Box>
);

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ background: '#08080f', minHeight: '100vh', position: 'relative' }}>
        {/* Ambient background blobs */}
        <Box sx={{
          position: 'fixed', top: '15%', left: '-5%', width: 400, height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }} />
        <Box sx={{
          position: 'fixed', bottom: '20%', right: '-5%', width: 500, height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Navbar name={personalInfo.name} />
          <HeroSection personalInfo={personalInfo} />
          {sectionDivider}
          <SkillsSection skills={skills} />
          {sectionDivider}
          <ExperienceSection experience={experience} />
          {sectionDivider}
          <ProjectsSection projects={projects} />
          {sectionDivider}
           <CertificationsSection certifications={certifications} />
          {sectionDivider}
          <EducationSection
            education={education}
          />
          {sectionDivider}
       
          <ContactSection personalInfo={personalInfo} />

          {/* Footer */}
          <Box sx={{
            borderTop: '1px solid rgba(255,255,255,0.05)',
            py: 4, px: { xs: 2, md: 4 },
            maxWidth: '1200px', mx: 'auto',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
          }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>
              Developed & Built by {personalInfo.name}
            </Typography>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}