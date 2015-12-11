import { combineReducers, createStore, applyMiddleware } from 'redux'
import {
    ADD_CARD_RECEIVED,
    MOVE_CARD_RECEIVED,
    DELETE_CARD_RECEIVED,
    CLEAR_BOARD_RECEIVED,
    CONNECTING_TO_SERVER,
    CONNECTION_CLOSED,
    SUBSCRIBING_TO_INITIAL_STATE,
    SUBSCRIBE_TO_INITIAL_STATE_FAILED,
    GETTING_INITIAL_STATE,
    SET_INITIAL_STATE_TIMER,
    SET_INITIAL_STATE,
    UNSUBSCRIBING_FROM_INITIAL_STATE,
    UNSUBSCRIBE_FROM_INITIAL_STATE_FAILED,
    SUBSCRIBE_TO_ADD_CARD_FAILED,
    SUBSCRIBE_TO_MOVE_CARD_FAILED,
    SUBSCRIBE_TO_DELETE_CARD_FAILED,
    SUBSCRIBE_TO_CLEAR_BOARD_FAILED,
    INITIALIZATION_COMPLETE
} from "./actions.es6"
import { LOADING_STATES } from "./constants.es6"
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import uuid from 'uuid'

// TODO: split out 'cards' state tree reducers from 'app status' state tree reducers
const initialState = {
    app_state: LOADING_STATES.UNINITIALIZED,
    app_error_description: "",
    receive_initial_state_subscription: null,
    initial_state_timer: null,
    columns: {
        1: [],
        2: [],
        3: [],
        5: [],
        8: [],
        13: [],
        '?': []
    },
    cards: {}
};

function copyState(old_state) {
    var new_state;

    // TODO: use the 'Immutable' library instead
    new_state = JSON.parse(JSON.stringify(old_state));

    return new_state;
}

function reduceAddCardReceived(state, payload) {
    var new_state, card;

    // Deep copy the old state
    new_state = copyState(state);

    // Modify the state
    card = payload.card;

    // Create the new card
    new_state.cards[card.card_id] = {
        card_id: card.card_id,
        title: card.title,
        history: card.history
    };

    // Add the card to the ? column
    new_state.columns['?'].push(card.card_id);

    // Return the new state
    return new_state;
}

function reduceMoveCardReceived(state, payload) {
    var new_state;

    // Copy the old state
    new_state = copyState(state);

    // Remove the card_id from all columns
    removeFromAllColumns(new_state.columns, payload.card_id);

    // Add the card_id to the new column
    new_state.columns[payload.to_column].push(payload.card_id);

    // Update its move history
    new_state.cards[payload.card_id].history.push(payload.to_column);

    // Return the new state
    return new_state;
}

function reduceDeleteCardReceived(state, payload) {
    var new_state;

    // Copy the old state
    new_state = copyState(state);

    // Remove the card_id from all columns
    removeFromAllColumns(new_state.columns, payload.card_id);

    // Remove the card from cards
    delete new_state.cards[payload.card_id];

    // Return the new state
    return new_state;
}

function reduceClearBoardReceived(state, payload) {
    var new_state;

    // Copy the old state
    new_state = copyState(state);

    // Modify the state
    // TODO: it'd be nice if we could just copy this portion out of the initial state.  Probably trivial once
    // TODO: the server events and board state are separated.
    new_state.columns = {
        1: [],
        2: [],
        3: [],
        5: [],
        8: [],
        13: [],
        '?': []
    };
    new_state.cards = {};

    // Return the new state
    return new_state;
}

function removeFromAllColumns(columns, card_id) {
    var column_id, index;

    for (column_id of Object.keys(columns)) {
        index = columns[column_id].indexOf(card_id);
        if (index !== -1) {
            columns[column_id].splice(index, 1);
        }
    }
}

function reduceConnectionClosed(state, payload) {
    var new_state;

    // Copy the old state
    new_state = copyState(state);

    // Update the state
    new_state.app_state = LOADING_STATES.ERROR;
    new_state.app_error_description = "Sorry, but the connection was closed.  This was the reason given:" + payload.reason;

    // Return the new state
    return new_state;
}

function reduceSubscribeToInitialStateFailed(state, payload) {
    var new_state;

    // Copy the old state
    new_state = copyState(state);

    // Update the state
    new_state.app_state = LOADING_STATES.ERROR;
    new_state.app_error_description = "Sorry, but we were unable to subscribe to the initial board state.  This was the reason given:" + payload.reason;

    // Return the new state
    return new_state;
}

function reduceUnsubscribeFromInitialStateFailed(state, payload) {
    var new_state;

    // Copy the old state
    new_state = copyState(state);

    // Update the state
    new_state.app_state = LOADING_STATES.ERROR;
    new_state.app_error_description = "Sorry, but we were unable to unsubscribe from receiving the initial board state.  This was the reason given:" + payload.reason;

    // Return the new state
    return new_state;
}

function reduceSubscribeToAddCardFailed(state, payload) {
    var new_state;

    // Copy the old state
    new_state = copyState(state);

    // Update the state
    new_state.app_state = LOADING_STATES.ERROR;
    new_state.app_error_description = "Sorry, but we were unable to subscribe to receiving added cards.  This was the reason given:" + payload.reason;

    // Return the new state
    return new_state;
}

function reduceSubscribeToMoveCardFailed(state, payload) {
    var new_state;

    // Copy the old state
    new_state = copyState(state);

    // Update the state
    new_state.app_state = LOADING_STATES.ERROR;
    new_state.app_error_description = "Sorry, but we were unable to subscribe to receiving moved cards.  This was the reason given:" + payload.reason;

    // Return the new state
    return new_state;
}

function reduceSubscribeToDeleteCardFailed(state, payload) {
    var new_state;

    // Copy the old state
    new_state = copyState(state);

    // Update the state
    new_state.app_state = LOADING_STATES.ERROR;
    new_state.app_error_description = "Sorry, but we were unable to subscribe to receiving deleted cards.  This was the reason given:" + payload.reason;

    // Return the new state
    return new_state;
}

function reduceSubscribeToClearBoardFailed(state, payload) {
    var new_state;

    // Copy the old state
    new_state = copyState(state);

    // Update the state
    new_state.app_state = LOADING_STATES.ERROR;
    new_state.app_error_description = "Sorry, but we were unable to subscribe to receiving clear board events.  This was the reason given:" + payload.reason;

    // Return the new state
    return new_state;
}

function reduceConnectingToServer(state, payload) {
    var new_state;

    // Copy the old state
    new_state = copyState(state);

    // Update the state
    new_state.app_state = LOADING_STATES.CONNECTING_TO_SERVER;

    // Return the new state
    return new_state;
}

function reduceSubscribingToInitialState(state, payload) {
    var new_state;

    // Copy the old state
    new_state = copyState(state);

    // Update the state
    new_state.app_state = LOADING_STATES.SUBSCRIBING_TO_RECEIVE_INITIAL_STATE;

    // Return the new state
    return new_state;
}

function reduceGettingInitialState(state, payload) {
    var new_state;

    // Copy the old state
    new_state = copyState(state);

    // Update the state
    new_state.app_state = LOADING_STATES.GETTING_INITIAL_STATE;

    // Return the new state
    return new_state;
}

function reduceSetInitialStateTimer(state, payload) {
    var new_state;

    // Copy the old state
    new_state = copyState(state);

    // Update the state
    new_state.initial_state_timer = payload.timer;

    // Return the new state
    return new_state;
}

function reduceSetInitialState(state, payload) {
    var new_state;

    // Copy the old state
    new_state = copyState(state);

    // Update the state
    new_state.cards = payload.cards;
    new_state.columns = payload.columns;

    // Return the new state
    return new_state;
}

function reduceUnsubscribingFromInitialState(state, payload) {
    var new_state;

    // Copy the old state
    new_state = copyState(state);

    // Update the state
    new_state.app_state = LOADING_STATES.UNSUBSCRIBING_TO_RECEIVE_INITIAL_STATE;

    // Return the new state
    return new_state;
}

function reduceInitializationComplete(state, payload) {
    var new_state;

    // Copy the old state
    new_state = copyState(state);

    // Update the state
    new_state.app_state = LOADING_STATES.READY;

    // Return the new state
    return new_state;
}

function cards(state = initialState, action) {
    switch (action.type) {
        case ADD_CARD_RECEIVED:
            return reduceAddCardReceived(state, action.payload);
        case MOVE_CARD_RECEIVED:
            return reduceMoveCardReceived(state, action.payload);
        case DELETE_CARD_RECEIVED:
            return reduceDeleteCardReceived(state, action.payload);
        case CLEAR_BOARD_RECEIVED:
            return reduceClearBoardReceived(state, action.payload);

        case CONNECTING_TO_SERVER:
            return reduceConnectingToServer(state, action.payload);
        case CONNECTION_CLOSED:
            return reduceConnectionClosed(state, action.payload);
        case SUBSCRIBING_TO_INITIAL_STATE:
            return reduceSubscribingToInitialState(state, action.payload);
        case SUBSCRIBE_TO_INITIAL_STATE_FAILED:
            return reduceSubscribeToInitialStateFailed(state, action.payload);
        case GETTING_INITIAL_STATE:
            return reduceGettingInitialState(state, action.payload);
        case SET_INITIAL_STATE_TIMER:
            return reduceSetInitialStateTimer(state, action.payload);
        case SET_INITIAL_STATE:
            return reduceSetInitialState(state, action.payload);
        case UNSUBSCRIBING_FROM_INITIAL_STATE:
            return reduceUnsubscribingFromInitialState(state, action.payload);
        case UNSUBSCRIBE_FROM_INITIAL_STATE_FAILED:
            return reduceUnsubscribeFromInitialStateFailed(state, action.payload);
        case SUBSCRIBE_TO_ADD_CARD_FAILED:
            return reduceSubscribeToAddCardFailed(state, action.payload);
        case SUBSCRIBE_TO_MOVE_CARD_FAILED:
            return reduceSubscribeToMoveCardFailed(state, action.payload);
        case SUBSCRIBE_TO_DELETE_CARD_FAILED:
            return reduceSubscribeToDeleteCardFailed(state, action.payload);
        case SUBSCRIBE_TO_CLEAR_BOARD_FAILED:
            return reduceSubscribeToClearBoardFailed(state, action.payload);
        case INITIALIZATION_COMPLETE:
            return reduceInitializationComplete(state, action.payload);
    }

    return state;
}

// Set up the actual store
const loggerMiddleware = createLogger();

const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
)(createStore);

const estimatorApp = combineReducers({cards});

export default createStoreWithMiddleware(estimatorApp);
