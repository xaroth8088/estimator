import React, { Component, PropTypes } from "react"
import { connect } from 'react-redux'
import Estimator from "../components/estimator/estimator.jsx"
import { LOADING_STATES } from "../constants.es6"
import Loading from "../components/loading/loading.jsx"
import AppError from "../components/app_error/app_error.jsx"

var App = React.createClass({
    render() {
        // Injected by connect() call:
        const { dispatch, app_state, cards, columns, app_error_description } = this.props;

        if( app_state === LOADING_STATES.READY ) {
            return (
                <Estimator cards={cards} columns={columns} dispatch={dispatch}/>
            );
        } else if( app_state === LOADING_STATES.ERROR ) {
            return (
                <AppError message={app_error_description}/>
            )
        } else {
            return (
                <Loading app_state={app_state} />
            );
        }
    }
});

// Which props do we want to inject, given the global state?
// TODO: use https://github.com/faassen/reselect for better performance.
function select(state) {
    return {
        app_state: state.cards.app_state,
        cards: state.cards.cards,
        columns: state.cards.columns,
        app_error_description: state.cards.app_error_description
    }
}

export default connect(select)(App)
