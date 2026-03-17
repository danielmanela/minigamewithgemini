import React, { useState, useEffect } from 'react';
import './App.css';

// --- SVG Icons ---
const ArmIcon = ({ className, onClick }: { className?: string, onClick?: (e: React.MouseEvent) => void }) => (
  <svg viewBox="0 0 100 100" className={className} onClick={onClick} width="300" height="300">
    {/* Clenched Fist */}
    <path d="M75,25 Q85,25 85,35 L85,45 Q85,55 75,55 L65,55 Q55,55 55,45 L55,35 Q55,25 65,25 Z" fill="#d2b48c" stroke="#333" strokeWidth="2" />
    <path d="M65,30 L65,50 M70,30 L70,50 M75,30 L75,50 M80,30 L80,50" stroke="#333" strokeWidth="1" opacity="0.3" /> {/* Knuckles */}
    
    {/* Forearm */}
    <path d="M55,40 L35,60 Q30,65 30,75 L30,85 Q30,95 40,95 L50,95 Q60,95 65,85 L65,55" fill="#d2b48c" stroke="#333" strokeWidth="2" />
    
    {/* Massive Bicep Peak */}
    <path d="M30,75 Q10,65 10,45 Q10,25 35,30 Q50,33 55,40" fill="#d2b48c" stroke="#333" strokeWidth="2" />
    <path d="M15,45 Q15,35 30,37" fill="none" stroke="#333" strokeWidth="3" /> {/* Bicep curve highlight */}
    
    {/* Tricep / Elbow */}
    <path d="M30,85 Q20,85 20,75" fill="none" stroke="#333" strokeWidth="2" />
    
    {/* Muscle Definition & Veins */}
    <path d="M40,50 L50,60" fill="none" stroke="#222" strokeWidth="1" opacity="0.4" />
    <path d="M25,40 Q20,40 15,50" fill="none" stroke="blue" strokeWidth="0.5" opacity="0.2" /> {/* Vein */}
    <path d="M45,70 Q50,75 55,75" fill="none" stroke="#222" strokeWidth="1" opacity="0.3" />
  </svg>
);

const TrainerIcon = ({ level }: { level: number }) => {
  const colors = ["#888", "#55acee", "#e67e22", "#9b59b6", "#e74c3c", "#f1c40f", "#2ecc71", "#1abc9c", "#34495e", "#000"];
  return (
    <svg viewBox="0 0 100 100" className="item-icon">
      <circle cx="50" cy="30" r="15" fill={colors[level % colors.length]} />
      <path d="M20,80 Q50,50 80,80" fill={colors[level % colors.length]} />
      <rect x="40" y="45" width="20" height="10" fill="#333" />
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

interface GlobalMultiplier {
  id: number;
  name: string;
  desc: string;
  cost: number;
  multiplierAdd: number;
  purchased: boolean;
}

// --- Main App ---
function App() {
  const [currency, setCurrency] = useState(0);
  const [clickValue, setClickValue] = useState(1);
  const [baseMultiplier] = useState(1);
  const [tempMultiplier, setTempMultiplier] = useState(1);
  const [multiplierActive, setMultiplierActive] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<{ id: number, x: number, y: number, value: number }[]>([]);
  const [showDumbbell, setShowDumbbell] = useState(false);
  
  const [trainers, setTrainers] = useState<Trainer[]>([
    { id: 0, name: "Gym Bro", baseCost: 15, baseIncome: 1, count: 0 },
    { id: 1, name: "Personal Trainer", baseCost: 100, baseIncome: 5, count: 0 },
    { id: 2, name: "Fitness Influencer", baseCost: 500, baseIncome: 20, count: 0 },
    { id: 3, name: "Olympia Coach", baseCost: 2500, baseIncome: 100, count: 0 },
    { id: 4, name: "Genetic Freak", baseCost: 10000, baseIncome: 500, count: 0 },
    { id: 5, name: "Bro-Scientist", baseCost: 50000, baseIncome: 2500, count: 0 },
    { id: 6, name: "Strength Coach", baseCost: 250000, baseIncome: 12500, count: 0 },
    { id: 7, name: "Strongman Legend", baseCost: 1250000, baseIncome: 62500, count: 0 },
    { id: 8, name: "Bodybuilding Legend", baseCost: 6250000, baseIncome: 312500, count: 0 },
    { id: 9, name: "Genetic God", baseCost: 31250000, baseIncome: 1562500, count: 0 },
    { id: 10, name: "Fitness Cyborg", baseCost: 150000000, baseIncome: 7812500, count: 0 },
  ]);

  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    { id: 0, name: "Dumbbell Set", desc: "+1 per click", baseCost: 10, valueAdd: 1, level: 0 },
    { id: 1, name: "Barbell Set", desc: "+5 per click", baseCost: 100, valueAdd: 5, level: 0 },
    { id: 2, name: "Squat Rack", desc: "+25 per click", baseCost: 1000, valueAdd: 25, level: 0 },
    { id: 3, name: "Chalk", desc: "+100 per click", baseCost: 5000, valueAdd: 100, level: 0 },
    { id: 4, name: "Lifting Straps", desc: "+500 per click", baseCost: 25000, valueAdd: 500, level: 0 },
    { id: 5, name: "Weight Belt", desc: "+2500 per click", baseCost: 125000, valueAdd: 2500, level: 0 },
    { id: 6, name: "Ammonia Salts", desc: "+10000 per click", baseCost: 625000, valueAdd: 10000, level: 0 },
    { id: 7, name: "Knee Sleeves", desc: "+50000 per click", baseCost: 3125000, valueAdd: 50000, level: 0 },
    { id: 8, name: "Wrist Wraps", desc: "+250000 per click", baseCost: 15625000, valueAdd: 250000, level: 0 },
    { id: 9, name: "Squat Suit", desc: "+1.25M per click", baseCost: 78125000, valueAdd: 1250000, level: 0 },
  ]);

  const [globalMultipliers, setGlobalMultipliers] = useState<GlobalMultiplier[]>([
    { id: 0, name: "Protein Powder", desc: "x1.5 all gains", cost: 1000, multiplierAdd: 0.5, purchased: false },
    { id: 1, name: "Pre-Workout", desc: "x2 all gains", cost: 10000, multiplierAdd: 1.0, purchased: false },
    { id: 2, name: "Creatine", desc: "x2.5 all gains", cost: 100000, multiplierAdd: 1.5, purchased: false },
    { id: 3, name: "Gym Membership", desc: "x3 all gains", cost: 1000000, multiplierAdd: 2.0, purchased: false },
    { id: 4, name: "Pro Sponsorship", desc: "x4 all gains", cost: 10000000, multiplierAdd: 3.0, purchased: false },
    { id: 5, name: "Elite Gym Chain", desc: "x5 all gains", cost: 100000000, multiplierAdd: 4.0, purchased: false },
  ]);

  const totalMultiplier = (baseMultiplier + globalMultipliers.reduce((acc, m) => acc + (m.purchased ? m.multiplierAdd : 0), 0)) * tempMultiplier;

  // Game Loop for Passive Income
  useEffect(() => {
    const interval = setInterval(() => {
      const passiveIncome = trainers.reduce((acc, t) => acc + t.baseIncome * t.count, 0);
      if (passiveIncome > 0) {
        setCurrency(prev => prev + (passiveIncome * totalMultiplier) / 10);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [trainers, totalMultiplier]);

  // Golden Dumbbell Spawner
  useEffect(() => {
    const spawnDumbbell = () => {
      setShowDumbbell(true);
      setTimeout(() => setShowDumbbell(false), 15000);
      
      const nextSpawn = (Math.random() * (5 - 3) + 3) * 60 * 1000;
      setTimeout(spawnDumbbell, nextSpawn);
    };

    const firstSpawn = (Math.random() * (5 - 3) + 3) * 60 * 1000;
    const timer = setTimeout(spawnDumbbell, firstSpawn);
    return () => clearTimeout(timer);
  }, []);

  const handleArmClick = (e: React.MouseEvent) => {
    const value = clickValue * totalMultiplier;
    setCurrency(prev => prev + value);
    
    // Floating text
    const id = Date.now() + Math.random();
    setFloatingTexts(prev => [...prev, { id, x: e.clientX, y: e.clientY, value }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 800);
  };

  const handleDumbbellClick = () => {
    setShowDumbbell(false);
    setTempMultiplier(2);
    setMultiplierActive(true);
    setTimeout(() => {
      setTempMultiplier(1);
      setMultiplierActive(false);
    }, 30000);
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
    const cost = Math.floor(upgrade.baseCost * Math.pow(2.5, upgrade.level));
    
    if (currency >= cost) {
      setCurrency(prev => prev - cost);
      setClickValue(prev => prev + upgrade.valueAdd);
      setUpgrades(prev => prev.map(u => u.id === id ? { ...u, level: u.level + 1 } : u));
    }
  };

  const buyGlobalMultiplier = (id: number) => {
    const multiplier = globalMultipliers.find(m => m.id === id);
    if (!multiplier || multiplier.purchased) return;
    
    if (currency >= multiplier.cost) {
      setCurrency(prev => prev - multiplier.cost);
      setGlobalMultipliers(prev => prev.map(m => m.id === id ? { ...m, purchased: true } : m));
    }
  };

  const totalPassiveIncome = trainers.reduce((acc, t) => acc + t.baseIncome * t.count, 0) * totalMultiplier;

  return (
    <div className="app">
      <header>
        <h1>Flex Clicker</h1>
      </header>

      <div className="stats">
        <div className="currency">{Math.floor(currency).toLocaleString()} Muscular Arms</div>
        <div className="income">Income: {totalPassiveIncome.toLocaleString(undefined, { maximumFractionDigits: 1 })} / sec</div>
        <div className="income">Click Power: {(clickValue * totalMultiplier).toLocaleString(undefined, { maximumFractionDigits: 1 })}</div>
      </div>

      <div className="main-area">
        <ArmIcon className="clickable-arm" onClick={handleArmClick} />
        {floatingTexts.map(t => (
          <div key={t.id} className="floating-text" style={{ left: t.x, top: t.y }}>
            +{t.value.toLocaleString(undefined, { maximumFractionDigits: 1 })}
          </div>
        ))}
      </div>

      {showDumbbell && <DumbbellIcon className="golden-dumbbell" onClick={handleDumbbellClick} />}
      {multiplierActive && <div className="multiplier-active">2X GAINS ACTIVE!</div>}

      <div className="shop">
        <div className="shop-section">
          <h2>Global Multipliers</h2>
          <div className="upgrades-container">
            {globalMultipliers.map(m => (
              <div 
                key={m.id} 
                className={`shop-item ${currency < m.cost || m.purchased ? 'disabled' : ''} ${m.purchased ? 'purchased' : ''}`}
                onClick={() => buyGlobalMultiplier(m.id)}
              >
                <div className="item-info">
                  <div className="item-name">{m.name} {m.purchased ? '(Owned)' : ''}</div>
                  <div className="item-desc">{m.desc}</div>
                  {!m.purchased && <div className="item-cost">Cost: {m.cost.toLocaleString()} Arms</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="shop-section">
          <h2>Click Upgrades</h2>
          <div className="upgrades-container">
            {upgrades.map(u => {
              const cost = Math.floor(u.baseCost * Math.pow(2.5, u.level));
              return (
                <div 
                  key={u.id} 
                  className={`shop-item ${currency < cost ? 'disabled' : ''}`}
                  onClick={() => buyUpgrade(u.id)}
                >
                  <div className="item-info">
                    <div className="item-name">{u.name} (Lvl {u.level})</div>
                    <div className="item-desc">{u.desc}</div>
                    <div className="item-cost">Cost: {cost.toLocaleString()} Arms</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="shop-section">
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
                    <div className="item-desc">+{t.baseIncome} Base Arms/sec</div>
                    <div className="item-cost">Cost: {cost.toLocaleString()} Arms</div>
                  </div>
                  <div className="item-count">{t.count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
