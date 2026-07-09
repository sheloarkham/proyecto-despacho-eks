import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `block font-bold py-2 px-3 rounded transition-colors ${
    isActive ? "bg-teal-800 text-white" : "hover:bg-teal-700"
  }`;

function Navbar() {
  return (
    <nav className="rounded-xl w-[250px] min-h-[880px] bg-teal-600 text-white sticky top-0 p-4 m-4">
      <h2 className="text-xl font-bold mb-8">Despacho Dashboard</h2>
      <p className="text-teal-200 text-sm mb-6">Rama: develop</p>

      <ul className="space-y-3">
        <li>
          <NavLink to="/" end className={linkClass}>
            Inicio
          </NavLink>
        </li>
        <li>
          <NavLink to="/usuarios" className={linkClass}>
            Usuarios
          </NavLink>
        </li>
        <li>
          <NavLink to="/productos" className={linkClass}>
            Productos
          </NavLink>
        </li>
        <li>
          <NavLink to="/configuracion" className={linkClass}>
            Configuración
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
