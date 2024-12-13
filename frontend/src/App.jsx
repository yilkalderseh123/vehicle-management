import { useEffect, useState } from "react";
import {
  getVehicles,
  addVehicle,
  updateVehicleStatus,
  deleteVehicle,
} from "./api";

const App = () => {
  const [vehicles, setVehicles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [modalData, setModalData] = useState({});

  useEffect(() => {
    const fetchVehicles = async () => {
      const data = await getVehicles();
      setVehicles(data);
    };
    fetchVehicles();
  }, []);

  const openModal = (type, data = {}) => {
    setModalType(type);
    setModalData(data);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalData({});
  };

  const handleAddVehicle = async (name) => {
    const newVehicle = await addVehicle({ name });
    setVehicles([...vehicles, newVehicle]);
    closeModal();
  };

  const handleUpdateStatus = async (id, status) => {
    const updatedVehicle = await updateVehicleStatus(id, status);
    setVehicles(vehicles.map((v) => (v._id === id ? updatedVehicle : v)));
    closeModal();
  };

  const handleDeleteVehicle = async (id) => {
    await deleteVehicle(id);
    setVehicles(vehicles.filter((v) => v._id !== id));
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 via-white to-blue-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 drop-shadow-md">
        Vehicle Management Dashboard
      </h1>

      <div className="flex justify-center mb-6">
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transform transition-transform duration-200 hover:scale-105"
          onClick={() => openModal("add")}
        >
          Add Vehicle
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg rounded-lg">
          <thead>
            <tr className="bg-blue-100">
              <th className="border border-gray-300 px-6 py-3 text-left text-gray-600">
                Vehicle Name
              </th>
              <th className="border border-gray-300 px-6 py-3 text-left text-gray-600">
                Status
              </th>
              <th className="border border-gray-300 px-6 py-3 text-left text-gray-600">
                Last Updated
              </th>
              <th className="border border-gray-300 px-6 py-3 text-left text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr
                key={vehicle._id}
                className="even:bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <td className="border border-gray-300 px-6 py-3 text-gray-800">
                  {vehicle.name}
                </td>
                <td className="border border-gray-300 px-6 py-3 text-gray-800">
                  {vehicle.status}
                </td>
                <td className="border border-gray-300 px-6 py-3 text-gray-800">
                  {new Date(vehicle.lastUpdated).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-6 py-3 flex space-x-3">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transform transition-transform duration-200 hover:scale-105"
                    onClick={() => openModal("update", vehicle)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transform transition-transform duration-200 hover:scale-105"
                    onClick={() => handleDeleteVehicle(vehicle._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg w-96 p-8 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={closeModal}
            >
              &times;
            </button>
            {modalType === "add" ? (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                  Add Vehicle
                </h2>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter vehicle name"
                  onChange={(e) => setModalData({ name: e.target.value })}
                />
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700 transform transition-transform duration-200 hover:scale-105"
                  onClick={() => handleAddVehicle(modalData.name)}
                >
                  Add
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                  Update Vehicle Status
                </h2>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter new status"
                  onChange={(e) =>
                    setModalData({ ...modalData, status: e.target.value })
                  }
                />
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-lg w-full hover:bg-green-700 transform transition-transform duration-200 hover:scale-105"
                  onClick={() =>
                    handleUpdateStatus(modalData._id, modalData.status)
                  }
                >
                  Update
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
