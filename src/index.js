import { useCallback, useState, useRef } from 'react'

navigator.getUserMedia = (navigator.getUserMedia
                          || navigator.webkitGetUserMedia
                          || navigator.mozGetUserMedia
                          || navigator.msGetUserMedia)

const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

export default () => {
  const [tracks, setTracks] = useState([])
  const [isRecording, setRecording] = useState(null)
  const [analyser, setAnalyser] = useState(audioCtx.createAnalyser())
  const mediaRecorder = useRef(null)
  const stream = useRef(null)

  const startRecording = useCallback(() => {
    const startTime = Date.now()

    if (mediaRecorder && mediaRecorder.current) {
      if (audioCtx && (audioCtx.state === 'suspended' || audioCtx.state !== 'running')) audioCtx.resume()
      if (audioCtx && mediaRecorder.current.state === 'inactive') {
        mediaRecorder.current.start(10)
        const source = audioCtx.createMediaStreamSource(stream.current)
        source.connect(analyser)
        setRecording(true)
      }
      if (mediaRecorder.current.state === 'paused') mediaRecorder.current.resume()
    }

    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
        },
        video: false,
      })
        .then((str) => {
          let chunks = []
          stream.current = str
          if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
            mediaRecorder.current = new MediaRecorder(str)
          } else {
            mediaRecorder.current = new MediaRecorder(str)
          }

          setRecording(true)
          mediaRecorder.current.onstop = () => {
            const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' })
            chunks = []

            const blobObject = {
              blob,
              startTime,
              stopTime: Date.now(),
              blobURL: window.URL.createObjectURL(blob),
            }

            setTracks((e) => [...e, blobObject])
            setRecording(false)
          }
          mediaRecorder.current.ondataavailable = (event) => {
            chunks.push(event.data)
          }

          audioCtx.resume().then(() => {
            mediaRecorder.current.start(10)
            const sourceNode = audioCtx.createMediaStreamSource(stream.current)
            sourceNode.connect(analyser)
          })
        })
    }
  }, [mediaRecorder, analyser, setRecording])

  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop()

      stream.current.getAudioTracks().forEach((track) => {
        track.stop()
      })
      mediaRecorder.current = null
      setAnalyser(audioCtx.createAnalyser())
      setRecording(null)
    }
  }, [mediaRecorder])

  function paintCanvas({ url, context, canvasDimesions }) {
    const { width, height } = canvasDimesions
    const req = new XMLHttpRequest()
    req.open('GET', url, true)
    req.responseType = 'arraybuffer'
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        if (req.status === 200) {
          audioCtx.decodeAudioData(req.response, (buffer) => {
            const leftChannel = buffer.getChannelData(0)
            context.save()
            context.fillStyle = '#222'
            context.fillRect(0, 0, width, height)
            context.strokeStyle = '#121'
            context.globalCompositeOperation = 'lighter'
            context.translate(0, height / 2)
            context.globalAlpha = 0.06
            for (let i = 0; i < leftChannel.length; i++) {
              // on which line do we get ?
              const x = Math.floor((width * i) / leftChannel.length)
              const y = (leftChannel[i] * height) / 2
              context.beginPath()
              context.moveTo(x, 0)
              context.lineTo(x + 1, y)
              context.stroke()
            }
            context.restore()
          }, () => console.log('error while decoding your file.'))
        }
        else {
          alert('error during the load.Wrong url or cross origin issue')
        }
      }
    }
    req.send()
  }

  return {
    paintCanvas,
    startRecording,
    stopRecording,
    isRecording,
    tracks,
  }
}
