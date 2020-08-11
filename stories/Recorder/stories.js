import React from 'react';

import Recorder from './index';

export default {
  title: 'Recorder',
  component: Recorder,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const Template = (args) => <Recorder {...args} />;

export const Default = Template.bind({});
Default.args = {
  primary: true,
  label: 'Button',
};

