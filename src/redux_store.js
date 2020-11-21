import { applyMiddleware, combineReducers, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import {
    ADD_CARD_RECEIVED,
    CLEAR_BOARD_RECEIVED,
    CONNECTING_TO_SERVER,
    CONNECTION_CLOSED,
    DELETE_CARD_RECEIVED,
    GETTING_INITIAL_STATE,
    INITIALIZATION_COMPLETE,
    MOVE_CARD_RECEIVED,
    SET_INITIAL_STATE,
    SET_INITIAL_STATE_TIMER,
    SUBSCRIBE_TO_ADD_CARD_FAILED,
    SUBSCRIBE_TO_CLEAR_BOARD_FAILED,
    SUBSCRIBE_TO_DELETE_CARD_FAILED,
    SUBSCRIBE_TO_INITIAL_STATE_FAILED,
    SUBSCRIBE_TO_MOVE_CARD_FAILED,
    SUBSCRIBING_TO_INITIAL_STATE,
    UNSUBSCRIBE_FROM_INITIAL_STATE_FAILED,
    UNSUBSCRIBING_FROM_INITIAL_STATE,
} from '~/actions';
import { LOADING_STATES } from '~/constants';

// TODO: split out 'cards' state tree reducers from 'app status' state tree reducers
const initialState = {
    appState: LOADING_STATES.UNINITIALIZED,
    appErrorDescription: '',
    receiveInitialStateSubscription: null,
    initialStateTimer: null,
    columns: {
        1: [],
        2: [],
        3: [],
        5: [],
        8: [],
        13: [],
        '?': [],
    },
    cards: {},
};

function copyState(oldState) {
    // TODO: use the 'Immutable' library instead
    const newState = JSON.parse(JSON.stringify(oldState));

    return newState;
}

function reduceAddCardReceived(state, payload) {
    // Deep copy the old state
    const newState = copyState(state);

    // Modify the state
    const { card } = payload;

    // Create the new Card
    newState.cards[card.cardId] = {
        cardId: card.cardId,
        title: card.title,
        history: card.history,
    };

    // Add the Card to the ? Column
    newState.columns['?'].push(card.cardId);

    // Return the new state
    return newState;
}

function removeFromAllColumns(columns, cardId) {
    let index;

    Object.keys(columns).forEach(
        (columnId) => {
            index = columns[columnId].indexOf(cardId);
            if (index !== -1) {
                columns[columnId].splice(index, 1);
            }
        },
    );
}

function reduceMoveCardReceived(state, payload) {
    // Don't move to the same Column you're already in
    if (state.columns[payload.toColumn].find((a) => a === payload.cardId) !== undefined) {
        return state;
    }

    // Copy the old state
    const newState = copyState(state);

    // Remove the cardId from all columns
    removeFromAllColumns(newState.columns, payload.cardId);

    // Add the cardId to the new Column
    newState.columns[payload.toColumn].push(payload.cardId);

    // Update its move history
    newState.cards[payload.cardId].history.push(payload.toColumn);

    // Return the new state
    return newState;
}

function reduceDeleteCardReceived(state, payload) {
    // Copy the old state
    const newState = copyState(state);

    // Remove the cardId from all columns
    removeFromAllColumns(newState.columns, payload.cardId);

    // Remove the Card from cards
    delete newState.cards[payload.cardId];

    // Return the new state
    return newState;
}

function reduceClearBoardReceived(state) {
    // Copy the old state
    const newState = copyState(state);

    // Modify the state
    // TODO: it'd be nice if we could just copy this portion out of the initial state.  Probably trivial once
    // TODO: the server events and board state are separated.
    newState.columns = {
        1: [],
        2: [],
        3: [],
        5: [],
        8: [],
        13: [],
        '?': [],
    };
    newState.cards = {};

    // Return the new state
    return newState;
}

function reduceConnectionClosed(state, payload) {
    // Copy the old state
    const newState = copyState(state);

    // Update the state
    newState.appState = LOADING_STATES.ERROR;
    newState.appErrorDescription = `Sorry, but the connection was closed.  This was the reason given:${payload.reason}`;

    // Return the new state
    return newState;
}

function reduceSubscribeToInitialStateFailed(state, payload) {
    // Copy the old state
    const newState = copyState(state);

    // Update the state
    newState.appState = LOADING_STATES.ERROR;
    newState.appErrorDescription = `Sorry, but we were unable to subscribe to the initial board state.  This was the reason given:${payload.reason}`;

    // Return the new state
    return newState;
}

function reduceUnsubscribeFromInitialStateFailed(state, payload) {
    // Copy the old state
    const newState = copyState(state);

    // Update the state
    newState.appState = LOADING_STATES.ERROR;
    newState.appErrorDescription = `Sorry, but we were unable to unsubscribe from receiving the initial board state.  This was the reason given:${payload.reason}`;

    // Return the new state
    return newState;
}

function reduceSubscribeToAddCardFailed(state, payload) {
    // Copy the old state
    const newState = copyState(state);

    // Update the state
    newState.appState = LOADING_STATES.ERROR;
    newState.appErrorDescription = `Sorry, but we were unable to subscribe to receiving added cards.  This was the reason given:${payload.reason}`;

    // Return the new state
    return newState;
}

function reduceSubscribeToMoveCardFailed(state, payload) {
    // Copy the old state
    const newState = copyState(state);

    // Update the state
    newState.appState = LOADING_STATES.ERROR;
    newState.appErrorDescription = `Sorry, but we were unable to subscribe to receiving moved cards.  This was the reason given:${payload.reason}`;

    // Return the new state
    return newState;
}

function reduceSubscribeToDeleteCardFailed(state, payload) {
    // Copy the old state
    const newState = copyState(state);

    // Update the state
    newState.appState = LOADING_STATES.ERROR;
    newState.appErrorDescription = `Sorry, but we were unable to subscribe to receiving deleted cards.  This was the reason given:${payload.reason}`;

    // Return the new state
    return newState;
}

function reduceSubscribeToClearBoardFailed(state, payload) {
    // Copy the old state
    const newState = copyState(state);

    // Update the state
    newState.appState = LOADING_STATES.ERROR;
    newState.appErrorDescription = `Sorry, but we were unable to subscribe to receiving clear board events.  This was the reason given:${payload.reason}`;

    // Return the new state
    return newState;
}

function reduceConnectingToServer(state) {
    // Copy the old state
    const newState = copyState(state);

    // Update the state
    newState.appState = LOADING_STATES.CONNECTING_TO_SERVER;

    // Return the new state
    return newState;
}

function reduceSubscribingToInitialState(state) {
    // Copy the old state
    const newState = copyState(state);

    // Update the state
    newState.appState = LOADING_STATES.SUBSCRIBING_TO_RECEIVE_INITIAL_STATE;

    // Return the new state
    return newState;
}

function reduceGettingInitialState(state) {
    // Copy the old state
    const newState = copyState(state);

    // Update the state
    newState.appState = LOADING_STATES.GETTING_INITIAL_STATE;

    // Return the new state
    return newState;
}

function reduceSetInitialStateTimer(state, payload) {
    // Copy the old state
    const newState = copyState(state);

    // Update the state
    newState.initialStateTimer = payload.timer;

    // Return the new state
    return newState;
}

function reduceSetInitialState(state, payload) {
    // Copy the old state
    const newState = copyState(state);

    // Update the state
    newState.cards = payload.cards;
    newState.columns = payload.columns;

    // Return the new state
    return newState;
}

function reduceUnsubscribingFromInitialState(state) {
    // Copy the old state
    const newState = copyState(state);

    // Update the state
    newState.appState = LOADING_STATES.UNSUBSCRIBING_TO_RECEIVE_INITIAL_STATE;

    // Return the new state
    return newState;
}

function reduceInitializationComplete(state) {
    // Copy the old state
    const newState = copyState(state);

    // Update the state
    newState.appState = LOADING_STATES.READY;

    // Return the new state
    return newState;
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
    default:
        return state;
    }
}

// Set up the actual store
const loggerMiddleware = createLogger();

const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware, // neat middleware that logs actions
)(createStore);

const estimatorApp = combineReducers({ cards });

export default createStoreWithMiddleware(estimatorApp);
