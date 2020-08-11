import React from 'react';
import PropTypes from 'prop-types';
import Jvibes from '../../dist'
import * as S from './styles'

const Basic = () => {
  return (
   <S.Basic>
    <Jvibes />
asd
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