import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase, Staff, StaffDocument } from '../lib/supabase'
import { ArrowLeft, Edit, Upload, FileText, Download, Trash2, Calendar, Phone, Mail, MapPin, User, GraduationCap, Shield, Wrench, DollarSign, Award, Clock } from 'lucide-react'

export default function StaffDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [staff, setStaff] = useState<Staff | null>(null)
  const [documents, setDocuments] = useState<StaffDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      fetchStaffData(id)
    }
  }, [id])

  const fetchStaffData = async (staffId: string) => {
    try {
      // Fetch staff details
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('*')
        .eq('id', staffId)
        .single()

      if (staffError) throw staffError
      setStaff(staffData)

      // Fetch staff documents
      const { data: documentsData, error: documentsError } = await supabase
        .from('staff_documents')
        .select('*')
        .eq('staff_id', staffId)
        .order('uploaded_at', { ascending: false })

      if (documentsError) throw documentsError
      setDocuments(documentsData || [])

    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !staff) return

    setUploadLoading(true)
    setError('')

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `staff/${staff.id}/${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('student-documents')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('student-documents')
        .getPublicUrl(fileName)

      // Save document record to database
      const documentRecord = {
        id: crypto.randomUUID(),
        staff_id: staff.id,
        document_name: file.name,
        document_url: urlData.publicUrl,
        uploaded_at: new Date().toISOString()
      }

      const { error: dbError } = await supabase
        .from('staff_documents')
        .insert([documentRecord])

      if (dbError) throw dbError

      // Update local state
      setDocuments(prev => [documentRecord, ...prev])

    } catch (error: any) {
      setError(error.message)
    } finally {
      setUploadLoading(false)
      // Reset file input
      event.target.value = ''
    }
  }

  const deleteDocument = async (documentId: string, documentUrl: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return
    }

    try {
      // Extract file path from URL
      const url = new URL(documentUrl)
      const filePath = url.pathname.split('/').slice(-3).join('/')

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('student-documents')
        .remove([filePath])

      if (storageError) throw storageError

      // Delete from database
      const { error: dbError } = await supabase
        .from('staff_documents')
        .delete()
        .eq('id', documentId)

      if (dbError) throw dbError

      // Update local state
      setDocuments(prev => prev.filter(doc => doc.id !== documentId))

    } catch (error: any) {
      setError(error.message)
    }
  }

  const getStaffIcon = (type: string) => {
    switch (type) {
      case 'teacher':
        return <GraduationCap className="h-6 w-6 text-blue-600" />
      case 'servant':
        return <Wrench className="h-6 w-6 text-green-600" />
      case 'trustee':
        return <Shield className="h-6 w-6 text-purple-600" />
      default:
        return <User className="h-6 w-6 text-gray-600" />
    }
  }

  const getStaffTypeColor = (type: string) => {
    switch (type) {
      case 'teacher':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'servant':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'trustee':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!staff) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Staff member not found</h3>
        <Link to="/staff" className="text-blue-600 hover:text-blue-700">
          Back to Staff
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/staff')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Staff</span>
          </button>
        </div>
        
        <Link
          to={`/staff/${staff.id}/edit`}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Edit className="h-5 w-5" />
          <span>Edit Staff Member</span>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Staff Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center space-x-4 mb-6">
              {getStaffIcon(staff.staff_type)}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{staff.name}</h2>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStaffTypeColor(staff.staff_type)}`}>
                  {staff.staff_type.charAt(0).toUpperCase() + staff.staff_type.slice(1)}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {staff.position && (
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Position</p>
                      <p className="text-gray-900">{staff.position}</p>
                    </div>
                  </div>
                )}

                {staff.department && (
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="text-gray-900">{staff.department}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Joining Date</p>
                    <p className="text-gray-900">
                      {new Date(staff.joining_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="text-gray-900">{staff.experience_years} years</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900">{staff.phone}</p>
                  </div>
                </div>

                {staff.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900">{staff.email}</p>
                    </div>
                  </div>
                )}

                {staff.salary && (
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Salary</p>
                      <p className="text-gray-900">₹{staff.salary.toLocaleString()}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <div className={`h-3 w-3 rounded-full ${staff.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="text-gray-900">{staff.is_active ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
              </div>
            </div>

            {staff.qualification && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-start space-x-3">
                  <Award className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Qualification</p>
                    <p className="text-gray-900">{staff.qualification}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-900">{staff.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
              <label className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer flex items-center space-x-2 text-sm">
                {uploadLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                <span>{uploadLoading ? 'Uploading...' : 'Upload'}</span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.doc,.docx"
                  className="hidden"
                  disabled={uploadLoading}
                />
              </label>
            </div>

            {documents.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No documents uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {documents.map((document) => {
                  const isImage = document.document_name.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                  
                  return (
                    <div key={document.id} className="bg-gray-50 rounded-lg p-4">
                      {isImage ? (
                        // Image preview
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-5 w-5 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {document.document_name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(document.uploaded_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <a
                                href={document.document_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 p-1"
                                title="View full size"
                              >
                                <Download className="h-4 w-4" />
                              </a>
                              
                              <button
                                onClick={() => deleteDocument(document.id, document.document_url)}
                                className="text-red-600 hover:text-red-700 p-1"
                                title="Delete image"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          
                          {/* Image preview */}
                          <div className="relative">
                            <img
                              src={document.document_url}
                              alt={document.document_name}
                              className="w-full h-48 object-contain bg-gray-100 rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => window.open(document.document_url, '_blank')}
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                const nextElement = target.nextElementSibling as HTMLElement;
                                if (target) target.style.display = 'none';
                                if (nextElement) nextElement.style.display = 'flex';
                              }}
                            />
                            <div 
                              className="hidden w-full h-48 bg-gray-200 rounded-lg border border-gray-200 items-center justify-center"
                            >
                              <div className="text-center">
                                <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">Image preview unavailable</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Regular file display
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {document.document_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(document.uploaded_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <a
                              href={document.document_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 p-1"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                            
                            <button
                              onClick={() => deleteDocument(document.id, document.document_url)}
                              className="text-red-600 hover:text-red-700 p-1"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

