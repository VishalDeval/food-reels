import React, { useRef, useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const MAX_BYTES = 110 * 1024 * 1024 // ~110MB

// Override the endpoint if needed:  <CreateFood endpoint="..." />
const CreateFood = ({ endpoint = 'http://localhost:3000/api/food/', onSaved }) => {
  const fileInput = useRef(null)
  const [file, setFile] = useState(null)          // the actual File object
  const [videoURL, setVideoURL] = useState(null)  // object URL for preview
  const [fileLabel, setFileLabel] = useState('')
  const [dragging, setDragging] = useState(false)
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [saving, setSaving] = useState(false)
  const [progress, setProgress] = useState(0)
  const [toast, setToast] = useState({ text: '', error: false })
const navigate = useNavigate();
  useEffect(() => {
    return () => { if (videoURL) URL.revokeObjectURL(videoURL) }
  }, [videoURL])

  const handleFile = (f) => {
    if (!f) return
    if (!f.type.startsWith('video/')) return showToast('Please choose a video file.', true)
    if (f.size > MAX_BYTES) return showToast('File is too large (max ~100MB).', true)
    if (videoURL) URL.revokeObjectURL(videoURL)
    setFile(f)
    setVideoURL(URL.createObjectURL(f))
    setFileLabel(`${f.name} · ${(f.size / 1048576).toFixed(1)}MB`)
    showToast('')
  }

  const removeVideo = () => {
    if (videoURL) URL.revokeObjectURL(videoURL)
    setFile(null)
    setVideoURL(null)
    setFileLabel('')
    if (fileInput.current) fileInput.current.value = ''
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const showToast = (text, error = false) => setToast({ text, error })

  const handleSubmit = async (e) => {
    e.preventDefault() // stop the browser's default full-page submit
    if (!file) return showToast('Add a video first.', true)
    if (!name.trim()) return showToast('Give your food a name.', true)

    // Build the multipart payload
    const formData = new FormData()
    formData.append('name', name.trim())
    formData.append('description', desc.trim())
    formData.append('video', file, file.name)

    setSaving(true)
    setProgress(0)
    showToast('')
    try {
      const res = await axios.post(endpoint, formData, {
        withCredentials: true, // send cookies / auth credentials cross-origin
        // axios sets the multipart Content-Type + boundary automatically
        onUploadProgress: (evt) => {
          if (evt.total) setProgress(Math.round((evt.loaded * 100) / evt.total))
        },
      })

      showToast(`✓ "${name.trim()}" saved successfully!`)
      onSaved?.(res.data)

      // Reset the form
      removeVideo()
      setName('')
      setDesc('')
      navigate('/'); // Navigate back to the home page
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/food-partner/login')
        return
      }
      const msg =
        err.response?.data?.message ||
        err.response?.statusText ||
        err.message ||
        'Something went wrong while saving.'
      showToast(msg, true)
    } finally {
      setSaving(false)
      setProgress(0)
    }
  }

  return (
    <div style={S.page}>
      <form style={S.card} onSubmit={handleSubmit} noValidate>
        <h1 style={S.h1}>Create Food</h1>
        <p style={S.subtitle}>Upload a short video, give it a name, and add a description.</p>

        <label style={S.label}>Food Video</label>

        {!videoURL ? (
          <div
            style={{ ...S.upload, ...(dragging ? S.uploadDrag : {}) }}
            onClick={() => fileInput.current?.click()}
            onDragEnter={(e) => { e.preventDefault(); setDragging(true) }}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={(e) => { e.preventDefault(); setDragging(false) }}
            onDrop={onDrop}
          >
            <div style={S.uploadIcons}>
              <span style={S.ico}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
              </span>
              <span style={{ ...S.ico, ...S.icoRec }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" /></svg>
              </span>
            </div>
            <div style={S.uploadMain}>
              <b style={{ color: '#2563eb', fontWeight: 600 }}>Tap to upload</b> or drag and drop
            </div>
            <div style={S.uploadHint}>MP4, WebM, MOV · Up to ~100MB</div>
            <input
              ref={fileInput}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/*"
              style={{ display: 'none' }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>
        ) : (
          <div>
            <video src={videoURL} controls playsInline style={S.video} />
            <div style={S.previewBar}>
              <span style={S.previewName}>{fileLabel}</span>
              <button type="button" style={S.remove} onClick={removeVideo}>Remove</button>
            </div>
          </div>
        )}

        <label style={S.label} htmlFor="food-name">Name</label>
        <input
          id="food-name"
          name="name"
          type="text"
          placeholder="e.g., Spicy Paneer Wrap"
          maxLength={60}
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={S.input}
        />

        <label style={S.label} htmlFor="food-desc">Description</label>
        <textarea
          id="food-desc"
          name="description"
          placeholder="Write a short description: ingredients, taste, spice level, etc."
          maxLength={300}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          style={S.textarea}
        />
        <div style={S.count}>{desc.length}/300</div>

        {saving && (
          <div style={S.progressTrack}>
            <div style={{ ...S.progressBar, width: `${progress}%` }} />
          </div>
        )}

        <button
          type="submit"
          style={{ ...S.save, ...(saving ? S.saveDisabled : {}) }}
          disabled={saving}
        >
          {saving ? `Uploading… ${progress}%` : 'Save Food'}
        </button>

        {toast.text && (
          <div style={{ ...S.toast, color: toast.error ? '#dc2626' : '#16a34a' }}>
            {toast.text}
          </div>
        )}
      </form>
    </div>
  )
}

const S = {
  page: {
    fontFamily: "'Outfit', system-ui, sans-serif",
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    color: '#1f2937',
    background:
      'radial-gradient(900px 500px at 80% -10%, rgba(37,99,235,.08), transparent 60%),' +
      'radial-gradient(700px 400px at -10% 110%, rgba(37,99,235,.06), transparent 60%), #f1f5f9',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    background: '#ffffff',
    border: '1px solid #e5e9f0',
    borderRadius: 24,
    padding: '30px 26px 32px',
    boxShadow: '0 20px 50px -20px rgba(15,23,42,.18)',
  },
  h1: { fontSize: 26, fontWeight: 700, letterSpacing: '-.5px', margin: 0, color: '#0f172a' },
  subtitle: { color: '#64748b', fontSize: 14, marginTop: 6, lineHeight: 1.5, maxWidth: '90%' },
  label: {
    display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '1.4px',
    textTransform: 'uppercase', color: '#94a3b8', margin: '24px 0 10px',
  },
  upload: {
    border: '1.5px dashed #cbd5e1',
    background: '#f8fafc',
    borderRadius: 16, padding: '34px 18px', textAlign: 'center', cursor: 'pointer',
    transition: '.2s',
  },
  uploadDrag: { borderColor: '#2563eb', background: '#eff6ff', transform: 'scale(1.01)' },
  uploadIcons: { display: 'flex', justifyContent: 'center', gap: 18, marginBottom: 14 },
  ico: {
    width: 38, height: 38, borderRadius: 11, display: 'grid', placeItems: 'center',
    background: 'rgba(37,99,235,.10)', color: '#2563eb',
  },
  icoRec: { background: '#f1f5f9', color: '#475569' },
  uploadMain: { fontSize: 15, color: '#334155' },
  uploadHint: { fontSize: 12, color: '#94a3b8', marginTop: 7, letterSpacing: '.3px' },
  video: { width: '100%', borderRadius: 12, display: 'block', background: '#000', maxHeight: 240 },
  previewBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 10, fontSize: 13, color: '#64748b', gap: 10,
  },
  previewName: { color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  remove: {
    background: 'none', border: '1px solid #e2e8f0', color: '#dc2626',
    borderRadius: 8, padding: '5px 11px', fontSize: 12, cursor: 'pointer', flexShrink: 0,
    fontFamily: 'inherit',
  },
  input: {
    width: '100%', background: '#ffffff', border: '1.5px solid #e2e8f0',
    borderRadius: 12, padding: '14px 15px', color: '#0f172a',
    fontFamily: 'inherit', fontSize: 15, outline: 'none', boxSizing: 'border-box',
  },
  textarea: {
    width: '100%', background: '#ffffff', border: '1.5px solid #e2e8f0',
    borderRadius: 12, padding: '14px 15px', color: '#0f172a',
    fontFamily: 'inherit', fontSize: 15, outline: 'none', boxSizing: 'border-box',
    resize: 'vertical', minHeight: 110, lineHeight: 1.55,
  },
  count: { textAlign: 'right', fontSize: 11, color: '#94a3b8', marginTop: 6 },
  progressTrack: {
    marginTop: 20, height: 8, borderRadius: 99, background: '#e2e8f0', overflow: 'hidden',
  },
  progressBar: {
    height: '100%', background: 'linear-gradient(90deg,#3b82f6,#2563eb)',
    borderRadius: 99, transition: 'width .2s',
  },
  save: {
    marginTop: 28, width: '100%',
    background: 'linear-gradient(180deg,#3b82f6,#2563eb)',
    border: 'none', borderRadius: 13, padding: 15, color: '#fff',
    fontFamily: 'inherit', fontWeight: 600, fontSize: 15, cursor: 'pointer',
    letterSpacing: '.3px', boxShadow: '0 12px 24px -10px rgba(37,99,235,.5)',
  },
  saveDisabled: { filter: 'grayscale(.4) brightness(.95)', cursor: 'not-allowed', boxShadow: 'none' },
  toast: { marginTop: 14, textAlign: 'center', fontSize: 13, fontWeight: 500 },
}

export default CreateFood