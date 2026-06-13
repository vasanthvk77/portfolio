import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { useInView } from '../hooks/useInView';
import { MapPin, Calendar, ChevronRight } from 'lucide-react';
import ThreeSphere from './ThreeSphere';

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

function ExperienceItem({ job, idx, isActive, innerRef }) {
  return (
    <Box
      ref={innerRef}
      sx={{
        display: 'flex',
        gap: { xs: 3, md: 5 },
        opacity: isActive ? 1 : 0.15,
        transform: isActive ? 'translateY(0)' : 'translateY(24px)',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        mb: 6,
        position: 'relative',
        zIndex: 2,
      }}
    >
      {/* Timeline dot column */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: '16px', position: 'relative', zIndex: 999 }}>
        <Box sx={{
          width: 16, height: 16, borderRadius: '50%', mt: '6px',
          background: isActive 
            ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)' 
            : 'rgba(255, 255, 255, 0.12)',
          border: isActive ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: isActive ? '0 0 12px rgba(139,92,246,0.8)' : 'none',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
          zIndex: 999,
        }} />
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, pb: 2 }}>
        {/* Date */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <Calendar size={13} color={isActive ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)"} style={{ transition: 'color 0.5s' }} />
          <Typography variant="caption" sx={{ color: isActive ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)', fontWeight: 500, transition: 'color 0.5s' }}>
            {job.date}
          </Typography>
        </Box>

        {/* Role */}
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 750, fontSize: { xs: '1.15rem', md: '1.35rem' }, mb: 1 }}>
          {job.role}
        </Typography>

        {/* Company + Location */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5, flexWrap: 'wrap' }}>
          <Chip
            label={job.company}
            size="small"
            sx={{
              background: isActive ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.03)',
              borderColor: isActive ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.08)',
              color: isActive ? 'primary.main' : 'rgba(255,255,255,0.3)',
              fontWeight: 600,
              fontSize: '0.8rem',
              transition: 'all 0.5s',
            }}
            variant="outlined"
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <MapPin size={12} color={isActive ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.2)"} style={{ transition: 'color 0.5s' }} />
            <Typography variant="caption" sx={{ color: isActive ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.2)', transition: 'color 0.5s' }}>{job.location}</Typography>
          </Box>
        </Box>

        {/* Description */}
        <Box component="ul" sx={{ pl: 0, m: 0, listStyle: 'none' }}>
          {job.description.map((point, i) => (
            <Box component="li" key={i} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'flex-start' }}>
              <ChevronRight size={14} color="#8b5cf6" style={{ marginTop: '4px', flexShrink: 0, opacity: isActive ? 0.8 : 0.2, transition: 'opacity 0.5s' }} />
              <Typography variant="body2" sx={{ color: isActive ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)', lineHeight: 1.7, fontSize: '0.9rem', transition: 'color 0.5s',textAlign:"justify" }}>
                {point}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default function ExperienceSection({ experience }) {
  const [headerRef, headerVisible] = useInView();
  const timelineRef = useRef(null);
  const itemRefs = useRef([]);
  const [activeIndexes, setActiveIndexes] = useState([0]);
  const [lineHeight, setLineHeight] = useState(0);
  const [trackHeight, setTrackHeight] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const activeRefs = itemRefs.current.filter(Boolean);
      if (!timelineRef.current || activeRefs.length === 0) return;

      const viewportHeight = window.innerHeight;
      const triggerY = viewportHeight * 0.65; // Trigger line is at 65% of viewport height

      const firstItem = activeRefs[0];
      const lastItem = activeRefs[activeRefs.length - 1];
      if (!firstItem || !lastItem) return;

      const firstRect = firstItem.getBoundingClientRect();
      const lastRect = lastItem.getBoundingClientRect();

      // Measure track from the first dot center (top + 14) to the bottom of the last item content
      const totalHeight = lastRect.bottom - (firstRect.top + 14);
      setTrackHeight(totalHeight);

      const progressLineHeight = Math.max(0, Math.min(totalHeight, triggerY - (firstRect.top + 14)));
      setLineHeight(progressLineHeight);

      // Determine which items are activated
      const newActiveIndexes = [0]; // First item is always active
      itemRefs.current.forEach((item, idx) => {
        if (idx === 0 || !item) return;
        const rect = item.getBoundingClientRect();
        const dotY = rect.top + 14; // Center of the current item's dot

        if (triggerY >= dotY) {
          newActiveIndexes.push(idx);
        }
      });

      setActiveIndexes(newActiveIndexes);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [experience]);

  return (
    <Box id="experience" sx={{ py: 10, px: { xs: 2, md: 4 }, maxWidth: '1200px', mx: 'auto' }}>
      <Box ref={headerRef} sx={{
        opacity: headerVisible ? 1 : 0, transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}>
        <SectionLabel text="Experience" />
      </Box>

      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'flex-start',
        gap: { xs: 6, md: 8 },
        position: 'relative',
      }}>
        {/* Left Side: Sticky 3D Model Sphere */}
        <Box sx={{
          width: { xs: '100%', md: 360 },
          maxWidth: { xs: 280, md: 360 },
          height: { xs: 280, md: 360 },
          flexShrink: { xs: 1, md: 0 },
          position: { xs: 'relative', md: 'sticky' },
          top: { xs: '20px', md: 'calc(50vh - 180px)' },
          zIndex: 2,
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

        {/* Right Side: Timeline Content */}
        <Box 
          ref={timelineRef}
          sx={{ 
            flex: 1, 
            width: '100%',
            position: 'relative',
          }}
        >
          {/* Background Track Line */}
          <Box sx={{
            position: 'absolute',
            left: '7px',
            top: '14px',
            height: `${trackHeight}px`,
            width: '2px',
            background: 'rgba(255, 255, 255, 0.05)',
            zIndex: 1,
          }} />

          {/* Traveling Progress Line */}
          <Box sx={{
            position: 'absolute',
            left: '7px',
            top: '14px',
            height: `${lineHeight}px`,
            width: '2px',
            background: 'linear-gradient(to bottom, #8b5cf6, #06b6d4)',
            boxShadow: '0 0 8px rgba(6, 182, 212, 0.4)',
            zIndex: 1,
          }} />

          {experience.map((job, idx) => (
            <ExperienceItem 
              key={idx} 
              job={job} 
              idx={idx} 
              isActive={activeIndexes.includes(idx)}
              innerRef={el => itemRefs.current[idx] = el}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
