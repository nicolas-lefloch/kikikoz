import React from 'react';
import {Route} from 'react-router';
import {BrowserRouter, Routes} from 'react-router-dom';
import './App.scss';
import Main from './component/Main';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<Main />} />
            </Routes>
        </BrowserRouter>
    )
}