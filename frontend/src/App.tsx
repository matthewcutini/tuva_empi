import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppStoreProvider } from './providers/app_store_provider';
import PersonMatchPage from './pages/PersonMatchPage';

const App: React.FC = () => {
  return (
    <AppStoreProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/person_match" replace />} />
        <Route path="/person_match" element={<PersonMatchPage />} />
      </Routes>
    </AppStoreProvider>
  );
};

export default App;

