//require("babel-polyfill");    // If you'd like to try running this on really old browsers, uncomment this

import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, Link, Redirect } from 'react-router'

import Estimator from "../components/estimator/estimator.jsx"

import './main.css';

// 404 route
var NoMatch = React.createClass({
    render() {
        return (
            <h1>"Sorry!"</h1>
        );
    }
});

// Routing
ReactDOM.render((
    <Router>
        <Route path="/" component={Estimator}/>
        <Route path="*" component={NoMatch}/>
    </Router>
), document.getElementById('app'));
