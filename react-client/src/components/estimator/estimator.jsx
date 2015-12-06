import React from "react"
import CreateCard from "../create_card/create_card.jsx"
import Column from "../column/column.jsx"
import { addCard, moveCard, deleteCard } from "../../actions.es6"

import "./estimator.css"

export default React.createClass({
    render() {
        var columns, column_id;

        columns = [];
        for (column_id of Object.keys(this.props.columns)) {
            columns.push(
                <Column
                    key={column_id}
                    column_id={column_id}
                    card_ids={this.props.columns[column_id]}
                    cards={this.props.cards}
                    />
            );
        }

        return (
            <div className="estimator">
                <CreateCard onCreateCard={title => this.props.dispatch(addCard(title))}/>

                <div className="estimator-columns">
                    {columns}
                </div>
            </div>
        );
    }
});