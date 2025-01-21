//import { apiSecret } from '../../../back/config/config';

/* const dev = process.env.REACT_APP_ENV != 'production';
console.log("dsadadsa", dev, process.env.REACT_APP_ENV)

export const masterPath = {
    url: dev ? "http://localhost:3032/api" : process.env.REACT_APP_API_URL,
    domain: dev ? "http://localhost:3032/api" : process.env.REACT_APP_DOMAIN,
    apiSecret: process.env.REACT_APP_API_SECRET
}; */




export const masterPath = {
    //url: "http://localhost:3032/api", //LOCAL
    url: "https://minisitio.online/api", //HOMOLOGAÇÃO
    //url: "https://br.minisitio.net/api", //PRODUÇÃO
    //domain: 'https://minitest.minisitio.online'
    domain: 'https://br.minisitio.net',
    accessToken: sessionStorage.getItem('userTokenAccess')
}; 

export const version = {
    version: "v2.0.39 homolog"
}