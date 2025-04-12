import React, { useState } from "react";

const CriarEvento = () => {
  const [formData, setFormData] = useState({
    nome: "",
    tema: "",
    data: "",
    hora: "",
    cep: "",
    logradouro: "",
    bairro: "",
    numero: "",
    descricao: "",
    imagem: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Validações com expressões regulares
    if (name === "nome" && !/^[a-zA-ZÀ-ÿ\s]{3,50}$/.test(value)) return;
    if (name === "numero" && !/^\d{0,5}$/.test(value)) return;
    if (name === "descricao" && value.length > 300) return;
    if (name === "cep" && !/^\d{0,8}$/.test(value)) return;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Buscar endereço via API se o cep estiver completo
    if (name === "cep" && value.length === 8) {
      fetch(`https://viacep.com.br/ws/${value}/json/`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.erro) {
            setFormData((prev) => ({
              ...prev,
              logradouro: data.logradouro || "",
              bairro: data.bairro || "",
            }));
          }
        });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imagem: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", formData);
  };

  return (
    <div className="bg-[url(./logo.jpg)] min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-200 p-6 bg-cover bg-center bg-no-repeat">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl space-y-6 border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-center text-purple-800 mb-4">
          Criar Novo Evento
        </h2>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Nome do Evento</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-purple-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Tema</label>
          <select
            name="tema"
            value={formData.tema}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-purple-500 outline-none"
            required
          >
            <option value="">Selecione um tema</option>
            <option value="Tecnologia">Tecnologia</option>
            <option value="Arte">Arte</option>
            <option value="Saúde">Saúde</option>
            <option value="Educação">Educação</option>
            <option value="Negócios">Negócios</option>
          </select>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-medium text-gray-700">Data</label>
            <input
              type="date"
              name="data"
              value={formData.data}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3"
              required
            />
          </div>

          <div className="flex-1">
            <label className="block mb-1 font-medium text-gray-700">Hora</label>
            <input
              type="time"
              name="hora"
              value={formData.hora}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3"
              required
            />
          </div>
        </div>

        {/* Novo campo de CEP */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">CEP</label>
          <input
            type="text"
            name="cep"
            value={formData.cep}
            onChange={handleChange}
            maxLength={8}
            placeholder="Apenas números"
            className="w-full border border-gray-300 rounded-md p-3"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Logradouro</label>
          <input
            type="text"
            name="logradouro"
            value={formData.logradouro}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-3"
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-medium text-gray-700">Bairro</label>
            <input
              type="text"
              name="bairro"
              value={formData.bairro}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3"
              required
            />
          </div>

          <div className="w-1/3">
            <label className="block mb-1 font-medium text-gray-700">Número</label>
            <input
              type="text"
              name="numero"
              value={formData.numero}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Descrição</label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-3"
            rows={4}
            maxLength={300}
            required
          ></textarea>
          <p className="text-right text-sm text-gray-500">
            {formData.descricao.length}/300 caracteres
          </p>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Imagem do Evento</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
          {formData.imagem && (
            <img
              src={formData.imagem}
              alt="Preview"
              className="mt-4 w-40 h-40 object-cover rounded-lg shadow-md mx-auto"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-md transition"
        >
          Cadastrar Evento
        </button>
      </form>
    </div>
  );
};

export default CriarEvento;
