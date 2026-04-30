import { useEffect, useState } from 'react'

export default function Charts() {
  const [thirtyYearRate, setThirtyYearRate] = useState({
    rate: "",
    date: "",
    loading: true,
    error: false,
  });

  const [fifteenYearRate, setFifteenYearRate] = useState({
    rate: "",
    date: "",
    loading: true,
    error: false,
  });

  useEffect(() => {
    async function fetchRate(
      years: string,
      setRate: (val: {
        rate: string
        date: string
        loading: boolean
        error: boolean
      }) => void
    ) {
      try {
        const response = await fetch(
          `http://localhost:3001/mortgage-rate?years=${years}`
        );
        if (!response.ok) {
          return setRate({ rate: "", date: "", loading: false, error: true });
        }
        const data = await response.json();
        setRate({
          rate: data.observations[0].value,
          date: data.observations[0].date,
          loading: false,
          error: false,
        });
      } catch (e) {
        if (e instanceof Error) {
          setRate({ rate: "", date: "", loading: false, error: true });
        }
      }
    }
    fetchRate("30", setThirtyYearRate);
    fetchRate("15", setFifteenYearRate);
  }, []);

  const renderRateCard = (
    title: string,
    data: { rate: string; date: string; loading: boolean; error: boolean }
  ) => {
    const stateClass = data.error
      ? "rate-card--error"
      : data.loading
        ? "rate-card--loading"
        : "";

    return (
      <article className={`card rate-card ${stateClass}`}>
        <h2>{title}</h2>
        {data.error ? (
          <p className="rate-muted">We couldn&apos;t load this rate. Try again in a moment.</p>
        ) : data.loading ? (
          <p className="rate-muted">Loading…</p>
        ) : (
          <>
            <p className="rate-display">{data.rate}%</p>
            <p className="rate-muted">As of {data.date}</p>
          </>
        )}
      </article>
    );
  };

  return (
    <div className="page rates">
      <header className="page__header">
        <h1>Sample mortgage rates</h1>
        <p className="page__lede">
          Pulled for quick context—your exact rate depends on credit, property, and timing. Use these as a starting point in the calculator.
        </p>
      </header>
      <div className="rates__grid">
        {renderRateCard("30-year fixed", thirtyYearRate)}
        {renderRateCard("15-year fixed", fifteenYearRate)}
      </div>
    </div>
  );
}
