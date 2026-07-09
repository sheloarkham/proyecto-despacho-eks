const productos = [
  { id: 101, nombre: "Teclado Mecánico RGB", categoria: "Periféricos", precio: 45990, stock: 120 },
  { id: 102, nombre: "Mouse Gamer Pro", categoria: "Periféricos", precio: 29990, stock: 85 },
  { id: 103, nombre: "Monitor 27'' 4K", categoria: "Monitores", precio: 189990, stock: 32 },
  { id: 104, nombre: "Audífonos Bluetooth", categoria: "Audio", precio: 34990, stock: 64 },
  { id: 105, nombre: "Webcam HD 1080p", categoria: "Accesorios", precio: 24990, stock: 48 },
];

export const ProductosPage = () => {
  return (
    <section>
      <h1 className="text-3xl font-bold text-teal-600 mb-2">Catálogo de Productos</h1>
      <p className="text-gray-600 mb-8">Productos disponibles para órdenes de compra y despacho.</p>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white border rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 text-sm">Total productos</p>
          <p className="text-3xl font-bold text-teal-600">5</p>
        </div>
        <div className="bg-white border rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 text-sm">En stock</p>
          <p className="text-3xl font-bold text-green-600">349</p>
        </div>
        <div className="bg-white border rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 text-sm">Categorías</p>
          <p className="text-3xl font-bold text-orange-500">4</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Listado de productos</h2>
          <button className="bg-teal-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-teal-700">
            + Agregar producto
          </button>
        </div>

        <table className="w-full text-center">
          <thead>
            <tr className="border-b">
              <th className="py-4 px-4">ID</th>
              <th className="py-4 px-4">Nombre</th>
              <th className="py-4 px-4">Categoría</th>
              <th className="py-4 px-4">Precio</th>
              <th className="py-4 px-4">Stock</th>
              <th className="py-4 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((prod) => (
              <tr key={prod.id} className="border-b hover:bg-gray-50">
                <td className="py-4">{prod.id}</td>
                <td className="py-4 font-semibold">{prod.nombre}</td>
                <td className="py-4">{prod.categoria}</td>
                <td className="py-4">${prod.precio.toLocaleString("es-CL")}</td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${prod.stock > 50 ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                    {prod.stock} uds
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
