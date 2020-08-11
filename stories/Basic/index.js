import React, { useState} from 'react';
import PropTypes from 'prop-types';
import jvibes from 'jvibes'
import * as S from './styles'


const Basic = () => {

  const [status, setStatus] = useState(null)
  const { tracks, isRecording } = jvibes(status)

  return (
   <S.Basic>
    <button onClick={() => setStatus("start")}>start</button>
    <button onClick={() => setStatus("stop")}>stop</button>
   </S.Basic>
  )
}

Basic.propTypes = {
  primary: PropTypes.bool,
  backgroundColor: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

Basic.defaultProps = {
  backgroundColor: null,
  primary: false,
  size: 'medium',
  onClick: undefined,
};


export default Basic