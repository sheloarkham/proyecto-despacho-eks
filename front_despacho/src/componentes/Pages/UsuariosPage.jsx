const usuarios = [
  { id: 1, nombre: "María González", email: "maria.gonzalez@duoc.cl", rol: "Administrador", estado: "Activo" },
  { id: 2, nombre: "Carlos Ruiz", email: "carlos.ruiz@duoc.cl", rol: "Operador", estado: "Activo" },
  { id: 3, nombre: "Ana Torres", email: "ana.torres@duoc.cl", rol: "Operador", estado: "Activo" },
  { id: 4, nombre: "Luis Pérez", email: "luis.perez@duoc.cl", rol: "Supervisor", estado: "Inactivo" },
];

export const UsuariosPage = () => {
  return (
    <section>
      <h1 className="text-3xl font-bold text-teal-600 mb-2">Gestión de Usuarios</h1>
      <p className="text-gray-600 mb-8">Administra los usuarios con acceso al sistema de despachos.</p>

      <div className="bg-white border border-gray-200 rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Buscar usuario..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-80"
          />
          <button className="bg-teal-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-teal-700">
            + Nuevo usuario
          </button>
        </div>

        <table className="w-full text-center">
          <thead>
            <tr className="border-b">
              <th className="py-4 px-4">ID</th>
              <th className="py-4 px-4">Nombre</th>
              <th className="py-4 px-4">Email</th>
              <th className="py-4 px-4">Rol</th>
              <th className="py-4 px-4">Estado</th>
              <th className="py-4 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-4">{user.id}</td>
                <td className="py-4">{user.nombre}</td>
                <td className="py-4">{user.email}</td>
                <td className="py-4">
                  <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm">
                    {user.rol}
                  </span>
                </td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${user.estado === "Activo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {user.estado}
                  </span>
                </td>
                <td className="py-4">
                  <button className="text-teal-600 font-bold mr-3">Editar</button>
                  <button className="text-red-500 font-bold">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
