import React, { useState } from 'react';
import { Box, Typography, Grid, TextField, Button, Stack } from '@mui/material';
import { useInView } from '../hooks/useInView';
import { Plus, Mail, Phone, MapPin, Send } from 'lucide-react';

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

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.03)',
    color: 'white',
    fontSize: '0.9rem',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
    '&:hover fieldset': { borderColor: 'rgba(139,92,246,0.4)' },
    '&.Mui-focused fieldset': { borderColor: '#8b5cf6' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#8b5cf6' },
};

const SUCCESS_MESSAGE_DURATION = 5000; // time in ms to display success feedback

export default function ContactSection({ personalInfo }) {
  const [leftRef, leftVisible] = useInView();
  const [rightRef, rightVisible] = useInView();

  // State management for form inputs & errors
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });

  const contactItems = [
    { icon: <Mail size={18} />, label: personalInfo.email, href: `mailto:${personalInfo.email}` },
    { icon: <Phone size={18} />, label: `+91 ${personalInfo.phone}`, href: `tel:+91${personalInfo.phone}` },
    { icon: <MapPin size={18} />, label: 'Tiruppur, Tamil Nadu', href: null },
  ];

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: '' }));
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: '' }));
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    if (errors.message) {
      setErrors((prev) => ({ ...prev, message: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Dynamic field validation
    const newErrors = { name: '', email: '', message: '' };
    let hasError = false;

    if (!name.trim()) {
      newErrors.name = 'Name is required.';
      hasError = true;
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required.';
      hasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
        hasError = true;
      }
    }

    if (!message.trim()) {
      newErrors.message = 'Message is required.';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setErrors({ name: '', email: '', message: '' });
    setIsSending(true);
    setStatus({ type: '', text: '' });

    try {
      const response = await fetch('/api/send-email.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: `Portfolio Contact from ${name.trim()}`,
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setStatus({ type: 'success', text: 'Thank you! Your message has been sent.' });
        setName('');
        setEmail('');
        setMessage('');

        // Clear success message after 5 seconds
        setTimeout(() => {
          setStatus((prev) => prev.type === 'success' ? { type: '', text: '' } : prev);
        }, SUCCESS_MESSAGE_DURATION);
      } else {
        setStatus({ type: 'error', text: data.message || 'Something went wrong. Please try again.' });
      }
    } catch (error) {
      setStatus({ type: 'error', text: 'Failed to connect. Please check your network and try again.' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Box id="contact" sx={{ py: 10, px: { xs: 2, md: 4 }, maxWidth: '1200px', mx: 'auto' }}>
      <Box sx={{ opacity: 1 }}>
        <SectionLabel text="Get In Touch" />
      </Box>

      <Grid container spacing={{ xs: 2, md: 6 }} alignItems="flex-start">
        {/* Left — contact info */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box
            ref={leftRef}
            sx={{
              opacity: leftVisible ? 1 : 0,
              transform: leftVisible ? 'translateX(0)' : 'translateX(-30px)',
              transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, mb: 4, fontSize: '0.95rem',textAlign:'justify' }}>
              I'm available for freelance projects, technical consultations, and collaborations. Whether you need a web application, mobile app, backend solution, or simply want to connect, feel free to get in touch.

            </Typography>

            <Stack spacing={2.5}>
              {contactItems.map(({ icon, label, href }) => (
                <Box
                  key={label}
                  component={href ? 'a' : 'div'}
                  href={href || undefined}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 2,
                    color: 'rgba(255,255,255,0.6)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    '&:hover': href ? { color: 'primary.main' } : {},
                  }}
                >
                  <Box sx={{
                    width: 40, height: 40, borderRadius: '10px',
                    background: 'rgba(139,92,246,0.1)',
                    border: '1px solid rgba(139,92,246,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'primary.main', flexShrink: 0,
                  }}>
                    {icon}
                  </Box>
                  <Typography variant="body2" sx={{ color: 'inherit', fontWeight: 500 }}>
                    {label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Grid>

        {/* Right — form */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box
            ref={rightRef}
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              opacity: rightVisible ? 1 : 0,
              transform: rightVisible ? 'translateX(0)' : 'translateX(30px)',
              transition: 'opacity 0.7s ease 0.1s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s',
            }}
          >
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Your Name"
                  variant="outlined"
                  value={name}
                  onChange={handleNameChange}
                  disabled={isSending}
                  error={!!errors.name}
                  helperText={errors.name}
                  sx={inputSx}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Your Email"
                  type="email"
                  variant="outlined"
                  value={email}
                  onChange={handleEmailChange}
                  disabled={isSending}
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={inputSx}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Your Message"
                  multiline
                  rows={5}
                  variant="outlined"
                  value={message}
                  onChange={handleMessageChange}
                  disabled={isSending}
                  error={!!errors.message}
                  helperText={errors.message}
                  sx={inputSx}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isSending}
                  endIcon={<Send size={16} />}
                  sx={{
                    background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                    color: 'white', py: 1.5, borderRadius: '10px', fontWeight: 700, fontSize: '1rem',
                    '&:hover': { opacity: 0.9, transform: 'translateY(-1px)' },
                    transition: 'all 0.2s',
                  }}
                >
                  {isSending ? 'Sending...' : 'Send Message'}
                </Button>
              </Grid>
              {status.text && (
                <Grid size={{ xs: 12 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: status.type === 'success' ? '#22d3ee' : '#f87171',
                      textAlign: 'center',
                      fontWeight: 600,
                      mt: 1,
                    }}
                  >
                    {status.text}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
