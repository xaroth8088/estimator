import React from 'react';
import { LOADING_STATES } from '../../constants.es6';

import './loading.css';

function Loading({ app_state }) {
    var state_message;

    switch (app_state) {
        case LOADING_STATES.UNINITIALIZED:
            state_message = 'Starting up...';
            break;
        case LOADING_STATES.CONNECTING_TO_SERVER:
            state_message = 'Connecting to Crossbar...';
            break;
        case LOADING_STATES.GETTING_INITIAL_STATE:
            state_message = 'Getting initial state...';
            break;
        case LOADING_STATES.SUBSCRIBING_TO_RECEIVE_INITIAL_STATE:
            state_message = 'Subscribing to recieve initial state...';
            break;
        case LOADING_STATES.UNSUBSCRIBING_TO_RECEIVE_INITIAL_STATE:
            state_message = 'Final preparation...';
            break;
        default:
            state_message = 'An unexpected state was encountered:' + app_state;
            break;
    }

    return (
        <div className="loading">
            <div className="loading-spinner"></div>
            <h1>{state_message}</h1>
        </div>
    );
}

export default Loading;
