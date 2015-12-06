export const ADD_CARD = 'ADD_CARD';
export const MOVE_CARD = 'MOVE_CARD';
export const DELETE_CARD = 'DELETE_CARD';


export function addCard(title) {
    return {
        type: ADD_CARD,
        payload: {
            title: title
        }
    }
}

export function moveCard(card_id, to_column) {
    return {
        type: MOVE_CARD,
        payload: {
            card_id: card_id,
            to_column: to_column
        }
    }
}

export function deleteCard(card_id) {
    return {
        type: DELETE_CARD,
        payload: {
            card_id: card_id
        }
    }
}