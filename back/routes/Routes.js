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
router.get('/api/admin/usuario/edit/:id', Users.buscarUsuario);
router.delete('/api/admin/usuario/delete/:id', Users.delete);
router.get('/api/admin/usuario/buscar/:id', Users.buscarUsuarioId);

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
router.post('/api/admin/desconto/create', Admin.criarIds);
router.delete('/api/admin/desconto/delete/:id', Admin.deleteIds);
router.get('/api/admin/desconto/buscar/:id', Admin.buscarId);
router.get('/api/admin/desconto/ddd/:id', Admin.buscarDDD);

router.get('/api/admin/espacos/read', Admin.listarEspacos);
router.get('/api/admin/anuncio/edit/:id', Admin.listarAnuncioId);
router.post('/api/admin/anuncio/create', Admin.criarAnuncio);
router.get('/api/admin/anuncio/buscar', Admin.buscarAnuncioId);
router.get('/api/admin/anuncio/visualizacoes', Admin.visualizacoes);


//site
router.post('/api/admin/usuario/criar-anuncio', Users.criarAnuncio);
router.get('/api/pa', Users.qtdaAnuncio);
router.post('/api/upload-image', uploadUser.single('image'), Upload.uploadImg);
router.get('/api/list-image', Upload.listFiles);


module.exports = router;












