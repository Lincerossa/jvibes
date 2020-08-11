import React, { useEffect } from 'react';

var index = (function () {
  useEffect(function () {
    console.warn("🚀Mounted");
  }, []);
  return /*#__PURE__*/React.createElement("div", null, "Check in console. There should be a warning");
});

export default index;
