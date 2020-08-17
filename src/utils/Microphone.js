import AudioContext from './context'

let analyser
let audioCtx
let mediaRecorder
let stream

navigator.getUserMedia = (navigator.getUserMedia
                          || navigator.webkitGetUserMedia
                          || navigator.mozGetUserMedia
                          || navigator.msGetUserMedia)
class Microphone {
  constructor({ onStart, onStop }) {
    this.onStart = onStart
    this.onStop = onStop
  }

  startRecording() {
    const startTime = Date.now()

    if (mediaRecorder) {
      if (audioCtx?.state === 'suspended') audioCtx.resume()

      if (audioCtx && mediaRecorder?.state === 'inactive') {
        mediaRecorder.start(10)
        const source = audioCtx.createMediaStreamSource(stream)
        source.connect(analyser)
        if (this.onStart) this.onStart()
      }

      if (mediaRecorder?.state === 'paused') mediaRecorder.resume()

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
          stream = str

          if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
            mediaRecorder = new MediaRecorder(str)
          } else {
            mediaRecorder = new MediaRecorder(str)
          }

          if (this.onStart) this.onStart()

          mediaRecorder.onstop = () => {
            const { onStop } = this
            const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' })
            chunks = []

            const blobObject = {
              blob,
              startTime,
              stopTime: Date.now(),
              blobURL: window.URL.createObjectURL(blob),
            }

            if (onStop) onStop(blobObject)
          }
          mediaRecorder.ondataavailable = (event) => {
            chunks.push(event.data)
          }

          audioCtx = AudioContext.getAudioContext()
          audioCtx.resume().then(() => {
            analyser = AudioContext.getAnalyser()
            mediaRecorder.start(10)
            const sourceNode = audioCtx.createMediaStreamSource(stream)
            sourceNode.connect(analyser)
          })
        })
    }
  }

  stopRecording() {
    if (mediaRecorder?.state !== 'inactive') {
      mediaRecorder.stop()

      stream.getAudioTracks().forEach((track) => {
        track.stop()
      })
      mediaRecorder = null
      AudioContext.resetAnalyser()
    }
  }

}

export default Microphone