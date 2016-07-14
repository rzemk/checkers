import App from './components/App';
import Home from './components/Home';
import About from './components/About';
import Faq from './components/Faq';
import NewPlayer from './components/AddPlayer';
import Play from './components/Game';

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

require('es6-promise').polyfill();
require('isomorphic-fetch');

render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="about" component={About} />
      <Route path="faq" component={Faq} />
      <Route path="NewPlayer" component={NewPlayer} />
      <Route path="Play" component={Play} />
    </Route>
  </Router>
  , document.getElementById('root'));
