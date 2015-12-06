import React from "react"
import "./create_card.css"

export default React.createClass({
    render() {
        return (
            <div>
                <input ref="value" placeholder="Enter card text" />
                <button onClick={this.onCreateClicked}>Make it!</button>
            </div>
        );
    },

    onCreateClicked() {
        alert('click!');
    }
});