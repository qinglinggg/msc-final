import React, { Component } from 'react';
class Loading extends Component {
    state = {  } 
    render() { 
        return (
            <div className="loading-screen">
                <div className="lds-ring">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <span>{this.props.text}</span>
            </div>
        );
    }
}
 
export default Loading;