import { useState, useCallback, useEffect } from 'react';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

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

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();
var AudioContext = {
  getAudioContext: function getAudioContext() {
    return audioCtx;
  },
  getAnalyser: function getAnalyser() {
    return analyser;
  },
  resetAnalyser: function resetAnalyser() {
    analyser = audioCtx.createAnalyser();
  },
  decodeAudioData: function decodeAudioData() {
    audioCtx.decodeAudioData(audioData).then(function (decodedData) {// use the decoded data here
    });
  }
};

var analyser$1;
var audioCtx$1;
var mediaRecorder;
var chunks = [];
var startTime;
var stream;
var mediaOptions;
var onStartCallback;
var onStopCallback;
var onSaveCallback;
var onDataCallback;
var constraints;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

var Microphone = /*#__PURE__*/function () {
  function Microphone(onStart, onStop, onSave, onData, options, soundOptions) {
    var _this = this;

    _classCallCheck(this, Microphone);

    _defineProperty(this, "startRecording", function () {
      startTime = Date.now();

      if (mediaRecorder) {
        if (audioCtx$1 && audioCtx$1.state === 'suspended') {
          audioCtx$1.resume();
        }

        if (mediaRecorder && mediaRecorder.state === 'paused') {
          mediaRecorder.resume();
          return;
        }

        if (audioCtx$1 && mediaRecorder && mediaRecorder.state === 'inactive') {
          mediaRecorder.start(10);
          var source = audioCtx$1.createMediaStreamSource(stream);
          source.connect(analyser$1);

          if (onStartCallback) {
            onStartCallback();
          }
        }
      } else if (navigator.mediaDevices) {
        console.log('getUserMedia supported.');
        navigator.mediaDevices.getUserMedia(constraints).then(function (str) {
          stream = str;

          if (MediaRecorder.isTypeSupported(mediaOptions.mimeType)) {
            mediaRecorder = new MediaRecorder(str, mediaOptions);
          } else {
            mediaRecorder = new MediaRecorder(str);
          }

          if (onStartCallback) {
            onStartCallback();
          }

          mediaRecorder.onstop = _this.onStop;

          mediaRecorder.ondataavailable = function (event) {
            chunks.push(event.data);

            if (onDataCallback) {
              onDataCallback(event.data);
            }
          };

          audioCtx$1 = AudioContext.getAudioContext();
          audioCtx$1.resume().then(function () {
            analyser$1 = AudioContext.getAnalyser();
            mediaRecorder.start(10);
            var sourceNode = audioCtx$1.createMediaStreamSource(stream);
            sourceNode.connect(analyser$1);
          });
        });
      } else {
        alert('Your browser does not support audio recording');
      }
    });

    var _ref = soundOptions || {},
        echoCancellation = _ref.echoCancellation,
        autoGainControl = _ref.autoGainControl,
        noiseSuppression = _ref.noiseSuppression,
        channelCount = _ref.channelCount;

    onStartCallback = onStart;
    onStopCallback = onStop;
    onSaveCallback = onSave;
    onDataCallback = onData;
    mediaOptions = options || {};
    constraints = {
      audio: {
        echoCancellation: echoCancellation,
        autoGainControl: autoGainControl,
        noiseSuppression: noiseSuppression,
        channelCount: channelCount
      },
      video: false
    };
  }

  _createClass(Microphone, [{
    key: "stopRecording",
    value: function stopRecording() {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        stream.getAudioTracks().forEach(function (track) {
          track.stop();
        });
        mediaRecorder = null;
        AudioContext.resetAnalyser();
      }
    }
  }, {
    key: "onStop",
    value: function onStop() {
      console.log("onStop");
      var blob = new Blob(chunks, {
        type: mediaOptions.mimeType
      });
      chunks = [];
      var blobObject = {
        blob: blob,
        startTime: startTime,
        stopTime: Date.now(),
        options: mediaOptions,
        blobURL: window.URL.createObjectURL(blob)
      };

      if (onStopCallback) {
        onStopCallback(blobObject);
      }

      if (onSaveCallback) {
        onSaveCallback(blobObject);
      }
    }
  }]);

  return Microphone;
}();

var index = (function (status) {
  var _useState = useState([]),
      _useState2 = _slicedToArray(_useState, 2),
      tracks = _useState2[0],
      setTracks = _useState2[1];

  var _useState3 = useState(null),
      _useState4 = _slicedToArray(_useState3, 2),
      isRecording = _useState4[0],
      setIsRecording = _useState4[1];

  var _useState5 = useState(null),
      _useState6 = _slicedToArray(_useState5, 2),
      MicrophoneIstance = _useState6[0],
      setMicrophoneIstance = _useState6[1];

  var onStart = function onStart() {
    return setIsRecording(true);
  };

  var onStop = useCallback(function (track) {
    setTracks([].concat(_toConsumableArray(tracks), [track]));
    setIsRecording(false);
  }, [tracks, setTracks, setIsRecording]);
  useEffect(function () {
    var MicrophoneIstance = new Microphone(onStart, onStop);
    setMicrophoneIstance(MicrophoneIstance);
  }, [onStop]);
  useEffect(function () {
    if (!MicrophoneIstance) return;
    if (status === "start") MicrophoneIstance.startRecording();
    if (status === "stop") MicrophoneIstance.stopRecording();
  }, [status, MicrophoneIstance]);
  return {
    tracks: tracks,
    isRecording: isRecording
  };
});

export default index;
