import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";

const Admin = lazy(() => import("./pages/Admin"));

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/admin"
          element={
            <Suspense
              fallback={
                <main className="flex min-h-screen items-center justify-center bg-[#0B1120] text-slate-300">
                  Cargando configuración...
                </main>
              }
            >
              <Admin />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
