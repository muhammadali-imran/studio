import { useState, useCallback } from 'react'
import api from '../api/axios'

/**
 * useFileUpload — performs an actual multipart/form-data upload with
 * progress tracking, rather than just sending the file's name/metadata.
 *
 * const { upload, progress, uploading, error } = useFileUpload('/studio/library/upload/')
 * await upload(file, { visibility: 'students', course: 1 })
 */
export function useFileUpload(url) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  const upload = useCallback(async (file, extraFields = {}) => {
    if (!file) throw new Error('No file selected')
    setUploading(true)
    setProgress(0)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)
    Object.entries(extraFields).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, value)
    })

    try {
      const res = await api.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          if (evt.total) setProgress(Math.round((evt.loaded / evt.total) * 100))
        },
      })
      return res.data
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Upload failed'
      setError(msg)
      throw err
    } finally {
      setUploading(false)
    }
  }, [url])

  return { upload, uploading, progress, error }
}
