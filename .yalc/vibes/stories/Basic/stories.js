import React from 'react';

import Basic from './index';

export default {
  title: 'Basic',
  component: Basic,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const Template = (args) => <Basic {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Button',
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: 'Button',
};

export const Large = Template.bind({});
Large.args = {
  size: 'large',
  label: 'Button',
};

export const Small = Template.bind({});
Small.args = {
  size: 'small',
  label: 'Button',
};
