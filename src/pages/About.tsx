import React from 'react'
import { Link } from 'react-router-dom'
import { 
  GraduationCap, 
  BookOpen, 
  Target, 
  Heart,
  Award,
  Users
} from 'lucide-react'

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center">
              <GraduationCap className="h-8 w-8 text-yellow-400" />
              <span className="ml-2 text-xl font-bold">Madrasa Rahmania Arabia</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="hover:text-yellow-400 transition">Home</Link>
              <Link to="/about" className="text-yellow-400">About</Link>
              <Link to="/admissions" className="hover:text-yellow-400 transition">Admissions</Link>
              <Link to="/notices" className="hover:text-yellow-400 transition">Notices</Link>
              <Link to="/contact" className="hover:text-yellow-400 transition">Contact</Link>
              <Link 
                to="/login" 
                className="bg-yellow-500 text-emerald-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-700 to-emerald-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">About Our Madrasa</h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            Dedicated to spreading Islamic knowledge and nurturing the next generation of scholars.
          </p>
        </div>
      </section>

      {/* History */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our History</h2>
              <p className="text-gray-600 mb-4">
                Madrasa Rahmania Arabia was established with a vision to provide quality Islamic education 
                to the children of our community. Under the guidance of the Kambipur Trust, we have been 
                serving the community for many years.
              </p>
              <p className="text-gray-600 mb-4">
                Our institution has produced numerous Hafiz-e-Quran and Aalims who are now serving 
                the community as Imams, teachers, and Islamic scholars across the region.
              </p>
              <p className="text-gray-600">
                We continue to uphold our commitment to excellence in Islamic education while 
                adapting to the needs of modern times.
              </p>
            </div>
            <div className="bg-emerald-100 rounded-xl p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-4xl font-bold text-emerald-600">500+</div>
                  <div className="text-gray-600 mt-2">Students Enrolled</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-4xl font-bold text-emerald-600">50+</div>
                  <div className="text-gray-600 mt-2">Qualified Teachers</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-4xl font-bold text-emerald-600">200+</div>
                  <div className="text-gray-600 mt-2">Huffaz Produced</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-4xl font-bold text-emerald-600">25+</div>
                  <div className="text-gray-600 mt-2">Years of Service</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <Target className="h-8 w-8 text-emerald-600" />
                <h3 className="text-2xl font-bold text-gray-900 ml-3">Our Mission</h3>
              </div>
              <p className="text-gray-600">
                To provide authentic Islamic education that nurtures both spiritual growth and intellectual 
                development. We aim to produce scholars who are firmly grounded in Islamic principles 
                while being capable of contributing positively to society.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <Heart className="h-8 w-8 text-emerald-600" />
                <h3 className="text-2xl font-bold text-gray-900 ml-3">Our Vision</h3>
              </div>
              <p className="text-gray-600">
                To be a leading institution of Islamic learning that produces pious, knowledgeable, 
                and responsible individuals who carry forward the message of Islam and serve humanity 
                with compassion and wisdom.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, title: 'Knowledge', desc: 'Pursuit of authentic Islamic knowledge' },
              { icon: Heart, title: 'Taqwa', desc: 'God-consciousness in all actions' },
              { icon: Users, title: 'Community', desc: 'Serving the Ummah with dedication' },
              { icon: Award, title: 'Excellence', desc: 'Striving for the best in everything' },
            ].map((value, idx) => (
              <div key={idx} className="text-center p-6">
                <value.icon className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Institution</h2>
          <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
            Give your child the gift of Islamic education. Admissions are now open for the new academic year.
          </p>
          <Link 
            to="/admissions" 
            className="bg-yellow-500 text-emerald-900 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-yellow-400 transition inline-block"
          >
            Apply Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Madrasa Rahmania Arabia - Kambipur Trust. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
