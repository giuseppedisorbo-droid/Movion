import React, { useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Activity, DollarSign, Package, Users, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import './App.css';

// Dati finanziari aggiornati
const financialData = [
  { year: 'Anno 1', revenue: 300000, production: -44000, logistics: -35900, personnel: -112500, commercial: -45000, ebit: -127400 },
  { year: 'Anno 2', revenue: 600000, production: -53000, logistics: -71800, personnel: -150000, commercial: -90000, ebit: 235200 },
  { year: 'Anno 3', revenue: 900000, production: -62000, logistics: -107700, personnel: -187500, commercial: -135000, ebit: 407800 },
  { year: 'Anno 4', revenue: 1200000, production: -71000, logistics: -143600, personnel: -225000, commercial: -180000, ebit: 580400 },
  { year: 'Anno 5', revenue: 1500000, production: -80000, logistics: -179500, personnel: -225000, commercial: -225000, ebit: 790500 },
];

const unitData = [
  { year: 'Anno 1', sales: 18, rental: 70 },
  { year: 'Anno 2', sales: 36, rental: 70 },
  { year: 'Anno 3', sales: 54, rental: 70 },
  { year: 'Anno 4', sales: 72, rental: 70 },
  { year: 'Anno 5', sales: 90, rental: 70 },
];

const opexBreakdown5Years = [
  { name: 'Produzione & Accessori', value: 310000, color: '#94a3b8' }, // Grigio
  { name: 'Logistica (Spedizioni/Ritiri)', value: 538500, color: '#f97316' }, // Arancione
  { name: 'Personale (Fino a 6 u.)', value: 900000, color: '#3b82f6' }, // Blu
  { name: 'Commerciale e Marketing', value: 675000, color: '#10b981' }, // Verde
];

function formatCurrency(value) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
}

function StatCard({ title, value, icon: Icon, trend, trendValue, colorClass = "blue" }) {
  let iconColor = "#3b82f6";
  if (colorClass === "orange") iconColor = "#f97316";
  if (colorClass === "green") iconColor = "#10b981";

  return (
    <div className={`stat-card ${colorClass}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="stat-card-title">{title}</div>
          <div className="stat-card-value">{value}</div>
        </div>
        <div style={{ padding: '10px', background: `rgba(${colorClass==='orange'?'249,115,22':colorClass==='green'?'16,185,129':'59,130,246'}, 0.1)`, borderRadius: '12px' }}>
          <Icon size={24} color={iconColor} />
        </div>
      </div>
      {trend && (
        <div className={`stat-card-trend ${trend === 'up' ? 'trend-up' : 'trend-down'}`}>
          <TrendingUp size={16} style={{ transform: trend === 'down' ? 'rotate(180deg)' : 'none' }} />
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="header-title">
          <h1><span className="blue">MOVION</span> <span className="orange">Business Plan</span></h1>
          <p>Dashboard Finanziaria & Proiezioni a 5 Anni</p>
          <div className="badges-row">
            <span className="badge blue">Dispositivo Medico ELF</span>
            <span className="badge orange">Noleggio & Vendita</span>
            <span className="badge green">Break-Even Anno 2</span>
          </div>
        </div>
        <div className="header-actions">
          <button onClick={() => alert("Sincronizzazione in arrivo")}>
            Sincronizza Dati
          </button>
        </div>
      </header>

      <div className="grid-cards">
        <StatCard 
          title="Fatturato Anno 5" 
          value={formatCurrency(1500000)} 
          icon={DollarSign} 
          trend="up" 
          trendValue="+300k Annuo" 
          colorClass="blue"
        />
        <StatCard 
          title="Utile Operativo (5 Anni)" 
          value={formatCurrency(1886500)} 
          icon={Activity} 
          trend="up" 
          trendValue="Cumulato netto" 
          colorClass="green"
        />
        <StatCard 
          title="Flotta Noleggio (A5)" 
          value="350 Unità" 
          icon={Package} 
          trend="up"
          trendValue="Rotazione 10 mesi/anno"
          colorClass="orange"
        />
        <StatCard 
          title="Costo Produzione Unitario" 
          value="€ 500" 
          icon={BarChart3} 
          colorClass="gray"
        />
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <div className="chart-header">
            <h3><BarChart3 size={20} className="blue" /> Crescita Ricavi vs EBIT (5 Anni)</h3>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={financialData} margin={{ top: 20, right: 10, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis dataKey="year" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" tickFormatter={(val) => `€${val/1000}k`} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#1e2329', borderColor: '#374151', color: '#f8fafc' }}
                formatter={(value) => formatCurrency(value)}
              />
              <Legend />
              <Bar dataKey="revenue" name="Ricavi Totali" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ebit" name="EBIT (Utile Operativo)" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h3><PieChartIcon size={20} className="orange" /> Ripartizione Costi (Totale 5A)</h3>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={opexBreakdown5Years}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {opexBreakdown5Years.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip 
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ backgroundColor: '#1e2329', borderColor: '#374151' }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-container" style={{ height: 'auto', marginBottom: '2.5rem' }}>
        <div className="chart-header">
          <h3><Activity size={20} className="green" /> Dettaglio Conto Economico di Sintesi</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="financial-table">
            <thead>
              <tr>
                <th>Voce Descrittiva</th>
                <th>Anno 1</th>
                <th>Anno 2</th>
                <th>Anno 3</th>
                <th>Anno 4</th>
                <th>Anno 5</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Fatturato (Noleggio + Vendita)</td>
                <td>{formatCurrency(300000)}</td>
                <td>{formatCurrency(600000)}</td>
                <td>{formatCurrency(900000)}</td>
                <td>{formatCurrency(1200000)}</td>
                <td>{formatCurrency(1500000)}</td>
              </tr>
              <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <td style={{ paddingLeft: '20px', fontSize: '0.9rem', color: '#9ca3af' }}>Costi di Produzione (€500/pz)</td>
                <td className="negative">{formatCurrency(-44000)}</td>
                <td className="negative">{formatCurrency(-53000)}</td>
                <td className="negative">{formatCurrency(-62000)}</td>
                <td className="negative">{formatCurrency(-71000)}</td>
                <td className="negative">{formatCurrency(-80000)}</td>
              </tr>
              <tr>
                <td>Margine Lordo</td>
                <td className="positive">{formatCurrency(256000)}</td>
                <td className="positive">{formatCurrency(547000)}</td>
                <td className="positive">{formatCurrency(838000)}</td>
                <td className="positive">{formatCurrency(1129000)}</td>
                <td className="positive">{formatCurrency(1420000)}</td>
              </tr>
              <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <td style={{ paddingLeft: '20px', fontSize: '0.9rem', color: '#9ca3af' }}>Personale (da 3 a 6 unità)</td>
                <td className="negative">{formatCurrency(-112500)}</td>
                <td className="negative">{formatCurrency(-150000)}</td>
                <td className="negative">{formatCurrency(-187500)}</td>
                <td className="negative">{formatCurrency(-225000)}</td>
                <td className="negative">{formatCurrency(-225000)}</td>
              </tr>
              <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <td style={{ paddingLeft: '20px', fontSize: '0.9rem', color: '#9ca3af' }}>Logistica (€50/movimentazione)</td>
                <td className="negative">{formatCurrency(-35900)}</td>
                <td className="negative">{formatCurrency(-71800)}</td>
                <td className="negative">{formatCurrency(-107700)}</td>
                <td className="negative">{formatCurrency(-143600)}</td>
                <td className="negative">{formatCurrency(-179500)}</td>
              </tr>
              <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <td style={{ paddingLeft: '20px', fontSize: '0.9rem', color: '#9ca3af' }}>Commerciale e Marketing (15%)</td>
                <td className="negative">{formatCurrency(-45000)}</td>
                <td className="negative">{formatCurrency(-90000)}</td>
                <td className="negative">{formatCurrency(-135000)}</td>
                <td className="negative">{formatCurrency(-180000)}</td>
                <td className="negative">{formatCurrency(-225000)}</td>
              </tr>
              <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <td style={{ paddingLeft: '20px', fontSize: '0.9rem', color: '#9ca3af' }}>CAPEX (R&D, SW, Certificazione)</td>
                <td className="negative">{formatCurrency(-190000)}</td>
                <td className="negative">-</td>
                <td className="negative">-</td>
                <td className="negative">-</td>
                <td className="negative">-</td>
              </tr>
              <tr style={{ borderTop: '2px solid rgba(255,255,255,0.1)' }}>
                <td style={{ fontSize: '1.1rem' }}>EBIT (Risultato Operativo)</td>
                <td className="negative" style={{ fontSize: '1.1rem' }}>{formatCurrency(-127400)}</td>
                <td className="positive" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{formatCurrency(235200)}</td>
                <td className="positive" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{formatCurrency(407800)}</td>
                <td className="positive" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{formatCurrency(580400)}</td>
                <td className="positive" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{formatCurrency(790500)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
