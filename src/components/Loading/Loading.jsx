import React from 'react';
import PropTypes from 'prop-types';
import { LOADING_STATES } from '~/constants';

import '~/components/Loading/Loading.css';

function Loading({ appState }) {
    let stateMessage;

    switch (appState) {
    case LOADING_STATES.UNINITIALIZED:
        stateMessage = 'Starting up...';
        break;
    case LOADING_STATES.CONNECTING_TO_SERVER:
        stateMessage = 'Connecting to Crossbar...';
        break;
    case LOADING_STATES.GETTING_INITIAL_STATE:
        stateMessage = 'Getting initial state...';
        break;
    case LOADING_STATES.SUBSCRIBING_TO_RECEIVE_INITIAL_STATE:
        stateMessage = 'Subscribing to recieve initial state...';
        break;
    case LOADING_STATES.UNSUBSCRIBING_TO_RECEIVE_INITIAL_STATE:
        stateMessage = 'Final preparation...';
        break;
    default:
        stateMessage = `An unexpected state was encountered:${appState}`;
        break;
    }

    return (
        <div className="loading">
            <div className="loading-spinner" />
            <h1>{stateMessage}</h1>
        </div>
    );
}

Loading.propTypes = {
    appState: PropTypes.string.isRequired,
};

export default Loading;
