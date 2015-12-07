import { combineReducers, createStore } from 'redux'
import { ADD_CARD, MOVE_CARD, DELETE_CARD } from "./actions.es6";

const initialState = {
    columns: {
        1: [],
        2: [],
        3: [],
        5: [],
        8: [],
        13: [],
        '?': []
    },
    cards: {},
    card_id_counter: 0
};

function reduceAddCard(state, payload) {
    var new_state, card_id;

    // Deep copy the old state
    new_state = JSON.parse(JSON.stringify(state));  // TODO: use the Immutable library instead

    // Get the new card_id
    card_id = new_state.card_id_counter;
    new_state.card_id_counter++;

    // Create the new card
    new_state.cards[card_id] = {
        card_id: card_id,
        title: payload.title,
        history: []
    };

    // Add the card to the ? column
    new_state.columns['?'].push(card_id);

    // Return the new state
    return new_state;
}

function reduceMoveCard(state, payload) {
    var new_state;

    // Copy the old state
    new_state = JSON.parse(JSON.stringify(state));

    // Remove the card_id from all columns
    removeFromAllColumns(new_state.columns, payload.card_id);

    // Add the card_id to the new column
    new_state.columns[payload.to_column].push(payload.card_id);

    // Update its move history
    new_state.cards[payload.card_id].history.push(payload.to_column);

    // Return the new state
    return new_state;
}

function reduceDeleteCard(state, payload) {
    var new_state;

    // Copy the old state
    new_state = JSON.parse(JSON.stringify(state));

    // Remove the card_id from all columns
    removeFromAllColumns(new_state.columns, payload.card_id);

    // Remove the card from cards
    delete new_state.cards[payload.card_id];

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

function cards(state = initialState, action) {
    switch (action.type) {
        case ADD_CARD:
            return reduceAddCard(state, action.payload);
        case MOVE_CARD:
            return reduceMoveCard(state, action.payload);
        case DELETE_CARD:
            return reduceDeleteCard(state, action.payload);
    }

    return state;
}

const estimatorApp = combineReducers({cards});

export default createStore(estimatorApp);
