const multer = require('multer');
const path = require('path');

// Configurar o armazenamento com multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, `../public/cartaoDigital`))
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.originalname}`); // Nome do arquivo salvo
    }
});

// Filtrar apenas arquivos PDF
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true); // Aceitar o upload
    } else {
        cb(new Error('Apenas arquivos PDF são permitidos!'), false); // Rejeitar o upload
    }
};

// Configurar o middleware multer
module.exports = (multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5MB por arquivo
}));