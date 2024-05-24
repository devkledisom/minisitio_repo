export default {
    buscarUsuarios: async () => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "uf": "11",
                "cidade": "ALTA FLORESTA D'OESTE"
            })
        };

        const request = await fetch('http://localhost:3032/buscar', options).then((x) => x.json())
        return request;
    }
}