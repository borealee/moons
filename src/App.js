import React from 'react';
import logo from './logo.svg';
import './App.css';
import Button from "@material-ui/core/Button";
import MoonLogic from "./moonLogic";
import MoonList from "./moonList";
import Grid from "@material-ui/core/Grid";
import Help from "./help"

class App extends React.Component {
    render() {
        return (
            <div className="App">
                {/*<header className="App-header">*/}
                {/*    <img src={logo} className="App-logo" alt="logo" />*/}
                {/*    <p>*/}
                {/*        Edit <code>src/App.js</code> and save to reload.*/}
                {/*    </p>*/}
                {/*    <a*/}
                {/*        className="App-link"*/}
                {/*        href="https://reactjs.org"*/}
                {/*        target="_blank"*/}
                {/*        rel="noopener noreferrer"*/}
                {/*    >*/}
                {/*        Learn React*/}
                {/*    </a>*/}
                {/*</header>*/}
            
                <div>
                    <Grid container>
                        <Grid item xs={6}>
                    {/*<MoonLogic/>*/}
                    <MoonList/>
                        </Grid>
                        <Grid item xs={6}>
                            <Help/>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }

}

export default App;
