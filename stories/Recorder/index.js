import React, { useEffect } from 'react';
import { Button, Space } from 'antd'
import PropTypes from 'prop-types'
import jvibes from 'jvibes'
import * as S from './styles'

const Recorder = () => {

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
      tracks?.map(track => {
        const { Analyser } = track
        return (
          <>
            <Analyser key={track.blobURL} controls />
          </>
        )
      })
    }
   </S.Recorder>
  )
}

Recorder.propTypes = {}
Recorder.defaultProps = {}

export default Recorder