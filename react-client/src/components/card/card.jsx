import React from "react"
import "./card.css"

export default React.createClass({
    render() {
        return (
            <div>
                {this.props.card.title}
            </div>
        );
    }
});