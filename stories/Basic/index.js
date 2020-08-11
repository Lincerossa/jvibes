import React from 'react';
import PropTypes from 'prop-types';
import Jvibes, { useRecord } from 'vibes'
import * as S from './styles'


console.log({useRecord})
const Basic = () => {
  return (
   <S.Basic>
    <Jvibes />

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