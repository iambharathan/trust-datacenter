import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, BookOpen, Users, Phone, MapPin, Clock, Star, ArrowRight, Menu, X, ChevronRight, Heart, Award } from 'lucide-react'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-emerald-800/95 backdrop-blur-md text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center group">
              <div className="bg-gradient-to-br from-yellow-400 to-amber-500 p-2 rounded-xl shadow-lg group-hover:shadow-glow transition-all duration-300">
                <GraduationCap className="h-6 w-6 lg:h-8 lg:w-8 text-emerald-900" />
              </div>
              <div className="ml-3">
                <span className="text-lg lg:text-xl font-bold tracking-tight">Madrasa Rahmania</span>
                <span className="hidden sm:block text-xs text-emerald-200">Kambipur Trust</span>
              </div>
            </Link>
            
            <div className="hidden lg:flex items-center space-x-1">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About Us' },
                { to: '/admissions', label: 'Admissions' },
                { to: '/notices', label: 'Notices' },
                { to: '/contact', label: 'Contact' },
              ].map(link => (
                <Link 
                  key={link.to}
                  to={link.to} 
                  className="px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <Link 
                to="/login" 
                className="ml-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-emerald-900 px-6 py-2.5 rounded-xl font-semibold hover:from-yellow-300 hover:to-amber-400 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                Admin Portal
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-emerald-900/98 backdrop-blur-lg border-t border-emerald-700 animate-fade-in-down">
            <div className="px-4 py-4 space-y-1">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About Us' },
                { to: '/admissions', label: 'Admissions' },
                { to: '/notices', label: 'Notices' },
                { to: '/contact', label: 'Contact' },
              ].map(link => (
                <Link 
                  key={link.to}
                  to={link.to} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <Link 
                to="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="block mt-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-emerald-900 px-4 py-3 rounded-xl font-semibold text-center"
              >
                Admin Portal
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white pt-16 lg:pt-20 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-hero-pattern opacity-30"></div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-emerald-100 mb-6 animate-fade-in-down">
                <Star className="w-4 h-4 mr-2 text-yellow-400" />
                Nurturing Islamic Excellence Since Establishment
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 animate-fade-in-up" style={{ fontFamily: "'Amiri', serif" }}>
                مدرسہ رحمانیہ عربیہ
              </h1>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                Madrasa Rahmania Arabia
              </h2>
              <p className="text-lg lg:text-xl text-emerald-100 mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
                Building tomorrow's leaders with comprehensive Islamic education, 
                Quranic knowledge, and strong moral values at <span className="text-yellow-400 font-semibold">Kambipur Trust</span>.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <Link 
                  to="/admissions" 
                  className="group bg-gradient-to-r from-yellow-400 to-amber-500 text-emerald-900 px-8 py-4 rounded-xl font-semibold text-lg hover:from-yellow-300 hover:to-amber-400 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 inline-flex items-center justify-center"
                >
                  Apply for Admission
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/about" 
                  className="group border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-emerald-800 transition-all duration-300 inline-flex items-center justify-center backdrop-blur-sm"
                >
                  Learn More
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                {[
                  { value: '500+', label: 'Students' },
                  { value: '25+', label: 'Teachers' },
                  { value: '15+', label: 'Years' },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center lg:text-left">
                    <div className="text-3xl lg:text-4xl font-bold text-yellow-400">{stat.value}</div>
                    <div className="text-sm text-emerald-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Decorative Card */}
            <div className="hidden lg:block relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 to-emerald-400/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl shadow-xl mb-4">
                    <BookOpen className="w-10 h-10 text-emerald-900" />
                  </div>
                  <h3 className="text-2xl font-bold">Comprehensive Islamic Education</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    'Quran Hifz & Tajweed',
                    'Islamic Studies (Aalim Course)',
                    'Arabic Language Proficiency',
                    'Character & Moral Development',
                    'Modern Educational Support',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center text-emerald-100">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/30 flex items-center justify-center mr-3">
                        <ChevronRight className="w-4 h-4 text-yellow-400" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
              Why Choose Us
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
              Excellence in <span className="text-emerald-600">Islamic Education</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              We provide comprehensive Islamic education combined with moral values and character building.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { 
                icon: BookOpen, 
                title: 'Quranic Education', 
                desc: 'Complete Hifz and Tajweed courses with experienced Qaris.',
                color: 'from-emerald-500 to-teal-500',
                bgColor: 'bg-emerald-50'
              },
              { 
                icon: Users, 
                title: 'Expert Faculty', 
                desc: 'Qualified Aalims and Muftis dedicated to quality education.',
                color: 'from-blue-500 to-indigo-500',
                bgColor: 'bg-blue-50'
              },
              { 
                icon: Heart, 
                title: 'Character Building', 
                desc: 'Focus on Islamic values, ethics, and personality development.',
                color: 'from-rose-500 to-pink-500',
                bgColor: 'bg-rose-50'
              },
              { 
                icon: Award, 
                title: 'Certified Programs', 
                desc: 'Recognized certifications upon completion of programs.',
                color: 'from-amber-500 to-orange-500',
                bgColor: 'bg-amber-50'
              },
            ].map((feature, idx) => (
              <div 
                key={idx} 
                className="group bg-white p-8 rounded-2xl border border-gray-100 shadow-soft hover:shadow-card-hover hover:-translate-y-2 transition-all duration-500"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className={`${feature.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-8 w-8 bg-gradient-to-br ${feature.color} bg-clip-text text-emerald-600`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold mb-4">
              Our Programs
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
              Programs <span className="text-emerald-600">We Offer</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Tailored programs for different age groups and learning objectives.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Nazra Quran', desc: 'Basic Quran reading with proper Tajweed rules', duration: '1-2 Years', icon: '📖', color: 'emerald' },
              { name: 'Hifz Course', desc: 'Complete Quran memorization with revision', duration: '3-5 Years', icon: '🌟', color: 'blue' },
              { name: 'Aalim Course', desc: 'Comprehensive Islamic scholarship program', duration: '7-8 Years', icon: '🎓', color: 'purple' },
              { name: 'Arabic Language', desc: 'Arabic speaking, reading and writing', duration: '2-3 Years', icon: '✍️', color: 'amber' },
            ].map((program, idx) => (
              <div 
                key={idx} 
                className="group relative bg-white rounded-2xl border-2 border-gray-100 p-6 hover:border-emerald-500 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <span className="text-4xl mb-4 block">{program.icon}</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{program.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{program.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-600 font-semibold text-sm flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {program.duration}
                    </span>
                    <Link to="/admissions" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center group/link">
                      Apply
                      <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-20"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Admissions are now open for the new academic year. Join us in nurturing the next generation of Islamic scholars.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/admissions" 
              className="bg-white text-emerald-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 inline-flex items-center justify-center"
            >
              Start Application
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              to="/contact" 
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all inline-flex items-center justify-center"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: MapPin, title: 'Our Location', info: 'Kambipur, Karnataka, India', color: 'from-emerald-400 to-teal-400' },
              { icon: Phone, title: 'Contact Us', info: '+91 XXXXX XXXXX', color: 'from-blue-400 to-indigo-400' },
              { icon: Clock, title: 'Working Hours', info: '6:00 AM - 8:00 PM', color: 'from-amber-400 to-orange-400' },
            ].map((item, idx) => (
              <div key={idx} className="text-center group">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <item.icon className="h-8 w-8 text-gray-900" />
                </div>
                <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.info}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center mb-4">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-2 rounded-xl">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-white font-bold text-xl">Madrasa Rahmania Arabia</span>
              </Link>
              <p className="text-gray-500 max-w-sm">
                Nurturing minds with Islamic education and values. Building tomorrow's leaders with Quranic knowledge.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['About Us', 'Admissions', 'Programs', 'Contact'].map(link => (
                  <li key={link}>
                    <Link to={`/${link.toLowerCase().replace(' ', '-')}`} className="hover:text-white transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-sm">
                <li>Kambipur, Karnataka</li>
                <li>+91 XXXXX XXXXX</li>
                <li>info@madrasa.com</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} Kambipur Trust. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
