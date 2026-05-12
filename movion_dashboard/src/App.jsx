import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Activity, DollarSign, Package, Users, Truck } from 'lucide-react';
import './App.css';

// Dati finanziari (Mock Firebase)
const financialData = [
  { year: 'Anno 1', revenue: 300000, production: -44000, opex: -393400, ebit: -127400 },
  { year: 'Anno 2', revenue: 600000, production: -53000, opex: -311800, ebit: 235200 },
  { year: 'Anno 3', revenue: 900000, production: -62000, opex: -430200, ebit: 407800 },
  { year: 'Anno 4', revenue: 1200000, production: -71000, opex: -548600, ebit: 580400 },
  { year: 'Anno 5', revenue: 1500000, production: -80000, opex: -629500, ebit: 790500 },
];

const unitData = [
  { year: 'Anno 1', sales: 18, rental: 70, total: 88 },
  { year: 'Anno 2', sales: 36, rental: 70, total: 106 },
  { year: 'Anno 3', sales: 54, rental: 70, total: 124 },
  { year: 'Anno 4', sales: 72, rental: 70, total: 142 },
  { year: 'Anno 5', sales: 90, rental: 70, total: 160 },
];

function formatCurrency(value) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
}

function StatCard({ title, value, icon: Icon, trend, trendValue }) {
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="stat-card-title">{title}</div>
          <div className="stat-card-value">{value}</div>
        </div>
        <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}>
          <Icon size={24} color="#3b82f6" />
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
  const [data, setData] = useState(financialData);

  // Qui integreremo la connessione reale a Firebase
  useEffect(() => {
    // const unsubscribe = onSnapshot(doc(db, "business_plan", "movion"), (doc) => {
    //   setData(doc.data().financials);
    // });
    // return () => unsubscribe();
  }, []);

  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="header-title">
          <h1>MOVION Business Plan</h1>
          <p>Dashboard Finanziaria & Proiezioni a 5 Anni</p>
        </div>
        <div className="header-actions">
          <button onClick={() => alert("Funzione Connetti a Firebase in arrivo!")}>
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
          trendValue="+25% CAGR" 
        />
        <StatCard 
          title="Margine Lordo Medio" 
          value="93.1%" 
          icon={Activity} 
          trend="up" 
          trendValue="Altissima redditività" 
        />
        <StatCard 
          title="Flotta Noleggio (A5)" 
          value="350 Unità" 
          icon={Package} 
        />
        <StatCard 
          title="Break-Even Point" 
          value="Q3 - Anno 2" 
          icon={TrendingUp} 
          trend="up" 
          trendValue="Luglio Anno 2" 
        />
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <div className="chart-header">
            <h3>Crescita Ricavi vs EBIT (5 Anni)</h3>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" vertical={false} />
              <XAxis dataKey="year" stroke="#a0a0ab" />
              <YAxis stroke="#a0a0ab" tickFormatter={(val) => `€${val/1000}k`} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#121217', borderColor: '#2a2a35', color: '#fff' }}
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
            <h3>Produzione Unità (Sales vs Rental)</h3>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={unitData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
              <XAxis dataKey="year" stroke="#a0a0ab" />
              <YAxis stroke="#a0a0ab" />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#121217', borderColor: '#2a2a35', color: '#fff' }}
              />
              <Legend />
              <Line type="monotone" dataKey="sales" name="Vendite" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="rental" name="Nuovi Noleggi" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-container" style={{ height: 'auto' }}>
        <div className="chart-header">
          <h3>Conto Economico di Sintesi</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="financial-table">
            <thead>
              <tr>
                <th>Voce</th>
                <th>Anno 1</th>
                <th>Anno 2</th>
                <th>Anno 3</th>
                <th>Anno 4</th>
                <th>Anno 5</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Fatturato</td>
                <td>{formatCurrency(300000)}</td>
                <td>{formatCurrency(600000)}</td>
                <td>{formatCurrency(900000)}</td>
                <td>{formatCurrency(1200000)}</td>
                <td>{formatCurrency(1500000)}</td>
              </tr>
              <tr>
                <td>Costi di Produzione</td>
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
              <tr>
                <td>Spese Operative (R&D, Pers, Log, Comm)</td>
                <td className="negative">{formatCurrency(-383400)}</td>
                <td className="negative">{formatCurrency(-311800)}</td>
                <td className="negative">{formatCurrency(-430200)}</td>
                <td className="negative">{formatCurrency(-548600)}</td>
                <td className="negative">{formatCurrency(-629500)}</td>
              </tr>
              <tr>
                <td>EBIT (Risultato Operativo)</td>
                <td className="negative">{formatCurrency(-127400)}</td>
                <td className="positive" style={{ fontWeight: 'bold' }}>{formatCurrency(235200)}</td>
                <td className="positive" style={{ fontWeight: 'bold' }}>{formatCurrency(407800)}</td>
                <td className="positive" style={{ fontWeight: 'bold' }}>{formatCurrency(580400)}</td>
                <td className="positive" style={{ fontWeight: 'bold' }}>{formatCurrency(790500)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
