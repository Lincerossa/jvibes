import React from 'react'
import BasicUsage from './index'

export default {
  title: 'BasicUsage',
  component: BasicUsage,
}

const Template = (args) => <BasicUsage {...args} />

export const Default = Template.bind({})
