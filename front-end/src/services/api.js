import axios from "axios";

const api = axios.create({
  baseURL: `http://${window.location.hostname}:5000`,
});

export const getData = async (page = 1, perPage = 100, filters = {}) => {
  try {
    // Convertir los filtros en parámetros de consulta
    const params = new URLSearchParams({
      page: page,
      per_page: perPage,
      ...filters,
    });

    const response = await api.get(`/data?${params}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const deleteRecord = async (id) => {
  try {
    await api.delete(`/data/${id}`);
  } catch (error) {
    console.error("Error deleting record:", error);
    throw error;
  }
};

export const updateItem = async (folioPedido, data) => {
  try {
    const updateData = {
      CANTIDADPEDIDA: data.cantidadPedida,
      PZVERIFICADA: data.cantidadVerificada,
      EXISTENCIA: data.existencia,
      LOCALIZACION: data.localizacion,
    };

    const response = await api.put(`/data/${folioPedido}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
};

export const createRecord = async (data) => {
  try {
    await api.post("/data", data);
  } catch (error) {
    console.error("Error creating record:", error);
    throw error;
  }
};
