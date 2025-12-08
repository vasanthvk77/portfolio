
// import React, { useState, useEffect, useRef } from 'react';
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Container,
//   Grid,
//   Card,
//   CardContent,
//   CardActions,
//   Button,
//   Chip,
//   Box,
//   IconButton,
//   Link as MuiLink,
//   ThemeProvider,
//   createTheme,
//   CssBaseline,
//   Avatar,
//   Drawer,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   useMediaQuery,
// } from '@mui/material';
// import {
//   LinkedIn,
//   GitHub,
//   Email,
//   School,
//   Work,
//   Code,
//   AccountCircle,
//   Menu as MenuIcon,
//   Download,
//   Send,
//   ArrowForward,
//   CheckCircle as CheckCircleIcon,
//   Close as CloseIcon,
// } from '@mui/icons-material';

// // A professional theme with a dark blue and white color palette.
// const darkBlueTheme = createTheme({
//   palette: {
//     mode: 'dark',
//     primary: {
//       main: '#90caf9', // Lighter Blue for text and primary accents
//     },
//     secondary: {
//       main: '#42a5f5', // A friendly blue for secondary accents
//     },
//     background: {
//       default: '#0d47a1', // Deep, dark blue for the main background
//       paper: 'rgba(13, 71, 161, 0.7)', 
//       purple:'#747BFF'// Semi-transparent dark blue for cards
//     },
//     text: {
//       primary: '#ffffff',
//       secondary: '#e0e0e0',
//     },
//   },
//   typography: {
//     fontFamily: "'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif",
//     h1: { fontWeight: 700, fontSize: '4rem' },
//     h2: { fontWeight: 700, fontSize: '3.5rem' },
//     h3: { fontWeight: 600, fontSize: '2.8rem' },
//     h4: { fontWeight: 600, fontSize: '2.2rem' },
//     h5: { fontWeight: 600, fontSize: '1.5rem' },
//     h6: { fontWeight: 500, fontSize: '1.2rem' },
//   },
//   components: {
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           borderRadius: '16px',
//           transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
//           border: '1px solid rgba(255, 255, 255, 0.2)',
//           boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
//           backdropFilter: 'blur(10px)',
//           '&:hover': {
//             transform: 'translateY(-10px)',
//             boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
//           },
//         },
//       },
//     },
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: '12px',
//           textTransform: 'none',
//           fontWeight: 'bold',
//           padding: '10px 24px',
//           fontSize: '1rem',
//         },
//       },
//     },
//   },
// });

// // --- Data (Remains the same) ---
// const portfolioData = {
//   personalInfo: {
//     name: 'Vasanthakumar B',
//     title: 'Full Stack Developer',
//     email: 'vasanth2004vk@gmail.com',
//     linkedin: 'https://linkedin.com/in/vasantha-kumar-b-6a9102293/',
//     github: 'https://github.com/vasanthvk77',
//     profileSummary: `Computer Science Engineer with experience as a Trainee Full Stack Developer. Skilled in developing web applications using React, Python Flask, Node.js, and SQL, with a solid foundation in programming and data structures. Familiar with all phases of the software development life cycle, particularly Agile practices. Demonstrates strong problem-solving skills and the ability to translate business requirements into functional, efficient software solutions.`
//   },
//   skills: {
//     'Languages & Libraries': ['Java', 'C', 'Python', 'JavaScript', 'JSON'],
//     'Web & App Development': ['React', 'Flutter', 'Flask','Fast API', 'Node.js', 'Express.js'],
//     'Frontend Technologies': ['HTML', 'CSS', 'Bootstrap'],
//     'Databases': ['MongoDB', 'SQL'],
//     'Tools & Platforms': ['Git', 'Railway', 'FlutLab', 'VS Code', 'Microsoft Office'],
//   },
//   experience: [
//     {
//       role: 'Trainee - Full Stack Development',
//       company: 'Cygnus Software',
//       date: 'June 2025 - Present',
//       location: 'Coimbatore, Tamil Nadu',
//       description: [
//         'Developed web application solutions using modern frameworks and languages including React, Python Flask, JavaScript, and SQL.',
//         'Built and maintained responsive user interfaces and implemented secure backend services.',
//         'Utilized SQL for data extraction, transformation, and management to support web applications.',
//         'Engaged in code reviews, debugging, and deployment activities in an Agile environment.',
//       ],
//     },
//   ],
//   projects: [
//     {
//       title: 'ATM Transaction Web Application',
//       tech: ['React', 'Python Flask', 'SQL'],
//       description: 'Developed a web application simulating ATM operations, including login, balance checking, deposits, withdrawals, and transaction history.',
//     },
//     {
//       title: 'ADA Checker Web Application',
//       tech: ['React', 'Python Flask', 'JavaScript'],
//       description: 'Created a web tool to analyze websites for ADA/WCAG accessibility violations, generating user-friendly reports.',
//     },
//     {
//       title: 'Stock Maintenance System',
//       tech: ['Flutter', 'Node.js', 'MongoDB'],
//       description: 'Managed product stock data across rooms with CRUD operations and role-based admin controls.',
//     },
//      {
//       title: 'Automobile Website',
//       tech: ['HTML', 'CSS', 'JavaScript', 'Bootstrap'],
//       description: 'Developed a responsive automobile website showcasing vehicle details and booking functionality.',
//     },
//   ],
//   education: [
//     {
//         degree: 'B.E. - Computer Science and Engineering',
//         institution: 'RVS College of Engineering & Technology',
//         year: '2021-2025',
//         grade: 'CGPA: 7.9',
//     },
//     {
//         degree: 'HSC - State Board',
//         institution: 'RC Town Higher Secondary School',
//         year: '2019-2021',
//         grade: '83%',
//     },
//   ],
//   certifications: [
//     'Programming in Java - Elysium (Internship Certificate)',
//     'Web Development - EZIO Skill Academy',
//     'Web Development - ICT Academy (Virtual)',
//     'Programming in Java - NPTEL (65%)',
//   ],
// };


// // --- Reusable Components & Hooks ---

// const pdfDownload=()=>{
//   const link = document.createElement('a');
//   link.href='/files/Resume.pdf';
//   link.download='Resume.pdf';
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);

// }

// const CodeRain = () => {
//     const canvasRef = useRef(null);

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         if (!canvas) return;
//         const ctx = canvas.getContext('2d');
//         let animationFrameId;
//         let drops = [];
//         let columns = 0;

//         const words = ['React', 'Node', 'SQL', 'Java', 'CSS', 'HTML', 'API', 'MUI', 'const', 'let', 'var', '() => {}', 'import', 'export', 'JSON', 'Grid', 'Box', 'Git'];
//         const fontSize = 16;

//         const setupRain = () => {
//             canvas.width = canvas.clientWidth;
//             canvas.height = canvas.clientHeight;
//             columns = Math.floor(canvas.width / fontSize);
//             drops = [];
//             for (let i = 0; i < columns; i++) {
//                 drops[i] = {
//                     y: Math.random() * canvas.height,
//                     text: words[Math.floor(Math.random() * words.length)],
//                     speed: Math.random() * 3+ 1,
//                     rotation: 0,
//                 };
//             }
//         };

//         setupRain();

//         const draw = () => {
//             ctx.fillStyle = 'rgba(13, 71, 161, 0.15)'; // Increased opacity to make trails fade faster
//             ctx.fillRect(0, 0, canvas.width, canvas.height);
            
//             ctx.fillStyle = '#90caf9';
//             ctx.font = `${fontSize}px monospace`;

//             for (let i = 0; i < drops.length; i++) {
//                 const drop = drops[i];
//                 const text = drop.text;
                
//                 ctx.save();
//                 ctx.translate(i * fontSize, drop.y);
//                 ctx.rotate(drop.rotation);
//                 ctx.fillText(text, 0, 0);
//                 ctx.restore();

//                 drop.y += drop.speed;
//                 drop.rotation += 0.02;

//                 if (drop.y > canvas.height && Math.random() > 0.95) {
//                     drops[i].y = 0;
//                     drops[i].text = words[Math.floor(Math.random() * words.length)];
//                     drops[i].speed = Math.random() * 3 + 1;
//                     drops[i].rotation = 0;
//                 }
//             }
//             animationFrameId = window.requestAnimationFrame(draw);
//         };

//         draw();

//         window.addEventListener('resize', setupRain);

//         return () => {
//             window.cancelAnimationFrame(animationFrameId);
//             window.removeEventListener('resize', setupRain);
//         };
//     }, []);

//     return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1, width: '100vw', height: '100vh' }} />;
// };


// const SectionHeader = ({ icon, title }) => (
//   <Box display="flex" alignItems="center" mb={6} justifyContent="center">
//     {React.cloneElement(icon, { sx: { fontSize: { xs: 36, md: 48 }, color: 'primary.main', mr: 2 } })}
//     <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
//       {title}
//     </Typography>
//   </Box>
// );

// const useIntersectionObserver = (options) => {
//     const [entry, setEntry] = useState(null);
//     const [node, setNode] = useState(null);
//     const observer = useRef(null);

//     useEffect(() => {
//         if (observer.current) observer.current.disconnect();
//         observer.current = new window.IntersectionObserver(([entry]) => setEntry(entry), options);
//         const { current: currentObserver } = observer;
//         if (node) currentObserver.observe(node);
//         return () => currentObserver.disconnect();
//     }, [node, options]);

//     return [setNode, entry];
// };

// const AnimatedBox = ({ children, ...props }) => {
//     const [ref, entry] = useIntersectionObserver({ threshold: 0.1 });
//     const isVisible = entry?.isIntersecting;

//     return (
//         <Box
//             ref={ref}
//             sx={{
//                 transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
//                 opacity: isVisible ? 1 : 0,
//                 transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
//             }}
//             {...props}
//         >
//             {children}
//         </Box>
//     );
// };


// // --- Main Application Component ---
// function App() {
//   const { personalInfo, skills, experience, projects, education, certifications } = portfolioData;
//   const isMobile = useMediaQuery(darkBlueTheme.breakpoints.down('md'));
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 10);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

//   const navLinks = [
//     { text: 'About', href: '#about', icon: <AccountCircle /> },
//     { text: 'Skills', href: '#skills', icon: <Code /> },
//     { text: 'Experience', href: '#experience', icon: <Work /> },
//     { text: 'Projects', href: '#projects', icon: <Code /> },
//     { text: 'Education', href: '#education', icon: <School /> },
//     { text: 'Contact', href: '#contact', icon: <Email /> },
//   ];

//   const drawer = (
//     <Box sx={{ textAlign: 'center', width: 250 }} role="presentation">
//         <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2}}>
//             <Typography variant="h6">Menu</Typography>
//             <IconButton onClick={handleDrawerToggle}>
//                 <CloseIcon />
//             </IconButton>
//         </Box>
//       <List>
//         {navLinks.map((item) => (
//           <ListItem key={item.text} disablePadding>
//             <ListItemButton component="a" href={item.href} onClick={handleDrawerToggle}>
//               <ListItemIcon sx={{color: 'primary.main'}}>{item.icon}</ListItemIcon>
//               <ListItemText primary={item.text} />
//             </ListItemButton>
//           </ListItem>
//         ))}
//       </List>
//     </Box>
//   );

//   return (
//     <ThemeProvider theme={darkBlueTheme}>
//       <CssBaseline />
//       <CodeRain />
//       <style>
//         {`
//           @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
//           html { scroll-behavior: smooth; }
//           body { background-color: transparent; }
//         `}
//       </style>

//       <AppBar
//         position="sticky"
//         elevation={scrolled ? 3 : 0}
//         sx={{
//           backgroundColor: scrolled ? 'rgba(13, 71, 161, 0.7)' : 'transparent',
//           backdropFilter: scrolled ? 'blur(10px)' : 'none',
//           transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
//           boxShadow: 'none',
//         }}
//       >
//         <Toolbar>
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'text.primary' }}>
//             {personalInfo.name}
//           </Typography>
//           {isMobile ? (
//             <IconButton color="primary" aria-label="open drawer" edge="start" onClick={handleDrawerToggle}>
//               <MenuIcon />
//             </IconButton>
//           ) : (
//             <Box>
//               {navLinks.map(item => (
//                 <Button key={item.text} color="text.primary" href={item.href} sx={{ fontWeight: 'bold','&:hover': {
//       backgroundColor: 'primary.light',
//       color: 'background.default',
//     }}}>
//                   {item.text}
//                 </Button>
//               ))}
//             </Box>
//           )}
//         </Toolbar>
//       </AppBar>

//       <nav>
//         <Drawer variant="temporary" open={drawerOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} anchor="right">
//           {drawer}
//         </Drawer>
//       </nav>

//       <main>
//         {/* --- Hero Section --- */}
//         <Box id="home" sx={{ 
//             display: 'flex', 
//             alignItems: 'center', 
//             justifyContent: 'center', 
//             minHeight: '100vh', 
//             textAlign: 'center', 
//             p: { xs: 2, sm: 4 },
//             backgroundColor: 'transparent',
//         }}>
//             <Container maxWidth="lg">
//                 <Typography variant="h2" component="h1" gutterBottom sx={{fontSize: {xs: '2.5rem', sm: '3.5rem'}}}>
//                 Hello, I'm {personalInfo.name}
//                 </Typography>
//                 <Typography variant="h5" color="text.secondary" gutterBottom sx={{ mb: 4, maxWidth: '700px', mx: 'auto', fontSize: {xs: '1.2rem', sm: '1.5rem'} }}>
//                 A passionate Full Stack Developer creating modern and responsive web applications.
//                 </Typography>
//                 <Button variant="contained" size="large" color="secondary" href="#about" endIcon={<ArrowForward />} sx={{'&:hover':{backgroundColor: 'background.purple',color: 'white'},color:'text.primary'}}>
//                     Learn More About Me
//                 </Button>
//             </Container>
//         </Box>

//         <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
//         {/* --- About Me Section --- */}
//         <AnimatedBox id="about" py={8}>
//             <Card>
//                 <CardContent sx={{p: {xs: 2, md: 5}}}>
//                     <Grid container spacing={4} alignItems="center">
//                         <Grid item xs={12} md={5}>
//                             <Avatar alt={personalInfo.name} src="http://googleusercontent.com/file_content/1" sx={{ width: '100%', height: 'auto', maxWidth: {xs: '250px', md: '350px'}, margin: '0 auto', border: '8px solid white', boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }} />
//                         </Grid>
//                         <Grid item xs={12} md={7}>
//                             <Typography variant="h3" component="h2" gutterBottom sx={{fontSize: {xs: '2rem', sm: '2.8rem'}}}>About Me</Typography>
//                             <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.2rem', mb: 3, textAlign: 'justify' }}>
//                             {personalInfo.profileSummary}
//                             </Typography>
//                             <Box>
//                             <Button variant="contained" color="secondary" startIcon={<Download />} sx={{ mr: 2,color:"white",'&:hover':{backgroundColor: 'background.purple',color: 'white'} }} onClick={pdfDownload}>
//                                 Download CV
//                             </Button>
//                             <IconButton color="primary" component={MuiLink} href={personalInfo.github} target="_blank" aria-label="GitHub"><GitHub sx={{ fontSize: '2.5rem' }} /></IconButton>
//                             <IconButton color="primary" component={MuiLink} href={personalInfo.linkedin} target="_blank" aria-label="LinkedIn"><LinkedIn sx={{ fontSize: '2.5rem' }} /></IconButton>
//                             <IconButton color="primary" component={MuiLink} href={`mailto:${personalInfo.email}`} aria-label="Email"><Email sx={{ fontSize: '2.5rem' }} /></IconButton>
//                             </Box>
//                         </Grid>
//                     </Grid>
//                 </CardContent>
//             </Card>
//         </AnimatedBox>

//         <AnimatedBox id="skills" py={12}>
//             <SectionHeader icon={<Code />} title="Technical Skills" />
//             {Object.entries(skills).map(([category, skillList]) => (
//             <Box key={category} mb={5} sx={{ textAlign: 'center' }}>
//                 <Typography variant="h6" gutterBottom>{category}</Typography>
//                 <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1.5 }}>
//                 {skillList.map(skill => <Chip key={skill} label={skill} sx={{fontSize: '1rem', padding: '10px 8px', backgroundColor: 'secondary.main', color: 'white'}}/>)}
//                 </Box>
//             </Box>
//             ))}
//         </AnimatedBox>

//         {/* --- Experience Timeline Section --- */}
//         <AnimatedBox id="experience" py={12}>
//             <SectionHeader icon={<Work />} title="Professional Experience" />
//             <Box sx={{position: 'relative', '&::before': { content: '""', position: 'absolute', left: {xs: '10px', md: '20px'}, top: 0, bottom: 0, width: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px'}}}>
//             {experience.map((job, index) => (
//                 <Box key={index} sx={{pl: {xs: 4, md: 8}, mb: 6, position: 'relative', '&::before': { content: '""', position: 'absolute', left: {xs: '0px', md: '10px'}, top: '5px', width: '24px', height: '24px', background: 'secondary.main', borderRadius: '50%', border: '4px solid #0d47a1'}}}>
//                     <Card>
//                         <CardContent sx={{ p: {xs: 2, md: 4} }}>
//                         <Typography variant="h5">{job.role}</Typography>
//                         <Typography variant="subtitle1" color="primary.main" sx={{fontWeight: 'bold'}}>{job.company} | {job.location}</Typography>
//                         <Typography variant="subtitle2" color="text.secondary" gutterBottom>{job.date}</Typography>
//                         <Box component="ul" sx={{ pl: 0, mt: 2, listStyleType: 'none' }}>
//                             {job.description.map((point, i) => (
//                                 <li key={i} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 8 }}>
//                                     <CheckCircleIcon sx={{ fontSize: 18, color: 'secondary.main', mr: 1.5, mt: 0.5 }} />
//                                     <Typography variant="body2" sx={{fontSize: '1rem'}}>{point}</Typography>
//                                 </li>
//                             ))}
//                         </Box>
//                         </CardContent>
//                     </Card>
//                 </Box>
//             ))}
//             </Box>
//         </AnimatedBox>

//         <AnimatedBox id="projects" py={12}>
//             <SectionHeader icon={<Code />} title="Projects" />
//             <Grid container spacing={4} sx={{ display: 'flex', flexDirection: 'column',justifyContent: 'center',alignItems: 'center'}}>
//             {projects.map((project, index) => (
//                 <Grid item xs={12} sm={6} md={4} key={index} >
//                 <Card sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column'}}>
//                     <CardContent sx={{ flexGrow: 1, p: 3 }}>
//                     <Typography variant="h5" gutterBottom>{project.title}</Typography>
//                     <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{project.description}</Typography>
//                     <Box>
//                         {project.tech.map(t => <Chip key={t} label={t} size="small" color="secondary" sx={{ m: 0.5, color: 'white' }} />)}
//                     </Box>
//                     </CardContent>
//                     <CardActions sx={{p: 2}}>
//                     <Button size="small" color="primary" href={personalInfo.github} target="_blank" rel="noopener noreferrer">View Code</Button>
//                     </CardActions>
//                 </Card>
//                 </Grid>
//             ))}
//             </Grid>
//         </AnimatedBox>

//         <AnimatedBox id="education" py={12}>
//             <SectionHeader icon={<School />} title="Education & Certifications" />
//             <Grid container spacing={4}>
//             {education.map((edu, index) => (
//                 <Grid item xs={12} md={6} key={index}>
//                 <Card>
//                     <CardContent sx={{p: 3}}>
//                     <Typography variant="h6">{edu.degree}</Typography>
//                     <Typography variant="subtitle1" color="primary.main" sx={{fontWeight: 'bold'}}>{edu.institution}</Typography>
//                     <Typography variant="body2" color="text.secondary">{edu.year} | {edu.grade}</Typography>
//                     </CardContent>
//                 </Card>
//                 </Grid>
//             ))}
//             <Grid item xs={12} md={6}>
//                 <Card sx={{ height: '100%' }}>
//                 <CardContent sx={{ p: 3 }}>
//                     <Typography variant="h6" gutterBottom>Certifications</Typography>
//                     <Box component="ul" sx={{ pl: 0, m: 0, listStyleType: 'none' }}>
//                     {certifications.map((cert, index) => (
//                         <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
//                         <CheckCircleIcon sx={{ fontSize: 18, color: 'primary.main', mr: 1 }} />
//                         <Typography variant="body1">{cert}</Typography>
//                         </li>
//                     ))}
//                     </Box>
//                 </CardContent>
//                 </Card>
//             </Grid>
//             </Grid>
//         </AnimatedBox>
        
//         <AnimatedBox id="contact" py={12}>
//             <Box sx={{backgroundColor: 'background.paper', p: {xs: 4, md: 8}, borderRadius: '24px', textAlign: 'center'}}>
//                 <Typography variant="h3" component="h2" gutterBottom sx={{fontSize: {xs: '2rem', sm: '2.8rem'}}}>Get In Touch</Typography>
//                 <Typography variant="h6" sx={{ mb: 4, maxWidth: '600px', margin: 'auto', color: 'text.secondary' }}>
//                 I'm currently looking for new opportunities. Feel free to reach out if you have a question or just want to connect!
//                 </Typography>
//                 <Button variant="contained" size="large" color="secondary" endIcon={<Send />} href={`mailto:${personalInfo.email}`} sx={{'&:hover':{backgroundColor: 'background.purple',color: 'white'},color:'text.primary'}}>
//                 Say Hello
//                 </Button>
//             </Box>
//         </AnimatedBox>

//         </Container>
//       </main>

//       {/* --- Footer --- */}
//       <Box component="footer" py={6} textAlign="center" sx={{ backgroundColor: 'transparent', color: 'white' }}>
//         <Typography variant="body2">
//           © {new Date().getFullYear()} {personalInfo.name}. All Rights Reserved.
//         </Typography>
//       </Box>
//     </ThemeProvider>
//   );
// }

// export default App;

import React, { useState, useEffect, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Box,
  IconButton,
  Link as MuiLink,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Collapse,
  CardHeader,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  LinkedIn,
  GitHub,
  Email,
  School,
  Work,
  Code,
  AccountCircle,
  Menu as MenuIcon,
  Download,
  Send,
  ArrowForward,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

// A professional theme with a dark blue and white color palette.
const darkBlueTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // Lighter Blue for text and primary accents
    },
    secondary: {
      main: '#42a5f5', // A friendly blue for secondary accents
    },
    background: {
      default: '#0d47a1', // Deep, dark blue for the main background
      paper: 'rgba(13, 71, 161, 0.7)', 
      purple:'#747BFF'// Semi-transparent dark blue for cards
    },
    text: {
      primary: '#ffffff',
      secondary: '#e0e0e0',
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: { fontWeight: 700, fontSize: '4rem' },
    h2: { fontWeight: 700, fontSize: '3.5rem' },
    h3: { fontWeight: 600, fontSize: '2.8rem' },
    h4: { fontWeight: 600, fontSize: '2.2rem' },
    h5: { fontWeight: 600, fontSize: '1.5rem' },
    h6: { fontWeight: 500, fontSize: '1.2rem' },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            transform: 'translateY(-10px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 'bold',
          padding: '10px 24px',
          fontSize: '1rem',
        },
      },
    },
  },
});

// --- Data (Remains the same) ---
const portfolioData = {
  personalInfo: {
    name: 'Vasanthakumar B',
    title: 'Python Developer',
    email: 'vasanth2004vk@gmail.com',
    phone: '9514203043',
    linkedin: 'https://linkedin.com/in/vasantha-kumar-b',
    github: 'https://github.com/vasanthvk77',
    profileSummary: `Python Developer with hands-on experience in building backend systems, automation workflows, and data-driven applications using Python, FastAPI, Flask, SQL, and MongoDB. Currently working as a Trainee Python Developer at Cygnus Software with exposure to AI-powered automation, ETL workflows, and backend API development. Strong understanding of algorithms, database operations, and system integration. Adept at converting business requirements into efficient backend logic and scalable solutions.`
  },
  skills: {
    'Programming & Backend': ['Python', 'Flask', 'FastAPI', 'MySQL', 'PostgreSQL', 'SQL Server', 'MongoDB'],
    'Core Concepts': ['Data Structures', 'OOPS', 'REST API Development', 'ETL', 'AI Automation'],
    'Frontend Exposure': ['HTML', 'CSS', 'Bootstrap', 'React'],
    'Tools & Platforms': ['Git', 'Railway', 'VS Code', 'Cursor', 'Microsoft Office'],
    'Other Skills': ['JSON', 'Agile Methodologies'],
  },
  experience: [
    {
      role: 'Trainee – Python Developer',
      company: 'Cygnus Softwares',
      date: 'June 2025 – Present',
      location: 'Coimbatore, Tamil Nadu',
      description: [
        'Developed backend APIs using Python FastAPI and Flask for web and desktop applications.',
        'Implemented authentication, CRUD operations, and database integration using SQL and MongoDB.',
        'Worked on automating data extraction, database updates, and ETL tasks using Python.',
        'Built automation pipelines that extract information from emails, classify data using AI, and generate automated responses.',
        'Contributed to systems involving speech-to-text processing, accessibility analysis, and backend-driven data workflows.',
        'Implemented intelligent ETL workflows that ingest large CSV/TSV files, apply AI-driven classification and SQL-based transformations, and load refined data into target databases with minimal manual intervention.',
        'Performed requirement analysis and performed the Unit and functional testing.',
        'Conducted testing of Python systems, debugging issues, and supporting deployments.',
      ],
    },
  ],
  projects: [
    {
      title: 'ADA Checker Web Application',
      tech: ['React', 'Python FastAPI', 'JavaScript'],
      description: 'Worked on an ADA Checker web application that scans websites for ADA and WCAG accessibility violations. Built a FastAPI backend to audit URLs and generate detailed, actionable accessibility reports. Created a React dashboard to display issues, severity levels, and recommended fixes for developers.',
    },
    {
      title: 'ATM Transaction Web Application',
      tech: ['React', 'Python Flask', 'SQL'],
      description: 'Developed a web application simulating ATM operations, including login, balance checking, deposits, withdrawals, and transaction history.',
    },
    {
      title: 'Sales Enquiry',
      tech: ['React', 'Python FastAPI', 'MySQL'],
      description: 'Worked on a hotel sales-enquiry automation system that reads inbound emails from hotel inboxes, classifies them using AI, extracts key details (dates, pax, requirements), and sends acknowledgement and manager summary emails automatically.',
    },
    {
      title: 'Sign language and Subtitle Generation System',
      tech: ['HTML', 'CSS', 'Javascript', 'Python Flask'],
      description: 'Developed an intelligent system that converts spoken audio into text and then translates that text into sign-language animations. The application processes uploaded videos or live audio, extracts speech using speech-to-text models, and generates dynamic sign-language representations.',
    },
    {
      title: 'Candor Data Platform',
      tech: ['Typescript', 'Python FastAPI', 'MySQL', 'PostgreSQL'],
      description: 'Worked on a desktop ETL platform that lets users visually define, configure, and run complete data pipelines, supporting both database-to-database and file-to-database loads with automated schema handling, datatype mapping, and performance-optimized bulk loading.',
    },
  ],
  education: [
    {
        degree: 'B.E. – Computer Science and Engineering',
        institution: 'RVS College of Engineering & Technology',
        year: '2021 – 2025',
        grade: 'CGPA: 8',
    },
  ],
  certifications: [
    'Programming in Java – Elysium (Internship Certificate)',
    'Web Development – EZIO Skill Academy',
    'Web Development – ICT Academy (Virtual)',
    'Programming in Java – NPTEL (65%)',
  ],
  additionalSkills: [
    'Video Editing (DaVinci Resolve)',
    'Photo Editing (Canva)',
  ],
};


// --- Reusable Components & Hooks ---

const pdfDownload=()=>{
  const link = document.createElement('a');
  link.href='/files/Resume.pdf';
  link.download='Resume.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const CodeRain = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let drops = [];
        let columns = 0;

        const words = ['Python', 'FastAPI', 'Flask', 'React', 'SQL', 'MongoDB', 'MySQL', 'PostgreSQL', 'ETL', 'AI', 'REST', 'API', 'JSON', 'Git', 'HTML', 'CSS', 'def', 'import', 'class', 'async'];
        const fontSize = 16;

        const setupRain = () => {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            columns = Math.floor(canvas.width / fontSize);
            drops = [];
            for (let i = 0; i < columns; i++) {
                drops[i] = {
                    y: Math.random() * canvas.height,
                    text: words[Math.floor(Math.random() * words.length)],
                    speed: Math.random() * 3+ 1,
                    rotation: 0,
                };
            }
        };

        setupRain();

        const draw = () => {
            ctx.fillStyle = 'rgba(13, 71, 161, 0.15)'; // Increased opacity to make trails fade faster
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#90caf9';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const drop = drops[i];
                const text = drop.text;
                
                ctx.save();
                ctx.translate(i * fontSize, drop.y);
                ctx.rotate(drop.rotation);
                ctx.fillText(text, 0, 0);
                ctx.restore();

                drop.y += drop.speed;
                drop.rotation += 0.02;

                if (drop.y > canvas.height && Math.random() > 0.95) {
                    drops[i].y = 0;
                    drops[i].text = words[Math.floor(Math.random() * words.length)];
                    drops[i].speed = Math.random() * 3 + 1;
                    drops[i].rotation = 0;
                }
            }
            animationFrameId = window.requestAnimationFrame(draw);
        };

        draw();

        window.addEventListener('resize', setupRain);

        return () => {
            window.cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', setupRain);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1, width: '100vw', height: '100vh' }} />;
};


const SectionHeader = ({ icon, title }) => (
  <Box display="flex" alignItems="center" mb={6} justifyContent="center">
    {React.cloneElement(icon, { sx: { fontSize: { xs: 36, md: 48 }, color: 'primary.main', mr: 2 } })}
    <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
      {title}
    </Typography>
  </Box>
);

const useIntersectionObserver = (options) => {
    const [entry, setEntry] = useState(null);
    const [node, setNode] = useState(null);
    const observer = useRef(null);

    useEffect(() => {
        if (observer.current) observer.current.disconnect();
        observer.current = new window.IntersectionObserver(([entry]) => setEntry(entry), options);
        const { current: currentObserver } = observer;
        if (node) currentObserver.observe(node);
        return () => currentObserver.disconnect();
    }, [node, options]);

    return [setNode, entry];
};

const AnimatedBox = ({ children, ...props }) => {
    const [ref, entry] = useIntersectionObserver({ threshold: 0.1 });
    const isVisible = entry?.isIntersecting;

    return (
        <Box
            ref={ref}
            sx={{
                transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            }}
            {...props}
        >
            {children}
        </Box>
    );
};

// --- NEW: Skills Tree Component ---
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const SkillsTree = ({ skillsData }) => {
  const [expanded, setExpanded] = useState(() => {
    const initialState = {};
    Object.keys(skillsData).forEach(key => {
      initialState[key] = true; // Start all categories expanded by default
    });
    return initialState;
  });

  const handleExpandClick = (category) => {
    setExpanded(prev => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <Grid container spacing={4}>
      {Object.entries(skillsData).map(([category, skillList]) => (
        <Grid item xs={12} sm={6} md={4} key={category}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', '&:hover': { transform: 'none' }}}>
            <CardHeader
              title={<Typography variant="h6">{category}</Typography>}
              onClick={() => handleExpandClick(category)}
              sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' } }}
              action={
                <ExpandMore
                  expand={expanded[category]}
                  aria-expanded={expanded[category]}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              }
            />
            <Collapse in={expanded[category]} timeout="auto" unmountOnExit>
              <CardContent>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                  {skillList.map(skill => (
                    <Chip
                      key={skill}
                      label={skill}
                      sx={{
                        fontSize: '1rem',
                        padding: '10px 8px',
                        bgcolor: 'secondary.main',
                        color: 'white',
                        border: '1px solid transparent',
                        '&:hover': {
                          bgcolor: 'primary.main',
                          color: 'background.default',
                          transform: 'scale(1.05)'
                        },
                        transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out'
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Collapse>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};


// --- Main Application Component ---
function App() {
  const { personalInfo, skills, experience, projects, education, certifications, additionalSkills } = portfolioData;
  const isMobile = useMediaQuery(darkBlueTheme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  const navLinks = [
    { text: 'About', href: '#about', icon: <AccountCircle /> },
    { text: 'Skills', href: '#skills', icon: <Code /> },
    { text: 'Experience', href: '#experience', icon: <Work /> },
    { text: 'Projects', href: '#projects', icon: <Code /> },
    { text: 'Education', href: '#education', icon: <School /> },
    { text: 'Contact', href: '#contact', icon: <Email /> },
  ];

  const drawer = (
    <Box sx={{ textAlign: 'center', width: 250 }} role="presentation">
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2}}>
            <Typography variant="h6">Menu</Typography>
            <IconButton onClick={handleDrawerToggle}>
                <CloseIcon />
            </IconButton>
        </Box>
      <List>
        {navLinks.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component="a" href={item.href} onClick={handleDrawerToggle}>
              <ListItemIcon sx={{color: 'primary.main'}}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={darkBlueTheme}>
      <CssBaseline />
      <CodeRain />
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
          html { scroll-behavior: smooth; }
          body { background-color: transparent; }
        `}
      </style>

      <AppBar
        position="sticky"
        elevation={scrolled ? 3 : 0}
        sx={{
          backgroundColor: scrolled ? 'rgba(13, 71, 161, 0.7)' : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          boxShadow: 'none',
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'text.primary' }}>
            {personalInfo.name}
          </Typography>
          {isMobile ? (
            <IconButton color="primary" aria-label="open drawer" edge="start" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box>
              {navLinks.map(item => (
                <Button key={item.text} href={item.href} sx={{ color: 'text.primary', fontWeight: 'bold','&:hover': {
      backgroundColor: 'primary.light',
      color: 'background.default',
    }}}>
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <nav>
        <Drawer variant="temporary" open={drawerOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} anchor="right">
          {drawer}
        </Drawer>
      </nav>

      <main>
        {/* --- Hero Section --- */}
        <Box id="home" sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '100vh', 
            textAlign: 'center', 
            p: { xs: 2, sm: 4 },
            backgroundColor: 'transparent',
        }}>
            <Container maxWidth="lg">
                <Typography variant="h2" component="h1" gutterBottom sx={{fontSize: {xs: '2.5rem', sm: '3.5rem'}}}>
                Hello, I'm {personalInfo.name}
                </Typography>
                <Typography variant="h5" color="text.secondary" gutterBottom sx={{ mb: 4, maxWidth: '700px', mx: 'auto', fontSize: {xs: '1.2rem', sm: '1.5rem'} }}>
                A passionate Python Developer creating backend systems, automation workflows, and data-driven applications.
                </Typography>
                <Button variant="contained" size="large" color="secondary" href="#about" endIcon={<ArrowForward />} sx={{'&:hover':{backgroundColor: 'background.purple',color: 'white'},color:'text.primary'}}>
                    Learn More About Me
                </Button>
            </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        {/* --- About Me Section --- */}
        <AnimatedBox id="about" py={8}>
            <Card>
                <CardContent sx={{p: {xs: 2, md: 5}}}>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={5}>
                            <Avatar alt={personalInfo.name} src="https://lh3.googleusercontent.com/a/ACg8ocL8jX34L86_593Xw2-e1d8G6o4E1H1vY2vM0K6j2F6cR4v98A=s288-c-no" sx={{ width: '100%', height: 'auto', maxWidth: {xs: '250px', md: '350px'}, margin: '0 auto', border: '8px solid white', boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }} />
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <Typography variant="h3" component="h2" gutterBottom sx={{fontSize: {xs: '2rem', sm: '2.8rem'}}}>About Me</Typography>
                            <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.2rem', mb: 3, textAlign: 'justify' }}>
                            {personalInfo.profileSummary}
                            </Typography>
                            <Box>
                            <Button variant="contained" color="secondary" startIcon={<Download />} sx={{ mr: 2,color:"white",'&:hover':{backgroundColor: 'background.purple',color: 'white'} }} onClick={pdfDownload}>
                                Download CV
                            </Button>
                            <IconButton color="primary" component={MuiLink} href={personalInfo.github} target="_blank" aria-label="GitHub"><GitHub sx={{ fontSize: '2.5rem' }} /></IconButton>
                            <IconButton color="primary" component={MuiLink} href={personalInfo.linkedin} target="_blank" aria-label="LinkedIn"><LinkedIn sx={{ fontSize: '2.5rem' }} /></IconButton>
                            <IconButton color="primary" component={MuiLink} href={`mailto:${personalInfo.email}`} aria-label="Email"><Email sx={{ fontSize: '2.5rem' }} /></IconButton>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </AnimatedBox>
        
        {/* --- MODIFIED: Skills Section --- */}
        <AnimatedBox id="skills" py={12}>
            <SectionHeader icon={<Code />} title="Technical Skills" />
            <Grid container spacing={4} justifyContent="center" alignItems="stretch">
              {Object.entries(skills).map(([category, skillList], idx) => (
                <Grid item xs={12} sm={6} md={6} key={category} sx={{ display: 'flex' }}>
                  <AnimatedBox sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch', minHeight: { xs: 220, md: 260 }, transitionDelay: `${idx * 100}ms` }}>
                    <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" align="center" gutterBottom>{category}</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
                          {skillList.map(skill => (
                            <Chip key={skill} label={skill} sx={{ fontSize: '1rem', padding: '10px 8px', bgcolor: 'secondary.main', color: 'white', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.08)', bgcolor: 'primary.main', color: 'background.default' } }} />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </AnimatedBox>
                </Grid>
              ))}
            </Grid>
        </AnimatedBox>

        {/* --- Experience Timeline Section --- */}
        <AnimatedBox id="experience" py={12}>
            <SectionHeader icon={<Work />} title="Professional Experience" />
            <Grid container spacing={4} justifyContent="center" alignItems="stretch">
              {experience.map((job, idx) => (
                <Grid item xs={12} md={6} key={idx} sx={{ display: 'flex' }}>
                  <AnimatedBox sx={{ width: '100%', height: '100%', minHeight: { xs: 220, md: 260 }, transitionDelay: `${idx * 100}ms` }}>
                    <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                      <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                        <Typography variant="h5" align="center">{job.role}</Typography>
                        <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 'bold', textAlign: 'center' }}>{job.company} | {job.location}</Typography>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom align="center">{job.date}</Typography>
                        <Box component="ul" sx={{ pl: 0, mt: 2, listStyleType: 'none' }}>
                          {job.description.map((point, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 8 }}>
                              <CheckCircleIcon sx={{ fontSize: 18, color: 'secondary.main', mr: 1.5, mt: 0.5 }} />
                              <Typography variant="body2" sx={{ fontSize: '1rem' }}>{point}</Typography>
                            </li>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </AnimatedBox>
                </Grid>
              ))}
            </Grid>
        </AnimatedBox>

        <AnimatedBox id="projects" py={12}>
            <SectionHeader icon={<Code />} title="Projects" />
            <Grid container spacing={4} justifyContent="center" alignItems="stretch">
              {projects.map((project, idx) => (
                <Grid item xs={12} sm={6} md={6} key={idx} sx={{ display: 'flex' }}>
                  <AnimatedBox sx={{ width: '100%', height: '100%', minHeight: { xs: 220, md: 260 }, transitionDelay: `${idx * 100}ms` }}>
                    <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography variant="h5" gutterBottom align="center">{project.title}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }} align="center">{project.description}</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
                          {project.tech.map(t => <Chip key={t} label={t} size="small" color="secondary" sx={{ m: 0.5, color: 'white', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.08)', bgcolor: 'primary.main', color: 'background.default' } }} />)}
                        </Box>
                      </CardContent>
                      
                    </Card>
                  </AnimatedBox>
                </Grid>
              ))}
            </Grid>
        </AnimatedBox>

        <AnimatedBox id="education" py={12}>
            <SectionHeader icon={<School />} title="Education & Certifications" />
            <Grid container spacing={4} justifyContent="center" alignItems="stretch">
              {education.map((edu, idx) => (
                <Grid item xs={12} md={6} key={idx} sx={{ display: 'flex' }}>
                  <AnimatedBox sx={{ width: '100%', height: '100%', minHeight: { xs: 220, md: 260 }, transitionDelay: `${idx * 100}ms` }}>
                    <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" align="center">{edu.degree}</Typography>
                        <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 'bold', textAlign: 'center' }}>{edu.institution}</Typography>
                        <Typography variant="body2" color="text.secondary" align="center">{edu.year} | {edu.grade}</Typography>
                      </CardContent>
                    </Card>
                  </AnimatedBox>
                </Grid>
              ))}
              <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                <AnimatedBox sx={{ width: '100%', height: '100%', minHeight: { xs: 220, md: 260 }, transitionDelay: `${education.length * 100}ms` }}>
                  <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom align="center">Certifications</Typography>
                      <Box component="ul" sx={{ pl: 0, m: 0, listStyleType: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {certifications.map((cert, idx) => (
                          <li key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                            <CheckCircleIcon sx={{ fontSize: 18, color: 'primary.main', mr: 1 }} />
                            <Typography variant="body1">{cert}</Typography>
                          </li>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </AnimatedBox>
              </Grid>
              {portfolioData.additionalSkills && (
                <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                  <AnimatedBox sx={{ width: '100%', height: '100%', minHeight: { xs: 220, md: 260 }, transitionDelay: `${(education.length + 1) * 100}ms` }}>
                    <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom align="center">Additional Skills</Typography>
                        <Box component="ul" sx={{ pl: 0, m: 0, listStyleType: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          {portfolioData.additionalSkills.map((skill, idx) => (
                            <li key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                              <CheckCircleIcon sx={{ fontSize: 18, color: 'primary.main', mr: 1 }} />
                              <Typography variant="body1">{skill}</Typography>
                            </li>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </AnimatedBox>
                </Grid>
              )}
            </Grid>
        </AnimatedBox>
        
        <AnimatedBox id="contact" py={12}>
            <Box sx={{backgroundColor: 'background.paper', p: {xs: 4, md: 8}, borderRadius: '24px', textAlign: 'center'}}>
                <Typography variant="h3" component="h2" gutterBottom sx={{fontSize: {xs: '2rem', sm: '2.8rem'}}}>Get In Touch</Typography>
                <Typography variant="h6" sx={{ mb: 4, maxWidth: '600px', margin: 'auto', color: 'text.secondary' }}>
                I'm currently looking for new opportunities. Feel free to reach out if you have a question or just want to connect!
                </Typography>
                <Button variant="contained" size="large" color="secondary" endIcon={<Send />} href={`mailto:${personalInfo.email}`} sx={{'&:hover':{backgroundColor: 'background.purple',color: 'white'},color:'text.primary'}}>
                Say Hello
                </Button>
            </Box>
        </AnimatedBox>

        </Container>
      </main>

      {/* --- Footer --- */}
      <Box component="footer" py={6} textAlign="center" sx={{ backgroundColor: 'transparent', color: 'white' }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} {personalInfo.name}. All Rights Reserved.
        </Typography>
      </Box>
    </ThemeProvider>
  );
}

export default App;