import { useLocation, Link } from "react-router-dom";

const labels = {
  "/": "Inicio",
  "/usuarios": "Usuarios",
  "/productos": "Productos",
  "/configuracion": "Configuracion",
};

export const Breadcrumb = () => {
  const { pathname } = useLocation();
  const current = labels[pathname] || "Pagina";

  return (
    <nav className="text-sm text-gray-500 mb-6">
      <Link to="/" className="hover:text-teal-600">
        Dashboard
      </Link>
      {pathname !== "/" && (
        <>
          <span className="mx-2">/</span>
          <span className="text-teal-600 font-semibold">{current}</span>
        </>
      )}
    </nav>
  );
};
