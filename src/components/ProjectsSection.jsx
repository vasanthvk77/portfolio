import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Chip, IconButton, Dialog, DialogContent, DialogActions, Button, Grow, useTheme, useMediaQuery } from '@mui/material';
import { useInView } from '../hooks/useInView';
import { Plus, ChevronLeft, ChevronRight, X } from 'lucide-react';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} timeout={350} />;
});

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

function ProjectCard({ project, cardWidth, onCardClick }) {
  return (
    <Card
      onClick={onCardClick}
      sx={{
        width: cardWidth,
        height: 350,
        flexShrink: 0,
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '16px',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        boxShadow: 'none',
        cursor: 'pointer',
        '&:hover': {
          border: '1px solid rgba(139,92,246,0.3)',
          background: 'rgba(255, 255, 255, 0.04)',
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.3)',
        },
      }}
    >
      {/* Floating inner image with rounded corners */}
      <Box sx={{ borderRadius: '12px', overflow: 'hidden', height: 170, width: '100%', mb: 2.5 }}>
        <CardMedia
          component="img"
          image={project.image}
          alt={project.title}
          sx={{
            height: '100%',
            width: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            '&:hover': { transform: 'scale(1.05)' },
          }}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.style.background = 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.1))';
          }}
        />
      </Box>

      <CardContent sx={{ p: 0, flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', textAlign: 'center' }}>
        {/* Title */}
        <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.4 }}>
          {project.title}
        </Typography>

        {/* Tech tags */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 0.75, mt: 1.5 }}>
          {project.tech.map(t => (
            <Chip
              key={t}
              label={t}
              size="small"
              sx={{
                fontSize: '0.75rem',
                height: 24,
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.6)',
                px: 0.5,
              }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

export default function ProjectsSection({ projects }) {
  const [headerRef, headerVisible] = useInView();
  const theme = useTheme();

  const [selectedProject, setSelectedProject] = useState(null);
  const [activeProject, setActiveProject] = useState(null);

  // Responsive slider columns
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.down('md'));
  const isMd = useMediaQuery(theme.breakpoints.down('lg'));

  let visibleCards = 4;
  if (isXs) visibleCards = 1;
  else if (isSm) visibleCards = 2;
  else if (isMd) visibleCards = 3;

  const gap = 20; // gap in px
  const maxIndex = Math.max(0, projects.length - visibleCards);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };
  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  const cardWidth = `calc((100% - ${(visibleCards - 1) * gap}px) / ${visibleCards})`;

  return (
    <Box id="projects" sx={{ py: 10, px: { xs: 2, md: 4 }, maxWidth: '1200px', mx: 'auto', position: 'relative' }}>
      {/* Header */}
      <Box ref={headerRef} sx={{
        opacity: headerVisible ? 1 : 0, transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}>
        <SectionLabel text="Projects" />
      </Box>

      {/* Slider Wrapper container */}
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
        
        {/* Left Arrow Button */}
        <IconButton
          onClick={handlePrev}
          disabled={currentIndex === 0}
          sx={{
            position: 'absolute',
            left: { xs: -8, md: -24 },
            zIndex: 10,
            background: 'rgba(15, 15, 26, 0.8)',
            border: '1px solid rgba(255,255,255,0.06)',
            color: 'white',
            backdropFilter: 'blur(8px)',
            '&:hover': { background: 'rgba(139,92,246,0.2)' },
            '&.Mui-disabled': { color: 'rgba(255,255,255,0.15)', background: 'rgba(15,15,26,0.4)', borderColor: 'rgba(255,255,255,0.02)' },
          }}
        >
          <ChevronLeft size={20} />
        </IconButton>

        {/* Viewport container */}
        <Box sx={{ width: '100%', overflow: 'hidden', py: 1 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: `${gap}px`,
              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: `translateX(calc(-${currentIndex} * (${cardWidth} + ${gap}px)))`,
            }}
          >
            {projects.map((project, idx) => (
              <ProjectCard
                key={idx}
                project={project}
                cardWidth={cardWidth}
                onCardClick={() => {
                  setSelectedProject(project);
                  setActiveProject(project);
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Right Arrow Button */}
        <IconButton
          onClick={handleNext}
          disabled={currentIndex === maxIndex}
          sx={{
            position: 'absolute',
            right: { xs: -8, md: -24 },
            zIndex: 10,
            background: 'rgba(15, 15, 26, 0.8)',
            border: '1px solid rgba(255,255,255,0.06)',
            color: 'white',
            backdropFilter: 'blur(8px)',
            '&:hover': { background: 'rgba(139,92,246,0.2)' },
            '&.Mui-disabled': { color: 'rgba(255,255,255,0.15)', background: 'rgba(15,15,26,0.4)', borderColor: 'rgba(255,255,255,0.02)' },
          }}
        >
          <ChevronRight size={20} />
        </IconButton>
      </Box>

      {/* Project Details Popup Dialog */}
      <Dialog
        open={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
        TransitionComponent={Transition}
        TransitionProps={{
          onExited: () => setActiveProject(null)
        }}
        PaperProps={{
          sx: {
            background: '#0a0a14',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            maxWidth: '680px', // Enlarged popup size
            width: '90%',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
            p: 1.5,
          }
        }}
      >
        {activeProject && (
          <>
            {/* Header with Close button */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, pt: 2.5, pb: 1.5 }}>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, fontSize: { xs: '1.2rem', md: '1.4rem' } }}>
                {activeProject.title}
              </Typography>
              <IconButton onClick={() => setSelectedProject(null)} sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: 'white' } }}>
                <X size={18} />
              </IconButton>
            </Box>

            <DialogContent sx={{ px: 3, py: 1 }}>
              {/* Subtitle / Company */}
              <Typography variant="subtitle1" sx={{ color: 'primary.main', mb: 2.5, fontWeight: 600 }}>
                {activeProject.subtitle} &nbsp;·&nbsp; {activeProject.company}
              </Typography>

              {/* Description */}
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, mb: 4, fontSize: '0.95rem' }}>
                {activeProject.description}
              </Typography>

              {/* Tech tags */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, mb: 2 }}>
                {activeProject.tech.map(t => (
                  <Chip
                    key={t}
                    label={t}
                    size="medium"
                    sx={{
                      background: 'rgba(139,92,246,0.1)',
                      border: '1px solid rgba(139,92,246,0.25)',
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: '0.8rem',
                    }}
                  />
                ))}
              </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5, justifyContent: 'flex-end', gap: 1.5 }}>
              {/* GitHub Link Button (Gradient without Pink) */}
              <Button
                variant="contained"
                href={activeProject.github}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', // Purple to Cyan
                  color: 'white',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 3.5,
                  py: 1.25,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7c3aed, #0891b2)',
                    boxShadow: '0 0 15px rgba(139,92,246,0.4)',
                  }
                }}
              >
                View on GitHub
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
