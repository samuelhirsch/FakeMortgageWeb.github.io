import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import AmortizationTable from './amortizationTable';

import NumericInput from './utilitys/NumericInput';
import useDebounce from './utilitys/useDebounce';

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

const EMPTY_DASH = "—";

export default function MortgageCalculator() {
  const [price, setPrice] = useState("");
  const [downPmt, setDownPmt] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("30");
  const [tax, setTax] = useState("");
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

  const inputsReady =
    dPrice.trim() !== "" &&
    dRate.trim() !== "";
    

  const finalDownPmt = TypeForDpmt === "%" ? (priceNum * downPmtNum) / 100 : downPmtNum

  const downPaymentInvalid =
    inputsReady &&
    priceNum > 0 &&
    finalDownPmt > priceNum;

  const summaryReady = inputsReady && !downPaymentInvalid;

  const loanAmt = priceNum - finalDownPmt > 0 ? priceNum - finalDownPmt : 0;
  const baseMonthlyPmt = monthlyPayment(loanAmt, rateNum, yearsNum);
  const monthlyTax = Number(dTax) / 12;
  const totalMonthlyPmt = baseMonthlyPmt + monthlyTax;
  const tableVisible = showTable && summaryReady;

  const dismissScheduleIfOpen = useCallback(() => {
    setShowTable((open) => (open ? false : open));
  }, []);

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
                onChange={(v) => {
                  dismissScheduleIfOpen();
                  setPrice(v);
                }}
                prefix="$"
                placeholder="500,000"
              />
            </label>

            <div className="field">
              <span className="field__label" id="down-label">Down payment</span>
              <div className="field__row field__row--dp">
                <NumericInput
                  className="num-input field__grow"
                  value={downPmt}
                  onChange={(v) => {
                    dismissScheduleIfOpen();
                    setDownPmt(v);
                  }}
                  prefix={TypeForDpmt === "$" ? "$" : ""}
                  suffix={TypeForDpmt === "%" ? "%" : ""}
                  aria-labelledby="down-label"
                  placeholder={TypeForDpmt === "%" ? "20" : "100,000"}
                />
                <div
                  className="segmented segmented--dp"
                  role="group"
                  aria-label="Down payment type"
                >
                  <button
                    type="button"
                    className={TypeForDpmt === "%" ? "is-selected" : ""}
                    onClick={() => {
                      dismissScheduleIfOpen();
                      setTypeForDpmt("%");
                    }}
                  >
                    %
                  </button>
                  <button
                    type="button"
                    className={TypeForDpmt === "$" ? "is-selected" : ""}
                    onClick={() => {
                      dismissScheduleIfOpen();
                      setTypeForDpmt("$");
                    }}
                  >
                    $
                  </button>
                </div>
              </div>
              {downPaymentInvalid && (
                <p className="calc-hint calc-hint--warn" role="alert">
                  Down payment can't exceed the home price.
                </p>
              )}
            </div>

            <label className="field">
              <span className="field__label">Annual property tax</span>
              <NumericInput
                value={tax}
                onChange={(v) => {
                  dismissScheduleIfOpen();
                  setTax(v);
                }}
                prefix="$"
                placeholder="6,000"
              />
            </label>

            <label className="field">
              <span className="field__label">
                Interest rate (%) — <Link to="/Rates">view current avg. rates</Link>
              </span>
              <NumericInput
                value={rate}
                onChange={(v) => {
                  dismissScheduleIfOpen();
                  setRate(v);
                }}
                suffix="%"
                placeholder="6.5"
              />
            </label>

            <div className="field">
              <span className="field__label" id="term-label">Loan term (years)</span>
              <div
                className="segmented segmented--term"
                role="group"
                aria-labelledby="term-label"
              >
                <button
                  type="button"
                  className={years === "10" ? "is-selected" : ""}
                  onClick={() => {
                    dismissScheduleIfOpen();
                    setYears("10");
                  }}
                >
                  10
                </button>
                <button
                  type="button"
                  className={years === "15" ? "is-selected" : ""}
                  onClick={() => {
                    dismissScheduleIfOpen();
                    setYears("15");
                  }}
                >
                  15
                </button>
                <button
                  type="button"
                  className={years === "30" ? "is-selected" : ""}
                  onClick={() => {
                    dismissScheduleIfOpen();
                    setYears("30");
                  }}
                >
                  30
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside
          className="card calculator__summary"
          aria-labelledby="summary-heading"
        >
          <header className="summary__header">
            <h2 id="summary-heading" className="summary__title">
              Payment summary
            </h2>
          </header>

          <div className="summary__lines">
            <div className="summary-line">
              <span>Down payment</span>
              <strong>
                {summaryReady ? fmt.format(finalDownPmt) : EMPTY_DASH}
              </strong>
            </div>
            <div className="summary-line">
              <span>Loan amount</span>
              <strong>
                {summaryReady ? fmt.format(loanAmt) : EMPTY_DASH}
              </strong>
            </div>
            <div className="summary-line">
              <span>Mortgage (est.)</span>
              <strong>
                {summaryReady ? fmt.format(baseMonthlyPmt) : EMPTY_DASH}
              </strong>
            </div>
            <div className="summary-line">
              <span>Property tax / mo</span>
              <strong>
                {summaryReady ? fmt.format(monthlyTax) : EMPTY_DASH}
              </strong>
            </div>
          </div>

          <div className="summary-total" role="status" aria-live="polite">
            <span className="summary-total__label">Estimated total / month</span>
            <strong className="summary-total__amount">
              {summaryReady ? fmt.format(totalMonthlyPmt) : EMPTY_DASH}
            </strong>
          </div>

          <div className="summary-actions">
            <button
              type="button"
              className="btn"
              disabled={!summaryReady && !showTable}
              onClick={() => {
                if (showTable) setShowTable(false);
                else if (summaryReady) setShowTable(true);
              }}
              title={
                !showTable && !inputsReady
                  ? "Enter home price, rate, and loan term first"
                  : !showTable && downPaymentInvalid
                    ? "Down payment must be less than or equal to the home price"
                    : undefined
              }
            >
              {showTable
                ? "Hide amortization schedule"
                : "Show amortization schedule"}
            </button>
          </div>
        </aside>
      </div>

      {tableVisible && (
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
