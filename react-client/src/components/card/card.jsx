import React from "react"

import { DragSource } from 'react-dnd';
import { ItemTypes } from '../../constants.es6';

import store from "../../redux_store.es6";
import { deleteCard } from "../../actions.es6";

import "./card.css"

const cardSource = {
    beginDrag(props) {
        return {
            card: props.card,
            confirming_delete: false
        };
    }
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

var Card = React.createClass({
    getInitialState() {
        return {
            show_history: false
        }
    },

    render() {
        var card_class, history_class;

        const { isDragging, connectDragSource, card } = this.props;
        card_class = "card";
        if (isDragging === true) {
            card_class += " dragging";
        }

        if (this.props.card.history.length > 5) {
            card_class += " warning";
        }

        history_class = "card-history";
        if (this.state.show_history === false) {
            history_class += " hidden";
        }

        if (this.state.confirming_delete === true) {
            card_class += " confirm_delete";
            return (
                <div className={card_class}>
                    <div className="card-confirm-title">
                        Confirm Delete?
                    </div>
                    <button onClick={this.onConfirmDeleteClicked} className="card-confirm-button">Delete!</button>
                    <button onClick={this.onCancelDeleteClicked} className="card-cancel-button">Nevermind</button>
                </div>
            );
        } else {
            return connectDragSource(
                <div className={card_class}>
                    <div className="card-title">
                        {card.title}
                    </div>
                    <div className="card-delete-button">
                        <button onClick={this.onDeleteClicked}>Delete</button>
                    </div>
                    <div className="card-move-count" onClick={this.onShowHistoryClicked}>
                        {card.history.length}
                    </div>
                    <div className={history_class}>
                        {card.history.join(', ')}
                    </div>
                </div>
            );
        }
    },

    onConfirmDeleteClicked() {
        store.dispatch(deleteCard(this.props.card.card_id));
    },

    onCancelDeleteClicked() {
        this.setState({
            confirming_delete: false
        });
    },

    onDeleteClicked() {
        this.setState({
            confirming_delete: true
        });
    },

    onShowHistoryClicked() {
        this.setState({
            show_history: !this.state.show_history
        });
    }
});

export default DragSource(ItemTypes.CARD, cardSource, collect)(Card);
