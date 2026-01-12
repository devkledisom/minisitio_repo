import { masterPath, version } from '../../../../config/config';


async function verificarArquivoCampanha(campanhaId) {
    const request = await fetch(`${masterPath.url}/admin/campanha/verificar-arquivo/${campanhaId}`);

    if (!request.ok) throw new Error('Erro na requisição: ' + request.status);

    return request.json();
}

export {
    verificarArquivoCampanha
};