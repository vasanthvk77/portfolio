import React, { useRef, useEffect } from 'react';
import { Box, Typography, Card, CardContent, useTheme, useMediaQuery } from '@mui/material';
import { useInView } from '../hooks/useInView';
import { FaCertificate, FaLaptopCode, FaCode, FaAward } from 'react-icons/fa';
import ThreeSphere from './ThreeSphere';

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

// Map certifications to beautiful theme icons
const ICON_MAP = {
  0: { icon: <FaCode />, color: '#06b6d4' },
  1: { icon: <FaLaptopCode />, color: '#8b5cf6' },
  2: { icon: <FaCertificate />, color: '#ec4899' },
  3: { icon: <FaAward />, color: '#f59e0b' },
};

export default function CertificationsSection({ certifications }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const runwayRef = useRef(null);
  const trackRef = useRef(null);
  const [headerRef, headerVisible] = useInView();

  useEffect(() => {
    const handleScroll = () => {
      if (!runwayRef.current || !trackRef.current || isMobile) return;

      const runwayRect = runwayRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalScrollable = runwayRect.height - viewportHeight;
      if (totalScrollable <= 0) return;

      const currentScroll = -runwayRect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));

      // Compute max translation for the cards track to slide left
      const trackWidth = trackRef.current.scrollWidth;
      const visibleWidth = trackRef.current.parentElement.clientWidth;
      const maxScroll = Math.max(0, trackWidth - visibleWidth);
      const xOffset = -progress * maxScroll;

      // Directly update the style transform for instant scroll synchronization
      trackRef.current.style.transform = `translateX(${xOffset}px)`;
    };

    if (!isMobile) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleScroll);
      handleScroll();
    } else {
      if (trackRef.current) {
        trackRef.current.style.transform = 'none';
      }
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isMobile]);

  return (
    <Box
      id="certifications"
      ref={runwayRef}
      sx={{
        position: 'relative',
        height: { xs: 'auto', md: '160vh' },
        py: { xs: 8, md: 4 },
        px: { xs: 2, md: 4 },
        maxWidth: '1200px',
        mx: 'auto',
      }}
    >
      {/* Container wrapper: behaves normally on mobile, sticky on desktop */}
      <Box sx={{
        position: { xs: 'relative', md: 'sticky' },
        top: { xs: 0, md: '15vh' },
        height: { xs: 'auto', md: '70vh' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        {/* Title */}
        <Box
          ref={headerRef}
          sx={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
            mb: 4,
          }}
        >
          <SectionLabel text="Certifications" />
        </Box>

        {/* Content Area */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', md: 'row' },
          alignItems: 'center',
          gap: { xs: 5, md: 3.5 },
          width: '100%',
        }}>
          {/* Cards Container: normal vertical stack/grid on mobile, slide viewport on desktop */}
          <Box sx={{
            width: { xs: '100%', md: 'calc(100% - 320px)' },
            overflow: { xs: 'visible', md: 'hidden' },
            flexShrink: 0,
            py: 2,
            maskImage: { xs: 'none', md: 'linear-gradient(to right, transparent, #000 30px, #000 calc(100% - 80px), transparent 100%)' },
            WebkitMaskImage: { xs: 'none', md: 'linear-gradient(to right, transparent, #000 30px, #000 calc(100% - 80px), transparent 100%)' },
          }}>
            <Box
              ref={trackRef}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row', md: 'row' },
                flexWrap: { xs: 'nowrap', sm: 'wrap', md: 'nowrap' },
                justifyContent: 'center',
                gap: 2.5,
                width: { xs: '100%', md: 'max-content' },
              }}
            >
              {certifications.map((cert, idx) => {
                const meta = ICON_MAP[idx] || ICON_MAP[0];
                return (
                  <Card
                    key={idx}
                    sx={{
                      width: { xs: '100%', sm: 'calc(50% - 12px)', md: 280 },
                      height: 190,
                      flexShrink: 0,
                      background: 'rgba(255, 255, 255, 0.03)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        border: '1px solid rgba(139,92,246,0.3)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        boxShadow: '0 12px 40px 0 rgba(139, 92, 246, 0.15)',
                      },
                    }}
                  >
                    {/* Top gradient strip */}
                    <Box sx={{
                      position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                      background: `linear-gradient(90deg, ${meta.color}, transparent)`,
                    }} />

                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{
                        width: 44, height: 44, borderRadius: '12px', mb: 2,
                        background: `${meta.color}15`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: meta.color, fontSize: '1.4rem'
                      }}>
                        {meta.icon}
                      </Box>
                      <Typography variant="body1" sx={{ color: 'white', fontWeight: 600, mb: 0.5, lineHeight: 1.3 }}>
                        {cert.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
                        {cert.issuer}
                      </Typography>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </Box>

          {/* Right Side: Stationary 3D Model Sphere */}
          <Box sx={{
            width: { xs: '100%', md: 280 },
            maxWidth: { xs: 240, md: 280 },
            height: { xs: 280, md: 280 },
            flexShrink: 0,
            position: 'relative',
            mx: { xs: 'auto', md: 0 },
          }}>
            {/* Glowing background halo */}
            <Box sx={{
              position: 'absolute',
              inset: 20,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
              filter: 'blur(20px)',
              pointerEvents: 'none',
            }} />
            <ThreeSphere />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

