import { Suspense } from "react";
import { Outlet } from "@tanstack/react-router";

function DefaultLayout() {
  return (
    <main className="flex relative">
      <Suspense fallback={<p>Carregando...</p>}>
        <Outlet />
      </Suspense>
    </main>
  );
}

export default DefaultLayout;
