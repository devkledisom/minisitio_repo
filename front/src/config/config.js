//import { apiSecret } from '../../../back/config/config';

/* const dev = process.env.REACT_APP_ENV != 'production';
console.log("dsadadsa", dev, process.env.REACT_APP_ENV)

export const masterPath = {
    url: dev ? "http://localhost:3032/api" : process.env.REACT_APP_API_URL,
    domain: dev ? "http://localhost:3032/api" : process.env.REACT_APP_DOMAIN,
    apiSecret: process.env.REACT_APP_API_SECRET
}; */




/* export const masterPath = {
    //url: "http://localhost:3032/api", //LOCAL
    url: "https://minisitio.online/api", //HOMOLOGAÇÃO
    //url: "https://br.minisitio.net/api", //PRODUÇÃO
    //domain: 'https://minitest.minisitio.online',
    domain: 'https://br.minisitio.net',
    accessToken: sessionStorage.getItem('userTokenAccess')
}; 

export const version = {
    version: "v2.0.39 homolog"
} */


const hostname = window.location.hostname;
const parts = hostname.split('.');
const subdomain = parts[0]; // Obtém o subdomínio
const apiProtocol = window.location.protocol; // Obtém o protocolo (http: ou https:)
const port = 3032;

let apiDomain;

// Se for localhost, mantém localhost com a porta
if (hostname === "localhost") {
    apiDomain = `${hostname}:${port}`;
} else {
    if(!parts[1]) {
        apiDomain = hostname // Obtém o domínio principal
    } else {
        apiDomain = `${parts[1]}.${parts[2]}` // Obtém o domínio principal
    }
}

const apiUrl = `${apiProtocol}//${apiDomain}/api`; // Usa "//" corretamente
const domain = `${apiProtocol}//${apiDomain}`;

export const masterPath = {
    url: apiUrl,
    domain: domain,
    accessToken: sessionStorage.getItem('userTokenAccess')
};

export const version = {
    version: 'v2.0.39'
};
