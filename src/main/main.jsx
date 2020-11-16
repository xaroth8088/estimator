import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { connectToServer } from '../actions.es6';
import CONFIG from '../config.es6';
import store from '../redux_store.es6';
import App from './app.jsx';

import './main.css';

ReactDOM.render((
    <Provider store={store}>
        <App />
    </Provider>
), document.getElementById('app'));

// Kick off the server connection process
store.dispatch(connectToServer(CONFIG.crossbar_uri, CONFIG.realm));

// TODO: routing, to get unique boards, and to create a board
//// 404 route
//var NoMatch = React.createClass({
//    render() {
//        return (
//            <h1>"Sorry!"</h1>
//        );
//    }
//});
//
//// Routing
//ReactDOM.render((
//    <Router>
//        <Route path="/" component={Estimator}/>
//        <Route path="*" component={NoMatch}/>
//    </Router>
//), document.getElementById('app'));
