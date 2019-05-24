import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {lightBlue900} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
import moment from 'moment';

import { Provider } from 'react-redux';
import store from './modules/store';


moment.locale("nb");

injectTapEventPlugin();

export const saknr = decodeURIComponent((new RegExp('[?|&]sak=([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;

const muiTheme = getMuiTheme({
  palette: {
    textColor: lightBlue900,
  },
  appBar: {
    height: 50,
  },
});

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider muiTheme={muiTheme}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
);
