export const DashboardStats = () => {
  const stats = [
    { label: "Ordenes de compra", value: "24", color: "text-teal-600" },
    { label: "Despachos activos", value: "12", color: "text-orange-500" },
    { label: "Entregas completadas", value: "89", color: "text-green-600" },
    { label: "Usuarios registrados", value: "4", color: "text-blue-600" },
  ];

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Resumen del sistema
      </h2>
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-gray-200 rounded-lg shadow p-5 text-center"
          >
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-gray-500 text-sm mt-2">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
