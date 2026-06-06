import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, useTheme, useMediaQuery } from '@mui/material';
import { useInView } from '../hooks/useInView';
import { FaPython, FaReact, FaGitAlt, FaDocker, FaHtml5, FaCss3Alt, FaBootstrap, FaNodeJs } from 'react-icons/fa';
import { SiFastapi, SiFlask, SiMongodb, SiMysql, SiPostgresql, SiFlutter, SiJsonwebtokens } from 'react-icons/si';

const ICON_MAP = {
  Python: { icon: <FaPython />, color: '#3776ab' },
  Flask: { icon: <SiFlask />, color: '#ffffff' },
  FastAPI: { icon: <SiFastapi />, color: '#009688' },
  MySQL: { icon: <SiMysql />, color: '#4479a1' },
  PostgreSQL: { icon: <SiPostgresql />, color: '#336791' },
  MongoDB: { icon: <SiMongodb />, color: '#47a248' },
  React: { icon: <FaReact />, color: '#61dafb' },
  HTML: { icon: <FaHtml5 />, color: '#e34f26' },
  CSS: { icon: <FaCss3Alt />, color: '#1572b6' },
  Bootstrap: { icon: <FaBootstrap />, color: '#7952b3' },
  Git: { icon: <FaGitAlt />, color: '#f05032' },
  Docker: { icon: <FaDocker />, color: '#2496ed' },
  'Node.js': { icon: <FaNodeJs />, color: '#339933' },
  Flutter: { icon: <SiFlutter />, color: '#02569b' },
  JSON: { icon: <SiJsonwebtokens />, color: '#f7df1e' },
};

function SectionLabel({ text }) {
  const len = text.length;
  const cutoff = len > 4 ? len - 2 : len - 1;
  const mainText = text.slice(0, cutoff);
  const highlightText = text.slice(cutoff);

  return (
    <Box sx={{ mb: 4 }}>
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

function SkillItem({ name }) {
  const meta = ICON_MAP[name];
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.25,
      p: 1.25,
      borderRadius: '10px',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      minWidth: 0,
      '&:hover': {
        background: 'rgba(139,92,246,0.08)',
        border: '1px solid rgba(139,92,246,0.3)',
        transform: 'translateY(-2px)',
      },
    }}>
      {meta ? (
        <Box sx={{ fontSize: '1.8rem', color: meta.color, display: 'flex', flexShrink: 0 }}>
          {meta.icon}
        </Box>
      ) : (
        <Box sx={{
          width: 32, height: 32, borderRadius: '6px',
          background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Typography sx={{ color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>
            {name.slice(0, 2).toUpperCase()}
          </Typography>
        </Box>
      )}
      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', fontWeight: 600, wordBreak: 'break-word', minWidth: 0 }}>
        {name}
      </Typography>
    </Box>
  );
}

export default function SkillsSection({ skills }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const containerRef = useRef(null);
  const maskPathRef = useRef(null);
  const [headerRef, headerVisible] = useInView();

  const categories = Object.entries(skills);

  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      if (!containerRef.current || !maskPathRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate top and height of the SVG drawing zone (offset by 220px padding)
      const svgTop = rect.top + 220;
      const svgHeight = rect.height - 440;
      
      // Progress is tracked pixel-for-pixel relative to the SVG top and bottom
      const centerOffset = (viewportHeight * 0.5) - svgTop;
      let progress = centerOffset / svgHeight;
      progress = Math.max(0, Math.min(1, progress));

      // Update mask stroke-dashoffset to draw the line in
      const pathLength = maskPathRef.current.getTotalLength();
      maskPathRef.current.style.strokeDasharray = pathLength;
      maskPathRef.current.style.strokeDashoffset = pathLength * (1 - progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    
    // Initial trigger
    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isMobile]);

  return (
    <Box
      id="skills"
      ref={containerRef}
      sx={{
        position: 'relative',
        py: 12,
        overflow: 'hidden',
        background: '#040408',
      }}
    >
      {/* Title */}
      <Box
        ref={headerRef}
        sx={{
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
          width: '100%',
          maxWidth: '1100px',
          mx: 'auto',
          px: { xs: 3, md: 4 },
          mb: 8,
        }}
      >
        <SectionLabel text="Technical Skills" />
      </Box>

      {/* SVG Dotted Curved Connection Line (Desktop Only) */}
      {!isMobile && (
        <svg
          style={{
            position: 'absolute',
            top: '220px',
            bottom: '220px',
            left: 0,
            width: '100%',
            height: 'calc(100% - 440px)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <mask id="skills-path-mask">
              <path
                ref={maskPathRef}
                d="M 25 4 C 25 14, 75 14, 75 24 C 75 34, 25 34, 25 44 C 25 54, 75 54, 75 64 C 75 74, 25 74, 25 84 C 25 94, 25 94, 25 96"
                stroke="white"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            </mask>
          </defs>
          
          {/* Faded Background Guideline */}
          <path
            d="M 25 4 C 25 14, 75 14, 75 24 C 75 34, 25 34, 25 44 C 25 54, 75 54, 75 64 C 75 74, 25 74, 25 84 C 25 94, 25 94, 25 96"
            stroke="rgba(139,92,246,0.1)"
            strokeWidth="2"
            strokeDasharray="6,6"
            fill="none"
          />
          
          {/* Active Animated Dotted Path */}
          <path
            d="M 25 4 C 25 14, 75 14, 75 24 C 75 34, 25 34, 25 44 C 25 54, 75 54, 75 64 C 75 74, 25 74, 25 84 C 25 94, 25 94, 25 96"
            stroke="#8b5cf6"
            strokeWidth="2.5"
            strokeDasharray="6,6"
            mask="url(#skills-path-mask)"
            fill="none"
          />
        </svg>
      )}

      {/* Grid Rows Wrapper */}
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', position: 'relative' }}>
        {categories.map(([category, skillList], idx) => {
          const isLeft = idx % 2 === 0;
          return (
            <Box
              key={category}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: isLeft ? 'row' : 'row-reverse' },
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                width: '100%',
                maxWidth: '1100px',
                mx: 'auto',
                px: { xs: 3, md: 4 },
                mb: { xs: 10, md: 18 },
                '&:last-child': { mb: 0 },
              }}
            >
              {/* Skill Card Column (takes 50% width on desktop) */}
              <Box
                sx={{
                  width: { xs: '100%', md: '50%' },
                  display: 'flex',
                  justifyContent: { xs: 'center', md: isLeft ? 'flex-start' : 'flex-end' },
                  zIndex: 2,
                }}
              >
                <Card
                  sx={{
                    width: '100%',
                    maxWidth: 460,
                    height: 340,
                    background: 'rgba(255, 255, 255, 0.02)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '20px',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      border: '1px solid rgba(139,92,246,0.3)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      boxShadow: '0 16px 40px 0 rgba(139, 92, 246, 0.15)',
                    },
                  }}
                >
                  {/* Accent Strip */}
                  <Box sx={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                    background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)',
                  }} />

                  <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: 'primary.main',
                        mb: 2.5,
                        fontWeight: 700,
                        fontSize: '1.05rem',
                        textTransform: 'uppercase',
                        letterSpacing: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#06b6d4' }} />
                      {category}
                    </Typography>

                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 1.5,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        flex: 1,
                        pr: 0.5,
                        '&::-webkit-scrollbar': { width: '4px' },
                        '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.1)', borderRadius: '2px' },
                      }}
                    >
                      {skillList.map(skill => (
                        <SkillItem key={skill} name={skill} />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {/* Space Filler Column (takes 50% width on desktop, hidden on mobile) */}
              <Box
                sx={{
                  width: { xs: '100%', md: '50%' },
                  display: { xs: 'none', md: 'block' },
                  zIndex: 2,
                }}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
