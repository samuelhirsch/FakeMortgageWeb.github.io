import { useState } from 'react'
import { Link } from 'react-router'
import AmortizationTable from './amortizationTable';

import NumericInput from './utilitys/NumericInput';
import useDebounce from "./utilitys/useDebounce";

function monthlyPayment(P: number, annualRate: number, years: number) {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (!P || !n) return 0;
  if (r === 0) return P / n;
  return (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}
const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function MortgageCalculator() {
  const [price, setPrice] = useState("500000");
  const [downPmt, setDownPmt] = useState("20");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("30");
  const [tax, setTax] = useState("6000");
  const [showTable, setShowTable] = useState(false);
  const [TypeForDpmt, setTypeForDpmt] = useState("%");

  const dPrice = useDebounce(price);
  const dDownPmt = useDebounce(downPmt);
  const dRate = useDebounce(rate);
  const dTax = useDebounce(tax);

  const priceNum = Number(dPrice);
  const downPmtNum = Number(dDownPmt);
  const rateNum = Number(dRate);
  const yearsNum = Number(years);

  const finalDownPmt = TypeForDpmt === "%" ? (priceNum * downPmtNum) / 100 : downPmtNum

  const loanAmt = priceNum - finalDownPmt > 0 ? priceNum - finalDownPmt : 0;
  const baseMonthlyPmt = monthlyPayment(loanAmt, rateNum, yearsNum);
  const monthlyTax = Number(dTax) / 12;
  const totalMonthlyPmt = baseMonthlyPmt + monthlyTax;


  return (
    <div className="page calculator">
      <header className="page__header">
        <h1>Mortgage calculator</h1>
        <p className="page__lede">
          Adjust the numbers to see an estimated payment. Property tax is spread monthly; check current market rates on the Rates page.
        </p>
      </header>

      <div className="calculator__grid">
        <div className="card calculator__form">
          <div className="field-group">
            <label className="field">
              <span className="field__label">Home price</span>
              <NumericInput
                value={price}
                onChange={setPrice}
                prefix="$"
              />
            </label>

            <div className="field">
              <span className="field__label" id="down-label">Down payment</span>
              <div className="field__row">
                <NumericInput
                  className="num-input field__grow"
                  value={downPmt}
                  onChange={setDownPmt}
                  prefix={TypeForDpmt === "$" ? "$" : ""}
                  suffix={TypeForDpmt === "%" ? "%" : ""}
                  aria-labelledby="down-label"
                />
                <div className="segmented" role="group" aria-label="Down payment type">
                  <button
                    type="button"
                    className={TypeForDpmt === "%" ? "is-selected" : ""}
                    onClick={() => setTypeForDpmt("%")}
                  >
                    %
                  </button>
                  <button
                    type="button"
                    className={TypeForDpmt === "$" ? "is-selected" : ""}
                    onClick={() => setTypeForDpmt("$")}
                  >
                    $
                  </button>
                </div>
              </div>
            </div>

            <label className="field">
              <span className="field__label">Annual property tax</span>
              <NumericInput
                value={tax}
                onChange={setTax}
                prefix="$"
              />
            </label>

            <label className="field">
              <span className="field__label">
                Interest rate (%) — <Link to="/Rates">view sample rates</Link>
              </span>
              <NumericInput
                value={rate}
                onChange={setRate}
                suffix="%"
              />
            </label>

            <div className="field">
              <span className="field__label" id="term-label">Loan term (years)</span>
              <div className="segmented" role="group" aria-labelledby="term-label">
                <button
                  type="button"
                  className={years === "10" ? "is-selected" : ""}
                  onClick={() => setYears("10")}
                >
                  10
                </button>
                <button
                  type="button"
                  className={years === "15" ? "is-selected" : ""}
                  onClick={() => setYears("15")}
                >
                  15
                </button>
                <button
                  type="button"
                  className={years === "30" ? "is-selected" : ""}
                  onClick={() => setYears("30")}
                >
                  30
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside className="card calculator__summary" aria-label="Payment summary">
          <div className="summary-line">
            <span>Down payment</span>
            <strong>{fmt.format(finalDownPmt)}</strong>
          </div>
          <div className="summary-line">
            <span>Loan amount</span>
            <strong>{fmt.format(loanAmt)}</strong>
          </div>
          <div className="summary-line">
            <span>Mortgage (est.)</span>
            <strong>{fmt.format(baseMonthlyPmt)}</strong>
          </div>
          <div className="summary-line">
            <span>Property tax / mo</span>
            <strong>{fmt.format(monthlyTax)}</strong>
          </div>
          <div className="summary-total summary-line">
            <span>Estimated total / mo</span>
            <strong>{fmt.format(totalMonthlyPmt)}</strong>
          </div>

          <div className="summary-actions">
            <button
              type="button"
              className="btn"
              onClick={() => setShowTable(!showTable)}
            >
              {showTable ? "Hide amortization schedule" : "Show amortization schedule"}
            </button>
          </div>
        </aside>
      </div>

      {showTable && (
        <AmortizationTable
          loanAmt={loanAmt}
          rateNum={rateNum}
          yearsNum={yearsNum}
          baseMonthlyPmt={baseMonthlyPmt}
        />
      )}
    </div>
  )

}
