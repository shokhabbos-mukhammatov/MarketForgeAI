'use client';

import { useState } from 'react';
import { 
  Globe, 
  FileText, 
  ArrowRight, 
  Loader2,
  Sparkles
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [manualInfo, setManualInfo] = useState('');
  const [isManualMode, setIsManualMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleProceed = async () => {
    if ((!websiteUrl.trim() && !isManualMode) || (!manualInfo.trim() && isManualMode)) {
      return;
    }

    setIsLoading(true);

    // Simulate processing time
    setTimeout(() => {
      // Navigate to main dashboard after processing
      router.push('/');
    }, 3000);
  };

  const toggleManualMode = () => {
    setIsManualMode(!isManualMode);
    setWebsiteUrl('');
    setManualInfo('');
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-indigo-900/20" />
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/15 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center">
          <div className="glass rounded-2xl p-8 bg-gradient-to-br from-purple-500/15 to-blue-500/15 border border-white/20 shadow-2xl">
            <div className="mb-6">
              <div className="relative mx-auto w-16 h-16">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-lg animate-pulse" />
                <div className="relative glass rounded-full p-3 bg-gradient-to-br from-purple-500/15 to-blue-500/15">
                  <Loader2 size={40} className="text-white animate-spin" />
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-light text-gradient mb-3">
              Processing
            </h2>
            <p className="text-gray-300 text-base mb-4">
              Setting up your workspace...
            </p>
            
            <div className="flex items-center justify-center space-x-2 text-purple-400">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-indigo-900/20" />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Left Side - Architectural Image */}
      <div className="relative z-10 flex-1 overflow-hidden">
        <div className="relative h-full">
          {/* Image with overlay */}
          <div className="absolute inset-0">
            <img 
              src="/1381238830380MA_La_Luciole_03_photo_Luc_Boegly-ezgif.com-avif-to-png-converter.png"
              alt="Modern Architecture"
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay to blend with the right side */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-900/20 to-slate-900/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-slate-900/20" />
          </div>

          {/* Company name at bottom */}
          <div className="absolute bottom-6 left-6 z-20">
            <div className="flex items-center space-x-2">
              <img 
                src="/LogoArrow.png" 
                alt="MarketForge AI Logo" 
                className="w-6 h-6 opacity-90"
                style={{ filter: 'brightness(0) invert(1) opacity(0.9)' }}
              />
              <div>
                <h1 className="text-2xl font-light text-white drop-shadow-lg">
                  MarketForge AI
                </h1>
                <p className="text-sm text-white/70 drop-shadow">
                  AI-Powered Market Analysis
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Input Form */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6 bg-gradient-to-l from-slate-900/80 to-transparent">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-white/20 mb-3 backdrop-blur-sm">
              <Sparkles size={24} className="text-blue-300" />
            </div>
            <h2 className="text-2xl font-light text-gradient mb-2">
              Get Started
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Understand your business context
            </p>
          </div>

          {/* Main Input Box */}
          <div className="glass rounded-xl p-5 border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl">
            {!isManualMode ? (
              // URL Input Mode
              <div className="space-y-4">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 mb-2">
                    <Globe size={20} className="text-blue-300" />
                  </div>
                  <h3 className="text-base font-medium text-white mb-1">
                    Website Analysis
                  </h3>
                  <p className="text-xs text-gray-400">
                    Analyze your website automatically
                  </p>
                </div>

                <div className="space-y-3">
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://your-website.com"
                    className="w-full glass rounded-lg p-3 bg-white/5 text-white placeholder-gray-400 outline-none focus:bg-white/10 transition-all duration-200 text-sm"
                    autoFocus
                  />

                  <button
                    onClick={handleProceed}
                    disabled={!websiteUrl.trim()}
                    className={`w-full rounded-lg p-3 transition-all duration-200 flex items-center justify-center space-x-2 font-medium text-sm ${
                      websiteUrl.trim()
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                        : 'bg-white/10 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <span>Analyze Website</span>
                    <ArrowRight size={16} />
                  </button>

                  <div className="text-center pt-1">
                    <button
                      onClick={toggleManualMode}
                      className="text-xs text-gray-400 hover:text-white transition-colors underline underline-offset-2"
                    >
                      Enter information manually
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Manual Input Mode
              <div className="space-y-4">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 mb-2">
                    <FileText size={20} className="text-purple-300" />
                  </div>
                  <h3 className="text-base font-medium text-white mb-1">
                    Business Information
                  </h3>
                  <p className="text-xs text-gray-400">
                    Tell us about your business
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="glass rounded-lg p-1 bg-white/5">
                    <textarea
                      value={manualInfo}
                      onChange={(e) => setManualInfo(e.target.value)}
                      placeholder="Describe your business...

• What products/services do you offer?
• Who is your target audience?
• What industry are you in?"
                      className="w-full bg-transparent text-white placeholder-gray-400 outline-none resize-none p-3 leading-relaxed text-sm"
                      rows={6}
                      autoFocus
                    />
                  </div>

                  <button
                    onClick={handleProceed}
                    disabled={!manualInfo.trim()}
                    className={`w-full rounded-lg p-3 transition-all duration-200 flex items-center justify-center space-x-2 font-medium text-sm ${
                      manualInfo.trim()
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl'
                        : 'bg-white/10 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <span>Process Information</span>
                    <ArrowRight size={16} />
                  </button>

                  <div className="text-center pt-1">
                    <button
                      onClick={toggleManualMode}
                      className="text-xs text-gray-400 hover:text-white transition-colors underline underline-offset-2"
                    >
                      Back to website URL
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}