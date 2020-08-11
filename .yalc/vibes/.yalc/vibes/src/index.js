import React, { useEffect } from "react"


export default () => {
  useEffect(() => {
    console.warn("🚀Mounted")
  }, []);

  return <div>Check in console. There should be a warning</div>
}