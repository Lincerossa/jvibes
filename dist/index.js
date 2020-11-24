import { useState, useRef, useCallback } from 'react';

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var index = (function () {
  var _useState = useState([]),
      _useState2 = _slicedToArray(_useState, 2),
      tracks = _useState2[0],
      setTracks = _useState2[1];

  var _useState3 = useState(null),
      _useState4 = _slicedToArray(_useState3, 2),
      isRecording = _useState4[0],
      setRecording = _useState4[1];

  var _useState5 = useState(audioCtx.createAnalyser()),
      _useState6 = _slicedToArray(_useState5, 2),
      analyser = _useState6[0],
      setAnalyser = _useState6[1];

  var mediaRecorder = useRef(null);
  var stream = useRef(null);
  var startRecording = useCallback(function () {
    var startTime = Date.now();

    if (mediaRecorder && mediaRecorder.current) {
      if (audioCtx && (audioCtx.state === 'suspended' || audioCtx.state !== 'running')) audioCtx.resume();

      if (audioCtx && mediaRecorder.current.state === 'inactive') {
        mediaRecorder.current.start(10);
        var source = audioCtx.createMediaStreamSource(stream.current);
        source.connect(analyser);
        setRecording(true);
      }

      if (mediaRecorder.current.state === 'paused') mediaRecorder.current.resume();
    }

    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false
        },
        video: false
      }).then(function (str) {
        var chunks = [];
        stream.current = str;

        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mediaRecorder.current = new MediaRecorder(str);
        } else {
          mediaRecorder.current = new MediaRecorder(str);
        }

        setRecording(true);

        mediaRecorder.current.onstop = function () {
          var blob = new Blob(chunks, {
            type: 'audio/webm;codecs=opus'
          });
          chunks = [];
          var blobObject = {
            blob: blob,
            startTime: startTime,
            stopTime: Date.now(),
            blobURL: window.URL.createObjectURL(blob)
          };
          setTracks(function (e) {
            return [].concat(_toConsumableArray(e), [blobObject]);
          });
          setRecording(false);
        };

        mediaRecorder.current.ondataavailable = function (event) {
          chunks.push(event.data);
        };

        audioCtx.resume().then(function () {
          mediaRecorder.current.start(10);
          var sourceNode = audioCtx.createMediaStreamSource(stream.current);
          sourceNode.connect(analyser);
        });
      });
    }
  }, [mediaRecorder, analyser, setRecording]);
  var stopRecording = useCallback(function () {
    if (mediaRecorder && mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      stream.current.getAudioTracks().forEach(function (track) {
        track.stop();
      });
      mediaRecorder.current = null;
      setAnalyser(audioCtx.createAnalyser());
      setRecording(null);
    }
  }, [mediaRecorder]);
  var paintCanvas = useCallback(function (_ref) {
    var url = _ref.url,
        context = _ref.context,
        canvasDimesions = _ref.canvasDimesions;
    var width = canvasDimesions.width,
        height = canvasDimesions.height;
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.responseType = 'arraybuffer';

    req.onreadystatechange = function () {
      if (req.readyState === 4) {
        if (req.status === 200) {
          audioCtx.decodeAudioData(req.response, function (buffer) {
            var leftChannel = buffer.getChannelData(0);
            context.save();
            context.fillStyle = '#222';
            context.fillRect(0, 0, width, height);
            context.strokeStyle = '#121';
            context.globalCompositeOperation = 'lighter';
            context.translate(0, height / 2);
            context.globalAlpha = 0.06;

            for (var i = 0; i < leftChannel.length; i++) {
              // on which line do we get ?
              var x = Math.floor(width * i / leftChannel.length);
              var y = leftChannel[i] * height / 2;
              context.beginPath();
              context.moveTo(x, 0);
              context.lineTo(x + 1, y);
              context.stroke();
            }

            context.restore();
          }, function () {
            return console.log('error while decoding your file.');
          });
        }
      }
    };

    req.send();
  }, []);
  return {
    paintCanvas: paintCanvas,
    startRecording: startRecording,
    stopRecording: stopRecording,
    isRecording: isRecording,
    tracks: tracks
  };
});

export default index;
