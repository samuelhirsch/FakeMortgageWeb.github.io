/** Replace with your real office details */
const CONTACT = {
  company: "The Hirsch Team",
  street: "Your street address",
  cityLine: "City, ST ZIP",
  /** What callers see on the page */
  businessPhone: "(555) 000-0000",
  /** Same number for the link: international form (+1…) so phones/apps can dial correctly */
  businessTel: "+15550000000",
  hoursWeekdays: "Monday–Friday: 9:00 a.m. – 5:00 p.m.",
  hoursWeekend: "Saturday: By appointment · Sunday: Closed",
};

export default function ContactUs() {
  const calendarUrl =
    "https://calendar.google.com/calendar/appointments/schedules/AcZssZ1vwSf2l-kcFCig_lrmSWx5nL4O5Ihu5hzOIwWmdMpM1EBTBeYDvyoLARhv4Ym6WEh_Psj2K7-N?gv=true";

  return (
    <div className="page contact">
      <header className="page__header">
        <h1>Contact us</h1>
        <p className="page__lede">
          Reach our team anytime—or book a dedicated time slot that fits your calendar.
        </p>
      </header>

      <div className="contact__grid">
        <section className="card contact__info" aria-labelledby="contact-info-heading">
          <h2 id="contact-info-heading">Office &amp; hours</h2>
          <dl className="contact__dl">
            <div className="contact__row">
              <dt>Address</dt>
              <dd>
                <address className="contact__address">
                  {CONTACT.company}
                  <br />
                  {CONTACT.street}
                  <br />
                  {CONTACT.cityLine}
                </address>
              </dd>
            </div>
            <div className="contact__row">
              <dt>Business phone</dt>
              <dd>
                {/* tel: opens the dialer on phones / click-to-call in many browsers */}
                <a href={`tel:${CONTACT.businessTel}`}>{CONTACT.businessPhone}</a>
              </dd>
            </div>
            <div className="contact__row">
              <dt>Business hours</dt>
              <dd>
                <p className="contact__hours">{CONTACT.hoursWeekdays}</p>
                <p className="contact__hours">{CONTACT.hoursWeekend}</p>
              </dd>
            </div>
          </dl>
        </section>

        <section className="card contact__schedule" aria-labelledby="schedule-heading">
          <h2 id="schedule-heading">Schedule a meeting</h2>
          <p className="contact__schedule-lede">
            Pick an open slot in our Google Calendar. You can embed below or open the scheduler in a new tab.
          </p>
          <iframe
            className="booking__frame contact__calendar-frame"
            title="Google Calendar appointment scheduler"
            src={calendarUrl}
          />
          <div className="booking__actions">
            <a className="btn" href={calendarUrl} target="_blank" rel="noreferrer">
              Open Google Calendar scheduler
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
