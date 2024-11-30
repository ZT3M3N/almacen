import { useEffect, useState } from "react";
import { getData, updateItem } from "../services/api";
import EditModal from "./EditModal";
import "../DataTable.css";

function DataTable() {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    folioPedido: "",
    codigoRelacionado: "",
    cantidadPedida: "",
    cantidadVerificada: "",
    descripcion_producto: "",
    codigoFamiliaUno: "",
    existencia: "",
    localizacion: "",
    descripcion_laboratorio: "",
    descripcion_clasificacion: "",
    descripcion_presentacion: ""
});

  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  const [editingItem, setEditingItem] = useState(null);

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  const handleSave = async (updatedItem) => {
    try {
      await updateItem(updatedItem.FOLIOPEDIDO, updatedItem);
      setEditingItem(null);
      // Recargar los datos
      fetchData(currentPage, debouncedFilters);
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar los cambios");
    }
  };

  // Efecto para manejar el debounce de los filtros
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 500); // Espera 500ms después de la última actualización

    return () => clearTimeout(timer);
  }, [filters]);

  // Efecto para cargar datos cuando cambian los filtros o la página
  useEffect(() => {
    fetchData(currentPage, debouncedFilters);
  }, [currentPage, debouncedFilters]);

  const fetchData = async (page, currentFilters) => {
    try {
      setLoading(true);
      // Solo enviar filtros que tengan valor
      const activeFilters = Object.entries(currentFilters).reduce(
        (acc, [key, value]) => {
          if (value) acc[key] = value;
          return acc;
        },
        {}
      );

      const response = await getData(page, 100, activeFilters);
      setItems(response.data);
      setTotalPages(response.pagination.total_pages);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (column, value) => {
    setFilters((prev) => ({
      ...prev,
      [column]: value,
    }));
    setCurrentPage(1); // Resetear a la primera página cuando se filtran datos
  };

  const clearFilters = () => {
    setFilters({
        folioPedido: "",
        codigoRelacionado: "",
        cantidadPedida: "",
        cantidadVerificada: "",
        descripcion_producto: "",
        codigoFamiliaUno: "",
        existencia: "",
        localizacion: "",
        descripcion_laboratorio: "",
        descripcion_clasificacion: "",
        descripcion_presentacion: ""
    });
    setCurrentPage(1);
};

  if (loading) {
    return <div className="loading">Cargando datos...</div>;
  }

  return (
    <div>
      <div className="filters-control">
        <button onClick={clearFilters} className="clear-filters-btn">
          Limpiar filtros
        </button>
      </div>
      <div className="table-container">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Folio Pedido</th>
              <th>Código Relacionado</th>
              <th>Cantidad Pedida</th>
              <th>Cantidad Verificada</th>
              <th>Producto</th>
              <th>Familia</th>
              <th>Existencia</th>
              <th>Localización</th>
              <th>Laboratorio</th>
              <th>Clasificación</th>
              <th>Presentación</th>
              <th></th>
            </tr>
            <tr>
              {Object.keys(filters).map((column) => (
                <th key={column}>
                  <input
                    type="text"
                    value={filters[column]}
                    onChange={(e) => handleFilterChange(column, e.target.value)}
                    placeholder={`Buscar...`}
                    className="filter-input"
                  />
                </th>
              ))}
              <th></th> {/* Celda vacía para acciones */}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.ROW_ID}>
                <td>{item.folioPedido}</td>
                <td>{item.codigoRelacionado}</td>
                <td>{item.cantidadPedida}</td>
                <td>{item.cantidadVerificada}</td>
                <td>{item.descripcion_producto}</td>
                <td>{item.codigoFamiliaUno}</td>
                <td>{item.existencia}</td>
                <td>{item.localizacion}</td>
                <td>{item.descripcion_laboratorio}</td>
                <td>{item.descripcion_clasificacion}</td>
                <td>{item.descripcion_presentacion}</td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(item)}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {editingItem && (
          <EditModal
            item={editingItem}
            onClose={() => setEditingItem(null)}
            onSave={handleSave}
          />
        )}
      </div>
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default DataTable;
