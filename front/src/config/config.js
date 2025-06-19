const hostname = window.location.hostname;
const parts = hostname.split('.');
const subdomain = parts[0];
const apiProtocol = window.location.protocol;
const port = 3032;

let apiDomain;
let portalDomain;

//console.log(hostname);
//console.log(parts);

if (hostname === "localhost") {
    apiDomain = `${hostname}:${port}`;
    portalDomain = `${hostname}:3000`;
} else {
    // Obtém o domínio principal, independentemente do número de partes
    if (hostname.includes('minisitio.com.br')) {
        apiDomain = hostname;
        portalDomain = hostname;
    } else {
        if (hostname.includes('automaplay.com.br')) {
            apiDomain = 'automaplay.com.br';
            portalDomain = 'minitest.automaplay.com.br';
        } else {
            apiDomain = `${parts[1]}.${parts[2]}`;
            portalDomain = `${parts[1]}.${parts[2]}`;
        }

    }
}

const apiUrl = `${apiProtocol}//${apiDomain}/api`;
const ioUrl = `${apiProtocol}//${apiDomain}`;
const domain = `${apiProtocol}//${portalDomain}`;

export const masterPath = {
    url: apiUrl,
    domain: domain,
    ioUrl: ioUrl,
    accessToken: sessionStorage.getItem('userTokenAccess')
};

export const version = {
    version: 'v2.0.70'
};





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
    url: "https://automaplay.com.br/api", //HOMOLOGAÇÃO
    //url: "https://br.minisitio.net/api", //PRODUÇÃO
    //domain: 'https://minitest.automaplay.com.br',
    domain: 'https://br.minisitio.net',
    accessToken: sessionStorage.getItem('userTokenAccess')
}; 

export const version = {
    version: "v2.0.39 homolog"
} */


/* const hostname = window.location.hostname;
const parts = hostname.split('.');
const subdomain = parts[0]; // Obtém o subdomínio
const apiProtocol = window.location.protocol; // Obtém o protocolo (http: ou https:)
const port = 3032;

let apiDomain;

// Se for localhost, mantém localhost com a porta
if (hostname === "localhost") {
    apiDomain = `${hostname}:${port}`;
} else {
    if(parts[1] !== "minisitio") {
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
    version: 'v2.0.40'
}; */
