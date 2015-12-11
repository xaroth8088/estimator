import React from "react"

import "./app_error.css"

export default React.createClass({
    render() {
        return (
            <div className="app_error">
                Estimator has disconnected from the server.  Please refresh and try again.
            </div>
        );
    }
});
