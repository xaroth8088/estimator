//require("babel-polyfill");    // If you'd like to try running this on really old browsers, uncomment this

import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, Link, Redirect } from 'react-router'
import { Provider } from 'react-redux'
import store from '../redux_store.es6'
import App from "./app.jsx"

import './main.css';

ReactDOM.render((
    <Provider store={store}>
        <App />
    </Provider>
), document.getElementById('app'));

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
