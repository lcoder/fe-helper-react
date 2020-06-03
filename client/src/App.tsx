import React from 'react'
import './App.css'
import { BrowserRouter as Router , Switch , Route } from 'react-router-dom'
import Home from './pages/index'
import NotFound from './pages/not-found'
import { StoreProvider } from './store/index'

function App() {
    return (
        <StoreProvider>
            <Router>
                <Switch>
                    <Route path="/" exact>
                        <Home />
                    </Route>
                    <Route component={ NotFound } />
                </Switch>
            </Router>
        </StoreProvider>
    )
}

export default App;
