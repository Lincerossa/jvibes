import styled from 'styled-components'


export const Audio = styled.audio`
  display: none;
`

export const Analyser = styled.div`
  width: 100%;
  position: relative;
`
export const Canvas = styled.canvas`
  width: 100%;
  display: block;
`
export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  ${(props) => props.marginLeft && 'margin-right: 1rem'};
`

export const HandlersWrapper = styled.div`
  position: absolute;
  bottom: 50%;
  transform: translate(0, 50%);
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  font-size: 2rem;

  svg {
    color: white;
    &:hover{
      color: magenta;
      cursor: pointer
    }
  }
`

export const AudioTimer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  padding: 1rem;
  color: white;

  svg {
    margin-right: .5rem;
  }
`

export const Col = styled.div`
  border: 1px solid black;
`

export const AudioTracker = styled.div.attrs((props) => ({
  style: {
    left: `${props.percentage * 100}%`,
  },
}))`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: white;
  cursor: col-resize;
`
