import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Header } from "./nav/header";
import { Landing } from "./pages/landing/landing";

export function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Header />}>
                    <Route path="/" element={<Landing />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
