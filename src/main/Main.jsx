import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { connectToServer } from '~/actions';
import CONFIG from '~/config';
import store from '~/redux_store';
import App from '~/main/App';

import '~/main/Main.css';

ReactDOM.render((
    <Provider store={store}>
        <App />
    </Provider>
), document.getElementById('app'));

// Kick off the server connection process
store.dispatch(connectToServer(CONFIG.crossbar_uri, CONFIG.realm));

// TODO: routing, to get unique boards, and to create a board
/// / 404 route
// let NoMatch = React.createClass({
//    render() {
//        return (
//            <h1>"Sorry!"</h1>
//        );
//    }
// });
//
/// / Routing
// ReactDOM.render((
//    <Router>
//        <Route path="/" component={Estimator}/>
//        <Route path="*" component={NoMatch}/>
//    </Router>
// ), document.getElementById('app'));
