import React from "react"
import Card from "../card/card.jsx"

import "./column.css"

export default React.createClass({
    render() {
        var card_id, cards;

        cards = [];
        for (card_id of this.props.card_ids) {
            cards.push(
                <div key={card_id} className="column-card">
                    <Card card={this.props.cards[card_id]} />
                </div>
            );
        }

        return (
            <div className="column">
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