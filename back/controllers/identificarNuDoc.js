const verificationNudoc = (input) => {
    const cpfWithPunctuation = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    //const cpfWithoutPunctuation = /^\d{11}$/;
    const cnpjWithPunctuation = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    //const cnpjWithoutPunctuation = /^\d{14}$/;
    //const documentoLimpo = documento.replace(/[.,\/-]/g, '');
    if (cpfWithPunctuation.test(input)) {
        return 'CPF';
    } else if (cnpjWithPunctuation.test(input) || cnpjWithoutPunctuation.test(input)) {
        return 'CNPJ';
    } else {
        return 'Invalid';
    }
};

module.exports = verificationNudoc;