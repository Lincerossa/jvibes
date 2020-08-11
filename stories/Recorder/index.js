import React from 'react';
import { Button, Space } from 'antd'
import PropTypes from 'prop-types';
import jvibes from 'jvibes'
import * as S from './styles'


const Recorder = () => {

  const { tracks, isRecording, startRecording, stopRecording } = jvibes()

  return (
   <S.Recorder>
    <Space>
      <Button onClick={startRecording}>start</Button>
      <Button type="danger" onClick={stopRecording}>stop</Button>
    </Space>
    {
      tracks?.map(track => <div>i</div>)
    }
   </S.Recorder>
  )
}

Recorder.propTypes = {}
Recorder.defaultProps = {}

export default Recorder