import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "../componentes/Layouts/DashboardLayout.jsx";
import { HomePage } from "../componentes/Pages/HomePage.jsx";
import { UsuariosPage } from "../componentes/Pages/UsuariosPage.jsx";
import { ProductosPage } from "../componentes/Pages/ProductosPage.jsx";
import { ConfiguracionPage } from "../componentes/Pages/ConfiguracionPage.jsx";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="/productos" element={<ProductosPage />} />
          <Route path="/configuracion" element={<ConfiguracionPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
