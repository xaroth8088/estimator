import { Connection } from "autobahn-browser"
import { LOADING_STATES, INITIAL_STATE_SUBSCRIPTION } from "./constants.es6"
import {
    registerSession,
    getSession,
    registerSubscription,
    getSubscription,
    unregisterSubscription
} from "./crossbar_connector.es6"
import { v4 } from "uuid"

// TODO: split out user-initiated actions from server-connection-related actions

// Connection-related actions
export const CONNECTING_TO_SERVER = 'CONNECTING_TO_SERVER';
export const CONNECTION_CLOSED = 'CONNECTION_CLOSED';
export const SUBSCRIBING_TO_INITIAL_STATE = 'SUBSCRIBING_TO_INITIAL_STATE';
export const SUBSCRIBE_TO_INITIAL_STATE_FAILED = 'SUBSCRIBE_TO_INITIAL_STATE_FAILED';
export const GETTING_INITIAL_STATE = 'GETTING_INITIAL_STATE';
export const SET_INITIAL_STATE_TIMER = 'SET_INITIAL_STATE_TIMER';
export const UNSUBSCRIBING_FROM_INITIAL_STATE = 'UNSUBSCRIBING_FROM_INITIAL_STATE';
export const UNSUBSCRIBE_FROM_INITIAL_STATE_FAILED = 'UNSUBSCRIBE_FROM_INITIAL_STATE_FAILED';

// For this set, we intentionally don't care about the success case changing the app state
export const SUBSCRIBE_TO_ADD_CARD_FAILED = 'SUBSCRIBE_TO_ADD_CARD_FAILED';
export const SUBSCRIBE_TO_MOVE_CARD_FAILED = 'SUBSCRIBE_TO_MOVE_CARD_FAILED';
export const SUBSCRIBE_TO_DELETE_CARD_FAILED = 'SUBSCRIBE_TO_DELETE_CARD_FAILED';
export const SUBSCRIBE_TO_CLEAR_BOARD_FAILED = 'SUBSCRIBE_TO_CLEAR_BOARD_FAILED';

export const INITIALIZATION_COMPLETE = 'INITIALIZATION_COMPLETE';

// Server-received actions
export const SET_INITIAL_STATE = 'SET_INITIAL_STATE';
export const ADD_CARD_RECEIVED = 'ADD_CARD_RECEIVED';
export const MOVE_CARD_RECEIVED = 'MOVE_CARD_RECEIVED';
export const DELETE_CARD_RECEIVED = 'DELETE_CARD_RECEIVED';
export const CLEAR_BOARD_RECEIVED = 'CLEAR_BOARD_RECEIVED';

export function connectingToServer() {
    // TODO: maybe include the URI we're connecting to here?
    return {
        type: CONNECTING_TO_SERVER,
        payload: {}
    }
}

export function connectionClosed(reason) {
    return {
        type: CONNECTION_CLOSED,
        payload: {
            reason: reason
        }
    }
}

export function subscribingToInitialState() {
    return {
        type: SUBSCRIBING_TO_INITIAL_STATE,
        payload: {}
    }
}

export function subscribeToInitialStateFailed(reason) {
    return {
        type: SUBSCRIBE_TO_INITIAL_STATE_FAILED,
        payload: {
            reason: reason
        }
    }
}

export function setInitialStateTimer(timer) {
    return {
        type: SET_INITIAL_STATE_TIMER,
        payload: {
            timer: timer
        }
    }
}

export function gettingInitialState() {
    return {
        type: GETTING_INITIAL_STATE,
        payload: {}
    }
}

export function unsubscribeFromInitialStateFailed(reason) {
    return {
        type: UNSUBSCRIBE_FROM_INITIAL_STATE_FAILED,
        payload: {
            reason: reason
        }
    }
}

export function subscribeToRequestInitialStateFailed(reason) {
    return {
        type: SUBSCRIBE_TO_ADD_CARD_FAILED,
        payload: {
            reason: reason
        }
    }
}

export function subscribeToAddCardFailed(reason) {
    return {
        type: SUBSCRIBE_TO_ADD_CARD_FAILED,
        payload: {
            reason: reason
        }
    }
}

export function subscribeToMoveCardFailed(reason) {
    return {
        type: SUBSCRIBE_TO_MOVE_CARD_FAILED,
        payload: {
            reason: reason
        }
    }
}

export function subscribeToDeleteCardFailed(reason) {
    return {
        type: SUBSCRIBE_TO_DELETE_CARD_FAILED,
        payload: {
            reason: reason
        }
    }
}

export function subscribeToClearBoardFailed(reason) {
    return {
        type: SUBSCRIBE_TO_CLEAR_BOARD_FAILED,
        payload: {
            reason: reason
        }
    }
}

export function setInitialState(cards, columns) {
    return {
        type: SET_INITIAL_STATE,
        payload: {
            cards: cards,
            columns: columns
        }
    }
}

export function unsubscribingFromInitialState() {
    return {
        type: UNSUBSCRIBING_FROM_INITIAL_STATE,
        payload: {}
    }
}

export function initializationComplete() {
    return {
        type: INITIALIZATION_COMPLETE,
        payload: {}
    }
}

export function addCardReceived(card) {
    return {
        type: ADD_CARD_RECEIVED,
        payload: {
            card: card
        }
    }
}

export function moveCardReceived(card_id, to_column) {
    return {
        type: MOVE_CARD_RECEIVED,
        payload: {
            card_id: card_id,
            to_column: to_column
        }
    }
}

export function deleteCardReceived(card_id) {
    return {
        type: DELETE_CARD_RECEIVED,
        payload: {
            card_id: card_id
        }
    }
}

export function clearBoardReceived() {
    return {
        type: CLEAR_BOARD_RECEIVED,
        payload: {}
    }
}

// "Thunks"
export function connectToServer(url, realm) {
    return function (dispatch) {
        var connection;

        // Update state to 'connecting...'
        dispatch(connectingToServer());

        // init the server
        connection = new Connection({
            url: url,
            realm: realm
        });

        connection.onopen = (session) => {
            registerSession(session);

            dispatch(subscribeToInitialState());
        };

        connection.onclose = (reason) => {
            dispatch(connectionClosed(reason));
        };

        // Actually connect
        console.log("Connecting to WAMP router...");
        connection.open();
    };
}

export function subscribeToInitialState() {
    return function (dispatch, getState) {
        var state;

        state = getState();

        if (state.cards.app_state !== LOADING_STATES.CONNECTING_TO_SERVER) {
            dispatch(connectionClosed("Illegal state transition in subscribeToInitialState.  From:" + state.app_state));
            return;
        }

        dispatch(subscribingToInitialState());

        getSession().subscribe(
            "estimator.set_initial_state",
            (data) => {
                dispatch(initialStateReceived(data[0], data[1]));

                dispatch(unsubscribeFromInitialState());
            }
        ).then(
            (subscription) => {
                registerSubscription(INITIAL_STATE_SUBSCRIPTION, subscription);
                dispatch(requestInitialState());
            },
            (error) => {
                dispatch(subscribeToInitialStateFailed(error));
            }
        );
    }
}

export function requestInitialState() {
    return function (dispatch) {
        var timer;

        dispatch(gettingInitialState());

        // Broadcast out a request for getting the initial state (we'll take whoever comes back first as our state)
        getSession().publish("estimator.request_initial_state", []);

        // We may be the first people in the room, in which case our request to get the initial state will never return
        // So, set a timer instead to wait for a little while before just assuming we're alone
        timer = setTimeout(
            () => {
                dispatch(initialStateTimeout())
            },
            5000
        );

        dispatch(setInitialStateTimer(timer));
    }
}

export function initialStateTimeout() {
    return function (dispatch, getState) {
        // Assume we're alone on the server now, and so just leave the board state at its defaults and move on in the
        // state machine.
        clearTimeout(getState().cards.initial_state_timer);
        dispatch(setInitialStateTimer(null));

        dispatch(unsubscribeFromInitialState());
    }
}

export function initialStateReceived(cards, columns) {
    return function (dispatch, getState) {
        var state;

        state = getState();

        if (state.cards.app_state !== LOADING_STATES.GETTING_INITIAL_STATE) {
            // This might happen in a race condition, but isn't a big deal so just skip out
            return;
        }

        clearTimeout(state.cards.initial_state_timer);
        dispatch(setInitialStateTimer(null));

        dispatch(setInitialState(cards, columns));

        dispatch(unsubscribeFromInitialState());
    };
}

export function unsubscribeFromInitialState() {
    return function (dispatch, getState) {
        var state;

        state = getState();

        if (state.cards.app_state !== LOADING_STATES.GETTING_INITIAL_STATE) {
            dispatch(connectionClosed("Illegal state transition in unsubscribeFromInitialState.  From:" + state.app_state));
            return;
        }

        // Unsub from set_initial_state, since we won't need it any more
        getSession().unsubscribe(getSubscription(INITIAL_STATE_SUBSCRIPTION)).then(
            () => {
                dispatch(unsubscribedFromInitialState());
            },
            (error) => {
                dispatch(unsubscribeFromInitialStateFailed(error));
            }
        );

        dispatch(unsubscribingFromInitialState());

        unregisterSubscription(INITIAL_STATE_SUBSCRIPTION);
    };
}

export function unsubscribedFromInitialState() {
    return function (dispatch) {
        // We're ready to start working now, so go subscribe to all the various events we'll want to receive
        dispatch(subscribeToRequestInitialState());
        dispatch(subscribeToAddCard());
        dispatch(subscribeToMoveCard());
        dispatch(subscribeToDeleteCard());
        dispatch(subscribeToClearBoard());

        dispatch(initializationComplete());
    }
}

export function subscribeToRequestInitialState() {
    return function (dispatch, getState) {
        // Sub to requests for initial state, for future clients
        getSession().subscribe(
            "estimator.request_initial_state",
            (data) => {
                var state;

                state = getState();

                getSession().publish("estimator.set_initial_state", [state.cards.cards, state.cards.columns]);
            }
        ).then(
            () => {},
            (reason) => {
                dispatch(subscribeToRequestInitialStateFailed(reason));
            }
        );
    }
}

export function subscribeToAddCard() {
    return function (dispatch) {
        getSession().subscribe(
            "estimator.new_card",
            (data) => {
                var card;

                card = data[0];

                dispatch(addCardReceived(card));
            }
        ).then(
            () => {},
            (reason) => {
                dispatch(subscribeToAddCardFailed(reason));
            }
        );
    }
}

export function subscribeToMoveCard() {
    return function (dispatch) {
        getSession().subscribe(
            "estimator.move_card",
            (data) => {
                var card_id, to_column;

                card_id = data[0];
                to_column = data[1];

                dispatch(moveCardReceived(card_id, to_column));
            }
        ).then(
            null,
            (reason) => {
                dispatch(subscribeToMoveCardFailed(reason));
            }
        );
    }
}

export function subscribeToDeleteCard() {
    return function (dispatch) {
        getSession().subscribe(
            "estimator.delete_card",
            (data) => {
                var card_id;

                card_id = data[0];

                dispatch(deleteCardReceived(card_id));
            }
        ).then(
            null,
            (reason) => {
                dispatch(subscribeToDeleteCardFailed(reason));
            }
        )
    }
}

export function subscribeToClearBoard() {
    return function (dispatch) {
        getSession().subscribe(
            "estimator.clear_board",
            (data) => {
                dispatch(clearBoardReceived());
            }
        ).then(
            null,
            (reason) => {
                dispatch(subscribeToClearBoardFailed(reason));
            }
        );
    }
}

export function addCard(title) {
    return function(dispatch) {
        var card;

        // Create the card locally
        card = {
            card_id: v4(),
            title: title,
            history: []
        };

        dispatch(addCardReceived(card));

        // Broadcast to other clients that the card has been created
        getSession().publish("estimator.new_card", [card]);
    }
}

export function moveCard(card_id, to_column) {
    return function(dispatch) {
        // Move the card locally
        dispatch(moveCardReceived(card_id, to_column));

        // Broadcast to other clients that the card has been moved
        getSession().publish("estimator.move_card", [card_id, to_column]);
    }
}

export function deleteCard(card_id) {
    return function(dispatch) {
        // Delete the card locally
        dispatch(deleteCardReceived(card_id));

        // Broadcast to other clients that the card has been deleted
        getSession().publish("estimator.delete_card", [card_id]);
    }
}

export function clearBoard() {
    return function(dispatch) {
        dispatch(clearBoardReceived());

        getSession().publish("estimator.clear_board", []);
    }
}
