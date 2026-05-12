import React from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Activity, DollarSign, Package, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import './App.css';

// Dati finanziari aggiornati
const financialData = [
  { year: 'Anno 1', revenue: 300000, production: -44000, logistics: -35900, personnel: -112500, commercial: -45000, ebit: -127400 },
  { year: 'Anno 2', revenue: 600000, production: -53000, logistics: -71800, personnel: -150000, commercial: -90000, ebit: 235200 },
  { year: 'Anno 3', revenue: 900000, production: -62000, logistics: -107700, personnel: -187500, commercial: -135000, ebit: 407800 },
  { year: 'Anno 4', revenue: 1200000, production: -71000, logistics: -143600, personnel: -225000, commercial: -180000, ebit: 580400 },
  { year: 'Anno 5', revenue: 1500000, production: -80000, logistics: -179500, personnel: -225000, commercial: -225000, ebit: 790500 },
];

const opexBreakdown5Years = [
  { name: 'Produzione & Accessori', value: 310000, color: '#64748b' }, // Grigio
  { name: 'Logistica (Spedizioni/Ritiri)', value: 538500, color: '#ea580c' }, // Arancione
  { name: 'Personale (Fino a 6 u.)', value: 900000, color: '#2563eb' }, // Blu
  { name: 'Commerciale e Marketing', value: 675000, color: '#059669' }, // Verde
];

function formatCurrency(value) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
}

function StatCard({ title, value, icon: Icon, trend, trendValue, colorClass = "blue" }) {
  let iconColor = "#2563eb";
  if (colorClass === "orange") iconColor = "#ea580c";
  if (colorClass === "green") iconColor = "#059669";
  if (colorClass === "gray") iconColor = "#64748b";

  let bgRGB = '37,99,235';
  if (colorClass === "orange") bgRGB = '234,88,12';
  if (colorClass === "green") bgRGB = '5,150,105';
  if (colorClass === "gray") bgRGB = '100,116,139';

  return (
    <div className={`stat-card ${colorClass}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="stat-card-title">{title}</div>
          <div className="stat-card-value">{value}</div>
        </div>
        <div style={{ padding: '10px', background: `rgba(${bgRGB}, 0.1)`, borderRadius: '12px' }}>
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
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="year" stroke="#64748b" />
              <YAxis stroke="#64748b" tickFormatter={(val) => `€${val/1000}k`} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }}
                formatter={(value) => formatCurrency(value)}
              />
              <Legend />
              <Bar dataKey="revenue" name="Ricavi Totali" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ebit" name="EBIT (Utile Operativo)" fill="#059669" radius={[4, 4, 0, 0]} />
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
                stroke="none"
              >
                {opexBreakdown5Years.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip 
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }}
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
                <td style={{ fontWeight: 600 }}>Fatturato (Noleggio + Vendita)</td>
                <td style={{ fontWeight: 600 }}>{formatCurrency(300000)}</td>
                <td style={{ fontWeight: 600 }}>{formatCurrency(600000)}</td>
                <td style={{ fontWeight: 600 }}>{formatCurrency(900000)}</td>
                <td style={{ fontWeight: 600 }}>{formatCurrency(1200000)}</td>
                <td style={{ fontWeight: 600 }}>{formatCurrency(1500000)}</td>
              </tr>
              <tr>
                <td style={{ paddingLeft: '20px', color: '#64748b' }}>Costi di Produzione (€500/pz)</td>
                <td className="negative">{formatCurrency(-44000)}</td>
                <td className="negative">{formatCurrency(-53000)}</td>
                <td className="negative">{formatCurrency(-62000)}</td>
                <td className="negative">{formatCurrency(-71000)}</td>
                <td className="negative">{formatCurrency(-80000)}</td>
              </tr>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <td style={{ fontWeight: 600 }}>Margine Lordo</td>
                <td className="positive">{formatCurrency(256000)}</td>
                <td className="positive">{formatCurrency(547000)}</td>
                <td className="positive">{formatCurrency(838000)}</td>
                <td className="positive">{formatCurrency(1129000)}</td>
                <td className="positive">{formatCurrency(1420000)}</td>
              </tr>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <td style={{ fontSize: '0.85rem', color: '#64748b' }}>% Margine Lordo</td>
                <td className="percent">85.3%</td>
                <td className="percent">91.1%</td>
                <td className="percent">93.1%</td>
                <td className="percent">94.0%</td>
                <td className="percent">94.6%</td>
              </tr>
              
              <tr>
                <td style={{ paddingLeft: '20px', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>Personale (da 3 a 6 unità)</td>
                <td className="negative" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>{formatCurrency(-112500)}</td>
                <td className="negative" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>{formatCurrency(-150000)}</td>
                <td className="negative" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>{formatCurrency(-187500)}</td>
                <td className="negative" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>{formatCurrency(-225000)}</td>
                <td className="negative" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>{formatCurrency(-225000)}</td>
              </tr>
              <tr>
                <td style={{ paddingLeft: '20px', color: '#64748b' }}>Logistica (€50/movimentazione)</td>
                <td className="negative">{formatCurrency(-35900)}</td>
                <td className="negative">{formatCurrency(-71800)}</td>
                <td className="negative">{formatCurrency(-107700)}</td>
                <td className="negative">{formatCurrency(-143600)}</td>
                <td className="negative">{formatCurrency(-179500)}</td>
              </tr>
              <tr>
                <td style={{ paddingLeft: '20px', color: '#64748b' }}>Commerciale e Marketing (15%)</td>
                <td className="negative">{formatCurrency(-45000)}</td>
                <td className="negative">{formatCurrency(-90000)}</td>
                <td className="negative">{formatCurrency(-135000)}</td>
                <td className="negative">{formatCurrency(-180000)}</td>
                <td className="negative">{formatCurrency(-225000)}</td>
              </tr>
              
              <tr style={{ backgroundColor: '#fff7ed' }}>
                <td style={{ fontWeight: 600, color: '#c2410c' }}>Subtotale OPEX</td>
                <td className="negative">{formatCurrency(-193400)}</td>
                <td className="negative">{formatCurrency(-311800)}</td>
                <td className="negative">{formatCurrency(-430200)}</td>
                <td className="negative">{formatCurrency(-548600)}</td>
                <td className="negative">{formatCurrency(-629500)}</td>
              </tr>

              <tr>
                <td style={{ paddingLeft: '20px', color: '#64748b' }}>CAPEX (R&D, SW, Certificazione)</td>
                <td className="negative">{formatCurrency(-190000)}</td>
                <td className="negative">-</td>
                <td className="negative">-</td>
                <td className="negative">-</td>
                <td className="negative">-</td>
              </tr>
              
              <tr style={{ borderTop: '2px solid #e2e8f0' }}>
                <td style={{ fontSize: '1.1rem', fontWeight: 700 }}>EBIT (Risultato Operativo)</td>
                <td className="negative" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{formatCurrency(-127400)}</td>
                <td className="positive" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{formatCurrency(235200)}</td>
                <td className="positive" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{formatCurrency(407800)}</td>
                <td className="positive" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{formatCurrency(580400)}</td>
                <td className="positive" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{formatCurrency(790500)}</td>
              </tr>
              <tr>
                <td style={{ fontSize: '0.85rem', color: '#64748b' }}>% EBIT Margin</td>
                <td className="danger" style={{ fontWeight: 600, fontSize: '0.9rem', color: '#dc2626' }}>-42.4%</td>
                <td className="percent">39.2%</td>
                <td className="percent">45.3%</td>
                <td className="percent">48.3%</td>
                <td className="percent">52.7%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
