import { useState, useEffect } from 'react'
import axios from 'axios';
const sessionId = new URLSearchParams(window.location.search).get('session_id');
console.log(sessionId);

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const response = await axios.get(`http://localhost:3001/user?session_id=${sessionId}`);
      setUser(response.data);
    }

    fetchUser();
  }, []);

  const handleLogin = () => {
    window.location.href = 'http://localhost:3001/auth/steam';
  };

  const handleLogout = async () => {
    await axios.get('http://localhost:3001/logout');
    setUser(null);
  };

  return (
    <div>
      <h1>Logowanie przez Steam</h1>
      {user ? (
        <div>
          <p>Użytkownik: {user.displayName}</p>
          <button onClick={handleLogout}>Wyloguj</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Zaloguj przez Steam</button>
      )}
    </div>
  );
}

export default App;