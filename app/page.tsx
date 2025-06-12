"use client"
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Play, Eye, Users, Zap, Camera, Activity, 
  BarChart3, Clock, Upload, AlertTriangle, MapPin,
  Wifi, Battery, Signal, User, Settings, Bell
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const FloatingOrb = ({ delay = 0, color = "cyan" }) => {
  const colors = {
    cyan: "bg-cyan-500",
    magenta: "bg-magenta-500", 
    green: "bg-green-500"
  };
  
  return (
    <motion.div
      className={`absolute w-3 h-3 ${colors[color]} rounded-full opacity-20 blur-sm`}
      initial={{ 
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200), 
        y: typeof window !== 'undefined' ? window.innerHeight + 50 : 800 
      }}
      animate={{
        y: -50,
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
      }}
      transition={{
        duration: Math.random() * 15 + 10,
        delay: delay,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
};

const BackgroundAnimation = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const colors = ['cyan', 'magenta', 'green'];
    const particleArray = Array.from({ length: 30 }, (_, i) => (
      <FloatingOrb key={i} delay={i * 0.3} color={colors[i % 3]} />
    ));
    setParticles(particleArray);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles}
      
    </div>
  );
};

const Header = () => {
  const router = useRouter()
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-gray-800"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div
          className="flex items-center space-x-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative">
            <Shield className="w-10 h-10 text-cyan-400" />
            <div className="absolute inset-0 w-10 h-10 bg-cyan-400/20 rounded-full blur-md" />
          </div>
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-400 bg-clip-text text-transparent">
              Rakshak AI
            </span>
            <div className="text-xs text-gray-500">Surveillance System</div>
          </div>
        </motion.div>
        
        <motion.div
          className="flex items-center space-x-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex items-center space-x-2 text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm">Online</span>
          </div>
          <motion.button
            className="bg-gradient-to-r from-cyan-600 to-cyan-600 hover:from-cyan-700 hover:to-cyan-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={()=>router.push('/login')}
          >
            Login
          </motion.button>
        </motion.div>
      </div>
    </motion.header>
  );
};

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
  
  const menuItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'cameras', icon: Camera, label: 'Cameras' },
    { id: 'reports', icon: Eye, label: 'Reports' },
    { id: 'timeline', icon: Clock, label: 'Timeline' },
    { id: 'upload', icon: Upload, label: 'Upload' },
  ];

  return (
    <motion.div
      className="w-64 bg-gray-900/80 backdrop-blur-xl border-r border-gray-800 p-6"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      
    >
      <div className="space-y-4">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.id}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
              activeItem === item.id 
                ? 'bg-gradient-to-r from-cyan-600/20 to-magenta-600/20 border border-cyan-500/50 text-cyan-400' 
                : 'hover:bg-gray-800/50 text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveItem(item.id)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
            {activeItem === item.id && (
              <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full" />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

const StatsCard = ({ title, value, change, icon: Icon, color = "cyan", delay = 0, isActive = false }) => {
  const colorClasses = {
    cyan: "from-cyan-600/20 to-cyan-400/10 border-cyan-500/30 text-cyan-400",
    magenta: "from-magenta-600/20 to-magenta-400/10 border-magenta-500/30 text-magenta-400",
    green: "from-green-600/20 to-green-400/10 border-green-500/30 text-green-400",
    red: "from-red-600/20 to-red-400/10 border-red-500/30 text-red-400",
    yellow: "from-yellow-600/20 to-yellow-400/10 border-yellow-500/30 text-yellow-400",
    blue: "from-blue-600/20 to-blue-400/10 border-blue-500/30 text-blue-400"
  };

  const changeColor = change?.startsWith('+') ? 'text-green-400 bg-green-500/20' : 
                     change?.startsWith('-') ? 'text-red-400 bg-red-500/20' : 
                     'text-blue-400 bg-blue-500/20';

  return (
    <motion.div
      className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-sm p-6 rounded-xl border relative overflow-hidden`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.02 }}
    >
      {isActive && (
        <div className="absolute top-0 right-0 w-3 h-3 bg-orange-400 rounded-full animate-pulse m-2" />
      )}
      <div className="flex items-center justify-between mb-4">
        <motion.div
          animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
          transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
        >
          <Icon className="w-8 h-8" />
        </motion.div>
        {change && (
          <span className={`text-xs ${changeColor} px-2 py-1 rounded-full font-medium`}>
            {change}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-300 font-medium">{title}</div>
    </motion.div>
  );
};

const AlertItem = ({ type, message, time, severity, location, suspect, delay = 0 }) => {
  const severityColors = {
    critical: "border-red-500/50 bg-red-500/10 text-red-400",
    high: "border-red-500/50 bg-red-500/10 text-red-400",
    medium: "border-yellow-500/50 bg-yellow-500/10 text-yellow-400",
    low: "border-green-500/50 bg-green-500/10 text-green-400"
  };

  return (
    <motion.div
      className={`p-4 rounded-lg border ${severityColors[severity]} mb-3`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 mt-0.5" />
        <div className="flex-1">
          <div className="font-medium text-white">{type}</div>
          <div className="text-sm text-gray-400 mt-1">{message}</div>
          {location && (
            <div className="text-xs text-gray-500 mt-1">📍 {location}</div>
          )}
          {suspect && (
            <div className="text-xs text-gray-500 mt-1">👤 {suspect}</div>
          )}
          <div className="text-xs text-gray-500 mt-2">{time}</div>
        </div>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const [activeThreats] = useState(3);

  return (
    <div className="flex-1 p-8 space-y-8 overflow-y-auto">
      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <StatsCard
          title="Active Cameras"
          value="24"
          change="+2.4%"
          icon={Camera}
          color="cyan"
          delay={1.2}
        />
        <StatsCard
          title="Threats Detected"
          value="3"
          change="+12%"
          icon={AlertTriangle}
          color="red"
          delay={1.4}
          isActive={true}
        />
        <StatsCard
          title="System Uptime"
          value="99.9%"
          change="+0.1%"
          icon={Activity}
          color="green"
          delay={1.6}
        />
      </motion.div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Feed Simulation */}
        <motion.div
          className="lg:col-span-2 bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-800 p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Live Camera Feed</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-400">Recording</span>
            </div>
          </div>
          
          <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50" />
            <div className="absolute top-4 left-4 flex items-center space-x-2">
              <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm border border-red-500/50">
                LIVE
              </div>
              <div className="bg-gray-800/80 text-white px-3 py-1 rounded-full text-sm">
                Camera 01 - Main Entrance
              </div>
            </div>
            
            <div className="absolute bottom-4 right-4 flex items-center space-x-4 text-white">
              <div className="flex items-center space-x-1">
                <Wifi className="w-4 h-4" />
                <span className="text-sm">Strong</span>
              </div>
              <div className="flex items-center space-x-1">
                <Signal className="w-4 h-4" />
                <span className="text-sm">4K</span>
              </div>
            </div>

            {/* Simulated detection boxes */}
            <motion.div
              className="absolute top-1/3 left-1/4 w-20 h-16 border-2 border-cyan-400 rounded"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="bg-cyan-400/20 text-cyan-400 text-xs px-1 -mt-6">Person</div>
            </motion.div>
            
            <motion.div
              className="absolute top-1/2 right-1/3 w-16 h-12 border-2 border-magenta-400 rounded"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, delay: 1, repeat: Infinity }}
            >
              <div className="bg-magenta-400/20 text-magenta-400 text-xs px-1 -mt-6">Bag</div>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mt-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-video bg-gray-800 rounded-lg relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-lg" />
                <div className="absolute bottom-2 left-2 text-xs text-gray-400">Cam {i + 1}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Alerts Panel */}
        <motion.div
          className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-800 p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Threat Detection Center</h3>
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded-full text-xs font-medium">
                {activeThreats} Active
              </span>
            </div>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <AlertItem
              type="Weapon Detection"
              message="Potential weapon detected via YOLOv8 model"
              time="30 sec ago"
              severity="critical"
              location="Main Entrance - Cam 01"
              suspect="Unknown Subject"
              delay={2.2}
            />
            <AlertItem
              type="Suspicious Loitering"
              message="Individual stationary for >5 minutes"
              time="2 min ago"
              severity="high"
              location="Parking Area - Cam 02"
              delay={2.4}
            />
            <AlertItem
              type="Face Recognition Match"
              message="Known suspect identified from database"
              time="3 min ago"
              severity="high"
              location="Lobby - Cam 03"
              suspect="John Doe (ID: 0023)"
              delay={2.6}
            />
            <AlertItem
              type="Unattended Baggage"
              message="Bag left without owner for >3 minutes"
              time="5 min ago"
              severity="medium"
              location="Waiting Area - Cam 01"
              delay={2.8}
            />
            <AlertItem
              type="Crowd Dispersal"
              message="Sudden drop in crowd density detected"
              time="8 min ago"
              severity="medium"
              location="Main Hall - Cam 04"
              delay={3.0}
            />
            <AlertItem
              type="Emotion Analysis"
              message="Angry emotion detected on weapon holder"
              time="10 min ago"
              severity="low"
              location="Security Gate - Cam 01"
              delay={3.2}
            />
          </div>

          {/* Quick Actions */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="text-sm font-medium text-gray-300 mb-3">Quick Actions</div>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                className="bg-red-600/20 hover:bg-red-600/30 text-red-300 px-3 py-2 rounded-lg text-sm border border-red-600/30 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Emergency Alert
              </motion.button>
              <motion.button
                className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 px-3 py-2 rounded-lg text-sm border border-blue-600/30 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Export Report
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Team Information Footer */}
      <motion.div
        className="bg-gradient-to-r from-gray-900/60 to-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 3.4 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-bold text-white mb-2">Team Cypher</h4>
            <p className="text-gray-400 text-sm">
              Advanced AI surveillance solution for Cytherthon.ai Hackathon – May 2025
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">24/7</div>
              <div className="text-xs text-gray-500">Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-magenta-400">99.9%</div>
              <div className="text-xs text-gray-500">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">Real-time</div>
              <div className="text-xs text-gray-500">Detection</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const HeroSection = () => {
  return (
    <motion.div
      className="px-8 py-12 relative z-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2 }}
    >
      <h1 className="text-5xl md:text-6xl font-bold mb-4">
        <span className="bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
          Next-Gen AI Surveillance
        </span>
      </h1>
      <p className="text-xl text-gray-300 mb-6 max-w-2xl">
        Real-time threat detection with advanced behavior analysis, face recognition, and weapon identification.
      </p>
      
      <motion.button
        className="bg-gradient-to-r from-cyan-600 via-magenta-600 to-green-600 hover:from-cyan-700 hover:via-magenta-700 hover:to-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 flex items-center space-x-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Play className="w-5 h-5" />
        <span>Watch Live Demo</span>
      </motion.button>

      <motion.div
        className="flex items-center space-x-6 text-sm text-gray-400 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-cyan-400" />
          <span>Team Cypher</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-magenta-400" />
          <span>Cytherthon.ai Hackathon – May 2025</span>
        </div>
      </motion.div>
    </motion.div>
  );
};


const FeaturesSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 10
      }
    }
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const glowVariants = {
    glow: {
      boxShadow: [
        "0 0 20px rgba(59, 130, 246, 0.3)",
        "0 0 40px rgba(59, 130, 246, 0.6)",
        "0 0 20px rgba(59, 130, 246, 0.3)"
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className="px-8 py-12 relative z-10  text-gray-100 overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 30, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          className="mb-16 text-center"
          variants={headerVariants}
        >
          <motion.h2 
            className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.span 
              className="text-4xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🔍
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Features
            </motion.span>
          </motion.h2>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ delay: 0.8, duration: 1 }}
          />
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
        >
          
          {/* Behavior Detection */}
          <motion.div 
            className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 relative overflow-hidden group cursor-pointer"
            variants={cardVariants}
            whileHover={{ 
              scale: 1.03,
              rotateY: 5,
              boxShadow: "0 20px 40px rgba(59, 130, 246, 0.2)"
            }}
            onHoverStart={() => setHoveredCard('behavior')}
            onHoverEnd={() => setHoveredCard(null)}
            animate={hoveredCard === 'behavior' ? glowVariants.glow : {}}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <motion.h3 
              className="text-xl font-semibold text-blue-400 mb-6 flex items-center gap-3 relative z-10"
              variants={pulseVariants}
              animate="pulse"
            >
              <motion.span
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                🎯
              </motion.span>
              Behavior Detection
            </motion.h3>
            <motion.ul 
              className="space-y-4 text-gray-300 relative z-10"
              variants={containerVariants}
            >
              {[
                { label: "Loitering:", desc: "Flags stationary individuals." },
                { label: "Unattended Baggage:", desc: "Detects left bags without owners." },
                { label: "Sudden Dispersal:", desc: "Triggers when crowd size drops quickly." }
              ].map((item, index) => (
                <motion.li
                  key={index}
                  variants={listItemVariants}
                  whileHover={{ x: 10, color: "#ffffff" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="font-medium text-white">{item.label}</span> {item.desc}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Weapon Detection */}
          <motion.div 
            className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 relative overflow-hidden group cursor-pointer"
            variants={cardVariants}
            whileHover={{ 
              scale: 1.03,
              rotateY: -5,
              boxShadow: "0 20px 40px rgba(239, 68, 68, 0.2)"
            }}
            onHoverStart={() => setHoveredCard('weapon')}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <motion.h3 
              className="text-xl font-semibold text-red-400 mb-6 flex items-center gap-3 relative z-10"
              variants={pulseVariants}
              animate="pulse"
            >
              <motion.span
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🧨
              </motion.span>
              Weapon Detection 
              <motion.span 
                className="text-xs bg-gray-700 px-3 py-1 rounded-full text-gray-400 border border-gray-600"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                (Demo)
              </motion.span>
            </motion.h3>
            <motion.ul 
              className="space-y-4 text-gray-300 relative z-10"
              variants={containerVariants}
            >
              {[
                "Handbags are treated as proxies for weapons.",
                <span key="red">
                  <motion.span 
                    className="text-red-400 font-medium"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Red bounding box
                  </motion.span> follows handbag.
                </span>,
                "Alert persists once triggered."
              ].map((item, index) => (
                <motion.li
                  key={index}
                  variants={listItemVariants}
                  whileHover={{ x: 10, color: "#ffffff" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Face Recognition */}
          <motion.div 
            className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 relative overflow-hidden group cursor-pointer md:col-span-2 lg:col-span-1"
            variants={cardVariants}
            whileHover={{ 
              scale: 1.03,
              rotateY: 5,
              boxShadow: "0 20px 40px rgba(168, 85, 247, 0.2)"
            }}
            onHoverStart={() => setHoveredCard('face')}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <motion.h3 
              className="text-xl font-semibold text-purple-400 mb-6 flex items-center gap-3 relative z-10"
              variants={pulseVariants}
              animate="pulse"
            >
              <motion.span
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotateY: [0, 180, 360]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🧠
              </motion.span>
              Face Recognition & Emotion Labeling
            </motion.h3>
            <motion.ul 
              className="space-y-4 text-gray-300 relative z-10"
              variants={containerVariants}
            >
              <motion.li variants={listItemVariants} whileHover={{ x: 10, color: "#ffffff" }}>
                Recognizes known suspects via{' '}
                <motion.code 
                  className="bg-gray-700 px-2 py-1 rounded text-yellow-400 text-sm border border-gray-600"
                  whileHover={{ 
                    backgroundColor: "#374151",
                    scale: 1.05
                  }}
                >
                  data/known_suspects.json
                </motion.code>
              </motion.li>
              <motion.li variants={listItemVariants} whileHover={{ x: 10, color: "#ffffff" }}>
                Shows suspect names in{' '}
                <motion.span 
                  className="text-pink-400 font-medium"
                  animate={{ 
                    textShadow: [
                      "0 0 10px rgba(236, 72, 153, 0.5)",
                      "0 0 20px rgba(236, 72, 153, 0.8)",
                      "0 0 10px rgba(236, 72, 153, 0.5)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  magenta
                </motion.span>
              </motion.li>
              <motion.li variants={listItemVariants} className="space-y-3">
                <div className="text-white font-medium">Labels:</div>
                <motion.ul 
                  className="ml-6 space-y-2"
                  variants={containerVariants}
                >
                  <motion.li 
                    variants={listItemVariants}
                    whileHover={{ x: 10 }}
                  >
                    Weapon holder → <motion.span 
                      className="text-red-400 font-medium"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      "Angry"
                    </motion.span>
                  </motion.li>
                  <motion.li 
                    variants={listItemVariants}
                    whileHover={{ x: 10 }}
                  >
                    Others → <span className="text-gray-400 font-medium">"Neutral"</span>
                  </motion.li>
                </motion.ul>
              </motion.li>
            </motion.ul>
          </motion.div>

        </motion.div>

        {/* Input & Output Section */}
        <motion.div 
          className="bg-gradient-to-r from-gray-800 via-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 relative overflow-hidden group"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 12,
            delay: 1.2
          }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 25px 50px rgba(34, 197, 94, 0.2)"
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
          
          <motion.h3 
            className="text-3xl font-semibold text-green-400 mb-8 flex items-center gap-3 relative z-10"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            <motion.span
              animate={{ 
                rotateY: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🎥
            </motion.span>
            Input & Output
          </motion.h3>
          
          <motion.div 
            className="grid md:grid-cols-2 gap-12 relative z-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={cardVariants}>
              <motion.h4 
                className="text-xl font-medium text-white mb-4 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  📥
                </motion.span>
                Input Sources
              </motion.h4>
              <motion.ul 
                className="space-y-3 text-gray-300"
                variants={containerVariants}
              >
                <motion.li
                  variants={listItemVariants}
                  whileHover={{ x: 10, color: "#ffffff" }}
                  className="flex items-center gap-2"
                >
                  <motion.span
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    •
                  </motion.span>
                  Webcam or MP4 (user selected)
                </motion.li>
              </motion.ul>
            </motion.div>
            
            <motion.div variants={cardVariants}>
              <motion.h4 
                className="text-xl font-medium text-white mb-4 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  📤
                </motion.span>
                Outputs
              </motion.h4>
              <motion.ul 
                className="space-y-3 text-gray-300"
                variants={containerVariants}
              >
                <motion.li
                  variants={listItemVariants}
                  whileHover={{ x: 10, color: "#ffffff" }}
                  className="flex items-center gap-2"
                >
                  <motion.span
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    •
                  </motion.span>
                  Processed video → <motion.code 
                    className="bg-gray-700 px-2 py-1 rounded text-blue-400 text-sm border border-gray-600"
                    whileHover={{ 
                      backgroundColor: "#374151",
                      scale: 1.05
                    }}
                  >
                    demo/output_*.mp4
                  </motion.code>
                </motion.li>
                <motion.li
                  variants={listItemVariants}
                  whileHover={{ x: 10, color: "#ffffff" }}
                  className="flex items-center gap-2"
                >
                  <motion.span
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: 0.5 }}
                  >
                    •
                  </motion.span>
                  Alert snapshots → <motion.code 
                    className="bg-gray-700 px-2 py-1 rounded text-orange-400 text-sm border border-gray-600"
                    whileHover={{ 
                      backgroundColor: "#374151",
                      scale: 1.05
                    }}
                  >
                    demo/frame_*.jpg
                  </motion.code>
                </motion.li>
              </motion.ul>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Footer = () => {
  return (
    <motion.footer
      className="bg-gray-900/80 backdrop-blur-xl border-t border-gray-800 py-12 px-8 relative z-10"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-8 h-8 text-cyan-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-400 bg-clip-text text-transparent">
                Rakshak AI
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Advanced AI surveillance system for real-time threat detection and prevention.
            </p>
            <div className="flex space-x-4">
              <motion.a 
                href="#" 
                className="text-gray-400 hover:text-cyan-400 transition-colors"
                whileHover={{ y: -2 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </motion.a>
              <motion.a 
                href="#" 
                className="text-gray-400 hover:text-magenta-400 transition-colors"
                whileHover={{ y: -2 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </motion.a>
              <motion.a 
                href="#" 
                className="text-gray-400 hover:text-green-400 transition-colors"
                whileHover={{ y: -2 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </motion.a>
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Features', 'Demo', 'Pricing', 'Contact'].map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <a href="#" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-0.5 text-cyan-400" />
                <span>123 Security Lane, Cyber City, IN 560001</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-magenta-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>contact@rakshakai.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+91 98765 43210</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <p>© {new Date().getFullYear()} Rakshak AI. All rights reserved.</p>
          <p className="mt-2">Developed with ❤️ by Team Cypher for Cytherthon.ai Hackathon</p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

const RakshakAILanding = () => {
  return (
    <div className="min-h-screen  text-white relative">
      <BackgroundAnimation />
      <Header />
      
      <div className="pt-20 relative z-10">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Dashboard Interface */}
        <div className="flex min-h-screen">
          <Sidebar />
          <Dashboard />
        </div>
        
        {/* Footer */}
        <FeaturesSection />
        
        <Footer />
      </div>
    </div>
  );
};

export default RakshakAILanding;