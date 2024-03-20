import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import LandingPage from './LandingPage';

const Lib = require('./Lib');
const { getStorageValue } = Lib;

function App() {
  const [screen, setScreen] = useState('BUSY');
  useEffect(() => {
    const check = async () => {
      const val = await getStorageValue('SCREEN');
      if (val === 'DASHBOARD') {
        setScreen('DASHBOARD');
      } else {
        setScreen('LANDING_PAGE');
      }
    }
    check();
  }, []);

  if (screen === 'DASHBOARD') return <Dashboard />;
  else if (screen === 'LANDING_PAGE') return <LandingPage />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-100">
      ...
    </div>
  );
}

export default App;
