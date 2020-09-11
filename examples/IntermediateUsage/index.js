import React, { useCallback, useState } from 'react';
import { Button, Space } from 'antd'
import jvibes, { Analyser } from 'jvibes'
import * as S from './styles'

export default () => {
  const { tracks, isRecording, startRecording, stopRecording } = jvibes()
  const [ playingAll, setPlayAll] = useState(false)

  const handleTogglerPlayAll = useCallback(() => {
    setPlayAll(werePlaying => !werePlaying)
  }, [setPlayAll])


  return (
   <S.Recorder>
    <S.CtaWrapper>
      <Space>
        <Button loading={!!isRecording} onClick={startRecording}>record</Button>
        <Button type="danger" onClick={stopRecording}>stop</Button>
      </Space>
      <S.PlayAll onClick={handleTogglerPlayAll} active={playingAll}>
        <Button type="primary">play all</Button>
      </S.PlayAll>
    </S.CtaWrapper>
    {
      tracks?.map((track) => <Space key={track.blobURL} style={{width: "100%"}} direction="vertical"><Analyser  blobURL={track.blobURL} playing={playingAll} /></Space>)
    }

   </S.Recorder>
  )
}