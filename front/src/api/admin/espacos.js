import { masterPath, version } from '../../config/config';

async function fetchEspacos(page) {
        const espacosFetch = await fetch(`${masterPath.url}/admin/espacos/read?page=${page}`)

        const result = await espacosFetch.json();

        return result;

}

async function deleteDuplicacaoEspaco(codOrigem) {
    const deleteFetch = await fetch(`${masterPath.url}/admin/anuncio/delete/${codOrigem}?type=dup`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "authorization": 'Bearer ' + sessionStorage.getItem('userTokenAccess')
        },
    })

    if (!deleteFetch.ok) {
        throw new Error('Erro ao deletar duplicações do espaço.');
    }

    const result = await deleteFetch.json();

    if (result.success) {

    }

    return result;
}

export { fetchEspacos, deleteDuplicacaoEspaco };