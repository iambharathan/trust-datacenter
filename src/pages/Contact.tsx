import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  GraduationCap, 
  Phone, 
  Mail, 
  MapPin,
  Clock,
  Send,
  CheckCircle
} from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: submitError } = await supabase
        .from('contact_inquiries')
        .insert([formData])

      if (submitError) throw submitError

      setSuccess(true)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err: any) {
      setError(err.message || 'Failed to submit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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
              <Link to="/admissions" className="hover:text-yellow-400 transition">Admissions</Link>
              <Link to="/notices" className="hover:text-yellow-400 transition">Notices</Link>
              <Link to="/contact" className="text-yellow-400">Contact</Link>
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
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-emerald-100 rounded-full p-3 mr-4">
                    <MapPin className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-600 mt-1">
                      Madrasa Rahmania Arabia<br />
                      Kambipur, Karnataka<br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-emerald-100 rounded-full p-3 mr-4">
                    <Phone className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600 mt-1">
                      +91 XXXXX XXXXX<br />
                      +91 XXXXX XXXXX
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-emerald-100 rounded-full p-3 mr-4">
                    <Mail className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600 mt-1">
                      info@madrasarahmania.org
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-emerald-100 rounded-full p-3 mr-4">
                    <Clock className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Office Hours</h3>
                    <p className="text-gray-600 mt-1">
                      Monday - Saturday<br />
                      9:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

                {success ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-600 mb-6">
                      Thank you for contacting us. We will get back to you soon.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subject
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        >
                          <option value="">Select a subject</option>
                          <option value="Admission Inquiry">Admission Inquiry</option>
                          <option value="Fee Related">Fee Related</option>
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Feedback">Feedback</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Write your message here..."
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-300 rounded-xl h-64 flex items-center justify-center">
            <p className="text-gray-600">Map will be displayed here</p>
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
