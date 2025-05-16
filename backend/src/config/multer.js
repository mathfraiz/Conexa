import multer from "multer";

const storage = multer.memoryStorage(); // ou defina pasta se quiser salvar arquivos em disco

const upload = multer({ storage });
const upFile = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../../fotos/"); // pasta onde os arquivos serão salvos
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // nome do arquivo
  },
});

export default upload;
