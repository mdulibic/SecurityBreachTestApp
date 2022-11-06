import React, {useState} from "react";

import "../index.css";
import {pageStyle} from "../style/globalStyles";
import Switch from "../components/Switch";
import {Alert, Button} from "@mui/material";
import DOMPurify from 'dompurify';
import authHeader from "../auth-header";

function LandingPage() {

    const api = process.env.REACT_APP_API_URL;

    const [value, setValue] = useState(false);
    const [message, setMessage] = useState("");
    const [userName, setUserName] = useState("");
    const [users, setUsers] = useState([]);

    const getTitle = () => {
        const title = `1.XSS<b onmouseover="alert('XSS ATTACK!');"> Attack</b>`;
        if (value) return DOMPurify.sanitize(title);
        else return title;
    }

    const setName = (name) => {
        setUserName(name)
        const script = document.getElementById('script').innerHTML;
        window.eval(script);
    };

    const logout = () => {
        setUsers([]);
        setMessage("Logged out!");
        localStorage.removeItem("user");
    };

    const login = (username, email, password) => {
        if(checkForm())
        fetch(api + `/users/auth/login/${value}`, {
            method: "POST", headers: {
                Origin: origin, "Content-Type": "application/json",
            }, credentials: "same-origin", withCredentials: true, body: JSON.stringify({
                username: username, email: email, password: password
            }, null, 2),
        }).then((r) => {
            setUsers([]);
            if (!r.ok) {
                setMessage("Failed to login");
                throw new Error("HTTP status code: " + r.status);
            } else {
                setMessage("Successfully logged in!");
                return r.json();
            }
        }).then(data => {
            localStorage.setItem("user", JSON.stringify(data));
        });
    };

    const register = (username, email, password) => {
        if(checkForm())
        fetch(api + `/users/auth/register/${value}`, {
            method: "POST", headers: {
                Origin: origin, "Content-Type": "application/json",
            }, credentials: "same-origin", withCredentials: true, body: JSON.stringify({
                username: username, email: email, password: password
            }, null, 2),
        }).then((r) => {
            setUsers([]);
            if (!r.ok) {
                setMessage("Failed to register");
                throw new Error("HTTP status code: " + r.status);
            } else {
                setMessage("Successfully registered!");
                return r.json();
            }
        });
    };

    const listUsers = () => {
        fetch(api + "/users", {
            method: "GET", headers: {
                Authorization: authHeader(), Origin: origin,
            },
        })
            .then((response) => {
                if (response.ok) {
                    setMessage("");
                    return response.json();
                } else {
                    setMessage("No rights to list users. Login to get access!");
                    throw new Error(response.status);
                }
            })
            .then((data) => {
                setUsers(data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const listUsersNoAuth = () => {
        fetch(api + "/auth/users", {
            method: "GET", headers: {
                Origin: origin,
            },
        })
            .then((response) => {
                if (response.ok) {
                    setMessage("");
                    return response.json();
                } else {
                    setMessage("No rights to list users. Login to get access!");
                    throw new Error(response.status);
                }
            })
            .then((data) => {
                setUsers(data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    function checkPassword(str)
    {
        if(value) {
            var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
            if(re.test(str)){
                setMessage("")
                return true;
            } else {
                setMessage("Password needs to be at least 8 letters, a symbol, upper and lower case letters and a number")
                return false;
            }
        } else {
            var re = /.{8,}$/;
            if(re.test(str)){
                setMessage("")
                return true;
            } else {
                setMessage("Password needs to be at least 8 characters")
                return false;
            }
        }
    }

    const checkForm = () => {
        var username = document.getElementById('username').value;
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;

        if(!checkPassword(password)) {
            return false;
        }
        else {
            if(!validateEmail(email)) {
                setMessage("Invalid e-mail format!")
                return false;
            } else {
                if(username) {
                    return true
                } else {
                    setMessage("Username can't be empty!")
                    return false;
                }
            }
        }
    }

    return (<div style={{...pageStyle, padding: "10px", overflow: "scroll"}}>
        <div style={{color: "#FFFFFF"}}>
            <h1>Security:</h1>
            <Switch
                isOn={value}
                handleToggle={() => {
                    setUsers([])
                    localStorage.removeItem("user");
                    setValue(!value)
                }}
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
            {value ? (<div style={{padding: "5px"}}> {userName} </div>) : (
                <div style={{padding: "5px"}} dangerouslySetInnerHTML={{__html: userName}}/>)}
        </div>
        <div>
            <h2 style={{color: "#FFFFFF"}}>2. Bad authentication</h2>
            <div>
                <form>
                    <div className="form-group">
                        <div className="form-group">
                            <label htmlFor="username">Username:</label>
                            <input id="username" placeholder="Username"/>
                        </div>
                        <label htmlFor="email">Email:</label>
                        <input type="email" name="email" className="form-control" id="email"
                               aria-describedby="emailHelp" placeholder="Enter email"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" name="password" className="form-control" id="password"
                               placeholder="Password"/>
                    </div>
                    <Button
                        style={{margin: "0.3rem", backgroundColor: "#FF6587"}}
                        onClick={() => login(document.getElementById('username').value, document.getElementById('email').value, document.getElementById('password').value)}
                        variant="contained">
                        Login
                    </Button>
                    <Button
                        style={{margin: "0.3rem", backgroundColor: "#FF6587"}}
                        onClick={() => logout()}
                        variant="contained">
                        Logout
                    </Button>
                    <Button
                        style={{margin: "0.3rem", backgroundColor: "#FF6587"}}
                        onClick={() => register(document.getElementById('username').value, document.getElementById('email').value, document.getElementById('password').value)}
                        variant="contained">
                        Register
                    </Button>
                    <Button
                        style={{margin: "0.3rem", backgroundColor: "#FF6587"}}
                        onClick={() => {
                            if (value) listUsers(); else listUsersNoAuth();
                        }}
                        variant="contained">
                        List users
                    </Button>
                    {users.length > 0 && (users.map((f) => (
                        <div style={{margin: "auto", marginTop: "2rem", width: "75%", color: "#FFFFFF"}}>
                            Username: {f.username}<br/> Email: {f.email} <br/>Password: {f.password}<br/>
                        </div>)))}
                    {message && (<div style={{color: "#FFFFFF"}}>{value ? (<div>{message}</div>) : (
                        <div>{message}</div>)}</div>)}
                </form>
            </div>
        </div>
    </div>);
}

export default LandingPage;
