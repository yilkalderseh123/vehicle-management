import axios from "axios";

const API_URL = "http://localhost:5000/api/vehicles";

export const getVehicles = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addVehicle = async (vehicle) => {
  const response = await axios.post(API_URL, vehicle);
  return response.data;
};

export const updateVehicleStatus = async (id, status) => {
  const response = await axios.put(`${API_URL}/${id}`, { status });
  return response.data;
};

export const deleteVehicle = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
