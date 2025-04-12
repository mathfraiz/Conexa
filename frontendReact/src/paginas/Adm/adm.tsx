import React, { useState } from "react";

const dados = [
  { nome: "Spoonbill", cientifico: "Platalea leucorodia", status: "Amber" },
  { nome: "Hoopoe", cientifico: "Upupa epops", status: "N/A" },
  { nome: "Wren", cientifico: "Troglodytes troglodytes", status: "Amber" },
  { nome: "Dunnock", cientifico: "Prunella modularis", status: "Amber" },
  { nome: "Gannet", cientifico: "Morus bassanus", status: "Amber" },
  { nome: "Puffin", cientifico: "Fratercula arctica", status: "Red" },
  { nome: "Curlew", cientifico: "Numenius arquata", status: "Red" },
  { nome: "Robin", cientifico: "Erithacus rubecula", status: "Green" },
  { nome: "Blackbird", cientifico: "Turdus merula", status: "Green" },
  { nome: "Coot", cientifico: "Fulica atra", status: "Green" },
];

const Adm = () => {
  const [dadosAves, setDadosAves] = useState(dados);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    cientifico: "",
    status: "Green",
  });
  const [selectedIndex, setSelectedIndex] = useState(null);

  const openModal = (edit = false, index = null) => {
    setEditMode(edit);
    if (edit && index !== null) {
      setFormData(dadosAves[index]);
      setSelectedIndex(index);
    } else {
      setFormData({
        nome: "",
        cientifico: "",
        status: "Green",
      });
      setSelectedIndex(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      const updatedAves = [...dadosAves];
      updatedAves[selectedIndex] = formData;
      setDadosAves(updatedAves);
    } else {
      setDadosAves([...dadosAves, formData]);
    }
    closeModal();
  };

  const handleDelete = (index) => {
    const updatedAves = dadosAves.filter((_, i) => i !== index);
    setDadosAves(updatedAves);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        {/* Header com botão ADD */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-700"></h2>
          <button
            className="bg-green-200 text-green-800 px-4 py-2 rounded font-semibold hover:bg-green-300"
            onClick={() => openModal(false)}
          >
            ADD
          </button>
        </div>

        {/* Tabela */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <th className="p-3 border-b">id</th>
              <th className="p-3 border-b">nome</th>
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b">Ações</th>
            </tr>
          </thead>
          <tbody>
            {dadosAves.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50 text-sm text-gray-800">
                <td className="p-3 border-b">{user.id}</td>
                <td className="p-3 border-b">{user.nome}</td>
                <td className="p-3 border-b">{user.email}</td>
                <td className="p-3 border-b flex gap-2">
                  <button
                    className="bg-orange-300 hover:bg-orange-200 text-white px-3 py-1 rounded"
                    onClick={() => openModal(true, index)}
                  >
                    EDIT
                  </button>
                  <button
                    className="bg-red-400 hover:bg-red-300 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(index)}
                  >
                    DELETE
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">{editMode ? "Edit Bird" : "Add Bird"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="nome" className="block text-sm font-semibold text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="cientifico" className="block text-sm font-semibold text-gray-700">
                  Scientific Name
                </label>
                <input
                  type="text"
                  id="cientifico"
                  name="cientifico"
                  value={formData.cientifico}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-semibold text-gray-700">
                  Conservation Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                >
                  <option value="Green">Green</option>
                  <option value="Amber">Amber</option>
                  <option value="Red">Red</option>
                  <option value="N/A">N/A</option>
                </select>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {editMode ? "Save Changes" : "Add Bird"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Adm;
