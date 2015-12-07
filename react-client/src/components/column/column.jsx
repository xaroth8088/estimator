import React from "react"
import Card from "../card/card.jsx"

import { DropTarget } from 'react-dnd';
import { ItemTypes } from '../../constants.es6';
import store from '../../redux_store.es6';
import { moveCard } from '../../actions.es6';

import "./column.css"

const columnTarget = {
    drop(props, monitor) {
        store.dispatch(moveCard(monitor.getItem().card.card_id, props.column_id));
    }
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    };
}

var Column = React.createClass({
    render() {
        var card_id, cards, column_class;
        const { connectDropTarget, isOver } = this.props;

        cards = [];
        for (card_id of this.props.card_ids) {
            cards.push(
                <div key={card_id} className="column-card">
                    <Card card={this.props.cards[card_id]}/>
                </div>
            );
        }

        column_class = "column";
        if( isOver === true ) {
            column_class += " hover";
        }

        return connectDropTarget(
            <div className={column_class}>
                <div className="column-header">
                    {this.props.column_id}
                </div>
                <div className="column-body">
                    {cards}
                </div>
            </div>
        );
    }
});

export default DropTarget(ItemTypes.CARD, columnTarget, collect)(Column);
