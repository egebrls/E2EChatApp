import React from "react";
import "./ForgotPage.css";

function ForgotPage() {
    return (
        <div className="">
            
            <div className="popup2">
                <img src="password.png"/>
                <h2>Forgot Password?</h2>
                <p>Enter the mail you use to Login</p>
                <input type="text"></input><br></br>
            <a href="login">
            <button className="btn2">Go Back To Login Page </button>
            </a>&emsp;&emsp;
            <button className="btn2">Send Mail</button>
            </div>
            <div>
                
            </div>
        </div>
    )
}

export default ForgotPage