import React from 'react'
import { Link } from 'react-router-dom'
import { 
  GraduationCap, 
  FileText, 
  Calendar,
  CheckCircle,
  Phone,
  Clock,
  Users,
  BookOpen
} from 'lucide-react'

export default function Admissions() {
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
              <Link to="/about" className="hover:text-yellow-400 transition">About</Link>
              <Link to="/admissions" className="text-yellow-400">Admissions</Link>
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
          <h1 className="text-4xl font-bold mb-4">Admissions</h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            Join our institution and embark on a journey of Islamic knowledge and spiritual growth.
          </p>
        </div>
      </section>

      {/* Admission Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Admission Process</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-emerald-100 rounded-full p-2 mr-4 mt-1">
                    <span className="text-emerald-600 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Submit Application</h3>
                    <p className="text-gray-600">
                      Visit our office and fill out the admission form with all required details. 
                      You can also contact us to receive the form.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-emerald-100 rounded-full p-2 mr-4 mt-1">
                    <span className="text-emerald-600 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Assessment</h3>
                    <p className="text-gray-600">
                      Students may be asked to take a basic assessment to determine their current 
                      level of Quranic knowledge and placement in appropriate class.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-emerald-100 rounded-full p-2 mr-4 mt-1">
                    <span className="text-emerald-600 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Document Verification</h3>
                    <p className="text-gray-600">
                      Submit required documents including previous education certificates (if any), 
                      identity proof, and photographs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-emerald-100 rounded-full p-2 mr-4 mt-1">
                    <span className="text-emerald-600 font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Fee Payment & Enrollment</h3>
                    <p className="text-gray-600">
                      Upon acceptance, pay the admission fee and first month's fee to complete 
                      the enrollment process.
                    </p>
                  </div>
                </div>
              </div>

              {/* Programs */}
              <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Available Programs</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { name: 'Nazra Quran', age: '5+ years', duration: '1-2 years', fee: 'Contact for details' },
                  { name: 'Hifz-ul-Quran', age: '7+ years', duration: '3-5 years', fee: 'Contact for details' },
                  { name: 'Aalim Course', age: '12+ years', duration: '7-8 years', fee: 'Contact for details' },
                  { name: 'Arabic Language', age: '10+ years', duration: '2-3 years', fee: 'Contact for details' },
                ].map((program, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-emerald-500 transition">
                    <h3 className="font-semibold text-gray-900">{program.name}</h3>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p><Users className="inline h-4 w-4 mr-1" /> Age: {program.age}</p>
                      <p><Clock className="inline h-4 w-4 mr-1" /> Duration: {program.duration}</p>
                      <p><BookOpen className="inline h-4 w-4 mr-1" /> Fee: {program.fee}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Requirements */}
              <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Required Documents</h2>
              <ul className="space-y-3">
                {[
                  'Completed admission form',
                  'Birth certificate or age proof',
                  'Previous education certificates (if applicable)',
                  '4 passport size photographs',
                  'Parent/Guardian ID proof',
                  'Address proof'
                ].map((doc, idx) => (
                  <li key={idx} className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-2" />
                    {doc}
                  </li>
                ))}
              </ul>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-emerald-50 rounded-xl p-6 sticky top-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Admission Open</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-emerald-600 mr-3" />
                    <div>
                      <p className="font-semibold text-gray-900">Academic Year</p>
                      <p className="text-gray-600">2025-2026</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-emerald-600 mr-3" />
                    <div>
                      <p className="font-semibold text-gray-900">Application Status</p>
                      <p className="text-green-600 font-medium">Open</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-emerald-600 mr-3" />
                    <div>
                      <p className="font-semibold text-gray-900">Office Hours</p>
                      <p className="text-gray-600">9:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                </div>

                <hr className="my-6" />

                <h4 className="font-semibold text-gray-900 mb-3">Contact for Admission</h4>
                <div className="space-y-2">
                  <a href="tel:+91XXXXXXXXXX" className="flex items-center text-emerald-600 hover:text-emerald-700">
                    <Phone className="h-4 w-4 mr-2" />
                    +91 XXXXX XXXXX
                  </a>
                </div>

                <Link 
                  to="/contact" 
                  className="mt-6 block w-full bg-emerald-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-emerald-700 transition"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
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
