import { useEffect, useState} from 'react'




export default ({play, stop}) => {
  const [isPlaying, setPlaying] = useState(false)



  useEffect(() => {
    if(play) setPlaying(true)
    if(stop) setPlaying(false)


  }, [play, stop])


  return {
    isPlaying
  }
}