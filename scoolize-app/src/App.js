import React, { useState } from 'react';
import AccueilScoolize from './components/AccueilScoolize';
import ResultatAdmission from './components/ResultatAdmission';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleAuthenticated = () => {
        setIsAuthenticated(true);
    };

    return (
        <div className="App">
            <AccueilScoolize onAuthenticated={handleAuthenticated} />
            {isAuthenticated && <ResultatAdmission />}
        </div>
    );
}

export default App;