import React, { useState, useEffect } from 'react';
import './App.css';

// --- SVG Icons ---
const ArmIcon = ({ className, onClick }: { className?: string, onClick?: (e: React.MouseEvent) => void }) => (
  <svg viewBox="0 0 100 100" className={className} onClick={onClick} width="300" height="300">
    <path d="M20,70 Q25,40 50,30 T80,50 L85,75 Q60,90 20,70 Z" fill="#d2b48c" stroke="#333" strokeWidth="2" />
    <path d="M50,30 Q60,10 80,30" fill="none" stroke="#333" strokeWidth="3" /> {/* Bicep curve */}
    <path d="M20,70 L10,85 L15,95 L30,85 Z" fill="#d2b48c" stroke="#333" strokeWidth="2" /> {/* Fist/Wrist */}
    <path d="M45,40 Q55,45 60,60" fill="none" stroke="#222" strokeWidth="1" opacity="0.3" /> {/* Muscle detail */}
  </svg>
);

const TrainerIcon = ({ level }: { level: number }) => {
  const colors = ["#888", "#55acee", "#e67e22", "#9b59b6", "#e74c3c"];
  return (
    <svg viewBox="0 0 100 100" className="item-icon">
      <circle cx="50" cy="30" r="15" fill={colors[level] || colors[0]} />
      <path d="M20,80 Q50,50 80,80" fill={colors[level] || colors[0]} />
      <rect x="40" y="45" width="20" height="10" fill="#333" /> {/* Weights icon placeholder */}
    </svg>
  );
};

const DumbbellIcon = ({ className, onClick }: { className?: string, onClick?: () => void }) => (
  <svg viewBox="0 0 100 100" className={className} onClick={onClick}>
    <rect x="10" y="40" width="15" height="20" rx="2" fill="gold" />
    <rect x="25" y="45" width="50" height="10" fill="gold" />
    <rect x="75" y="40" width="15" height="20" rx="2" fill="gold" />
  </svg>
);

// --- Data Types ---
interface Trainer {
  id: number;
  name: string;
  baseCost: number;
  baseIncome: number;
  count: number;
}

interface Upgrade {
  id: number;
  name: string;
  desc: string;
  baseCost: number;
  valueAdd: number;
  level: number;
}

// --- Main App ---
function App() {
  const [currency, setCurrency] = useState(0);
  const [clickValue, setClickValue] = useState(1);
  const [multiplier, setMultiplier] = useState(1);
  const [multiplierActive, setMultiplierActive] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<{ id: number, x: number, y: number, value: number }[]>([]);
  const [showDumbbell, setShowDumbbell] = useState(false);
  
  const [trainers, setTrainers] = useState<Trainer[]>([
    { id: 0, name: "Gym Bro", baseCost: 15, baseIncome: 1, count: 0 },
    { id: 1, name: "Personal Trainer", baseCost: 100, baseIncome: 5, count: 0 },
    { id: 2, name: "Fitness Influencer", baseCost: 500, baseIncome: 20, count: 0 },
    { id: 3, name: "Olympia Coach", baseCost: 2500, baseIncome: 100, count: 0 },
    { id: 4, name: "Genetic Freak", baseCost: 10000, baseIncome: 500, count: 0 },
  ]);

  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    { id: 0, name: "Heavy Weights", desc: "+1 per click", baseCost: 10, valueAdd: 1, level: 0 },
    { id: 1, name: "Steroids", desc: "+5 per click", baseCost: 100, valueAdd: 5, level: 0 },
    { id: 2, name: "Creatine", desc: "+20 per click", baseCost: 1000, valueAdd: 20, level: 0 },
  ]);

  // Game Loop for Passive Income
  useEffect(() => {
    const interval = setInterval(() => {
      const passiveIncome = trainers.reduce((acc, t) => acc + t.baseIncome * t.count, 0);
      if (passiveIncome > 0) {
        setCurrency(prev => prev + (passiveIncome * multiplier) / 10); // Run every 100ms for smoothness
      }
    }, 100);
    return () => clearInterval(interval);
  }, [trainers, multiplier]);

  // Golden Dumbbell Spawner
  useEffect(() => {
    const spawnDumbbell = () => {
      setShowDumbbell(true);
      setTimeout(() => setShowDumbbell(false), 15000); // Hide after 15s if not clicked
      
      const nextSpawn = (Math.random() * (5 - 3) + 3) * 60 * 1000; // 3-5 minutes
      setTimeout(spawnDumbbell, nextSpawn);
    };

    const firstSpawn = (Math.random() * (5 - 3) + 3) * 60 * 1000;
    const timer = setTimeout(spawnDumbbell, firstSpawn);
    return () => clearTimeout(timer);
  }, []);

  const handleArmClick = (e: React.MouseEvent) => {
    const value = clickValue * multiplier;
    setCurrency(prev => prev + value);
    
    // Floating text
    const id = Date.now();
    setFloatingTexts(prev => [...prev, { id, x: e.clientX, y: e.clientY, value }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 800);
  };

  const handleDumbbellClick = () => {
    setShowDumbbell(false);
    setMultiplier(2);
    setMultiplierActive(true);
    setTimeout(() => {
      setMultiplier(1);
      setMultiplierActive(false);
    }, 30000); // 30 seconds of 2x
  };

  const buyTrainer = (id: number) => {
    const trainer = trainers.find(t => t.id === id);
    if (!trainer) return;
    const cost = Math.floor(trainer.baseCost * Math.pow(1.15, trainer.count));
    
    if (currency >= cost) {
      setCurrency(prev => prev - cost);
      setTrainers(prev => prev.map(t => t.id === id ? { ...t, count: t.count + 1 } : t));
    }
  };

  const buyUpgrade = (id: number) => {
    const upgrade = upgrades.find(u => u.id === id);
    if (!upgrade) return;
    const cost = Math.floor(upgrade.baseCost * Math.pow(2, upgrade.level));
    
    if (currency >= cost) {
      setCurrency(prev => prev - cost);
      setClickValue(prev => prev + upgrade.valueAdd);
      setUpgrades(prev => prev.map(u => u.id === id ? { ...u, level: u.level + 1 } : u));
    }
  };

  const totalPassiveIncome = trainers.reduce((acc, t) => acc + t.baseIncome * t.count, 0) * multiplier;

  return (
    <div className="app">
      <header>
        <h1>Flex Clicker</h1>
      </header>

      <div className="stats">
        <div className="currency">{Math.floor(currency).toLocaleString()} Muscular Arms</div>
        <div className="income">Income: {totalPassiveIncome.toFixed(1)} / sec</div>
        <div className="income">Click Power: {(clickValue * multiplier).toFixed(1)}</div>
      </div>

      <div className="main-area">
        <ArmIcon className="clickable-arm" onClick={handleArmClick} />
        {floatingTexts.map(t => (
          <div key={t.id} className="floating-text" style={{ left: t.x, top: t.y }}>
            +{t.value}
          </div>
        ))}
      </div>

      {showDumbbell && <DumbbellIcon className="golden-dumbbell" onClick={handleDumbbellClick} />}
      {multiplierActive && <div className="multiplier-active">2X GAINS ACTIVE!</div>}

      <div className="shop">
        <h2>Upgrades</h2>
        <div className="upgrades-container">
          {upgrades.map(u => {
            const cost = Math.floor(u.baseCost * Math.pow(2, u.level));
            return (
              <div 
                key={u.id} 
                className={`shop-item ${currency < cost ? 'disabled' : ''}`}
                onClick={() => buyUpgrade(u.id)}
              >
                <div className="item-info">
                  <div className="item-name">{u.name} (Lvl {u.level})</div>
                  <div className="item-desc">{u.desc}</div>
                  <div className="item-cost">Cost: {cost} Arms</div>
                </div>
              </div>
            );
          })}
        </div>

        <h2>Trainers</h2>
        <div className="trainers-container">
          {trainers.map(t => {
            const cost = Math.floor(t.baseCost * Math.pow(1.15, t.count));
            return (
              <div 
                key={t.id} 
                className={`shop-item ${currency < cost ? 'disabled' : ''}`}
                onClick={() => buyTrainer(t.id)}
              >
                <TrainerIcon level={t.id} />
                <div className="item-info">
                  <div className="item-name">{t.name}</div>
                  <div className="item-desc">+{t.baseIncome} Arms/sec</div>
                  <div className="item-cost">Cost: {cost} Arms</div>
                </div>
                <div className="item-count">{t.count}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
