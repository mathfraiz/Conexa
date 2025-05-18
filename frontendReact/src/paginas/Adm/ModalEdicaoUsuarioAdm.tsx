// import React, { useEffect, useRef, useState } from "react";
// import { useAuth } from "../../contexts/AuthContext";

// interface ModalEdicaoUsuarioProps {
//   isModalOpen: boolean;
//   user: Usuario;
//   onClose: (foiSalvo: boolean, mensagem?: string) => void;
// }

// interface Usuario {
//   email: string;
//   id: number;
//   imagem_perfil: string | File | null;
//   nome: string;
//   telefone: string;
//   tipo: string;
// }

// const ModalEdicaoUsuario: React.FC<ModalEdicaoUsuarioProps> = ({
//   isModalOpen,
//   user,
//   onClose,
// }) => {
//   function base64ToFile(base64SemPrefixo: string, filename: string): File {
//     const base64 = `data:image/png;base64,${base64SemPrefixo}`;
//     const [metadata, data] = base64.split(",");
//     const mimeMatch = metadata.match(/:(.*?);/);
//     const mime = mimeMatch ? mimeMatch[1] : "image/png";
//     const bstr = atob(data);
//     const u8arr = new Uint8Array(bstr.length);
//     for (let i = 0; i < bstr.length; i++) {
//       u8arr[i] = bstr.charCodeAt(i);
//     }
//     return new File([u8arr], filename, { type: mime });
//   }

//   const modalRef = useRef<HTMLDivElement>(null);
//   const { usuario } = useAuth();
//   const [imagem64, setImagem64] = useState<string>("");

//   const [nome, setNome] = useState("");
//   const [email, setEmail] = useState("");
//   const [telefone, setTelefone] = useState("");
//   const [tipo, setTipo] = useState("usuario");
//   const [imagemPerfil, setImagemPerfil] = useState<File | null>(null);
//   const [erros, setErros] = useState<{ [key: string]: boolean }>({});

//   useEffect(() => {
//     if (user) {
//       setNome(user.nome || "");
//       setEmail(user.email || "");
//       setTelefone(user.telefone || "");
//       setTipo(user.tipo || "usuario");
//       if (user.imagem_perfil && typeof user.imagem_perfil === "string") {
//         console.log(user.imagem_perfil);
//         const file = base64ToFile(user.imagem_perfil, "foto-perfil.jpg");
//         setImagemPerfil(file);
//       } else {
//         setImagemPerfil(null);
//         const base64 = `data:image/png;base64,${user.imagem_perfil}`;
//         setImagem64(base64);
//       }
//     }
//     console.log("imagem64", imagem64);
//   }, [user]);

//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
//         onClose(false);
//       }
//     };
//     if (isModalOpen) document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isModalOpen, onClose]);

//   const validarNome = (nome: string) => /^[A-Za-zÀ-ÿ\s]+$/.test(nome);

//   const formatarTelefone = (valor: string) => {
//     const numeros = valor.replace(/\D/g, "").slice(0, 11);
//     if (numeros.length <= 10) {
//       return numeros.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
//     }
//     return numeros.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
//   };

//   const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const formatado = formatarTelefone(e.target.value);
//     setTelefone(formatado);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const novosErros = {
//       nome: !validarNome(nome),
//     };
//     setErros(novosErros);
//     if (Object.values(novosErros).some(Boolean)) return;

//     try {
//       const token = sessionStorage.getItem("token");
//       const formData = new FormData();

//       formData.append("nome", nome);
//       formData.append("email", email);
//       formData.append("telefone", telefone);
//       formData.append("tipo", tipo);
//       console.log(telefone);

//       if (imagemPerfil instanceof File) {
//         formData.append("imagem_perfil", imagemPerfil);
//       }

//       const resp = await fetch(`http://localhost:3000/usuario/${user?.id}`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       if (resp.ok) {
//         const novoUsuario = {
//           ...usuario!,
//           nome,
//           email,
//           telefone,
//           tipo,
//           imagem_perfil:
//             imagemPerfil instanceof File
//               ? URL.createObjectURL(imagemPerfil)
//               : usuario?.imagem_perfil,
//         };
//         console.log(novoUsuario);

//         onClose(true, "Usuário atualizado com sucesso!");
//       } else {
//         throw new Error("Falha na atualização");
//       }
//     } catch (error) {
//       console.error("Erro ao atualizar usuário", error);
//       onClose(false, "Erro ao atualizar usuário");
//     }
//   };

//   const inputClass = (campo: string) =>
//     `w-full px-4 py-2 border ${
//       erros[campo] ? "border-red-500" : "border-gray-300"
//     } rounded-xl focus:ring-2 focus:ring-purple-500 text-black`;

//   if (!isModalOpen || !usuario) return null;

//   return (
//     <div className="fixed top-[5.5rem] right-6 z-50 w-[400px] animate-fade-in">
//       <div
//         ref={modalRef}
//         className="bg-white border border-purple-300 rounded-2xl shadow-2xl p-6 space-y-4"
//       >
//         <h2 className="text-2xl font-extrabold text-purple-700 text-center">
//           Editar Usuário
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="text"
//             placeholder="Nome"
//             value={nome}
//             onChange={(e) => setNome(e.target.value)}
//             className={inputClass("nome")}
//             required
//           />
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className={inputClass("email")}
//             required
//           />
//           <input
//             type="tel"
//             placeholder="Telefone"
//             value={telefone}
//             onChange={handleTelefoneChange}
//             className={inputClass("telefone")}
//           />
//           <select
//             value={tipo}
//             onChange={(e) => setTipo(e.target.value)}
//             className={inputClass("tipo")}
//           >
//             <option value="usuario">Usuário</option>
//             <option value="admin">Admin</option>
//           </select>

//           <div className="flex items-center gap-2">
//             <img
//               src={imagem64 || "./imagem_Icon_User.png"}
//               alt="Imagem de perfil"
//               className="w-24 h-24 object-cover rounded-xl border-2 border-purple-400 shadow-md mb-2"
//             />

//             <label className="cursor-pointer bg-purple-100 text-purple-700 px-4 py-2 rounded-xl border border-purple-300 hover:bg-purple-200 transition">
//               Selecionar imagem
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => {
//                   const file = e.target.files?.[0] || null;
//                   setImagemPerfil(file);
//                   if (file instanceof File) {
//                     setImagem64(URL.createObjectURL(file));
//                   }
//                 }}
//                 className="w-full text-sm text-gray-500 hidden"
//               />
//             </label>
//           </div>

//           <div className="flex justify-end gap-3 pt-2">
//             <button
//               type="button"
//               onClick={() => onClose(false)}
//               className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400"
//             >
//               Cancelar
//             </button>
//             <button
//               type="submit"
//               className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-lg transition"
//             >
//               Salvar
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ModalEdicaoUsuario;
