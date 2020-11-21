import { Connection } from 'autobahn-browser';
import { v4 } from 'uuid';
import { INITIAL_STATE_SUBSCRIPTION, LOADING_STATES } from '~/constants';
import {
    getSession,
    getSubscription,
    registerSession,
    registerSubscription,
    unregisterSubscription,
} from '~/crossbar_connector';

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
        payload: {},
    };
}

export function connectionClosed(reason) {
    return {
        type: CONNECTION_CLOSED,
        payload: {
            reason,
        },
    };
}

export function subscribingToInitialState() {
    return {
        type: SUBSCRIBING_TO_INITIAL_STATE,
        payload: {},
    };
}

export function subscribeToInitialStateFailed(reason) {
    return {
        type: SUBSCRIBE_TO_INITIAL_STATE_FAILED,
        payload: {
            reason,
        },
    };
}

export function setInitialStateTimer(timer) {
    return {
        type: SET_INITIAL_STATE_TIMER,
        payload: {
            timer,
        },
    };
}

export function gettingInitialState() {
    return {
        type: GETTING_INITIAL_STATE,
        payload: {},
    };
}

export function unsubscribeFromInitialStateFailed(reason) {
    return {
        type: UNSUBSCRIBE_FROM_INITIAL_STATE_FAILED,
        payload: {
            reason,
        },
    };
}

export function subscribeToRequestInitialStateFailed(reason) {
    return {
        type: SUBSCRIBE_TO_ADD_CARD_FAILED,
        payload: {
            reason,
        },
    };
}

export function subscribeToAddCardFailed(reason) {
    return {
        type: SUBSCRIBE_TO_ADD_CARD_FAILED,
        payload: {
            reason,
        },
    };
}

export function subscribeToMoveCardFailed(reason) {
    return {
        type: SUBSCRIBE_TO_MOVE_CARD_FAILED,
        payload: {
            reason,
        },
    };
}

export function subscribeToDeleteCardFailed(reason) {
    return {
        type: SUBSCRIBE_TO_DELETE_CARD_FAILED,
        payload: {
            reason,
        },
    };
}

export function subscribeToClearBoardFailed(reason) {
    return {
        type: SUBSCRIBE_TO_CLEAR_BOARD_FAILED,
        payload: {
            reason,
        },
    };
}

export function setInitialState(cards, columns) {
    return {
        type: SET_INITIAL_STATE,
        payload: {
            cards,
            columns,
        },
    };
}

export function unsubscribingFromInitialState() {
    return {
        type: UNSUBSCRIBING_FROM_INITIAL_STATE,
        payload: {},
    };
}

export function initializationComplete() {
    return {
        type: INITIALIZATION_COMPLETE,
        payload: {},
    };
}

export function addCardReceived(card) {
    return {
        type: ADD_CARD_RECEIVED,
        payload: {
            card,
        },
    };
}

export function moveCardReceived(cardId, toColumn) {
    return {
        type: MOVE_CARD_RECEIVED,
        payload: {
            cardId,
            toColumn,
        },
    };
}

export function deleteCardReceived(cardId) {
    return {
        type: DELETE_CARD_RECEIVED,
        payload: {
            cardId,
        },
    };
}

export function clearBoardReceived() {
    return {
        type: CLEAR_BOARD_RECEIVED,
        payload: {},
    };
}

// "Thunks"
export function subscribeToRequestInitialState() {
    return (dispatch, getState) => {
        // Sub to requests for initial state, for future clients
        getSession().subscribe(
            'Estimator.request_initial_state',
            () => {
                const state = getState();

                getSession().publish('Estimator.set_initial_state', [state.cards.cards, state.cards.columns]);
            },
        ).then(
            () => {
            },
            (reason) => {
                dispatch(subscribeToRequestInitialStateFailed(reason));
            },
        );
    };
}

export function subscribeToAddCard() {
    return (dispatch) => {
        getSession().subscribe(
            'Estimator.new_card',
            (data) => {
                const card = data[0];

                dispatch(addCardReceived(card));
            },
        ).then(
            () => {
            },
            (reason) => {
                dispatch(subscribeToAddCardFailed(reason));
            },
        );
    };
}

export function subscribeToMoveCard() {
    return (dispatch) => {
        getSession().subscribe(
            'Estimator.move_card',
            (data) => {
                const cardId = data[0];
                const toColumn = data[1];

                dispatch(moveCardReceived(cardId, toColumn));
            },
        ).then(
            null,
            (reason) => {
                dispatch(subscribeToMoveCardFailed(reason));
            },
        );
    };
}

export function subscribeToDeleteCard() {
    return (dispatch) => {
        getSession().subscribe(
            'Estimator.delete_card',
            (data) => {
                const cardId = data[0];

                dispatch(deleteCardReceived(cardId));
            },
        ).then(
            null,
            (reason) => {
                dispatch(subscribeToDeleteCardFailed(reason));
            },
        );
    };
}

export function subscribeToClearBoard() {
    return (dispatch) => {
        getSession().subscribe(
            'Estimator.ClearBoard',
            () => {
                dispatch(clearBoardReceived());
            },
        ).then(
            null,
            (reason) => {
                dispatch(subscribeToClearBoardFailed(reason));
            },
        );
    };
}

export function unsubscribedFromInitialState() {
    return (dispatch) => {
        // We're ready to start working now, so go subscribe to all the various events we'll want to receive
        dispatch(subscribeToRequestInitialState());
        dispatch(subscribeToAddCard());
        dispatch(subscribeToMoveCard());
        dispatch(subscribeToDeleteCard());
        dispatch(subscribeToClearBoard());

        dispatch(initializationComplete());
    };
}

export function unsubscribeFromInitialState() {
    return (dispatch, getState) => {
        const state = getState();

        if (state.cards.appState !== LOADING_STATES.GETTING_INITIAL_STATE) {
            dispatch(connectionClosed(`Illegal state transition in unsubscribeFromInitialState.  From:${state.appState}`));
            return;
        }

        // Unsub from set_initial_state, since we won't need it any more
        getSession().unsubscribe(getSubscription(INITIAL_STATE_SUBSCRIPTION)).then(
            () => {
                dispatch(unsubscribedFromInitialState());
            },
            (error) => {
                dispatch(unsubscribeFromInitialStateFailed(error));
            },
        );

        dispatch(unsubscribingFromInitialState());

        unregisterSubscription(INITIAL_STATE_SUBSCRIPTION);
    };
}

export function initialStateReceived(cards, columns) {
    return (dispatch, getState) => {
        const state = getState();

        if (state.cards.appState !== LOADING_STATES.GETTING_INITIAL_STATE) {
            // This might happen in a race condition, but isn't a big deal so just skip out
            return;
        }

        clearTimeout(state.cards.initialStateTimer);
        dispatch(setInitialStateTimer(null));

        dispatch(setInitialState(cards, columns));

        dispatch(unsubscribeFromInitialState());
    };
}

export function initialStateTimeout() {
    return (dispatch, getState) => {
        // Assume we're alone on the server now, and so just leave the board state at its defaults and move on in the
        // state machine.
        clearTimeout(getState().cards.initialStateTimer);
        dispatch(setInitialStateTimer(null));

        dispatch(unsubscribeFromInitialState());
    };
}

export function requestInitialState() {
    return (dispatch) => {
        dispatch(gettingInitialState());

        // Broadcast out a request for getting the initial state (we'll take whoever comes back first as our state)
        getSession().publish('Estimator.request_initial_state', []);

        // We may be the first people in the room, in which case our request to get the initial state will never return
        // So, set a timer instead to wait for a little while before just assuming we're alone
        const timer = setTimeout(
            () => {
                dispatch(initialStateTimeout());
            },
            5000,
        );

        dispatch(setInitialStateTimer(timer));
    };
}

export function subscribeToInitialState() {
    return (dispatch, getState) => {
        const state = getState();

        if (state.cards.appState !== LOADING_STATES.CONNECTING_TO_SERVER) {
            dispatch(connectionClosed(`Illegal state transition in subscribeToInitialState.  From:${state.appState}`));
            return;
        }

        dispatch(subscribingToInitialState());

        getSession().subscribe(
            'Estimator.set_initial_state',
            (data) => {
                dispatch(initialStateReceived(data[0], data[1]));

                dispatch(unsubscribeFromInitialState());
            },
        ).then(
            (subscription) => {
                registerSubscription(INITIAL_STATE_SUBSCRIPTION, subscription);
                dispatch(requestInitialState());
            },
            (error) => {
                dispatch(subscribeToInitialStateFailed(error));
            },
        );
    };
}

export function connectToServer(url, realm) {
    return (dispatch) => {
        // Update state to 'connecting...'
        dispatch(connectingToServer());

        // init the server
        const connection = new Connection({
            url,
            realm,
        });

        connection.onopen = (session) => {
            registerSession(session);

            dispatch(subscribeToInitialState());
        };

        connection.onclose = (reason) => {
            dispatch(connectionClosed(reason));
        };

        // Actually connect
        connection.open();
    };
}

export function addCard(title) {
    return (dispatch) => {
        // Create the Card locally
        const card = {
            cardId: v4(),
            title,
            history: [],
        };

        dispatch(addCardReceived(card));

        // Broadcast to other clients that the Card has been created
        getSession().publish('Estimator.new_card', [card]);
    };
}

export function moveCard(cardId, toColumn) {
    return (dispatch) => {
        // Move the Card locally
        dispatch(moveCardReceived(cardId, toColumn));

        // Broadcast to other clients that the Card has been moved
        getSession().publish('Estimator.move_card', [cardId, toColumn]);
    };
}

export function deleteCard(cardId) {
    return (dispatch) => {
        // Delete the Card locally
        dispatch(deleteCardReceived(cardId));

        // Broadcast to other clients that the Card has been deleted
        getSession().publish('Estimator.delete_card', [cardId]);
    };
}

export function clearBoard() {
    return (dispatch) => {
        dispatch(clearBoardReceived());

        getSession().publish('Estimator.ClearBoard', []);
    };
}
