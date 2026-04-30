import { useMemo, useState } from "react";
import NumericInput from "./utilitys/NumericInput";
import useDebounce from "./utilitys/useDebounce";

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

type amorRow = {
  month?: number;
  year?: number;
  principal: number;
  interest: number;
  extraPayment: number;
  remainingBalance: number;
};
type AmortResult = {
  rows: amorRow[];
  intrestPaid?: number;
  intrestSaved?: number;
  error?: string;
};

type mortgageInfo = {
  loanAmt: number;
  rateNum: number;
  yearsNum: number;
  baseMonthlyPmt: number;
};

export default function AmortizationTable(props: mortgageInfo) {
  const { loanAmt, rateNum, yearsNum, baseMonthlyPmt } = props;
  const [viewMode, setViewMode] = useState<"monthly" | "yearly">("monthly");
  const [extraYearlyPayment, setExtraYearlyPayment] = useState<string>("0");
  const dextraYearlyPayment = useDebounce(extraYearlyPayment);

  const tableData: AmortResult = useMemo(() => {
    const schedule: amorRow[] = [];
    if (
      loanAmt <= 0 ||
      yearsNum <= 0 ||
      rateNum < 0 ||
      baseMonthlyPmt <= 0
    ) {
      return { rows: schedule, error: "Invalid loan inputs" };
    }
    const annualRate = rateNum / 100 / 12;
    const totalMonths = yearsNum * 12;
    const monthlyPmtCents = Math.round(baseMonthlyPmt * 100);
    let baselineBalance = Math.round(loanAmt * 100);
    let totalInterestBaselineCents = 0;

    for (let m = 1; m <= totalMonths; m++) {
      const interest = Math.round(baselineBalance * annualRate);
      totalInterestBaselineCents += interest;
      const principal = Math.min(monthlyPmtCents - interest, baselineBalance);
      baselineBalance -= principal;
      if (baselineBalance <= 0) break;
    }

    let remainingBalanceInCents = Math.round(loanAmt * 100);
    const monthlyPaymentInCents = Math.round(baseMonthlyPmt * 100);
    const extraYearlyPaymentInCents = Math.round(
      Number(dextraYearlyPayment) * 100
    );

    let cumulativeInterestInCents = 0;

    for (let i = 1; i <= totalMonths; i++) {
      const interestForMonthInCents = Math.round(
        remainingBalanceInCents * annualRate
      );
      cumulativeInterestInCents += interestForMonthInCents;
      const regularPrincipalInCents =
        monthlyPaymentInCents - interestForMonthInCents;
      if (regularPrincipalInCents <= 0) {
        return {
          rows: schedule,
          error: "Payment too low to amortize this loan.",
        };
      }

      const extraForThisMonthInCents =
        i % 12 === 1 ? extraYearlyPaymentInCents : 0;
      const totalPrincipalInCents =
        regularPrincipalInCents + extraForThisMonthInCents;
      const actualPrincipalPaidInCents = Math.min(
        totalPrincipalInCents,
        remainingBalanceInCents
      );

      const extraActuallyApplied = Math.max(
        0,
        actualPrincipalPaidInCents - regularPrincipalInCents
      );
      remainingBalanceInCents -= actualPrincipalPaidInCents;

      schedule.push({
        month: i,
        principal:
          actualPrincipalPaidInCents / 100 - extraActuallyApplied / 100,
        interest: interestForMonthInCents / 100,
        extraPayment: extraActuallyApplied / 100,
        remainingBalance: Math.max(0, remainingBalanceInCents / 100),
      });
      if (remainingBalanceInCents <= 0) break;
    }

    const intrestSavedInCents =
      totalInterestBaselineCents - cumulativeInterestInCents;

    return {
      rows: schedule,
      intrestPaid: cumulativeInterestInCents / 100,
      intrestSaved: intrestSavedInCents / 100,
    };
  }, [loanAmt, rateNum, yearsNum, baseMonthlyPmt, dextraYearlyPayment]);

  const displayRows: amorRow[] = useMemo(() => {
    if (tableData.error || tableData.rows.length === 0) return [];

    if (viewMode === "monthly") return tableData.rows;
    const yearlySchedule: amorRow[] = [];
    for (let i = 0; i < tableData.rows.length; i += 12) {
      const yearSlice = tableData.rows.slice(i, i + 12);
      if (yearSlice.length === 0) break;
      const lastMonthInSlice = yearSlice[yearSlice.length - 1];

      const yearNumber = Math.floor(i / 12) + 1;
      const yearlyPrincipal = yearSlice.reduce((sum, row) => sum + row.principal, 0);
      const yearlyInterest = yearSlice.reduce((sum, row) => sum + row.interest, 0);
      const yearlyBalance = lastMonthInSlice.remainingBalance;
      yearlySchedule.push({
        year: yearNumber,
        principal: yearlyPrincipal,
        interest: yearlyInterest,
        extraPayment: yearSlice[0].extraPayment,
        remainingBalance: yearlyBalance,
      });
    }
    return yearlySchedule;
  }, [viewMode, tableData.rows, tableData.error]);

  return (
    <section className="amort card">
      <div className="amort__toolbar">
        <h3>
          Schedule by {viewMode === "monthly" ? "month" : "year"}
        </h3>
        <div
          className="segmented"
          role="group"
          aria-label="Amortization view"
        >
          <button
            type="button"
            className={viewMode === "monthly" ? "is-selected" : ""}
            onClick={() => setViewMode("monthly")}
          >
            Monthly
          </button>
          <button
            type="button"
            className={viewMode === "yearly" ? "is-selected" : ""}
            onClick={() => setViewMode("yearly")}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="amort-extra">
        <label className="field">
          <span className="field__label">Extra payment (once per year)</span>
          <NumericInput
            value={extraYearlyPayment}
            onChange={setExtraYearlyPayment}
            prefix="$"
          />
        </label>
      </div>

      {!tableData.error && (
        <div className="amort-metrics">
          <p>
            <span>Estimated interest paid</span>
            <strong>{fmt.format(tableData.intrestPaid ?? 0)}</strong>
          </p>
          <p>
            <span>Interest difference vs baseline (extras)</span>
            <strong>{fmt.format(tableData.intrestSaved ?? 0)}</strong>
          </p>
        </div>
      )}

      <div className="table-shell">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">
                {viewMode === "monthly" ? "Month" : "Year"}
              </th>
              <th scope="col">Principal</th>
              <th scope="col">Interest</th>
              <th scope="col">Balance</th>
            </tr>
          </thead>
          <tbody>
            {tableData.error && (
              <tr className="row-message">
                <td colSpan={4}>{tableData.error}</td>
              </tr>
            )}

            {!tableData.error && displayRows.length === 0 && (
              <tr className="row-message">
                <td colSpan={4}>No amortization data.</td>
              </tr>
            )}

            {displayRows.map((row) => (
              <tr
                key={viewMode === "monthly" ? "m" + row.month : "y" + row.year}
              >
                <td>{viewMode === "monthly" ? row.month : row.year}</td>
                <td>
                  {fmt.format(row.principal)}
                  {row.extraPayment > 0 && (
                    <small className="cell-note">
                      +{fmt.format(row.extraPayment)} extra this period
                    </small>
                  )}
                </td>
                <td>{fmt.format(row.interest)}</td>
                <td>{fmt.format(row.remainingBalance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
