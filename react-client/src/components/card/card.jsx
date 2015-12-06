import React from "react"
import "./card.css"

export default React.createClass({
    render() {
        return (
            <div className="card">
                {this.props.card.title}
            </div>
        );
    }
});