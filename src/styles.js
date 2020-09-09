import styled from 'styled-components'


export const Audio = styled.audio`
  display: none;
`

export const CanvasWrapper = styled.div`
  width: 100%;
  position: relative;
`
export const Canvas = styled.canvas`
  width: 100%;

`

export const AudioTimer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
`

export const Col = styled.div`
  border: 1px solid black;
`

export const AudioTracker = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: white;
  cursor: col-resize;
  left: ${(props) => `${props.percentage*100}%`};
`
