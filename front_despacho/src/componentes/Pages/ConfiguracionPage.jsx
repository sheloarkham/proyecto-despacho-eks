export const ConfiguracionPage = () => {
  return (
    <section>
      <h1 className="text-3xl font-bold text-teal-600 mb-2">Configuración del Sistema</h1>
      <p className="text-gray-600 mb-8">Parámetros generales de la plataforma de despachos.</p>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">General</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-bold mb-1">Nombre de la empresa</label>
              <input
                type="text"
                defaultValue="Despacho Express S.A."
                className="border border-gray-300 rounded-lg w-full p-2"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Email de contacto</label>
              <input
                type="email"
                defaultValue="contacto@despacho.cl"
                className="border border-gray-300 rounded-lg w-full p-2"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Zona horaria</label>
              <select className="border border-gray-300 rounded-lg w-full p-2">
                <option>America/Santiago (UTC-4)</option>
                <option>America/Bogota (UTC-5)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Despachos</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-bold mb-1">Máximo intentos de entrega</label>
              <input
                type="number"
                defaultValue="3"
                className="border border-gray-300 rounded-lg w-full p-2"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Notificaciones por email</label>
              <select className="border border-gray-300 rounded-lg w-full p-2">
                <option>Activadas</option>
                <option>Desactivadas</option>
              </select>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <label className="font-bold">Generar despacho automático al confirmar compra</label>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow p-6 col-span-2">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Conexión APIs</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-1">API Ventas</label>
              <input
                type="text"
                defaultValue="/api/v1/ventas"
                readOnly
                className="border border-gray-300 rounded-lg w-full p-2 bg-gray-50 text-gray-500"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">API Despachos</label>
              <input
                type="text"
                defaultValue="/api/v1/despachos"
                readOnly
                className="border border-gray-300 rounded-lg w-full p-2 bg-gray-50 text-gray-500"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Base de datos</label>
              <input
                type="text"
                defaultValue="Neon PostgreSQL (us-east-1)"
                readOnly
                className="border border-gray-300 rounded-lg w-full p-2 bg-gray-50 text-gray-500"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Entorno</label>
              <input
                type="text"
                defaultValue="EKS Fargate - devopseks"
                readOnly
                className="border border-gray-300 rounded-lg w-full p-2 bg-gray-50 text-gray-500"
              />
            </div>
          </div>
          <button className="mt-6 bg-teal-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-teal-700">
            Guardar configuración
          </button>
        </div>
      </div>
    </section>
  );
};
