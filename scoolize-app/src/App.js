import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from 'react-router-dom';
import AccueilScoolize from './components/AccueilScoolize';
import MesNotes from './components/MesNotes';
import MesVoeux from './components/MesVoeux';
import Profil from './components/Profil';
import ResultatsAlgo from './components/ResultatsAlgo';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AccueilScoolize />} />
                <Route path="/notes" element={<MesNotes />} />
                <Route path="/voeux" element={<MesVoeux />} />
                <Route path="/profil" element={<Profil />} />
                <Route path="/resultats" element={<ResultatsAlgo />} />
            </Routes>
        </Router>
    );
}

export default App;
