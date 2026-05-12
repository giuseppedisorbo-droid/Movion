import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Activity, DollarSign, Package, BarChart3, PieChart as PieChartIcon, Settings } from 'lucide-react';
import './App.css';

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
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState({
    targetRevenueY5: 1500000,
    priceSale: 5000,
    priceRental: 300,
    rentalYieldMonths: 10,
    costProduction: 500,
    costLogistics: 50,
    capex: 190000,
    personnelCost: 37500,
    commercialPercent: 15,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: Number(value) }));
  };

  // Calcolo Dinamico di tutto il BP
  const { financialData, totals, kpis } = useMemo(() => {
    const step = config.targetRevenueY5 / 5;
    let data = [];
    let totProd = 0, totLog = 0, totPers = 0, totComm = 0;
    
    // Assumiamo che le unità di personale crescano organicamente con i ricavi (hardcoded growth logic)
    const personnelGrowth = [3, 4, 5, 6, 6];

    for (let i = 0; i < 5; i++) {
      let revenue = step * (i + 1);
      
      // Assumiamo sempre 70% noleggio e 30% vendita come da target fisso, o calcoliamolo.
      let revRental = revenue * 0.70;
      let revSale = revenue * 0.30;
      
      let salesUnits = revSale / config.priceSale;
      let rentalYieldPerDevice = config.rentalYieldMonths * config.priceRental;
      let rentalFleet = revRental / rentalYieldPerDevice; // flotta totale operativa necessaria in quell'anno
      
      // Unità da produrre quell'anno = vendite + nuovi noleggi
      let prevFleet = i === 0 ? 0 : ((step * i) * 0.70) / rentalYieldPerDevice;
      let newRentalUnits = rentalFleet - prevFleet;
      let unitsProduced = salesUnits + newRentalUnits;
      
      let costProd = unitsProduced * config.costProduction;
      
      // Logistica: (flotta * mesi rotazione) + vendite = numero di spedizioni totali
      let logisticsCount = (rentalFleet * config.rentalYieldMonths) + salesUnits;
      let costLogistics = logisticsCount * config.costLogistics;
      
      let costPersonnel = personnelGrowth[i] * config.personnelCost;
      let costCommercial = revenue * (config.commercialPercent / 100);
      let capexy = i === 0 ? config.capex : 0;
      
      let ebit = revenue - costProd - costLogistics - costPersonnel - costCommercial - capexy;
      
      totProd += costProd;
      totLog += costLogistics;
      totPers += costPersonnel;
      totComm += costCommercial;

      data.push({
        year: `Anno ${i + 1}`,
        revenue,
        production: -costProd,
        logistics: -costLogistics,
        personnel: -costPersonnel,
        commercial: -costCommercial,
        capex: -capexy,
        ebit,
        grossMargin: revenue - costProd,
        fleet: rentalFleet,
        unitsSold: salesUnits
      });
    }

    const totalOpex = [
      { name: 'Produzione & Accessori', value: totProd, color: '#64748b' },
      { name: 'Logistica (Sped/Ritiri)', value: totLog, color: '#ea580c' },
      { name: 'Personale', value: totPers, color: '#2563eb' },
      { name: 'Commerciale (Provvigioni)', value: totComm, color: '#059669' },
    ];

    const totalEbit = data.reduce((acc, curr) => acc + curr.ebit, 0);

    return { 
      financialData: data, 
      totals: totalOpex,
      kpis: { totalEbit, finalFleet: data[4].fleet }
    };
  }, [config]);

  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="header-title">
          <h1><span className="blue">MOVION</span> <span className="orange">Business Plan</span></h1>
          <p>Dashboard Dinamica e Simulatore a 5 Anni</p>
          <div className="badges-row">
            <span className="badge blue">Modello Interattivo</span>
            <span className="badge orange">Noleggio 70% / Vendita 30%</span>
            <span className="badge green">Dati in Tempo Reale</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="outline" onClick={() => setShowSettings(!showSettings)}>
            <Settings size={18} /> Modifica Variabili
          </button>
        </div>
      </header>

      {showSettings && (
        <div className="settings-panel">
          <div className="setting-group">
            <label>Fatturato Obiettivo Anno 5 (€)</label>
            <input type="number" name="targetRevenueY5" value={config.targetRevenueY5} onChange={handleChange} />
          </div>
          <div className="setting-group">
            <label>Prezzo di Vendita Unitario (€)</label>
            <input type="number" name="priceSale" value={config.priceSale} onChange={handleChange} />
          </div>
          <div className="setting-group">
            <label>Tariffa Noleggio (Mese) (€)</label>
            <input type="number" name="priceRental" value={config.priceRental} onChange={handleChange} />
          </div>
          <div className="setting-group">
            <label>Mesi di Rotazione Annua</label>
            <input type="number" name="rentalYieldMonths" value={config.rentalYieldMonths} onChange={handleChange} />
          </div>
          <div className="setting-group">
            <label>Costo Produzione Unitario (€)</label>
            <input type="number" name="costProduction" value={config.costProduction} onChange={handleChange} />
          </div>
          <div className="setting-group">
            <label>Costo Logistica x Spedizione (€)</label>
            <input type="number" name="costLogistics" value={config.costLogistics} onChange={handleChange} />
          </div>
          <div className="setting-group">
            <label>Costo Personale Unitario Annuo (€)</label>
            <input type="number" name="personnelCost" value={config.personnelCost} onChange={handleChange} />
          </div>
          <div className="setting-group">
            <label>Provvigioni Commerciali (%)</label>
            <input type="number" name="commercialPercent" value={config.commercialPercent} onChange={handleChange} />
          </div>
        </div>
      )}

      <div className="grid-cards">
        <StatCard 
          title="Fatturato Target A5" 
          value={formatCurrency(config.targetRevenueY5)} 
          icon={DollarSign} 
          trend="up" 
          trendValue="Proiezione a Regime" 
          colorClass="blue"
        />
        <StatCard 
          title="Utile Operativo Netto (5A)" 
          value={formatCurrency(kpis.totalEbit)} 
          icon={Activity} 
          trend="up" 
          trendValue="Margine di Profitto Cumulato" 
          colorClass="green"
        />
        <StatCard 
          title="Flotta Noleggio (A5)" 
          value={`${Math.round(kpis.finalFleet)} Unità`} 
          icon={Package} 
          trend="up"
          trendValue={`Rotazione ${config.rentalYieldMonths} mesi/anno`}
          colorClass="orange"
        />
        <StatCard 
          title="Costo Produzione Unitario" 
          value={`€ ${config.costProduction}`} 
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
                data={totals}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {totals.map((entry, index) => (
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
          <h3><Activity size={20} className="green" /> Dettaglio Conto Economico di Sintesi (Ricalcolo Dinamico)</h3>
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
                <td style={{ fontWeight: 600 }}>Fatturato Dinamico</td>
                {financialData.map((d, i) => <td key={i} style={{ fontWeight: 600 }}>{formatCurrency(d.revenue)}</td>)}
              </tr>
              <tr>
                <td style={{ paddingLeft: '20px', color: '#64748b' }}>Costi di Produzione (€{config.costProduction}/pz)</td>
                {financialData.map((d, i) => <td key={i} className="negative">{formatCurrency(d.production)}</td>)}
              </tr>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <td style={{ fontWeight: 600 }}>Margine Lordo</td>
                {financialData.map((d, i) => <td key={i} className="positive">{formatCurrency(d.grossMargin)}</td>)}
              </tr>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <td style={{ fontSize: '0.85rem', color: '#64748b' }}>% Margine Lordo</td>
                {financialData.map((d, i) => <td key={i} className="percent">{((d.grossMargin / d.revenue)*100).toFixed(1)}%</td>)}
              </tr>
              
              <tr>
                <td style={{ paddingLeft: '20px', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>Personale</td>
                {financialData.map((d, i) => <td key={i} className="negative" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>{formatCurrency(d.personnel)}</td>)}
              </tr>
              <tr>
                <td style={{ paddingLeft: '20px', color: '#64748b' }}>Logistica (€{config.costLogistics}/movimentazione)</td>
                {financialData.map((d, i) => <td key={i} className="negative">{formatCurrency(d.logistics)}</td>)}
              </tr>
              <tr>
                <td style={{ paddingLeft: '20px', color: '#64748b' }}>Commerciale e Marketing ({config.commercialPercent}%)</td>
                {financialData.map((d, i) => <td key={i} className="negative">{formatCurrency(d.commercial)}</td>)}
              </tr>
              
              <tr style={{ backgroundColor: '#fff7ed' }}>
                <td style={{ fontWeight: 600, color: '#c2410c' }}>Subtotale OPEX</td>
                {financialData.map((d, i) => <td key={i} className="negative">{formatCurrency(d.personnel + d.logistics + d.commercial)}</td>)}
              </tr>

              <tr>
                <td style={{ paddingLeft: '20px', color: '#64748b' }}>CAPEX (R&D, SW, Certificazione)</td>
                {financialData.map((d, i) => <td key={i} className="negative">{d.capex !== 0 ? formatCurrency(d.capex) : '-'}</td>)}
              </tr>
              
              <tr style={{ borderTop: '2px solid #e2e8f0' }}>
                <td style={{ fontSize: '1.1rem', fontWeight: 700 }}>EBIT (Risultato Operativo)</td>
                {financialData.map((d, i) => <td key={i} className={d.ebit < 0 ? "negative" : "positive"} style={{ fontSize: '1.1rem', fontWeight: 700 }}>{formatCurrency(d.ebit)}</td>)}
              </tr>
              <tr>
                <td style={{ fontSize: '0.85rem', color: '#64748b' }}>% EBIT Margin</td>
                {financialData.map((d, i) => <td key={i} className={d.ebit < 0 ? "danger" : "percent"} style={{ fontWeight: 600, fontSize: '0.9rem' }}>{((d.ebit / d.revenue)*100).toFixed(1)}%</td>)}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
