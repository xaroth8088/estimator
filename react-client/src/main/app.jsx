import React, { Component, PropTypes } from "react"
import { connect } from 'react-redux'
import Estimator from "../components/estimator/estimator.jsx"

var App = React.createClass({
    render() {
        // Injected by connect() call:
        const { dispatch, cards, columns } = this.props;

        return (
            <Estimator cards={cards} columns={columns} dispatch={dispatch}/>
        );
    }
});

// Which props do we want to inject, given the global state?
// TODO: use https://github.com/faassen/reselect for better performance.
function select(state) {
    return {
        cards: state.cards.cards,
        columns: state.cards.columns
    }
}

export default connect(select)(App)
