import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Activity, DollarSign, Package, BarChart3, PieChart as PieChartIcon, Settings, Download } from 'lucide-react';
import './App.css';
import ReportDinamico from './ReportDinamico';

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
  const defaultConfig = {
    targetSalesUnitsY5: 90,
    targetFleetY5: 350,
    priceSale: 5000,
    priceRental: 300,
    rentalYieldMonths: 10,
    costProduction: 500,
    costLogistics: 50,
    capex: 190000,
    personnelCost: 37500,
    commercialPercent: 15,
    maintenancePercent: 3,
  };

  const [showSettings, setShowSettings] = useState(false);
  const [printMode, setPrintMode] = useState('dashboard');

  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('movionConfig');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaultConfig, ...parsed };
      } catch(e) {}
    }
    return defaultConfig;
  });

  React.useEffect(() => {
    localStorage.setItem('movionConfig', JSON.stringify(config));
  }, [config]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value === '' ? '' : value }));
  };

  const resetToDefault = () => {
    if(window.confirm('Vuoi ripristinare i valori predefiniti del Business Plan?')) {
      setConfig(defaultConfig);
    }
  };

  const { financialData, unitData, totals, kpis } = useMemo(() => {
    const salesY5 = Number(config.targetSalesUnitsY5) || 0;
    const fleetY5 = Number(config.targetFleetY5) || 0;
    const pSale = Number(config.priceSale) || 1;
    const pRental = Number(config.priceRental) || 1;
    const rYield = Number(config.rentalYieldMonths) || 1;
    const cProd = Number(config.costProduction) || 0;
    const cLog = Number(config.costLogistics) || 0;
    const cPers = Number(config.personnelCost) || 0;
    const cComm = Number(config.commercialPercent) || 0;
    const cCapex = Number(config.capex) || 0;
    const cMaint = Number(config.maintenancePercent) || 0;

    const stepSales = salesY5 / 5;
    const stepFleet = fleetY5 / 5;
    
    let fData = [];
    let uData = [];
    let totProd = 0, totLog = 0, totPers = 0, totComm = 0, totMaint = 0;
    
    const personnelGrowth = [3, 4, 5, 6, 6];
    let totalUnitsProducedOverall = 0;

    for (let i = 0; i < 5; i++) {
      let salesUnits = stepSales * (i + 1);
      let rentalFleet = stepFleet * (i + 1);
      
      let revSale = salesUnits * pSale;
      let revRental = rentalFleet * rYield * pRental;
      let revenue = revSale + revRental;
      
      let prevFleet = i === 0 ? 0 : stepFleet * i;
      let newRentalUnits = rentalFleet - prevFleet;
      let unitsProduced = salesUnits + newRentalUnits;
      
      let costProd = unitsProduced * cProd;
      
      let logisticsCount = (rentalFleet * rYield) + salesUnits;
      let costLogistics = logisticsCount * cLog;
      
      let costPersonnel = personnelGrowth[i] * cPers;
      let costCommercial = revenue * (cComm / 100);
      let costMaintenance = revenue * (cMaint / 100);
      let capexy = i === 0 ? cCapex : 0;
      
      let ebit = revenue - costProd - costLogistics - costPersonnel - costCommercial - costMaintenance - capexy;
      
      totProd += costProd;
      totLog += costLogistics;
      totPers += costPersonnel;
      totComm += costCommercial;
      totMaint += costMaintenance;
      totalUnitsProducedOverall += unitsProduced;

      fData.push({
        year: `Anno ${i + 1}`,
        revenue,
        production: -costProd,
        logistics: -costLogistics,
        personnel: -costPersonnel,
        commercial: -costCommercial,
        maintenance: -costMaintenance,
        capex: -capexy,
        ebit,
        grossMargin: revenue - costProd
      });

      uData.push({
        year: `Anno ${i + 1}`,
        revSale,
        salesUnits,
        revRental,
        fleet: rentalFleet,
        newFleetUnits: newRentalUnits,
        contracts: rentalFleet * config.rentalYieldMonths,
        unitsProduced
      });
    }

    const totalOpex = [
      { name: 'Produzione & Accessori', value: totProd, color: '#64748b' },
      { name: 'Logistica (Sped/Ritiri)', value: totLog, color: '#ea580c' },
      { name: 'Personale', value: totPers, color: '#2563eb' },
      { name: 'Commerciale', value: totComm, color: '#059669' },
      { name: 'Manutenzione', value: totMaint, color: '#f59e0b' },
    ];

    const totalEbit = fData.reduce((acc, curr) => acc + curr.ebit, 0);

    const targetRevenueY5 = fData[4].revenue || 1;
    const saleRatioY5 = (uData[4].revSale / targetRevenueY5) * 100;

    return { 
      financialData: fData, 
      unitData: uData,
      totals: totalOpex,
      kpis: { totalEbit, finalFleet: uData[4].fleet, totalUnitsProducedOverall, targetRevenueY5, saleRatioY5 }
    };
  }, [config]);

  const handlePrintDashboard = () => {
    setPrintMode('dashboard');
    setTimeout(() => window.print(), 100);
  };

  const handlePrintReport = () => {
    setPrintMode('report');
    setTimeout(() => {
      window.print();
      setPrintMode('dashboard');
    }, 100);
  };

  return (
    <div className={`${printMode}-mode`}>
      <div className="dashboard-container">
      <header className="header">
        <div className="header-title">
          <h1><span className="blue">MOVION</span> <span className="orange">Business Plan</span></h1>
          <p>Dashboard Dinamica & Generatore di Report</p>
          <div className="badges-row">
            <span className="badge blue">Modello Interattivo</span>
            <span className="badge orange">Noleggio 70% / Vendita 30%</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="outline" onClick={() => setShowSettings(!showSettings)}>
            <Settings size={18} /> Variabili
          </button>
          <button className="outline" onClick={resetToDefault}>
            Ripristina
          </button>
          <button className="outline" onClick={handlePrintDashboard}>
            Stampa Grafici
          </button>
          <button onClick={handlePrintReport}>
            <Download size={18} /> Scarica Relazione
          </button>
        </div>
      </header>

      {showSettings && (
        <div className="settings-panel">
          <div className="setting-group">
            <label>Unità Vendute (Obiettivo A5)</label>
            <input type="number" name="targetSalesUnitsY5" value={config.targetSalesUnitsY5} onChange={handleChange} />
          </div>
          <div className="setting-group">
            <label>Flotta Noleggio (Obiettivo A5)</label>
            <input type="number" name="targetFleetY5" value={config.targetFleetY5} onChange={handleChange} />
          </div>
          <div className="setting-group">
            <label>Prezzo Vendita Unitario (€)</label>
            <input type="number" name="priceSale" value={config.priceSale} onChange={handleChange} />
          </div>
          <div className="setting-group">
            <label>Tariffa Noleggio Mensile (€)</label>
            <input type="number" name="priceRental" value={config.priceRental} onChange={handleChange} />
          </div>
          <div className="setting-group">
            <label>Mesi Rotazione Annua</label>
            <input type="number" name="rentalYieldMonths" value={config.rentalYieldMonths} onChange={handleChange} />
          </div>
          <div className="setting-group">
            <label>Costo Produzione (BOM) (€)</label>
            <input type="number" name="costProduction" value={config.costProduction} onChange={handleChange} />
          </div>
          <div className="setting-group">
            <label>Costo Spedizione/Ritiro (€)</label>
            <input type="number" name="costLogistics" value={config.costLogistics} onChange={handleChange} />
          </div>
          <div className="setting-group">
            <label>Costo Personale Annuo (€)</label>
            <input type="number" name="personnelCost" value={config.personnelCost} onChange={handleChange} />
          </div>
          <div className="setting-group">
            <label>Provvigioni Commerciali (%)</label>
            <input type="number" name="commercialPercent" value={config.commercialPercent} onChange={handleChange} />
          </div>
          <div className="setting-group">
            <label>Costo Manutenzione (%)</label>
            <input type="number" name="maintenancePercent" value={config.maintenancePercent} onChange={handleChange} />
          </div>
        </div>
      )}

      <div className="grid-cards">
        <StatCard 
          title="Fatturato Target A5" 
          value={formatCurrency(kpis.targetRevenueY5)} 
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
          title="Unità da Produrre (5A)" 
          value={Math.round(kpis.totalUnitsProducedOverall)} 
          icon={BarChart3} 
          trend="up"
          trendValue={`A € ${config.costProduction} cad.`}
          colorClass="gray"
        />
      </div>

      <div className="charts-section">
        <div className="chart-container" style={{ height: '420px' }}>
          <div className="chart-header">
            <h3><BarChart3 size={20} className="blue" /> Crescita Ricavi vs EBIT (5 Anni)</h3>
          </div>
          <ResponsiveContainer width="100%" height="80%">
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

        <div className="chart-container" style={{ height: '420px' }}>
          <div className="chart-header">
            <h3><PieChartIcon size={20} className="orange" /> Ripartizione Costi (Totale 5A)</h3>
          </div>
          <ResponsiveContainer width="100%" height="80%">
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

      <div className="chart-container" style={{ height: 'auto' }}>
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
                <td style={{ fontWeight: 600 }}>Fatturato Dinamico</td>
                {financialData.map((d, i) => <td key={i} style={{ fontWeight: 600 }}>{formatCurrency(d.revenue)}</td>)}
              </tr>
              <tr>
                <td style={{ paddingLeft: '20px', color: '#64748b' }}>Costi Produzione (€{config.costProduction}/pz)</td>
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
              <tr>
                <td style={{ paddingLeft: '20px', color: '#64748b' }}>Manutenzione e Ricambi ({config.maintenancePercent}%)</td>
                {financialData.map((d, i) => <td key={i} className="negative">{formatCurrency(d.maintenance)}</td>)}
              </tr>
              
              <tr style={{ backgroundColor: '#fff7ed' }}>
                <td style={{ fontWeight: 600, color: '#c2410c' }}>Subtotale OPEX</td>
                {financialData.map((d, i) => <td key={i} className="negative">{formatCurrency(d.personnel + d.logistics + d.commercial + d.maintenance)}</td>)}
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

      <div className="chart-container" style={{ height: 'auto' }}>
        <div className="chart-header">
          <h3><Package size={20} className="orange" /> Analisi Unità e Composizione Flotta (Dinamica)</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="financial-table" style={{ marginBottom: '2rem' }}>
            <thead>
              <tr>
                <th colSpan={6} style={{ textAlign: 'left', backgroundColor: '#eff6ff', color: '#1d4ed8' }}>VENDITE DIREZIONALI</th>
              </tr>
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
                <td style={{ color: '#64748b' }}>Ricavi Vendita</td>
                {unitData.map((d, i) => <td key={i}>{formatCurrency(d.revSale)}</td>)}
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Unità Vendute</td>
                {unitData.map((d, i) => <td key={i} style={{ fontWeight: 600 }}>{Math.round(d.salesUnits)}</td>)}
              </tr>
            </tbody>
          </table>

          <table className="financial-table" style={{ marginBottom: '2rem' }}>
            <thead>
              <tr>
                <th colSpan={6} style={{ textAlign: 'left', backgroundColor: '#fff7ed', color: '#c2410c' }}>NOLEGGI A PAZIENTI</th>
              </tr>
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
                <td style={{ color: '#64748b' }}>Ricavi Noleggio</td>
                {unitData.map((d, i) => <td key={i}>{formatCurrency(d.revRental)}</td>)}
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Apparecchi in Flotta Noleggio (Totali)</td>
                {unitData.map((d, i) => <td key={i} style={{ fontWeight: 600 }}>{Math.round(d.fleet)}</td>)}
              </tr>
              <tr>
                <td style={{ color: '#64748b', fontStyle: 'italic' }}>Mesi Fatturati (Contratti Generati)</td>
                {unitData.map((d, i) => <td key={i} style={{ fontStyle: 'italic' }}>{Math.round(d.contracts)}</td>)}
              </tr>
            </tbody>
          </table>

          <table className="financial-table">
            <thead>
              <tr>
                <th colSpan={7} style={{ textAlign: 'left', backgroundColor: '#ecfdf5', color: '#047857' }}>FABBISOGNO DI PRODUZIONE</th>
              </tr>
              <tr>
                <th>Voce Descrittiva</th>
                <th>Anno 1</th>
                <th>Anno 2</th>
                <th>Anno 3</th>
                <th>Anno 4</th>
                <th>Anno 5</th>
                <th>Totale</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ color: '#64748b' }}>Unità per Vendita</td>
                {unitData.map((d, i) => <td key={i}>{Math.round(d.salesUnits)}</td>)}
                <td style={{ fontWeight: 600 }}>{Math.round(unitData.reduce((acc, curr) => acc + curr.salesUnits, 0))}</td>
              </tr>
              <tr>
                <td style={{ color: '#64748b' }}>Nuove Unità per Flotta Noleggio</td>
                {unitData.map((d, i) => <td key={i}>{Math.round(d.newFleetUnits)}</td>)}
                <td style={{ fontWeight: 600 }}>{Math.round(unitData.reduce((acc, curr) => acc + curr.newFleetUnits, 0))}</td>
              </tr>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <td style={{ fontWeight: 600 }}>Totale Unità da Produrre</td>
                {unitData.map((d, i) => <td key={i} style={{ fontWeight: 600 }}>{Math.round(d.unitsProduced)}</td>)}
                <td style={{ fontWeight: 700, color: '#059669' }}>{Math.round(kpis.totalUnitsProducedOverall)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      </div>
      <ReportDinamico 
        config={config} 
        financialData={financialData} 
        unitData={unitData} 
        kpis={kpis} 
      />
    </div>
  );
}

export default App;
