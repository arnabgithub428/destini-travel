
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Page/Home";
import PassengerDetails from "./Page/PassengerDetails";

function App() {
    return (
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/passenger-details"
                    element={<PassengerDetails />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
