'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  Database, 
  Zap, 
  Shield, 
  Users, 
  TrendingUp,
  CheckCircle,
  Star,
  Github,
  Twitter,
  Linkedin,
  Play,
  Download,
  Globe,
  Clock,
  Target,
  BarChart3,
  Brain,
  Cpu,
  Layers,
  Workflow,
  ChevronRight,
  Menu,
  X,
  Book,
  FileText,
  ExternalLink
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [activeFeature, setActiveFeature] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDocsClick = () => {
    // This will be handled by the parent component to navigate to docs
    window.dispatchEvent(new CustomEvent('navigate-to-docs'));
  };

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Intelligence",
      description: "Advanced machine learning algorithms analyze your data patterns and optimize resource allocation automatically",
      details: "Our neural networks process complex relationships between tasks, workers, and constraints to deliver optimal solutions.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Workflow className="h-8 w-8" />,
      title: "Smart Automation",
      description: "Transform manual processes into intelligent workflows with natural language rule configuration",
      details: "Simply describe your business rules in plain English and watch them convert to executable logic.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Layers className="h-8 w-8" />,
      title: "Real-time Processing",
      description: "Process thousands of data points instantly with live validation and error detection",
      details: "Get immediate feedback on data quality with actionable suggestions for improvements.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Cpu className="h-8 w-8" />,
      title: "Optimization Engine",
      description: "Multi-objective optimization balances competing priorities for maximum efficiency",
      details: "Configure custom weights for priority, fairness, efficiency, and workload distribution.",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const stats = [
    { label: "Processing Speed", value: "10x", icon: <Zap className="h-5 w-5 md:h-6 md:w-6" />, color: "text-yellow-400" },
    { label: "Accuracy Rate", value: "99.9%", icon: <Target className="h-5 w-5 md:h-6 md:w-6" />, color: "text-green-400" },
    { label: "Time Saved", value: "80%", icon: <Clock className="h-5 w-5 md:h-6 md:w-6" />, color: "text-blue-400" },
    { label: "Data Rules", value: "12+", icon: <Shield className="h-5 w-5 md:h-6 md:w-6" />, color: "text-purple-400" }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Operations Director",
      company: "TechCorp",
      content: "Data Alchemist transformed our resource allocation process. What used to take days now takes minutes with incredible accuracy.",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Project Manager",
      company: "InnovateLab",
      content: "The natural language rule creation is revolutionary. Our team can now configure complex allocation rules without any technical expertise.",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Data Analyst",
      company: "DataFlow Inc",
      content: "The AI validation caught critical errors we never would have found manually. It's like having a data expert working 24/7.",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
      rating: 5
    }
  ];

  const useCases = [
    {
      title: "Project Management",
      description: "Optimize team assignments and resource allocation across complex projects",
      icon: <Users className="h-8 w-8 md:h-10 md:w-10" />,
      metrics: ["40% faster delivery", "25% better utilization", "90% satisfaction"],
      gradient: "from-blue-600 to-purple-600"
    },
    {
      title: "Workforce Planning",
      description: "Balance workloads and skill requirements for maximum team efficiency",
      icon: <BarChart3 className="h-8 w-8 md:h-10 md:w-10" />,
      metrics: ["60% planning reduction", "35% team satisfaction", "50% cost savings"],
      gradient: "from-green-600 to-teal-600"
    },
    {
      title: "Operations Optimization",
      description: "Streamline processes and eliminate bottlenecks with intelligent automation",
      icon: <TrendingUp className="h-8 w-8 md:h-10 md:w-10" />,
      metrics: ["50% efficiency gain", "90% error reduction", "70% faster processing"],
      gradient: "from-orange-600 to-red-600"
    }
  ];

  return (
    <div className="min-h-screen modern-background text-white overflow-hidden relative">
      {/* Subtle grid overlay */}
      <div className="grid-overlay"></div>

      {/* Premium Navigation */}
      <nav className={`fixed top-0 w-full z-50 premium-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="container mx-auto px-4 sm:px-6 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="logo-container">
              <div className="logo-icon">
                <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <span className="logo-text">Data Alchemist</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="nav-links">
              <a href="#features" className="nav-link">Features</a>
              <a href="#use-cases" className="nav-link">Use Cases</a>
              <a href="#testimonials" className="nav-link">Testimonials</a>
              <button
                onClick={handleDocsClick}
                className="nav-link flex items-center gap-2 hover:text-purple-300"
              >
                <Book className="h-4 w-4" />
                Documentation
                <ExternalLink className="h-3 w-3 opacity-60" />
              </button>
              <button
                onClick={onGetStarted}
                className="cta-button"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-button"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mobile-menu"
            >
              <div className="mobile-menu-links">
                <a href="#features" className="mobile-menu-link">Features</a>
                <a href="#use-cases" className="mobile-menu-link">Use Cases</a>
                <a href="#testimonials" className="mobile-menu-link">Testimonials</a>
                <button
                  onClick={handleDocsClick}
                  className="mobile-menu-link flex items-center gap-2"
                >
                  <Book className="h-4 w-4" />
                  Documentation
                </button>
                <button
                  onClick={onGetStarted}
                  className="mobile-cta-button"
                >
                  Get Started
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 md:pt-40 pb-16 md:pb-20 px-4 sm:px-6 z-10">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 glass-card rounded-full mb-6 md:mb-8">
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs md:text-sm text-gray-300 font-medium">AI-Powered Resource Allocation Platform</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-6 md:mb-8 leading-tight">
              Turn Data Chaos Into
              <span className="plasma-text block">
                Smart Action
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
              AI-powered platform that cleans, validates, and transforms messy spreadsheets into intelligent, 
              rule-ready resource plans — all with natural language.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center px-4">
              <button
                onClick={onGetStarted}
                className="group btn-modern w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-semibold flex items-center justify-center gap-3 text-white"
              >
                <Play className="h-5 w-5 md:h-6 md:w-6 group-hover:scale-110 transition-transform" />
                Start Free Trial
                <ArrowRight className="h-5 w-5 md:h-6 md:w-6 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={handleDocsClick}
                className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 glass-card rounded-xl text-base md:text-lg font-semibold flex items-center justify-center gap-3 hover:bg-white/10 transition-all duration-300"
              >
                <FileText className="h-5 w-5 md:h-6 md:w-6" />
                View Documentation
              </button>
            </div>

            <div className="mt-12 md:mt-16 text-xs md:text-sm text-gray-400">
              <p>Trusted by 10,000+ teams worldwide • No credit card required</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-20 px-4 sm:px-6 relative z-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="flex items-center justify-center mb-3 md:mb-4">
                  <div className="p-3 md:p-4 glass-card rounded-xl md:rounded-2xl group-hover:bg-white/10 transition-all duration-300">
                    <div className={stat.color}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
                <div className="text-2xl md:text-4xl font-bold text-white mb-1 md:mb-2">{stat.value}</div>
                <div className="text-gray-400 font-medium text-sm md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-20 px-4 sm:px-6 relative z-10">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full mb-4 md:mb-6"
            >
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-xs md:text-sm text-gray-300 font-medium">Powerful Features</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6">
              Built for the Future of
              <span className="plasma-text block">Resource Management</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Experience next-generation AI capabilities designed to transform how you handle resource allocation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
            <div className="space-y-4 md:space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 md:p-6 rounded-xl md:rounded-2xl border cursor-pointer transition-all duration-300 ${
                    activeFeature === index
                      ? 'border-white/30 glass-card'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className={`p-2 md:p-3 rounded-lg md:rounded-xl bg-gradient-to-br ${feature.gradient} transition-all duration-300`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-300 mb-3 text-sm md:text-base">{feature.description}</p>
                      {activeFeature === index && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="text-gray-400 text-xs md:text-sm"
                        >
                          {feature.details}
                        </motion.p>
                      )}
                    </div>
                    <ChevronRight className={`h-4 w-4 md:h-5 md:w-5 text-gray-400 transition-transform ${activeFeature === index ? 'rotate-90' : ''}`} />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="relative mt-8 lg:mt-0">
              <div className="glass-card rounded-xl md:rounded-2xl p-6 md:p-8">
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 bg-red-500 rounded-full" />
                    <div className="h-3 w-3 bg-yellow-500 rounded-full" />
                    <div className="h-3 w-3 bg-green-500 rounded-full" />
                  </div>
                  
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-400" />
                      <span className="text-gray-300 text-sm md:text-base">AI validation complete</span>
                      <div className="ml-auto px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">99.9%</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-400" />
                      <span className="text-gray-300 text-sm md:text-base">Business rules configured</span>
                      <div className="ml-auto px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">12 rules</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-400" />
                      <span className="text-gray-300 text-sm md:text-base">Optimization weights set</span>
                      <div className="ml-auto px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">Balanced</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4 md:h-5 md:w-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-gray-300 text-sm md:text-base">Generating allocation...</span>
                      <div className="ml-auto px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">Processing</div>
                    </div>
                  </div>

                  <div className="bg-black/20 rounded-lg md:rounded-xl p-3 md:p-4 border border-white/10">
                    <div className="text-xs md:text-sm text-gray-400 mb-2">Natural Language Rule</div>
                    <div className="text-white italic mb-2 text-sm md:text-base">
                      "Tasks T12 and T14 should always run together"
                    </div>
                    <div className="text-green-400 text-xs md:text-sm flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 md:h-4 md:w-4" />
                      Converted to Co-Run Rule
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-16 md:py-20 px-4 sm:px-6 relative z-10">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full mb-4 md:mb-6"
            >
              <Target className="h-4 w-4 text-green-400" />
              <span className="text-xs md:text-sm text-gray-300 font-medium">Real-World Impact</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6">
              Proven Results Across
              <span className="plasma-text block">Every Industry</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              See how leading organizations use Data Alchemist to solve complex allocation challenges
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div className="glass-card rounded-xl md:rounded-2xl p-6 md:p-8 hover:bg-white/10 transition-all duration-300 h-full">
                  <div className="flex justify-center mb-4 md:mb-6">
                    <div className={`p-3 md:p-4 bg-gradient-to-br ${useCase.gradient} rounded-xl md:rounded-2xl`}>
                      {useCase.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4 text-center">{useCase.title}</h3>
                  <p className="text-gray-300 mb-4 md:mb-6 text-center text-sm md:text-base">{useCase.description}</p>
                  
                  <div className="space-y-2 md:space-y-3">
                    {useCase.metrics.map((metric, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-xs md:text-sm">{metric}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-20 px-4 sm:px-6 relative z-10">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full mb-4 md:mb-6"
            >
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-xs md:text-sm text-gray-300 font-medium">Customer Stories</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6">
              Loved by Teams
              <span className="plasma-text block">Around the World</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of satisfied customers who have transformed their workflows
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-xl md:rounded-2xl p-6 md:p-8 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-300 mb-4 md:mb-6 italic text-sm md:text-base">"{testimonial.content}"</p>
                
                <div className="flex items-center gap-3 md:gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border-2 border-white/20"
                  />
                  <div>
                    <div className="font-semibold text-white text-sm md:text-base">{testimonial.name}</div>
                    <div className="text-gray-400 text-xs md:text-sm">{testimonial.role}</div>
                    <div className="text-gray-500 text-xs">{testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-4 sm:px-6 relative z-10">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="glass-card rounded-2xl md:rounded-3xl p-8 md:p-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6">
                Ready to Transform Your
                <span className="plasma-text block">Resource Allocation?</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto">
                Join thousands of teams who have revolutionized their workflow with AI-powered resource allocation
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
                <button
                  onClick={onGetStarted}
                  className="group btn-modern w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-semibold flex items-center justify-center gap-3 text-white"
                >
                  <Sparkles className="h-5 w-5 md:h-6 md:w-6 group-hover:scale-110 transition-transform" />
                  Start Free Trial
                  <ArrowRight className="h-5 w-5 md:h-6 md:w-6 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button 
                  onClick={handleDocsClick}
                  className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 glass-card rounded-xl text-base md:text-lg font-semibold flex items-center justify-center gap-3 hover:bg-white/20 transition-all duration-300"
                >
                  <Book className="h-5 w-5 md:h-6 md:w-6" />
                  Read Documentation
                </button>
              </div>

              <div className="mt-6 md:mt-8 text-gray-400">
                <p className="text-sm md:text-base">✨ No credit card required • 14-day free trial • Cancel anytime</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 md:py-12 px-4 sm:px-6 relative z-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <div className="h-8 w-8 md:h-10 md:w-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg md:rounded-xl flex items-center justify-center">
                  <Sparkles className="h-4 w-4 md:h-6 md:w-6 text-white" />
                </div>
                <span className="text-lg md:text-2xl font-bold plasma-text">Data Alchemist</span>
              </div>
              <p className="text-gray-400 text-sm mb-3 md:mb-4">
                AI-powered resource allocation for the modern enterprise
              </p>
              <div className="flex gap-3 md:gap-4">
                <a href="http://github.com/MiirzaBaig" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="h-4 w-4 md:h-5 md:w-5" />
                </a>
                <a href="https://x.com/MiirzaBaig" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-4 w-4 md:h-5 md:w-5" />
                </a>
                <a href="https://www.linkedin.com/in/mirza-baig-590b1826b/" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-4 w-4 md:h-5 md:w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-3 md:mb-4 text-sm md:text-base">Product</h4>
              <div className="space-y-2">
                <a href="#features" className="block text-gray-400 hover:text-white text-xs md:text-sm transition-colors accent-line">Features</a>
                <a href="#use-cases" className="block text-gray-400 hover:text-white text-xs md:text-sm transition-colors accent-line">Use Cases</a>
                <a href="#" className="block text-gray-400 hover:text-white text-xs md:text-sm transition-colors accent-line">Pricing</a>
                <a href="#" className="block text-gray-400 hover:text-white text-xs md:text-sm transition-colors accent-line">API</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-3 md:mb-4 text-sm md:text-base">Resources</h4>
              <div className="space-y-2">
                <button
                  onClick={handleDocsClick}
                  className="block text-gray-400 hover:text-white text-xs md:text-sm transition-colors accent-line text-left"
                >
                  Documentation
                </button>
                <a href="#" className="block text-gray-400 hover:text-white text-xs md:text-sm transition-colors accent-line">Tutorials</a>
                <a href="#" className="block text-gray-400 hover:text-white text-xs md:text-sm transition-colors accent-line">Blog</a>
                <a href="#" className="block text-gray-400 hover:text-white text-xs md:text-sm transition-colors accent-line">Support</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-3 md:mb-4 text-sm md:text-base">Company</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white text-xs md:text-sm transition-colors accent-line">About</a>
                <a href="#" className="block text-gray-400 hover:text-white text-xs md:text-sm transition-colors accent-line">Careers</a>
                <a href="#" className="block text-gray-400 hover:text-white text-xs md:text-sm transition-colors accent-line">Privacy</a>
                <a href="#" className="block text-gray-400 hover:text-white text-xs md:text-sm transition-colors accent-line">Terms</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-6 md:mt-8 pt-6 md:pt-8 text-center">
            <p className="text-gray-400 text-xs md:text-sm">
              © 2024 Data Alchemist. All rights reserved. Built with ❤️ for the future of work.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}