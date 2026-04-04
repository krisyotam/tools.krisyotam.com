"use client"

import { useState, useRef, useEffect, useCallback } from "react"

export function CameraRecorderTool() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([])
  const [selectedCamera, setSelectedCamera] = useState("")
  const [recording, setRecording] = useState(false)
  const [photoUrl, setPhotoUrl] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [error, setError] = useState("")

  const startCamera = useCallback(async (deviceId?: string) => {
    try {
      if (stream) {
        stream.getTracks().forEach(t => t.stop())
      }
      const constraints: MediaStreamConstraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : true,
        audio: true,
      }
      const s = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(s)
      if (videoRef.current) {
        videoRef.current.srcObject = s
      }
      setError("")

      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter(d => d.kind === "videoinput")
      setCameras(videoDevices)
      if (!deviceId && videoDevices.length > 0) {
        setSelectedCamera(videoDevices[0].deviceId)
      }
    } catch (e) {
      setError((e as Error).message)
    }
  }, [stream])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop())
      setStream(null)
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [stream])

  const takePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.drawImage(video, 0, 0)
    const url = canvas.toDataURL("image/png")
    setPhotoUrl(url)
  }, [])

  const startRecording = useCallback(() => {
    if (!stream) return
    chunksRef.current = []
    const mr = new MediaRecorder(stream, { mimeType: "video/webm" })
    mr.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" })
      setVideoUrl(URL.createObjectURL(blob))
    }
    mr.start()
    mediaRecorderRef.current = mr
    setRecording(true)
  }, [stream])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop()
      setRecording(false)
    }
  }, [recording])

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop())
    }
  }, [stream])

  return (
    <div>
      <div className="tool-section">
        <div className="tool-row" style={{ alignItems: "flex-end" }}>
          {cameras.length > 1 && (
            <div className="tool-field" style={{ flex: 1 }}>
              <label>Camera</label>
              <select
                value={selectedCamera}
                onChange={e => { setSelectedCamera(e.target.value); startCamera(e.target.value) }}
              >
                {cameras.map((c, i) => (
                  <option key={c.deviceId} value={c.deviceId}>
                    {c.label || `Camera ${i + 1}`}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="tool-actions">
            {!stream ? (
              <button onClick={() => startCamera(selectedCamera || undefined)}>Start Camera</button>
            ) : (
              <button onClick={stopCamera}>Stop Camera</button>
            )}
          </div>
        </div>
        {error && <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.5rem" }}>{error}</p>}
      </div>

      <div className="tool-columns">
        <div className="tool-section" style={{ flex: 1 }}>
          <p className="tool-section-title">Preview</p>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: "100%",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              display: "block",
            }}
          />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          {stream && (
            <div className="tool-actions" style={{ marginTop: "0.5rem" }}>
              <button onClick={takePhoto}>Take Photo</button>
              {!recording ? (
                <button onClick={startRecording}>Start Recording</button>
              ) : (
                <button onClick={stopRecording} style={{ color: "hsl(0, 70%, 55%)" }}>Stop Recording</button>
              )}
            </div>
          )}
        </div>
        <div className="tool-section" style={{ flex: 1 }}>
          <p className="tool-section-title">Captures</p>
          {photoUrl && (
            <div style={{ marginBottom: "0.75rem" }}>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>Photo</p>
              <img
                src={photoUrl}
                alt="Captured photo"
                style={{ width: "100%", border: "1px solid var(--border-color)" }}
              />
              <div className="tool-actions" style={{ marginTop: "0.25rem" }}>
                <a href={photoUrl} download="photo.png">
                  <button>Download Photo</button>
                </a>
              </div>
            </div>
          )}
          {videoUrl && (
            <div>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>Recording</p>
              <video
                src={videoUrl}
                controls
                style={{ width: "100%", border: "1px solid var(--border-color)" }}
              />
              <div className="tool-actions" style={{ marginTop: "0.25rem" }}>
                <a href={videoUrl} download="recording.webm">
                  <button>Download Video</button>
                </a>
              </div>
            </div>
          )}
          {!photoUrl && !videoUrl && (
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", padding: "1rem" }}>
              Start the camera and take a photo or recording.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
