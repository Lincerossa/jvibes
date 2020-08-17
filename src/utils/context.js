const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
let analyser = audioCtx.createAnalyser()

export default {

  getAudioContext() {
    return audioCtx
  },

  getAnalyser() {
    return analyser
  },

  resetAnalyser() {
    analyser = audioCtx.createAnalyser()
  },

}
