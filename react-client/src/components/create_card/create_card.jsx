import React from "react"
import "./create_card.css"

export default React.createClass({
    render() {
        return (
            <div>
                <form action="">
                    <input ref="card_title" placeholder="Enter card text" />
                    <button onClick={this.onCreateClicked}>Make it!</button>
                </form>
            </div>
        );
    },

    onCreateClicked() {
        this.props.onCreateCard(this.refs.card_title.value);
        this.refs.card_title.value = "";
    }
});