// .storybook/preview.js
import '../src/app/globals.css'; // Adjust this path to your main CSS file
import { withTests } from '@storybook/addon-jest';

export const decorators = [
  withTests({
    results: [],
  }),
];

export const parameters = {
  backgrounds: {
    default: 'black',
    values: [
      {
        name: 'black',
        value: '#000000',
      },
      // You can add other background options here if needed
    ],
  },
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
