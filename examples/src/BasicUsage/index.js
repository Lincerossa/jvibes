import React from 'react';
import { Button, Space } from 'antd'
import jvibes from 'jvibes'
import * as S from './styles'

export default () => {
  const { tracks, isRecording, startRecording, stopRecording } = jvibes()

  return (
   <S.Recorder>
    <S.CtaWrapper>
      <Space>
        <Button loading={!!isRecording} onClick={startRecording}>record</Button>
        <Button type="danger" onClick={stopRecording}>stop</Button>
      </Space>
    </S.CtaWrapper>
    {
      tracks?.map((track) => <Space style={{width: "100%"}} direction="vertical" key={track.blobURL}><audio preload="auto" controls type="audio/ogg" src={track.blobURL} /></Space>)
    }
   </S.Recorder>
  )
}