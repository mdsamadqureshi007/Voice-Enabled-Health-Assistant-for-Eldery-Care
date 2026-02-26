const { useState, useEffect, useRef } = React;

function App() {
    const [theme, setTheme] = useState('light');
    const [activePage, setActivePage] = useState('dashboard');

    // Theme Toggle
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    // Mock Medicines State
    const [medicines, setMedicines] = useState([
        { id: 1, name: 'Aspirin', dosage: '1 Pill', time: '08:00 AM', status: 'pending' },
        { id: 2, name: 'Metformin', dosage: '500mg', time: '01:00 PM', status: 'taken' },
        { id: 3, name: 'Lisinopril', dosage: '10mg', time: '08:00 PM', status: 'missed' },
    ]);

    const missedCount = medicines.filter(m => m.status === 'missed').length;
    const riskLevel = missedCount === 0 ? 'low' : missedCount < 2 ? 'medium' : 'high';

    return (
        <div className="app-container">
            <header className="header">
                <h1>SilverCare 🕊️</h1>
                <div className="header-controls">
                    <span className={`badge ${riskLevel}-risk`}>
                        {riskLevel.toUpperCase()} RISK
                    </span>
                    <button className="theme-toggle" onClick={toggleTheme}>
                        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
                    </button>
                </div>
            </header>

            <nav className="nav-bar">
                {['dashboard', 'medication', 'emergency', 'doctors', 'assistant', 'feedback'].map(page => (
                    <button
                        key={page}
                        className={`nav-btn ${activePage === page ? 'active' : ''}`}
                        onClick={() => setActivePage(page)}
                    >
                        {page.charAt(0).toUpperCase() + page.slice(1)}
                    </button>
                ))}
            </nav>

            <main className="main-content">
                {activePage === 'dashboard' && <Dashboard setActivePage={setActivePage} medicines={medicines} riskLevel={riskLevel} />}
                {activePage === 'medication' && <Medication medicines={medicines} setMedicines={setMedicines} />}
                {activePage === 'emergency' && <Emergency />}
                {activePage === 'doctors' && <Doctors />}
                {activePage === 'assistant' && <Assistant />}
                {activePage === 'feedback' && <Feedback />}
            </main>
        </div>
    );
}

// 1. Dashboard Component
function Dashboard({ setActivePage, medicines, riskLevel }) {
    const nextMed = medicines.find(m => m.status === 'pending') || medicines[0];

    return (
        <div className="dashboard-grid">
            <div className="card">
                <h2>👋 Welcome back, Mr. Rajendra!</h2>
                <p>Health Tip of the Day: Drink at least 8 glasses of water to stay hydrated.</p>
                <br />
                <p>Your current risk level based on medication tracking is <strong>{riskLevel.toUpperCase()}</strong>.</p>
            </div>

            <div className="card" style={{ cursor: 'pointer', border: '2px solid var(--primary)' }} onClick={() => setActivePage('medication')}>
                <h2>💊 Next Medication</h2>
                {nextMed ? (
                    <div>
                        <h3>{nextMed.name} ({nextMed.dosage})</h3>
                        <p style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 'bold' }}>at {nextMed.time}</p>
                    </div>
                ) : <p>All caught up!</p>}
            </div>

            <div className="card" style={{ cursor: 'pointer', backgroundColor: 'var(--accent)', color: 'white' }} onClick={() => setActivePage('emergency')}>
                <h2 style={{ color: 'white' }}>🚨 Need Help?</h2>
                <p>Click here to go to Emergency SOS Dashboard immediately.</p>
            </div>

            <div className="card" style={{ cursor: 'pointer' }} onClick={() => setActivePage('assistant')}>
                <h2>🎙️ Talk to AI Doctor</h2>
                <p>Have a health doubt? Just ask our AI assistant over voice.</p>
            </div>
        </div>
    );
}

// 2. Medication Management Component
function Medication({ medicines, setMedicines }) {
    const updateStatus = (id, status) => {
        setMedicines(medicines.map(m => m.id === id ? { ...m, status } : m));
        if (status === 'missed') alert('Reminder: Missing medication increases health risk!');
        if (status === 'taken') alert('Great job staying on track!');
    };

    const notifyVoice = (medName) => {
        if ('speechSynthesis' in window) {
            const msg = new SpeechSynthesisUtterance(`It's time to take your medicine: ${medName}`);
            window.speechSynthesis.speak(msg);
        } else {
            alert(`It's time to take your medicine: ${medName}`);
        }
    };

    return (
        <div className="card">
            <h2>Medication Schedule</h2>
            <button style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }} onClick={() => notifyVoice(medicines[0].name)}>
                🔊 Simulate Voice Alert
            </button>
            <div className="med-list">
                {medicines.map(med => (
                    <div key={med.id} className={`med-item ${med.status}`}>
                        <div className="med-info">
                            <h3>{med.name} - {med.dosage}</h3>
                            <p>⏰ {med.time}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {med.status === 'pending' && (
                                <>
                                    <button className="btn-action btn-taken" onClick={() => updateStatus(med.id, 'taken')}>Taken ✅</button>
                                    <button className="btn-action btn-missed" onClick={() => updateStatus(med.id, 'missed')}>Missed ❌</button>
                                </>
                            )}
                            {med.status !== 'pending' && (
                                <span className={`badge ${med.status === 'taken' ? 'low-risk' : 'medium-risk'}`}>
                                    {med.status.toUpperCase()}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// 3. Emergency Response Component
function Emergency() {
    const [status, setStatus] = useState('idle');
    const [gps, setGps] = useState(null);

    const activateSOS = () => {
        setStatus('contacting...');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                (err) => setGps({ error: 'Location permission denied for demo' })
            );
        }
        setTimeout(() => setStatus('ambulance_sent'), 2000);
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>Emergency Response</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Press the button in case of a medical emergency.</p>

            {status === 'idle' ? (
                <button className="btn-emergency" onClick={activateSOS}>SOS</button>
            ) : (
                <div className="card" style={{ maxWidth: 600, margin: '0 auto', border: '2px solid var(--accent)' }}>
                    <h2 style={{ color: 'var(--accent)', fontSize: '2rem' }}>
                        {status === 'contacting...' ? '⏳ Contacting Emergency Services...' : '🚑 Ambulance is on the way!'}
                    </h2>
                    <p style={{ fontSize: '1.2rem', margin: '1rem 0' }}>An SMS has been sent to your emergency contacts: <strong>Son (9876543210)</strong></p>

                    <div className="map-mock">
                        {gps?.error ? "Mock Map (GPS Denied)" : gps ? `Mock Map for Demo (Lat: ${gps.lat.toFixed(2)}, Lng: ${gps.lng.toFixed(2)})` : 'Loading Location...'}
                    </div>
                    <button style={{ marginTop: '1rem', padding: '0.8rem', background: '#333', color: 'white' }} onClick={() => setStatus('idle')}>Acknowledge & Dismiss Demo</button>
                </div>
            )}
        </div>
    );
}

// 4. Doctors & Pharmacy Component
function Doctors() {
    const mockPlaces = [
        { name: 'City Central Hospital', role: 'Hospital', distance: '1.2 km', open: true, rating: 4.8 },
        { name: 'Dr. Sharma Clinic', role: 'Doctor (Cardiology)', distance: '2.5 km', open: true, rating: 4.5 },
        { name: 'Apollo Pharmacy', role: 'Pharmacy', distance: '0.5 km', open: false, rating: 4.2 },
    ];

    return (
        <div className="card">
            <h2>Nearby Medical Support</h2>
            <p>Using Google Maps API (Simulated Data)</p>

            <div className="dashboard-grid" style={{ marginTop: '1rem' }}>
                {mockPlaces.map((p, i) => (
                    <div key={i} className="card" style={{ borderLeft: p.open ? '5px solid var(--success)' : '5px solid var(--accent)' }}>
                        <h3>{p.name}</h3>
                        <p style={{ color: 'var(--primary)', fontWeight: '600' }}>{p.role}</p>
                        <p>⭐ {p.rating} / 5</p>
                        <p>📍 {p.distance} away</p>
                        <span style={{ color: p.open ? 'var(--success)' : 'var(--accent)', fontWeight: 'bold' }}>
                            {p.open ? 'OPEN NOW' : 'CLOSED'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// 5. AI Health Assistant
function Assistant() {
    const [messages, setMessages] = useState([
        { text: "Hello! I am your AI Health Assistant. How are you feeling today?", sender: "bot" }
    ]);
    const [input, setInput] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const handleSend = (userText = input) => {
        if (!userText.trim()) return;
        setMessages(prev => [...prev, { text: userText, sender: "user" }]);
        setInput('');

        // Simulate OpenAI API Response
        setTimeout(() => {
            let botResponse = "I'm sorry, I'm just a demo. But remember to drink water and rest!";
            const lower = userText.toLowerCase();
            if (lower.includes('headache')) botResponse = "For a headache, rest in a quiet, dark room. If it persists, please contact your doctor.";
            else if (lower.includes('diabetes') || lower.includes('eat')) botResponse = "For diabetes management, prioritize fiber-rich foods, leafy greens, and avoid sugary drinks.";
            else if (lower.includes('missed') && lower.includes('medicine')) botResponse = "If you missed your medicine, usually you should take it as soon as you remember. However, if it's almost time for the next dose, skip the missed one. Never double up!";

            setMessages(prev => [...prev, { text: botResponse, sender: "bot" }]);
        }, 1000);
    };

    const toggleListen = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Speech recognition not supported in this browser. Please type.");
            return;
        }

        if (isRecording) return; // Prevent multiple starting

        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.onstart = () => setIsRecording(true);
        recognition.onresult = (event) => {
            const speechToText = event.results[0][0].transcript;
            handleSend(speechToText);
        };
        recognition.onerror = () => setIsRecording(false);
        recognition.onend = () => setIsRecording(false);

        recognition.start();
    };

    return (
        <div className="chat-container">
            <div className="disclaimer">
                ⚠️ This assistant does not replace professional medical advice. Always consult a real doctor.
            </div>
            <div className="chat-history" ref={scrollRef}>
                {messages.map((m, i) => (
                    <div key={i} className={`chat-msg ${m.sender}`}>
                        {m.text}
                    </div>
                ))}
            </div>
            <div className="chat-input-area">
                <button className={`btn-mic ${isRecording ? 'recording' : ''}`} onClick={toggleListen} title="Voice Input">
                    🎙️
                </button>
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Type or speak a health doubt..."
                />
                <button className="btn-action" onClick={() => handleSend()}>Send</button>
            </div>
        </div>
    );
}

// 6. Feedback & Ratings
function Feedback() {
    const [rating, setRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    return (
        <div className="card" style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
            <h2>Give Feedback</h2>
            <p style={{ marginBottom: '2rem' }}>How was your experience with SilverCare today?</p>

            {!submitted ? (
                <>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '3rem', cursor: 'pointer', marginBottom: '2rem' }}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <span key={star} onClick={() => setRating(star)} style={{ color: star <= rating ? 'var(--warning)' : 'var(--border)' }}>
                                ★
                            </span>
                        ))}
                    </div>
                    <button className="btn-action" onClick={() => setRating > 0 ? setSubmitted(true) : alert('Select a rating')} disabled={!rating}>
                        Submit Rating
                    </button>
                </>
            ) : (
                <h3 style={{ color: 'var(--success)' }}>Thank you for your feedback! Average Rating: 4.8 🌟</h3>
            )}
        </div>
    );
}

window.App = App;
