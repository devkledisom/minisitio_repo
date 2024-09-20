// formController.js
import { useState } from 'react';

const useFormController = () => {
    const [formValues, setFormValues] = useState({
        codUsuario: '',
        email: ''
    });

    const [formErrors, setFormErrors] = useState({
        codUsuario: '',
        email: ''
    });

    const handleChangeform = (e) => {
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

    const handleSubmit = (e, callback) => {
        e.preventDefault();

        if (validateForm()) {
            callback(formValues);
        }
    };

    return {
        formValues,
        formErrors,
        handleChangeform,
        handleSubmit
    };
};

export default useFormController;
