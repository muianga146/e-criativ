import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment, ContactShadows } from '@react-three/drei';
import Lenis from 'lenis';
import { 
  ArrowRight, 
  Menu, 
  X, 
  MessageCircle, 
  MapPin, 
  Mail, 
  Phone, 
  Facebook, 
  Instagram, 
  Linkedin,
  Palette,
  Megaphone,
  MonitorSmartphone,
  Share2,
  Video,
  Target
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- 3D Components ---
function AbstractShapes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <mesh position={[-2, 1, -2]} scale={1.5}>
          <sphereGeometry args={[1, 64, 64]} />
          <MeshDistortMaterial color="#4ADE80" envMapIntensity={1} clearcoat={1} clearcoatRoughness={0.1} metalness={0.1} roughness={0.2} distort={0.4} speed={2} />
        </mesh>
      </Float>
      
      <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
        <mesh position={[3, -1, -1]} scale={1.2}>
          <torusGeometry args={[1, 0.4, 32, 100]} />
          <MeshDistortMaterial color="#A7F3D0" envMapIntensity={1} clearcoat={1} clearcoatRoughness={0.2} metalness={0.2} roughness={0.1} distort={0.2} speed={1.5} />
        </mesh>
      </Float>

      <Float speed={2.5} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[0, -2, -3]} scale={1}>
          <octahedronGeometry args={[1, 2]} />
          <MeshDistortMaterial color="#67E8F9" envMapIntensity={1} clearcoat={0.8} clearcoatRoughness={0.1} metalness={0.1} roughness={0.3} distort={0.3} speed={3} />
        </mesh>
      </Float>
    </group>
  );
}

function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#A7F3D0" />
      <AbstractShapes />
      <Environment preset="city" />
      <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={2} far={4} />
    </Canvas>
  );
}

// --- UI Components ---

function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input, textarea, [role="button"]')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[100] mix-blend-difference flex items-center justify-center"
      animate={{
        x: mousePosition.x - 16,
        y: mousePosition.y - 16,
        scale: isHovering ? 2 : 1,
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
    >
      <div className="w-full h-full bg-[#A7F3D0] rounded-full opacity-80 blur-[2px]" />
    </motion.div>
  );
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Home', href: '#home' },
    { name: 'Quem Somos', href: '#about' },
    { name: 'Serviços', href: '#services' },
    { name: 'Portfólio', href: '#portfolio' },
    { name: 'Contactos', href: '#contact' },
  ];

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      scrolled ? "py-4" : "py-6"
    )}>
      <div className="container mx-auto px-6">
        <div className="glass rounded-full px-6 py-3 flex items-center justify-between">
          <a href="#home" className="text-2xl font-serif font-bold tracking-tighter text-gray-900">
            Ecriativa<span className="text-[#4ADE80]">.</span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-[#4ADE80] transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a 
              href="#contact"
              className="bg-[#4ADE80] hover:bg-[#34D399] text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(74,222,128,0.4)]"
            >
              Iniciar Projeto
            </a>
          </nav>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-gray-900"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 mt-4 px-6 md:hidden"
          >
            <div className="glass-card rounded-3xl p-6 flex flex-col gap-4">
              {links.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-gray-800 hover:text-[#4ADE80]"
                >
                  {link.name}
                </a>
              ))}
              <a 
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="bg-[#4ADE80] text-white text-center py-3 rounded-full font-semibold mt-4"
              >
                Iniciar Projeto
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  const title = "Elevamos a Sua Marca ao Próximo Nível";
  
  return (
    <section id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Scene />
      </div>

      {/* Content */}
      <motion.div 
        style={{ y: y1, opacity }}
        className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center mt-20"
      >
        <div className="overflow-hidden mb-6">
          <motion.h1 
            className="font-serif text-5xl md:text-7xl lg:text-[8vw] leading-[0.9] tracking-tight text-gray-900 max-w-5xl"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
              hidden: {}
            }}
          >
            {title.split(' ').map((word, i) => (
              <span key={i} className="inline-block mr-[0.2em]">
                {word.split('').map((char, j) => (
                  <motion.span
                    key={j}
                    className="inline-block"
                    variants={{
                      hidden: { y: "100%", opacity: 0, rotateZ: 10 },
                      visible: { y: 0, opacity: 1, rotateZ: 0, transition: { type: "spring", damping: 12, stiffness: 100 } }
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            ))}
          </motion.h1>
        </div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-lg md:text-2xl text-gray-600 max-w-2xl mb-10 font-sans"
        >
          Transformamos ideias em marcas fortes e memoráveis. Criatividade e estratégia para destacar o seu negócio em Maputo e no mundo.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: "spring" }}
        >
          <a 
            href="#contact"
            className="group relative inline-flex items-center justify-center gap-3 bg-[#4ADE80] text-white px-8 py-4 rounded-full text-lg font-semibold overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(74,222,128,0.5)]"
          >
            <span className="relative z-10">Iniciar Projeto Agora</span>
            <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#34D399] to-[#4ADE80] opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="text-xs uppercase tracking-widest text-gray-500 font-medium">Scroll</span>
        <div className="w-[1px] h-12 bg-gray-300 overflow-hidden">
          <motion.div 
            className="w-full h-full bg-[#4ADE80]"
            animate={{ y: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />
        </div>
      </motion.div>
    </section>
  );
}

function About() {
  const cards = [
    { title: "Missão", desc: "Elevar o padrão do design em Moçambique, entregando soluções que conectam marcas a pessoas de forma autêntica." },
    { title: "Visão", desc: "Ser a agência criativa de referência em Maputo, reconhecida pela inovação e excelência visual." },
    { title: "Objetivo", desc: "Transformar cada projeto numa obra de arte funcional que gera resultados reais para os nossos clientes." }
  ];

  return (
    <section id="about" className="py-32 relative bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Text */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-4xl md:text-6xl text-gray-900 mb-6 leading-tight">
              Somos a <span className="text-[#4ADE80] italic">Edição Criativa</span>.
            </h2>
            <p className="text-xl text-gray-600 mb-8 font-light leading-relaxed">
              Não somos apenas uma agência. Somos um estúdio de mentes inquietas sediado em Maputo, apaixonados por estética, funcionalidade e narrativas visuais que deixam marca.
            </p>
            
            <div className="space-y-6">
              {['Expertise Comprovada', 'Equipe Multidisciplinar', 'Inovação Constante'].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.5 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-[#A7F3D0]/30 flex items-center justify-center text-[#4ADE80]">
                    <ArrowRight className="w-5 h-5 -rotate-45" />
                  </div>
                  <span className="text-lg font-medium text-gray-800">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Cards & Image */}
          <div className="relative h-full min-h-[500px]">
            {/* Decorative background blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[#A7F3D0]/40 to-[#67E8F9]/20 rounded-full blur-3xl -z-10" />
            
            <div className="grid gap-6 relative z-10">
              {cards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50, rotateX: -20 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.2, type: "spring" }}
                  whileHover={{ scale: 1.02, rotateY: 5 }}
                  className={cn(
                    "glass-card p-8 rounded-3xl",
                    i === 1 ? "lg:ml-12" : "",
                    i === 2 ? "lg:ml-24" : ""
                  )}
                >
                  <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">{card.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function Services() {
  const services = [
    { icon: Palette, title: "Design de Marcas", desc: "Identidade visual forte e memorável que conta a sua história." },
    { icon: Megaphone, title: "Comunicação Estratégica", desc: "Campanhas publicitárias que conectam e convertem." },
    { icon: MonitorSmartphone, title: "Design Digital & UI/UX", desc: "Experiências digitais imersivas, sites e apps premium." },
    { icon: Share2, title: "Marketing Digital", desc: "Gestão de redes sociais e estratégias de crescimento." },
    { icon: Video, title: "Produção de Conteúdo", desc: "Fotografia, vídeo e copywriting que engajam." },
    { icon: Target, title: "Estratégias de Branding", desc: "Posicionamento de marca no mercado moçambicano e global." }
  ];

  return (
    <section id="services" className="py-32 bg-[#FAF9F6]">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="font-serif text-5xl md:text-6xl text-gray-900 mb-6">O que Fazemos</h2>
          <p className="text-xl text-gray-600">Soluções criativas 360º para marcas que não se contentam com o básico.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative bg-white p-10 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#A7F3D0]/50 to-transparent rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-[#FAF9F6] rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#4ADE80] transition-colors duration-500">
                  <service.icon className="w-8 h-8 text-[#4ADE80] group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Portfolio() {
  const projects = [
    { title: "Rebranding Banco X", category: "Branding", img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800" },
    { title: "App de Delivery Maputo", category: "UI/UX", img: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=800" },
    { title: "Campanha Verão", category: "Publicidade", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" },
    { title: "Embalagens Café MZ", category: "Design", img: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=800" },
  ];

  return (
    <section id="portfolio" className="py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <h2 className="font-serif text-5xl md:text-6xl text-gray-900 mb-6">Trabalhos Recentes</h2>
            <p className="text-xl text-gray-600">Confira alguns dos nossos projetos mais recentes, que mostram como transformamos ideias em soluções visuais e digitais de impacto.</p>
          </motion.div>
          <motion.button 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[#4ADE80] font-semibold flex items-center gap-2 hover:gap-4 transition-all"
          >
            Ver Todos <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={cn(
                "group relative rounded-[2rem] overflow-hidden cursor-pointer",
                i % 2 !== 0 ? "md:mt-16" : ""
              )}
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img 
                  src={project.img} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                <span className="text-[#A7F3D0] font-medium mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{project.category}</span>
                <h3 className="text-white text-3xl font-display font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">{project.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="py-32 bg-[#FAF9F6] relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[#A7F3D0]/30 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#67E8F9]/20 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Info */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-5xl md:text-7xl text-gray-900 mb-8 leading-tight">
              Vamos Criar Algo <span className="text-[#4ADE80] italic">Incrível</span> Juntos?
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Pronto para elevar a sua marca? Preencha o formulário ou visite-nos no nosso estúdio em Maputo.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:bg-[#4ADE80] group-hover:text-white transition-colors duration-300 text-[#4ADE80]">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Visite-nos</h4>
                  <p className="text-gray-600">Av. das Indústrias, Bairro da Liberdade,<br/>Tintas CIN Casa NR155 – Maputo, Moçambique</p>
                </div>
              </div>
              
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:bg-[#4ADE80] group-hover:text-white transition-colors duration-300 text-[#4ADE80]">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Email</h4>
                  <a href="mailto:info@ecriativa.co.mz" className="text-gray-600 hover:text-[#4ADE80] transition-colors">info@ecriativa.co.mz</a>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:bg-[#4ADE80] group-hover:text-white transition-colors duration-300 text-[#4ADE80]">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Ligue</h4>
                  <p className="text-gray-600">+258 87 355 9682 / +258 87 272 6390</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-12">
              {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-[#4ADE80] hover:text-white hover:scale-110 hover:-rotate-6 transition-all shadow-sm">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card p-10 md:p-12 rounded-[2.5rem]"
          >
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900 ml-2">Nome Completo</label>
                <input 
                  type="text" 
                  placeholder="Como devemos chamá-lo?"
                  className="w-full bg-white/50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 focus:border-[#4ADE80] transition-all"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900 ml-2">Email</label>
                <input 
                  type="email" 
                  placeholder="seu@email.com"
                  className="w-full bg-white/50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 focus:border-[#4ADE80] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900 ml-2">Sobre o Projeto</label>
                <textarea 
                  rows={4}
                  placeholder="Conte-nos um pouco sobre a sua ideia..."
                  className="w-full bg-white/50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#4ADE80]/50 focus:border-[#4ADE80] transition-all resize-none"
                />
              </div>

              <button className="w-full bg-[#4ADE80] text-white font-bold text-lg py-5 rounded-2xl hover:bg-[#34D399] transition-colors shadow-lg shadow-[#4ADE80]/20 hover:shadow-[#4ADE80]/40 mt-4">
                Enviar Mensagem
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white py-10 border-t border-gray-100">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Edição Criativa. Todos os direitos reservados.
        </p>
        <div className="flex gap-6 text-sm text-gray-500">
          <a href="#" className="hover:text-[#4ADE80] transition-colors">Política de Privacidade</a>
          <a href="#" className="hover:text-[#4ADE80] transition-colors">Termos de Uso</a>
        </div>
      </div>
    </footer>
  );
}

function WhatsAppFAB() {
  return (
    <motion.a
      href="https://wa.me/258873559682"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-[#4ADE80] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all group"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 2, type: "spring" }}
    >
      <MessageCircle className="w-8 h-8" />
      {/* Tooltip */}
      <span className="absolute right-full mr-4 bg-white text-gray-900 text-sm font-semibold px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-sm">
        Falar com a Equipe
      </span>
    </motion.a>
  );
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative w-full bg-[#FAF9F6] text-gray-900 selection:bg-[#A7F3D0] selection:text-gray-900">
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFAB />
    </div>
  );
}
