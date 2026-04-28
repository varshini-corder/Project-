
import React, { useState, useEffect } from 'react';
import { AppState, User } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LOGIN);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (username: string) => {
    setCurrentUser({
      username,
      email: `${username.toLowerCase()}@vmap.edu`,
      avatar: `https://picsum.photos/seed/${username}/200/200`
    });
    setAppState(AppState.WELCOME);
  };

  useEffect(() => {
    if (appState === AppState.WELCOME) {
      const timer = setTimeout(() => {
        setAppState(AppState.DASHBOARD);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  if (appState === AppState.LOGIN) {
    return <Login onLogin={handleLogin} />;
  }

  if (appState === AppState.WELCOME) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-600">
        <div className="text-center animate-bounce">
          <div className="w-24 h-24 bg-white rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-2xl rotate-12">
            <span className="text-indigo-600 text-5xl font-black italic">V</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Welcome to V-Map, {currentUser?.username}!
          </h1>
          <p className="text-indigo-100 mt-4 text-lg font-medium">Preparing your campus guide...</p>
        </div>
      </div>
    );
  }

  return currentUser ? <Dashboard user={currentUser} /> : null;
};

export default App;
