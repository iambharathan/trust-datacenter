import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase, Student, StudentDocument } from '../lib/supabase'
import { ArrowLeft, Edit, Upload, FileText, Download, Trash2, Calendar, Phone, Mail, MapPin, User, Users } from 'lucide-react'

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [student, setStudent] = useState<Student | null>(null)
  const [documents, setDocuments] = useState<StudentDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      fetchStudentData(id)
    }
  }, [id])

  const fetchStudentData = async (studentId: string) => {
    try {
      // Fetch student details
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('id', studentId)
        .single()

      if (studentError) throw studentError
      setStudent(studentData)

      // Fetch student documents
      const { data: documentsData, error: documentsError } = await supabase
        .from('student_documents')
        .select('*')
        .eq('student_id', studentId)
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
    if (!file || !student) return

    setUploadLoading(true)
    setError('')

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${student.id}/${Date.now()}.${fileExt}`
      
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
        student_id: student.id,
        document_name: file.name,
        document_url: urlData.publicUrl,
        uploaded_at: new Date().toISOString()
      }

      const { error: dbError } = await supabase
        .from('student_documents')
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
      const filePath = url.pathname.split('/').slice(-2).join('/')

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('student-documents')
        .remove([filePath])

      if (storageError) throw storageError

      // Delete from database
      const { error: dbError } = await supabase
        .from('student_documents')
        .delete()
        .eq('id', documentId)

      if (dbError) throw dbError

      // Update local state
      setDocuments(prev => prev.filter(doc => doc.id !== documentId))

    } catch (error: any) {
      setError(error.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Student not found</h3>
        <Link to="/students" className="text-blue-600 hover:text-blue-700">
          Back to Students
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
            onClick={() => navigate('/students')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Students</span>
          </button>
        </div>
        
        <Link
          to={`/students/${student.id}/edit`}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Edit className="h-5 w-5" />
          <span>Edit Student</span>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Student Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{student.name}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="text-gray-900">{student.age} years old</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Class</p>
                    <p className="text-gray-900">{student.class}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Admission Date</p>
                    <p className="text-gray-900">
                      {new Date(student.admission_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Father's Name</p>
                    <p className="text-gray-900">{student.father_name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Mother's Name</p>
                    <p className="text-gray-900">{student.mother_name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900">{student.phone}</p>
                  </div>
                </div>

                {student.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900">{student.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-900">{student.address}</p>
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
