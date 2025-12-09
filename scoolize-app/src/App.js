import React, { useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import AccueilScoolize from './components/AccueilScoolize';
import MesNotes from './components/MesNotes';
import MesVoeux from './components/MesVoeux';
import Profil from './components/Profil';
import EspaceEcole from './components/EspaceEcole';
import { supabase } from './supabaseClient';
import ResultatAdmission from './components/ResultatAdmission';

const GateAccueil = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [hasSession, setHasSession] = useState(false);

    useEffect(() => {
        const check = async () => {
            const { data } = await supabase.auth.getSession();
            setHasSession(!!data?.session);
            setLoading(false);
        };
        check();
    }, []);

    if (loading) return null;
    if (hasSession) return <Navigate to="/profil" replace />;
    return children;
};

const GateEcole = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const check = async () => {
            const { data: sessionData } = await supabase.auth.getSession();
            if (!sessionData?.session) {
                setIsAuthorized(false);
                setLoading(false);
                return;
            }

            const userId = sessionData.session.user.id;
            
            const { data, error } = await supabase
                .from('ecoles')
                .select('id')
                .eq('id', userId)
                .single();

            setIsAuthorized(!!data && !error);
            setLoading(false);
        };
        check();
    }, []);

    if (loading) return null;
    if (!isAuthorized) return <Navigate to="/" replace />;
    return children;
};

const GateAuth = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [hasSession, setHasSession] = useState(false);

    useEffect(() => {
        const check = async () => {
            const { data } = await supabase.auth.getSession();
            setHasSession(!!data?.session);
            setLoading(false);
        };
        check();
    }, []);

    if (loading) return null;
    if (!hasSession) return <Navigate to="/" replace />;
    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <GateAccueil>
                            <AccueilScoolize />
                        </GateAccueil>
                    }
                />
                <Route path="/notes" element={<MesNotes />} />
                <Route path="/voeux" element={<MesVoeux />} />
                <Route path="/profil" element={<Profil />} />
                <Route
                    path="/admission"
                    element={
                        <GateAuth>
                            <ResultatAdmission />
                        </GateAuth>
                    }
                />
                <Route
                    path="/ecole/dashboard"
                    element={
                        <GateEcole>
                            <EspaceEcole />
                        </GateEcole>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
