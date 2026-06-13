import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip } from '@mui/material';
import { useInView } from '../hooks/useInView';
import { Plus, GraduationCap, Calendar, Sparkles } from 'lucide-react';

function SectionLabel({ text }) {
  const len = text.length;
  const cutoff = len > 4 ? len - 2 : len - 1;
  const mainText = text.slice(0, cutoff);
  const highlightText = text.slice(cutoff);

  return (
    <Box sx={{ mb: 6 }}>
      <Typography
        variant="h4"
        className="section-title"
        sx={{ color: 'white', fontWeight: 700, fontSize: { xs: '1.6rem', md: '2rem' } }}
      >
        {mainText}
        <Box component="span" sx={{ color: 'primary.main' }}>
          {highlightText}
        </Box>
      </Typography>
    </Box>
  );
}

function AnimCard({ children, delay = 0 }) {
  const [ref, visible] = useInView();
  return (
    <Card ref={ref} sx={{
      height: '100%',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }}>
      {children}
    </Card>
  );
}

export default function EducationSection({ education }) {
  const [headerRef, headerVisible] = useInView();

  return (
    <Box id="education" sx={{ py: 10, px: { xs: 2, md: 4 }, maxWidth: '1200px', mx: 'auto' }}>
      <Box ref={headerRef} sx={{
        opacity: headerVisible ? 1 : 0, transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}>
        <SectionLabel text="Education" />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {education.map((edu, idx) => (
          <AnimCard key={idx} delay={idx * 100}>
            <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
                <Box sx={{
                  width: 52, height: 52, borderRadius: '14px', flexShrink: 0,
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(6,182,212,0.1) 100%)',
                  border: '1px solid rgba(139,92,246,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(139,92,246,0.15)',
                }}>
                  <GraduationCap size={26} color="#a78bfa" />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 1, fontSize: '1.1rem', letterSpacing: '0.5px' }}>
                    {edu.degree}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: 'secondary.main', mb: 1.5, fontWeight: 600, fontSize: '0.95rem' }}>
                    {edu.institution}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap' }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: 0.75, fontSize: '0.8rem' }}>
                      <Calendar size={13} color="rgba(255,255,255,0.45)" /> {edu.year}
                    </Typography>
                    <Chip 
                      label={edu.grade} 
                      size="small" 
                      sx={{ 
                        height: 22, 
                        fontSize: '0.75rem', 
                        background: 'rgba(6,182,212,0.1)', 
                        borderColor: 'rgba(6,182,212,0.25)', 
                        color: '#22d3ee', 
                        fontWeight: 600 
                      }} 
                      variant="outlined" 
                    />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </AnimCard>
        ))}
      </Box>
    </Box>
  );
}

