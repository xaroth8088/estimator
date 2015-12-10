import React from "react"
import "./create_card.css"

export default React.createClass({
    render() {
        return (
            <div className="create_card">
                <form action="">
                    <input ref="card_title" placeholder="Enter card text" />
                    <button onClick={this.onCreateClicked}>Make it!</button>
                </form>
            </div>
        );
    },

    onCreateClicked() {
        if( this.refs.card_title.value === "" ) {
            return;
        }

        this.props.onCreateCard(this.refs.card_title.value);
        this.refs.card_title.value = "";
    }
});