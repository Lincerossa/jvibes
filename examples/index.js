import React from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.css'
import './index.css'
import { Tabs } from 'antd'
import styled from 'styled-components'
import BasicUsage from './BasicUsage'
import IntermediateUsage from './IntermediateUsage'

const { TabPane } = Tabs

const App = () => (
  <Wrapper>
    <Intro>
      <Title>Welcome to jvibes</Title>
      <Subtitle>🎼 Let's play around with the sounds</Subtitle>
      <Subtitle>🚀 Easy react-hooks available</Subtitle>
    </Intro>
    <Tabs defaultActiveKey="1">
      <TabPane tab="Basic Usage" key="1">
        <BasicUsage />
      </TabPane>
      <TabPane tab="Intermediate Usage" key="2">
        <IntermediateUsage />
      </TabPane>
    </Tabs>
  </Wrapper>
)

const Wrapper = styled.div`
  padding: 2rem 2rem;
`
const Intro = styled.div`
  margin-bottom: 3rem;
`
const Title = styled.h1`
  font-size: 3rem;
  text-align: center;
`
const Subtitle = styled.h3``

ReactDOM.render(<App />, document.getElementById('root'))
