import React, {useState} from "react";

import "../index.css";
import {pageStyle} from "../style/globalStyles";
import Switch from "../components/Switch";
import {Button} from "@mui/material";
import DOMPurify from 'dompurify';

function LandingPage() {

    const [value, setValue] = useState(false);
    const [userName, setUserName] = useState("");

    const displayStyle = {
        display: "flex", justifyContent: "center", alignItems: "center", paddingTop: "10px"
    }

    const getTitle = () => {
        const title = `1.XSS<b onmouseover="alert('XSS ATTACK!');"> Attack</b>`;
        if (value) return DOMPurify.sanitize(title)
        else return title
    }

    const setName = (name) => {
        setUserName(name)
        const script = document.getElementById('script').innerHTML;
        window.eval(script);
    };

    return (<div style={{...pageStyle, padding: "10px"}}>
        <div style={{color: "#FFFFFF"}}>
            <h1>Security:</h1>
            <Switch
                isOn={value}
                handleToggle={() => setValue(!value)}
            />
        </div>
        <div>
            <h2 style={{color: "#FFFFFF", padding: "5px"}} dangerouslySetInnerHTML={{__html: getTitle()}}/>
            <div className="form-group">
                <label style={{padding: "5px"}}>Insert your name:</label>
                <input id="name" style={{padding: "5px"}}/>
                <Button
                    style={{margin: "0.3rem", backgroundColor: "#FF6587"}}
                    onClick={() => setName(document.getElementById('name').value)}
                    variant="contained">
                    Submit
                </Button>
            </div>
            {value ? (<div style={{padding: "5px"}}> {userName} </div>)
                :(<div style={{padding: "5px"}} dangerouslySetInnerHTML={{__html: userName}}/>)}
        </div>
        <div>
            <h2 style={{color: "#FFFFFF"}}>2. Bad authentication</h2>
            <div>
                <form>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Email address</label>
                        <input type="email" name="email" className="form-control" id="exampleInputEmail1"
                               aria-describedby="emailHelp" placeholder="Enter email"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Password</label>
                        <input type="password" name="password" className="form-control" id="exampleInputPassword1"
                               placeholder="Password"/>
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                    <button style={{marginLeft: '25px'}} className="btn btn-success">Signup</button>
                </form>
            </div>
        </div>
    </div>);
}

export default LandingPage;
