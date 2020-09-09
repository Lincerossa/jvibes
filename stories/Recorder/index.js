import React, { useEffect, useCallback, useState } from 'react';
import { Button, Space } from 'antd'
import { FiBatteryCharging } from "react-icons/fi";
import PropTypes from 'prop-types'
import jvibes, { Analyser } from 'jvibes'
import * as S from './styles'

const Recorder = () => {
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
      tracks?.map((track) => <Space style={{width: "100%"}} direction="vertical"><Analyser key={track.blobURL} blobURL={track.blobURL} playing={playingAll} /></Space>)
    }

   </S.Recorder>
  )
}

Recorder.propTypes = {}
Recorder.defaultProps = {}

export default Recorder