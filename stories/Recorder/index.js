import React from 'react';
import { Button, Space } from 'antd'
import PropTypes from 'prop-types';
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
      tracks?.map(track => <S.Audio controls src={track.blobURL}>Your browser does not support the <code>audio</code> element. </S.Audio>)
    }
   </S.Recorder>
  )
}

Recorder.propTypes = {}
Recorder.defaultProps = {}

export default Recorder