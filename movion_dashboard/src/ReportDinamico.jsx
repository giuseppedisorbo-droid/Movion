import React from 'react';

function formatCurrency(value) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
}

export default function ReportDinamico({ config, financialData, unitData, kpis }) {
  return (
    <div className="report-document">
      <h1>Business Plan: Dispositivo Elettromedicale MOVION</h1>
      <h2>Campi Elettromagnetici ELF e Microcorrenti</h2>
      <hr />

      <h3>1. Executive Summary</h3>
      <p>
        Il presente Business Plan descrive il progetto di sviluppo, certificazione, produzione e commercializzazione di <strong>MOVION</strong>, un dispositivo elettromedicale proprietario basato su campi elettromagnetici a bassissima frequenza (ELF) e microcorrenti. 
        Il progetto mira a raggiungere un fatturato di <strong>{formatCurrency(kpis.targetRevenueY5)}</strong> entro il 5° anno, con un modello di ricavi basato su noleggi e vendite dirette in crescita lineare.
      </p>

      <h4>1.1 Premessa Storica e Validazione del Mercato (Il Caso Seqex - "Anno 0")</h4>
      <p>
        L'iniziativa MOVION si fonda su una solida e comprovata esperienza sul campo iniziata nel 2018 con la commercializzazione del dispositivo <em>Seqex</em>, un apparecchio di terzi con caratteristiche terapeutiche e di mercato simili a quelle previste per MOVION.
        Nel corso degli anni, EUBIOS ha investito nell'acquisto di circa <strong>250 apparecchiature Seqex</strong> per costruire la propria base clienti. A fine 2026, questa flotta esistente genererà un fatturato consolidato stimato in <strong>€ 300.000</strong>. 
        Questo risultato storico rappresenta a tutti gli effetti il nostro <strong>"Anno 0"</strong>: una validazione assoluta e inconfutabile dell'interesse del mercato e della sostenibilità del modello di business basato sul noleggio, fornendo la base sicura su cui scalare il nuovo prodotto proprietario MOVION.
      </p>

      <hr />

      <h3>2. Descrizione del Prodotto</h3>
      <p><strong>Specifiche Tecniche e Design:</strong></p>
      <ul>
        <li><strong>Display:</strong> TFT da 4.3" touch capacitivo, incollato su vetro a dimensione del pannello frontale (ottima tenuta IP).</li>
        <li><strong>Case:</strong> Contenitore da banco tipo Bopla BoPad (ABS, ~215x150 mm), frontale inclinato.</li>
        <li><strong>Alimentazione:</strong> Modulo ingresso 100/230Vac, pre-omologato medicale.</li>
        <li><strong>Uscite:</strong> Sdoppiamento applicatori, con canale dedicato alle microcorrenti.</li>
      </ul>

      <hr />

      <h3>3. Pricing</h3>
      <table className="doc-table">
        <thead>
          <tr><th>Modalità</th><th>Prezzo (IVA esclusa)</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Vendita</strong></td><td><strong>{formatCurrency(config.priceSale)}</strong></td></tr>
          <tr><td><strong>Noleggio</strong></td><td><strong>{formatCurrency(config.priceRental)} / mese</strong></td></tr>
        </tbody>
      </table>

      <hr />

      <h3>4. Strategia Regolatoria</h3>
      <ul>
        <li><strong>Marcatura CE</strong> secondo MDR 2017/745, Classe IIa.</li>
        <li>Implementazione Sistema Qualità, redazione Fascicolo Tecnico e sviluppo informatico coperti da partner esterni ("chiavi in mano").</li>
        <li>Valutazione Clinica (CER), prove di laboratorio EMC/Safety e tutte le autorizzazioni per l'immissione sul mercato.</li>
      </ul>

      <hr />

      <h3>5. Piano Operativo e R&D</h3>
      <ul>
        <li><strong>Time-to-market stimato:</strong> 52 settimane (1 anno).</li>
        <li><strong>Sviluppo Elettronica (R&D):</strong> {formatCurrency(config.capexElectronics)}.</li>
        <li><strong>Sviluppo Informatico e Certificazioni:</strong> {formatCurrency(config.capexIT)}.</li>
        {config.capexMarketing > 0 && <li><strong>Budget Marketing Iniziale:</strong> {formatCurrency(config.capexMarketing)}.</li>}
      </ul>
      <p><strong>Costo unitario di produzione (BOM su lotti 200/300 pz):</strong></p>
      <table className="doc-table">
        <thead>
          <tr><th>Componente</th><th>Costo Stimato</th></tr>
        </thead>
        <tbody>
          <tr><td>Elettronica Principale (Scheda + Display TFT 4.3")</td><td>{formatCurrency(config.costElectronics)}</td></tr>
          <tr><td>Contenitore ABS (es. Bopla BoPad) e meccanica</td><td>{formatCurrency(config.costMechanics)}</td></tr>
          <tr><td><strong>Accessori (Applicatori/Bobine)</strong></td><td><strong>{formatCurrency(config.costAccessories)}</strong></td></tr>
          <tr><td>Alimentatore medicale, manuale e packaging</td><td>{formatCurrency(config.costPackaging)}</td></tr>
          <tr className="highlight"><td><strong>Totale Costo Unitario di Produzione</strong></td><td><strong>{formatCurrency(kpis.cProd)}</strong></td></tr>
        </tbody>
      </table>

      <hr />

      <h3>6. Piano Finanziario a 5 Anni (Dinamico)</h3>

      <h4>6.1 Proiezione Fatturato</h4>
      <table className="doc-table">
        <thead>
          <tr><th></th><th>Anno 1</th><th>Anno 2</th><th>Anno 3</th><th>Anno 4</th><th>Anno 5</th></tr>
        </thead>
        <tbody>
          <tr className="highlight">
            <td><strong>Fatturato Totale</strong></td>
            {financialData.map((d, i) => <td key={i}>{formatCurrency(d.revenue)}</td>)}
          </tr>
        </tbody>
      </table>

      <h4>6.2 Composizione Analitica del Fatturato</h4>
      <p><strong>A. Fatturato da Vendita Diretta (Prezzo Unitario: {formatCurrency(config.priceSale)})</strong></p>
      <table className="doc-table">
        <thead>
          <tr><th></th><th>Anno 1</th><th>Anno 2</th><th>Anno 3</th><th>Anno 4</th><th>Anno 5</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Obiettivo Ricavi Vendita</td>
            {unitData.map((d, i) => <td key={i}>{formatCurrency(d.revSale)}</td>)}
          </tr>
          <tr className="highlight">
            <td><strong>Unità Vendute Necessarie</strong></td>
            {unitData.map((d, i) => <td key={i}><strong>{Math.round(d.salesUnits)} pz</strong></td>)}
          </tr>
        </tbody>
      </table>

      <p><strong>B. Fatturato da Noleggio (Tariffa: {formatCurrency(config.priceRental)}/mese - Resa: {config.rentalYieldMonths} mesi/anno)</strong></p>
      <table className="doc-table">
        <thead>
          <tr><th></th><th>Anno 1</th><th>Anno 2</th><th>Anno 3</th><th>Anno 4</th><th>Anno 5</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Obiettivo Ricavi Noleggio</td>
            {unitData.map((d, i) => <td key={i}>{formatCurrency(d.revRental)}</td>)}
          </tr>
          <tr className="highlight">
            <td><strong>Flotta Operativa Necessaria</strong></td>
            {unitData.map((d, i) => <td key={i}><strong>{Math.round(d.fleet)} pz</strong></td>)}
          </tr>
          <tr>
            <td>Mesi fatturati (singoli contratti)</td>
            {unitData.map((d, i) => <td key={i}>{Math.round(d.contracts)}</td>)}
          </tr>
        </tbody>
      </table>

      <h4>6.3 Fabbisogno di Produzione Totale</h4>
      <table className="doc-table">
        <thead>
          <tr><th></th><th>Anno 1</th><th>Anno 2</th><th>Anno 3</th><th>Anno 4</th><th>Anno 5</th><th>Totale</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Unità per Vendita</td>
            {unitData.map((d, i) => <td key={i}>{Math.round(d.salesUnits)}</td>)}
            <td>{Math.round(unitData.reduce((a, b) => a + b.salesUnits, 0))}</td>
          </tr>
          <tr>
            <td>Nuove Unità per Flotta Noleggio</td>
            {unitData.map((d, i) => <td key={i}>{Math.round(d.newFleetUnits)}</td>)}
            <td>{Math.round(unitData.reduce((a, b) => a + b.newFleetUnits, 0))}</td>
          </tr>
          <tr className="highlight">
            <td><strong>Totale Unità da Produrre</strong></td>
            {unitData.map((d, i) => <td key={i}><strong>{Math.round(d.unitsProduced)}</strong></td>)}
            <td><strong>{Math.round(kpis.totalUnitsProducedOverall)}</strong></td>
          </tr>
        </tbody>
      </table>

      <h4>6.4 Conto Economico Semplificato</h4>
      <table className="doc-table">
        <thead>
          <tr><th></th><th>Anno 1</th><th>Anno 2</th><th>Anno 3</th><th>Anno 4</th><th>Anno 5</th></tr>
        </thead>
        <tbody>
          <tr className="highlight">
            <td><strong>Ricavi Totali</strong></td>
            {financialData.map((d, i) => <td key={i}>{formatCurrency(d.revenue)}</td>)}
          </tr>
          <tr>
            <td>Costi Produzione</td>
            {financialData.map((d, i) => <td key={i}>{formatCurrency(d.production)}</td>)}
          </tr>
          <tr>
            <td><strong>Margine Lordo</strong></td>
            {financialData.map((d, i) => <td key={i}><strong>{formatCurrency(d.grossMargin)}</strong></td>)}
          </tr>
          <tr>
            <td>Costi Logistica</td>
            {financialData.map((d, i) => <td key={i}>{formatCurrency(d.logistics)}</td>)}
          </tr>
          <tr>
            <td>Costo Personale</td>
            {financialData.map((d, i) => <td key={i}>{formatCurrency(d.personnel)}</td>)}
          </tr>
          <tr>
            <td>Costi Commerciali</td>
            {financialData.map((d, i) => <td key={i}>{formatCurrency(d.commercial)}</td>)}
          </tr>
          <tr>
            <td>Costi Manutenzione/Ricambi</td>
            {financialData.map((d, i) => <td key={i}>{formatCurrency(d.maintenance)}</td>)}
          </tr>
          <tr>
            <td>Assicurazioni/Cert. Annue</td>
            {financialData.map((d, i) => <td key={i}>{formatCurrency(d.insurance)}</td>)}
          </tr>
          <tr>
            <td>CAPEX Iniziale</td>
            {financialData.map((d, i) => <td key={i}>{d.capex !== 0 ? formatCurrency(d.capex) : '-'}</td>)}
          </tr>
          <tr className="highlight-dark">
            <td><strong>Risultato Operativo (EBIT)</strong></td>
            {financialData.map((d, i) => <td key={i}><strong>{formatCurrency(d.ebit)}</strong></td>)}
          </tr>
          <tr>
            <td>% EBIT Margin</td>
            {financialData.map((d, i) => <td key={i}>{((d.ebit / d.revenue) * 100).toFixed(1)}%</td>)}
          </tr>
        </tbody>
      </table>

      <hr />

      <h3>7. Riepilogo KPI Target</h3>
      <table className="doc-table">
        <tbody>
          <tr><td>Fatturato Target Anno 5</td><td>{formatCurrency(kpis.targetRevenueY5)}</td></tr>
          <tr><td><strong>Costo Spedizione/Ritiro</strong></td><td><strong>{formatCurrency(config.costLogistics)} fissi</strong></td></tr>
          <tr><td>Investimento Iniziale (CAPEX Totale)</td><td>{formatCurrency(kpis.cCapex)}</td></tr>
          <tr><td>Costo Personale Annuo Unitario (Anno 1)</td><td>{formatCurrency(config.personnelCost)}/anno (inflazione {config.personnelInflation}%)</td></tr>
          <tr><td>Costi Commerciali / Provvigioni</td><td>{config.commercialPercent}% del Fatturato</td></tr>
          <tr><td>Costi Manutenzione / Ricambi</td><td>{config.maintenancePercent}% del Fatturato</td></tr>
          <tr><td>Costo Unitario Produzione (Device)</td><td>{formatCurrency(kpis.cProd)}</td></tr>
          <tr><td>Apparecchi in Flotta Noleggio (Anno 5)</td><td>{Math.round(kpis.finalFleet)} unità</td></tr>
          <tr className="highlight"><td><strong>EBIT Totale (Cumulato 5 Anni)</strong></td><td><strong>{formatCurrency(kpis.totalEbit)}</strong></td></tr>
        </tbody>
      </table>
    </div>
  );
}
