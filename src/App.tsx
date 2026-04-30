import { BrowserRouter, Routes, Route } from 'react-router'
import Home from './home'
import Header from './header'
import ContactUs from './contactUs'
import AboutUs from './aboutUs'
import MortgageCalculator from './calculator'
import Charts from './charts'
function App() {
    return (
        <div className="app-root">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Header />}>
                        <Route index element={<Home />} />
                        <Route path="/ContactUs" element={<ContactUs />} />
                        <Route path="/AboutUs" element={<AboutUs />} />
                        <Route path="/Calculator" element={<MortgageCalculator />} />
                        <Route path="/Rates" element={<Charts />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App
