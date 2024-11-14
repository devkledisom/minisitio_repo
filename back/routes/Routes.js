const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');


//Controllers
const BemVindo = require('../controllers/BemVindo');
const Buscador = require('../controllers/Buscador');
const Admin = require('../controllers/Admin');
const Login = require('../controllers/Login');
const Users = require('../controllers/Users');
const Upload = require('../controllers/Upload');
const UserActions = require('../controllers/UserActions');

//FUNCTIONS
const saveImport = require('../functions/serverImport');
const { faleComDono, faleComDonoCliente } = require('../functions/sendMailer');

//MODELS
const Anuncio = require('../models/table_anuncio');

//middleware
router.use(function timelog(req, res, next) {
    //res.setHeader('Content-Type', 'application/json; charset=utf-8');
    console.log('Time: ', Date.now());
    next();
});

const uploadUser = require('../middlewares/uploadImage');


router.get('/api/', BemVindo.bemvindo);

//buscador
router.post('/api/buscar', Buscador.busca);
router.get('/api/cadernos', Buscador.buscarCaderno);
router.get('/api/ufs', Buscador.buscarUf);
router.post('/api/anuncios/:codCaderno', Buscador.buscaGeralCaderno);
router.get('/api/atividade/:codAtividade', Buscador.buscaAtividade);
router.get('/api/anuncio/:codAnuncio', Buscador.buscaAnuncio);
router.get('/api/admin/usuario', Admin.listarUsuarios);

//Login
router.post('/api/entrar', Login.login);

//Admin
router.post('/api/admin/usuario/create', Users.create);
router.post('/api/admin/usuario/update/:id', Users.update);
router.put('/api/admin/usuario/status/:id', Users.updateStatus);
router.get('/api/admin/usuario/edit/:id', Users.buscarUsuario);
router.delete('/api/admin/usuario/delete/:id', Users.delete);
router.get('/api/admin/usuario/buscar/:id', Users.buscarUsuarioId);
router.post('/api/admin/usuario/export', Admin.exportUser);

router.get('/api/admin/cadernos', Admin.listarCadernos);
router.get('/api/admin/cadernos/buscar/', Admin.buscarRegistroCaderno);
router.post('/api/admin/cadernos/create', Admin.criarCaderno);
router.put('/api/admin/cadernos/update', Admin.atualizarCadernos);
router.delete('/api/admin/cadernos/delete/:id', Admin.deleteCadernos);
router.get('/api/admin/cadernos/edit/:id', Admin.listarCadernoId);

router.get('/api/admin/atividades/read', Admin.listarAtividades);
router.get('/api/admin/atividade', Admin.listarAtividadesId);
router.put('/api/admin/atividade/update', Admin.atualizarAtividades);
router.delete('/api/admin/atividade/delete/:id', Admin.deleteAtividade);
router.post('/api/admin/atividade/create', Admin.criarAtividade);

router.get('/api/admin/desconto/read', Admin.listarIds);
router.get('/api/admin/desconto/edit/:id', Admin.listarUserId);
router.put('/api/admin/desconto/update', Admin.atualizarIds);
router.put('/api/admin/desconto/status/:id', Admin.updateUserStatus);
router.post('/api/admin/desconto/create', Admin.criarIds);
router.delete('/api/admin/desconto/delete/:id', Admin.deleteIds);
router.get('/api/admin/desconto/buscar/:id', Admin.buscarId);
router.get('/api/admin/desconto/read/all', Admin.buscarAllId);
router.get('/api/admin/desconto/ddd/:id', Admin.buscarDDD);
router.post('/api/admin/desconto/export', Admin.exportID);

router.get('/admin/desconto/read', Admin.listarIds);
router.get('/admin/desconto/edit/:id', Admin.listarUserId);
router.put('/admin/desconto/update', Admin.atualizarIds);
router.post('/admin/desconto/create', Admin.criarIds);
router.delete('/admin/desconto/delete/:id', Admin.deleteIds);
router.get('/admin/desconto/buscar/:id', Admin.buscarId);
router.get('/admin/desconto/ddd/:id', Admin.buscarDDD);

//ANUNCIOS
router.get('/api/admin/espacos/read', Admin.listarEspacos);
router.get('/api/admin/anuncio/edit/:id', Admin.listarAnuncioId);
router.post('/api/admin/anuncio/create', Admin.criarAnuncio);
router.put('/api/admin/anuncio/status/:id', Admin.updateAnuncioStatus);
router.delete('/api/admin/anuncio/delete/:id', Admin.deleteAnuncio);
router.put('/api/admin/anuncio/update', Admin.atualizarAnuncio);
router.get('/api/admin/anuncio/buscar', Admin.buscarAnuncioId);
router.get('/api/admin/anuncio/visualizacoes', Admin.visualizacoes);
router.post('/api/admin/anuncio/duplicate', Admin.duplicar);
router.get('/api/admin/anuncio/classificado/:caderno/:uf', Admin.listarClassificado);
router.get('/api/admin/anuncio/classificado/geral/:caderno/:uf', Admin.listarClassificadoGeral);
router.get('/api/admin/anuncio/classificado/geral2', Admin.listarClassificadoGeral2);
router.get('/api/admin/anuncio/classificado/especifico/:caderno/:uf', Admin.listarClassificadoEspecifico);

//ROTAS MODULO PIN
router.get('/api/admin/pin/read', Admin.listarPin);
router.post('/api/admin/pin/create', Admin.criarPin);
router.put('/api/admin/pin/update', Admin.atualizarPin);
router.delete('/api/admin/pin/delete/:id', Admin.deletarPin);
router.get('/api/admin/pin/edit/:id', Admin.listarPinId);

//EXPORT OR IMPORT
router.post('/api/admin/anuncio/export', Admin.export4excell);
router.post('/api/admin/export/:modulo', Admin.exportPadrao);
router.post('/api/admin/anuncio/import', saveImport().single('uploadedfile'),Admin.import4excell);

//site
router.post('/api/admin/usuario/criar-anuncio', Users.criarAnuncio);
router.get('/api/pa', Users.qtdaAnuncio);
router.post('/api/upload-image', uploadUser.single('image'), Upload.uploadImg);
router.get('/api/list-image', Upload.listFiles);

//ACÕES DO USUARIO
router.get('/api/cartao-digital', UserActions.cartaoDigital);

//EMAIL FALE COM O DONO

// Configuração do multer para armazenar o arquivo em uma pasta local
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/upload/anexoEmail/')); // Pasta onde os arquivos serão salvos
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nome único para cada arquivo
    }
});

const upload = multer({ storage });

router.post('/api/fale-com-dono', upload.single('anexo'), async(req, res) => {
    console.log(req.body);

    if(req.body.email == '') {
        res.json({success: false, message: "email não enviado"});
        return;
    }

    const anuncio = await Anuncio.findAll({
        where: {
            codAnuncio: req.body.id
        }
    });

    const filename = req.file ? req.file.filename : false

   const emailReturn = await faleComDono(req.body, anuncio.descEmailAutorizante, filename);
   faleComDonoCliente(req.body);
    if(emailReturn) {
        res.json({success: true, message: "email enviado"});
    } else {
        res.json({success: false, message: "email não enviado"});
    }
});


module.exports = router;












