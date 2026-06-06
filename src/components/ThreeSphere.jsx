import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import * as THREE from 'three';

const simplexNoiseGLSL = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

const vertexShader = `
  ${simplexNoiseGLSL}

  uniform float uTime;
  uniform vec2  uMouse;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vViewDir;
  varying float vFold;       // cloth-fold curvature value
  varying float vFoldSharp;  // high-freq fold detail

  void main() {
    // ---- flowing cloth folds via layered noise on sphere surface ----
    // Low-freq sweeping drape
    float fold1 = snoise(position * 1.1 + vec3(uTime * 0.08, uMouse.x * 0.3, uMouse.y * 0.3));
    // Mid-freq crease lines
    float fold2 = snoise(position * 2.8 - vec3(uTime * 0.05, 0.0, 0.0)) * 0.5;
    // Thin sharp highlight wrinkles
    float fold3 = snoise(position * 6.5 + vec3(0.0, uTime * 0.07, uMouse.y * 0.5)) * 0.25;

    float fold = fold1 + fold2 + fold3;
    vFold      = fold;
    vFoldSharp = fold3 * 4.0; // amplified for specular ridge

    // Displace vertices along normal — cloth drape amplitude
    float amp = 0.13;
    vec3 displaced = position + normal * fold * amp;

    vPosition = displaced;
    vNormal   = normalize(normalMatrix * normal);

    vec4 mvPos = modelViewMatrix * vec4(displaced, 1.0);
    vViewDir   = normalize(-mvPos.xyz);

    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2  uMouse;

  varying vec3  vNormal;
  varying vec3  vPosition;
  varying vec3  vViewDir;
  varying float vFold;
  varying float vFoldSharp;

  // Iridescent silk palette — deep purples, cyans, pinks, whites like Image 1
  vec3 silkColor(float t) {
    vec3 a = vec3(0.78, 0.80, 0.90);   // bright pastel base
    vec3 b = vec3(0.28, 0.22, 0.18);   // colour swing amplitude
    vec3 c = vec3(1.0,  1.0,  1.0);
    vec3 d = vec3(0.00, 0.33, 0.60);   // phase offset → purple/cyan/pink cycle
    return clamp(a + b * cos(6.28318 * (c * t + d)), 0.0, 1.0);
  }

  // Sharper prismatic accent on fold ridges
  vec3 prism(float t) {
    vec3 a = vec3(0.5);
    vec3 b = vec3(0.5);
    vec3 c = vec3(1.0, 0.9, 0.8);
    vec3 d = vec3(0.0, 0.25, 0.55);
    return clamp(a + b * cos(6.28318 * (c * t + d)), 0.0, 1.0);
  }

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewDir);

    float NdotV  = max(dot(N, V), 0.0);
    float fresnel = pow(1.0 - NdotV, 3.2);

    // ---- Cloth fold colour mapping ----
    float phase = vFold * 0.55                   // fold curvature drives hue
                + vPosition.y * 0.18             // vertical gradient (darker bottom)
                + vPosition.x * 0.10             // left-right tilt
                + uTime * 0.04;                  // slow drift

    vec3 baseColor = silkColor(phase);

    // Pearl-white core
    vec3 pearlWhite = vec3(0.96, 0.95, 1.00);
    baseColor = mix(baseColor, pearlWhite, 0.22);

    // ---- Fold ridge highlight ----
    float ridgeAmt  = smoothstep(0.3, 0.9, abs(vFoldSharp));
    vec3 ridgeColor = prism(phase + 0.3) * ridgeAmt * 1.4;

    // ---- Specular highlights ----
    vec3 L1 = normalize(vec3(1.5, 2.0, 2.5));
    vec3 H1 = normalize(L1 + V);
    float spec1 = pow(max(dot(N, H1), 0.0), 120.0);
    vec3 specColor1 = vec3(1.0, 1.0, 1.0) * spec1 * 2.5;

    // Fill light
    vec3 L2 = normalize(vec3(-1.0, -0.8, 1.2));
    vec3 H2 = normalize(L2 + V);
    float spec2 = pow(max(dot(N, H2), 0.0), 30.0);
    vec3 specColor2 = vec3(0.55, 0.75, 1.0) * spec2 * 0.5;

    // ---- Fresnel rim ----
    vec3 rimColor = mix(
      vec3(0.85, 0.85, 1.0),          // cool white
      prism(phase + fresnel * 0.4),   // prismatic at extreme glancing
      fresnel
    ) * fresnel * 0.9;

    // ---- Compositing ----
    vec3 color  = baseColor * (1.0 - fresnel * 0.15);
    color      += ridgeColor;
    color      += rimColor;
    color      += specColor1 + specColor2;

    color = mix(color, vec3(1.0), pow(fresnel, 5.0) * 0.6);

    float alpha = mix(0.80, 0.99, fresnel * 0.5 + 0.5);

    gl_FragColor = vec4(color, alpha);
  }
`;

const WORDS = [
  'GIT', 'AWS', 'CSS', 'JS', 'API', 'SQL',
  'JWT', 'XML', 'MUI', 'UI', 'UX', 'NPM',
  'DOM', 'DEV', 'APP', 'WEB'
];

const COLORS = [
  '#06b6d4', // Cyan shadow glow
  '#8b5cf6', // Purple shadow glow
  '#38bdf8', // Sky Blue shadow glow
  '#ec4899', // Pink shadow glow
  '#22d3ee', // Bright Cyan shadow glow
];

export default function ThreeSphere({ scrollProgress = 0 }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollProgressRef = useRef(scrollProgress);

  // Keep scroll progress updated in ref for requestAnimationFrame loop
  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const width  = container.clientWidth;
    const height = container.clientHeight;

    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(2, 128, 128);

    const uniforms = {
      uTime:  { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      side: THREE.FrontSide,
    });

    const backMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
    });

    const backSphere = new THREE.Mesh(geometry, backMat);
    scene.add(backSphere);

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Particle system state
    let particles = [];
    let lastSpawnTime = 0;
    let isHovering = false;

    const spawnWord = (rect, forceSpeed = null) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = forceSpeed || (0.8 + Math.random() * 10); // Gentle drift speed
      particles.push({
        text: WORDS[Math.floor(Math.random() * WORDS.length)],
        glowColor: COLORS[Math.floor(Math.random() * COLORS.length)],
        x: rect.width / 2,
        y: rect.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        fontSize: Math.floor(Math.random() * 3) + 12, // 12px to 14px Poppins
      });
    };

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.targetX = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      mouseRef.current.targetY = -((e.clientY - rect.top)  / rect.height) * 2 + 1;

      // Slower spawn rate on mousemove (spawns once every 220ms)
      const now = performance.now();
      if (now - lastSpawnTime > 220) {
        spawnWord(rect);
        lastSpawnTime = now;
      }
    };

    const handleMouseEnter = () => {
      isHovering = true;
    };

    const handleMouseLeave = () => {
      isHovering = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      // Sizing the 2D canvas with high DPR support
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial sizing

    let rafId;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();

      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.06;
      m.y += (m.targetY - m.y) * 0.06;

      uniforms.uTime.value = t;
      uniforms.uMouse.value.set(m.x, m.y);

      // Rotate sphere slowly over time + add scroll rotation impact
      sphere.rotation.y    = t * 0.06 + scrollProgressRef.current * 4.5;
      sphere.rotation.x    = t * 0.02 + scrollProgressRef.current * 1.5;
      backSphere.rotation.y = sphere.rotation.y;
      backSphere.rotation.x = sphere.rotation.x;

      renderer.render(scene, camera);

      // Background spawn rate when stationary but hovering
      const now = performance.now();
      if (isHovering && now - lastSpawnTime > 300) {
        const rect = container.getBoundingClientRect();
        spawnWord(rect, 0.7 + Math.random() * 0.5);
        lastSpawnTime = now;
      }

      // Draw 2D text particles
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const dpr = window.devicePixelRatio || 1;
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;
        ctx.clearRect(0, 0, w, h);
        
        const centerX = w / 2;
        const centerY = h / 2;
        
        particles = particles.filter(p => {
          p.x += p.vx;
          p.y += p.vy;

          // Calculate radial distance from sphere center
          const dx = p.x - centerX;
          const dy = p.y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Dynamic screen-space sphere radius (approx ~160px on desktop)
          const sphereRadius = Math.min(w, h) * 0.35;
          const maxRadius = Math.min(w, h) * 0.48;

          // Remove fully drifted particles
          if (dist >= maxRadius) {
            return false;
          }

          // Emergence threshold: invisible inside, fade in as it exits surface, then fade out
          let alpha = 0;
          if (dist < sphereRadius) {
            alpha = 0; // Completely hidden inside the sphere
          } else if (dist >= sphereRadius && dist < sphereRadius + 15) {
            alpha = (dist - sphereRadius) / 15; // Smoothly fade in as it exits
          } else if (dist >= sphereRadius + 15 && dist < maxRadius) {
            alpha = 1 - (dist - (sphereRadius + 15)) / (maxRadius - (sphereRadius + 15)); // Fade out beyond sphere boundary
          }

          if (alpha <= 0.01) {
            return true;
          }

          ctx.save();
          ctx.shadowBlur = 6;
          ctx.shadowColor = p.glowColor;
          ctx.fillStyle = '#ffffff'; // White text
          ctx.globalAlpha = alpha;
          ctx.font = `bold ${p.fontSize}px Poppins`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.text, p.x, p.y);
          ctx.restore();

          return true;
        });
      }

      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      backMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        ref={containerRef}
        sx={{
          width: '100%',
          height: '100%',
          cursor: 'grab',
          '&:active': { cursor: 'grabbing' },
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
}