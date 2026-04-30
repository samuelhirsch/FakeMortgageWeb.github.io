import { Routes, Route, BrowserRouter } from "react-router";
import Home from "./home";
import ContactUs from "./contactUs";
import AboutUs from "./aboutUs";
import Rates from "./charts";
import Calculator from "./calculator";
import Header from "./header";

/** Match Vite base (e.g. "/" or "/FakeMortgageWeb/"); BrowserRouter basename must not end with `/` */
const routerBasename =
  import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Home />} />
          <Route path="ContactUs" element={<ContactUs />} />
          <Route path="AboutUs" element={<AboutUs />} />
          <Route path="Calculator" element={<Calculator />} />
          <Route path="Rates" element={<Rates />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
