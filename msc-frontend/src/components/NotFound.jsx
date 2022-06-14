import React, { Component } from 'react';

class NotFound extends Component {
    state = {  } 
    render() { 
        return (
            <div id="page-content">
                <div className="notfound-content">
                    <div className="notfound-warning">
                        Oops! The page that you are looking for is not found.
                    </div>
                    <div className="notfound-button" 
                        onClick={() => window.location = `/`}
                    >
                        Back to Home
                    </div>
                </div>
            </div>
        );
    }
}
 
export default NotFound;