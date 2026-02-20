import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import UserList from './components/UserList';
import UserDetails from './components/UserDetails';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>User Management</h1>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/user/:id" element={<UserDetails />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
