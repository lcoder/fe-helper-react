import React from 'react'
import './App.css'
import { BrowserRouter as Router , Switch , Route } from 'react-router-dom'
import Home from './pages/index'
import NotFound from './pages/not-found'

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/" exact>
                    <Home />
                </Route>
                <Route component={ NotFound } />
            </Switch>
        </Router>
    )
}

export default App;
