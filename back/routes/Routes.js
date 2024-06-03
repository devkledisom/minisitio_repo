const express = require('express');
const router = express.Router();


//Controllers
const BemVindo = require('../controllers/BemVindo');
const Buscador = require('../controllers/Buscador');
const Admin = require('../controllers/Admin');
const Login = require('../controllers/Login');
const Users = require('../controllers/Users');
const Upload = require('../controllers/upload');

//middleware
router.use(function timelog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

const uploadUser = require('../middlewares/uploadImage');


router.get('/', BemVindo.bemvindo);

//buscador
router.post('/buscar', Buscador.busca);
router.get('/cadernos', Buscador.buscarCaderno);
router.get('/ufs', Buscador.buscarUf);
router.post('/anuncios/:codCaderno', Buscador.buscaGeralCaderno);
router.get('/atividade/:codAtividade', Buscador.buscaAtividade);
router.get('/anuncio/:codAnuncio', Buscador.buscaAnuncio);
router.get('/admin/usuario', Admin.listarUsuarios);

//Login
router.post('/entrar', Login.login);

//Admin
router.post('/admin/usuario/create', Users.create);
router.post('/admin/usuario/update/:id', Users.update);
router.get('/admin/usuario/edit/:id', Users.buscarUsuario);
router.delete('/admin/usuario/delete/:id', Users.delete);
router.get('/admin/usuario/buscar/:id', Users.buscarUsuarioId);

router.get('/admin/cadernos', Admin.listarCadernos);

router.get('/admin/atividades/read', Admin.listarAtividades);
router.get('/admin/atividade', Admin.listarAtividadesId);
router.put('/admin/atividade/update', Admin.atualizarAtividades);
router.delete('/admin/atividade/delete/:id', Admin.deleteAtividade);
router.post('/admin/atividade/create', Admin.criarAtividade);

router.get('/admin/desconto/read', Admin.listarIds);
router.get('/admin/desconto/edit/:id', Admin.listarUserId);
router.put('/admin/desconto/update', Admin.atualizarIds);
router.post('/admin/desconto/create', Admin.criarIds);
router.delete('/admin/desconto/delete/:id', Admin.deleteIds);
router.get('/admin/desconto/buscar/:id', Admin.buscarId);

router.get('/admin/espacos/read', Admin.listarEspacos);
router.get('/admin/anuncio/edit/:id', Admin.listarAnuncioId);
router.get('/admin/anuncio/buscar', Admin.buscarAnuncioId);


//site
router.post('/admin/usuario/criar-anuncio', Users.criarAnuncio);
router.get('/pa', Users.qtdaAnuncio);
router.post('/upload-image', uploadUser.single('image'), Upload.uploadImg);
router.get('/list-image', Upload.listFiles);


module.exports = router;
