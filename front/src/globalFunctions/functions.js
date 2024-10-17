export function limparCPFouCNPJ(cpfOuCnpj) {
    return cpfOuCnpj.replace(/[.-]/g, '');
}