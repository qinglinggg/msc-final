import React, { Component } from 'react';
class Loading extends Component {
    state = {  } 
    render() { 
        return (
            <div className="loading-screen">
                <div class="lds-ring">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <span>Memuat data responden...</span>
            </div>
        );
    }
}
 
export default Loading;