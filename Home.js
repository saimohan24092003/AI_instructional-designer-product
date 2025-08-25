// frontend/src/pages/Home.js - Enhanced with Animations
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logo from '../assets/clamshellconsulting_logo.jpeg';
import idPic from '../assets/ID_pic.png';

export default function Home() {
  const leftColumnRef = useRef(null);
  const rightColumnRef = useRef(null);
  const featuresRef = useRef([]);

  useEffect(() => {
    // Add Google Fonts - Multiple attractive fonts
    const fonts = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
      'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap',
      'https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap'
    ];
    
    fonts.forEach(fontUrl => {
      const link = document.createElement('link');
      link.href = fontUrl;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    });

    // Animate elements on mount
    const animateOnLoad = () => {
      if (leftColumnRef.current) {
        leftColumnRef.current.style.animation = 'slideInFromLeft 1s ease-out';
      }
      if (rightColumnRef.current) {
        rightColumnRef.current.style.animation = 'slideInFromRight 1s ease-out 0.5s both';
      }
      
      // Animate features
      featuresRef.current.forEach((item, index) => {
        if (item) {
          item.style.animation = `fadeInUp 0.6s ease-out ${1.5 + (index * 0.2)}s both`;
        }
      });
    };

    animateOnLoad();

    // Remove mouse parallax - no cleanup needed
    return () => {};
  }, []);

  const addFeatureRef = (el, index) => {
    featuresRef.current[index] = el;
  };

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

        /* Enhanced Typography Animations */
        @keyframes textGlow {
          0%, 100% { text-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
          50% { text-shadow: 0 0 30px rgba(168, 85, 247, 0.8), 0 0 40px rgba(236, 72, 153, 0.6); }
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(168, 85, 247, 0.6), 0 0 60px rgba(236, 72, 153, 0.4); }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .brand-name-animated {
          background: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899);
          background-size: 200% 200%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientShift 3s ease-in-out infinite, textGlow 3s ease-in-out infinite;
        }

        .main-heading-animated {
          font-family: 'Inter', sans-serif;
          font-weight: 900;
        }

        .gradient-text-animated {
          background: linear-gradient(135deg, #60a5fa, #a855f7, #ec4899);
          background-size: 200% 200%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientShift 4s ease-in-out infinite;
        }

        .floating-orb {
          transition: transform 2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .animated-card {
          /* Remove float animation */
          transition: all 0.3s ease;
        }

        .animated-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
        }

        .button-hover:hover {
          transform: translateY(-3px) scale(1.05);
          transition: all 0.3s ease;
        }

        .feature-dot-animated {
          animation: pulseGlow 2s ease-in-out infinite;
        }

        .feature-text-enhanced {
          font-family: 'Orbitron', 'Space Grotesk', monospace;
          font-weight: 700;
          font-size: 16px;
          background: linear-gradient(135deg, #00d4ff, #ff00e6, #ffaa00, #00ff88);
          background-size: 300% 300%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: 0.05em;
          line-height: 1.4;
          text-transform: uppercase;
          transition: all 0.4s ease;
          animation: rainbowShift 3s ease-in-out infinite;
          text-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
        }

        @keyframes rainbowShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes neonGlow {
          0%, 100% { 
            text-shadow: 
              0 0 5px rgba(0, 212, 255, 0.5),
              0 0 10px rgba(0, 212, 255, 0.5),
              0 0 15px rgba(0, 212, 255, 0.5);
          }
          50% { 
            text-shadow: 
              0 0 10px rgba(255, 0, 230, 0.8),
              0 0 20px rgba(255, 0, 230, 0.8),
              0 0 30px rgba(255, 0, 230, 0.8);
          }
        }

        .feature-item-enhanced:hover .feature-text-enhanced {
          font-size: 17px;
          background: linear-gradient(135deg, #ffffff, #00d4ff, #ff00e6);
          background-size: 200% 200%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          transform: translateX(8px) scale(1.02);
          animation: neonGlow 1s ease-in-out infinite, rainbowShift 2s ease-in-out infinite;
          letter-spacing: 0.08em;
        }

        .feature-item-enhanced:hover .feature-dot-animated {
          background: linear-gradient(45deg, #00d4ff, #ff00e6, #ffaa00);
          box-shadow: 
            0 0 20px rgba(0, 212, 255, 0.8),
            0 0 30px rgba(255, 0, 230, 0.6),
            0 0 40px rgba(255, 170, 0, 0.4);
          transform: scale(1.5) rotate(180deg);
          animation: spinGlow 1s linear infinite;
        }

        @keyframes spinGlow {
          0% { transform: scale(1.5) rotate(0deg); }
          100% { transform: scale(1.5) rotate(360deg); }
        }

        .nav-link-animated:hover {
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }

        .logout-btn-animated {
          animation: pulseGlow 3s ease-in-out infinite;
          transition: all 0.3s ease;
        }

        .logout-btn-animated:hover {
          transform: translateY(-2px);
        }
      `}</style>

      <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 relative overflow-hidden">
        
        {/* Header - Full Width */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-white/10 w-full">
          <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <img 
                src={logo} 
                alt="Clamshell Consulting" 
                className="h-8 w-auto mr-3"
              />
              <span className="text-xl font-bold text-gray-900 brand-name-animated">
                Clamshell Learning
              </span>
            </div>
            <nav className="flex items-center gap-6">
              <Link 
                to="/dashboard" 
                className="text-gray-600 hover:text-blue-600 font-medium nav-link-animated"
              >
                Dashboard
              </Link>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold logout-btn-animated button-hover">
                Logout
              </button>
            </nav>
          </div>
        </header>

        {/* Fixed Background decoration elements - No mouse dependency */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating-orb absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="floating-orb absolute top-40 right-20 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl"></div>
          <div className="floating-orb absolute bottom-20 left-1/3 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Main content - Full Width */}
        <div className="relative z-10 w-full pt-20 pb-8">
          <div className="w-full max-w-none px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start font-sans w-full">
              
              {/* Left Column - Full Width */}
              <div ref={leftColumnRef} className="space-y-8 flex flex-col justify-center py-12 w-full">
                {/* Enhanced Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-400/30 backdrop-blur-sm w-fit">
                  <img 
                    src={logo} 
                    alt="Clamshell Consulting" 
                    className="h-5 w-auto"
                  />
                  <span className="text-sm text-blue-200 font-medium">AI-Powered Learning Platform</span>
                </div>
                
                {/* Enhanced Main Heading */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight main-heading-animated">
                  <span className="text-white block">Instructional</span>
                  <span className="gradient-text-animated block">
                    Design Assistant
                  </span>
                  <span className="text-white/90 block">for Teams</span>
                </h1>
                
                {/* Enhanced Description */}
                <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-none">
                  Transform your content creation process with AI. Generate objectives, conduct SME interviews, and produce professional reports in minutes, not hours.
                </p>
                
                {/* Enhanced Buttons */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                  <Link 
                    to="/signup" 
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-xl button-hover text-center"
                  >
                    Get Started →
                  </Link>
                  
                  <Link 
                    to="/login" 
                    className="w-full sm:w-auto px-8 py-4 text-white font-semibold border-2 border-white/20 rounded-xl hover:bg-white/10 button-hover text-center"
                  >
                    Sign In
                  </Link>
                </div>
              </div>

              {/* Right Column - Full Width */}
              <div ref={rightColumnRef} className="relative flex justify-center items-center py-12 w-full">
                {/* Static Main Platform Card */}
                <div className="animated-card relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl w-full max-w-lg">
                  
                  {/* Card Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center overflow-hidden">
                      <img 
                        src={idPic} 
                        alt="Instructional Design" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-xl leading-tight">
                        Instructional<br />Design Platform
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-base mb-6 leading-relaxed">
                    Leverage AI to act as an experienced instructional designer
                  </p>

                  {/* ID Picture Display */}
                  <div className="bg-white/10 rounded-xl p-4 mb-6">
                    <img 
                      src={idPic} 
                      alt="Instructional Design Process" 
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>

                  <button className="w-full bg-white text-slate-800 font-semibold py-3 px-6 rounded-xl mb-6 shadow-lg button-hover">
                    Get started
                  </button>

                  {/* Enhanced Features List */}
                  <ul className="space-y-3">
                    {[
                      "AI-powered content analysis and extraction",
                      "Intelligent SME interview bot", 
                      "Strategic course planning and structure"
                    ].map((item, idx) => (
                      <li 
                        key={idx} 
                        ref={(el) => addFeatureRef(el, idx)}
                        className="feature-item-enhanced flex items-center gap-5 text-sm opacity-0 cursor-pointer p-3 rounded-xl transition-all duration-500 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 hover:border hover:border-cyan-400/30"
                      >
                        <span className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex-shrink-0 feature-dot-animated"></span>
                        <span className="feature-text-enhanced">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Static Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-pink-500/20 to-yellow-500/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}