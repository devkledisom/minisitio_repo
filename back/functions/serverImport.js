const multer = require('multer');
const path = require('path');

module.exports = function saveImport() {
    // Configura o destino e o nome do arquivo
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/import/'); // Pasta onde o arquivo será salvo
    },
    filename: function (req, file, cb) {
        cb(null, 'uploadedfile.xlsx'/*file.fieldname  + '-' + Date.now() + path.extname(file.originalname) */);
    }
});

const upload = multer({ storage: storage });

return upload;
}
