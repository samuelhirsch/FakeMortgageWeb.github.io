import { useCallback, useEffect, useMemo, useState, type TransitionEvent } from "react";
import { Link } from "react-router";

const AUTO_MS = 6000;

export default function Home() {
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fn = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  const baseSlides = useMemo(
    () => [
      {
        id: "intro",
        content: (
          <div className="home-slide home-slide--intro">
            <p className="home-hero__eyebrow home-animate">
              Trusted experience • Real relationships • Zero guesswork
            </p>
            <h1 className="home-hero__title home-animate home-animate--2">
              Just <span className="home-hero__accent">Sign</span>
            </h1>
            <p className="home-hero__slogan home-animate home-animate--3">
              Where getting a mortgage is part of the fun.
            </p>
            <p className="home-hero__lede home-animate home-animate--4">
              Clear answers, calm pacing, and a seasoned team beside you from pre-approval to keys in hand.
            </p>
            <div className="home-hero__cta home-animate home-animate--5">
              <Link className="btn btn--large" to="/Calculator">
                Estimate your payment
              </Link>
              <Link className="btn btn--secondary btn--large" to="/ContactUs">
                Contact us
              </Link>
            </div>
          </div>
        ),
      },
      {
        id: "trust",
        content: (
          <div className="home-slide home-slide--trust">
            <h2 className="home-slide__title home-animate">Built on years of trust</h2>
            <p className="home-slide__intro home-animate home-animate--2">
              Borrowers come back—and send friends—because we treat every file like it matters.
            </p>
            <ul
              className="home-proof home-animate home-animate--3"
              aria-label="Why borrowers choose The Hirsch Team"
            >
              <li className="home-proof__item">
                <strong>Deep experience.</strong> Years guiding purchases and refinances through the
                messy moments, with steady communication the whole way.
              </li>
              <li className="home-proof__item">
                <strong>Trust that compounds.</strong> Referrals and repeat clients fuel our shop
                because people remember candor and follow-through long after closing.
              </li>
            </ul>
          </div>
        ),
      },
      {
        id: "vision",
        content: (
          <div className="home-slide home-slide--vision">
            <p className="home-hero__eyebrow home-animate">Closer to closing</p>
            <h2 className="home-slide__title home-animate home-animate--2">
              Every milestone, explained in plain English
            </h2>
            <p className="home-slide__intro home-animate home-animate--3">
              You will always know what is next, what it costs, and why it matters—no jargon wall.
            </p>
            <ul className="home-proof home-animate home-animate--4">
              <li className="home-proof__item">
                <strong>Step-by-step updates.</strong> Clear next actions and realistic timelines.
              </li>
              <li className="home-proof__item">
                <strong>Calm problem solving.</strong> If something changes, we explain options fast.
              </li>
            </ul>
          </div>
        ),
      },
      {
        id: "cta",
        content: (
          <div className="home-slide home-slide--outro">
            <h2 className="home-slide__title home-animate">Ready when you are</h2>
            <p className="home-hero__slogan home-animate home-animate--2">
              Where getting a mortgage is part of the fun.
            </p>
            <p className="home-slide__intro home-animate home-animate--3">
              Run the numbers, book a quick call, or both—we will meet you where you are.
            </p>
            <div className="home-hero__cta home-animate home-animate--5">
              <Link className="btn btn--large" to="/Calculator">
                Estimate your payment
              </Link>
              <Link className="btn btn--secondary btn--large" to="/ContactUs">
                Contact us
              </Link>
            </div>
          </div>
        ),
      },
    ],
    []
  );

  const slides = useMemo(
    () =>
      reducedMotion
        ? baseSlides
        : [...baseSlides, { ...baseSlides[0], id: `${baseSlides[0].id}-clone` }],
    [baseSlides, reducedMotion]
  );
  const count = baseSlides.length;
  const [instantJump, setInstantJump] = useState(false);

  const goNext = useCallback(() => {
    setIndex((i) => (reducedMotion ? (i + 1) % count : i + 1));
  }, [count, reducedMotion]);

  useEffect(() => {
    const t = window.setInterval(goNext, AUTO_MS);
    return () => window.clearInterval(t);
  }, [goNext]);

  // Safety net: if transitionend is ever skipped, recover cleanly.
  useEffect(() => {
    if (reducedMotion) return;
    if (index <= count) return;
    setInstantJump(true);
    setIndex(0);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setInstantJump(false));
    });
  }, [count, index, reducedMotion]);

  const handleTrackTransitionEnd = useCallback((e: TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.propertyName !== "transform") return;
    if (reducedMotion || index !== count) return;
    setInstantJump(true);
    setIndex(0);
    // Let the no-transition jump apply, then restore transitions.
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setInstantJump(false));
    });
  }, [count, index]);

  const pct = 100 / slides.length;
  const transitionMs = reducedMotion || instantJump ? 0 : 580;

  return (
    <section className="home-carousel" aria-label="Featured highlights">
      <div className="home-carousel__viewport" aria-live="polite">
        <div
          className="home-carousel__track"
          onTransitionEnd={handleTrackTransitionEnd}
          style={{
            width: `${slides.length * 100}%`,
            transform: `translate3d(-${index * pct}%, 0, 0)`,
            transition: `transform ${transitionMs}ms cubic-bezier(0.33, 1, 0.68, 1)`,
          }}
        >
          {slides.map((slide, i) => (
            <article
              key={slide.id}
              className="home-carousel__slide"
              style={{ flex: `0 0 ${pct}%` }}
              aria-hidden={i !== index}
              id={`home-slide-${slide.id}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${Math.min(i + 1, count)} of ${count}`}
            >
              <div
                className={`home-hero home-slide-shell ${i === index ? "is-active-slide" : ""
                  }`}
              >
                {slide.content}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
