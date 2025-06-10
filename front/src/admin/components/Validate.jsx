import React, { useState } from 'react';

const Validate = () => {
    const [formValues, setFormValues] = useState({
        codUsuario: '',
        email: ''
    });

    const [formErrors, setFormErrors] = useState({
        codUsuario: '',
        email: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });

        // Limpar mensagem de erro ao começar a digitar
        setFormErrors({
            ...formErrors,
            [name]: ''
        });
    };

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!formValues.codUsuario) {
            isValid = false;
            errors['codUsuario'] = 'Usuário é um campo obrigatório.';
        }

        if (!formValues.email) {
            isValid = false;
            errors['email'] = 'Email é um campo obrigatório.';
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Aqui você pode processar o envio do formulário, por exemplo, enviando dados para um servidor
            console.log('Formulário enviado com sucesso', formValues);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="codUsuario">Usuário:</label>
                <input
                    type="text"
                    id="codUsuario"
                    name="codUsuario"
                    value={formValues.codUsuario}
                    onChange={handleChange}
                    className={`form-control ${formErrors.codUsuario ? 'is-invalid' : ''}`}
                    required
                />
                {formErrors.codUsuario && <div className="invalid-feedback">{formErrors.codUsuario}</div>}
            </div>
            <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                    className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                    required
                />
                {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
            </div>
            <button type="submit" className="btn btn-primary">Enviar</button>
        </form>
    );
};

export default Validate;
