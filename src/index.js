import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createGlobalStyle } from 'styled-components';

import './index.scss';
import './i18n';
import App from './App';
import store from './store';

// eslint-disable-next-line import/no-webpack-loader-syntax
const theme = require('sass-extract-loader?{"plugins":["sass-extract-js"]}!./scss/_index.scss');

const GlobalStyle = createGlobalStyle`
  *,
  ::after,
  ::before {
    box-sizing: border-box;
  }
  html,
  body {
    position: relative;
    margin: 0;
    padding: 0;
    font-family: ${p => p.theme.globalFont};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: -internal-root-color;
    z-index: 0;
  }
  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace;
  }
`;

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>,
  document.getElementById('root')
);

