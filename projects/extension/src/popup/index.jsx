import React from 'react';
import { render } from 'react-dom';
import './index.scss';
import Popup from './Popup';

render(<Popup />, window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();
