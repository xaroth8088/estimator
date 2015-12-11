import React from "react"
import "./create_card.css"

export default React.createClass({
    render() {
        return (
            <div className="create_card">
                <textarea ref="card_title" placeholder="Enter card text, one per line" />
                <button onClick={this.onCreateClicked}>Make it!</button>
            </div>
        );
    },

    onCreateClicked() {
        var card_text, cards, card;

        if( this.refs.card_title.value === "" ) {
            return;
        }

        card_text = this.refs.card_title.value;

        // Split on newlines, to permit a bulk entry
        cards = card_text.split("\n");

        for( card of cards ) {
            if( card.trim() !== '' ) {
                this.props.onCreateCard(card);
            }
        }

        // Clear out the input box
        this.refs.card_title.value = "";
    }
});