import multer from "multer";

const storage = multer.memoryStorage(); // ou defina pasta se quiser salvar arquivos em disco

const upload = multer({ storage });

export default upload;
