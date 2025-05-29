import { useState } from 'react';
import { validations } from '../helper/placeFormValidations.mjs';

const hasInvalidation = (field, value) => {
    //Buscar si ese campo tiene una validacion que no cumple
    const result = validations[field].find(validation => !validation.expr.test(value));

    return result ? 
        { field: field, isInvalid: true, error: result.error } : 
        { field: field, isInvalid: false, error: "" } 
}

export function useInvalidField() {
    const [invalidation, setInvalidation] = useState({});

    //Para setear una validacion específica de un campo
    const handleChangeInvalidation = (field, isInvalid, error) => {
        setInvalidation(prev => {
            return {
                ...prev,
                [field]: {
                    isInvalid: isInvalid,
                    error: error
                }
            };
        });
    }

    //Para obtener la validación de un campo específico
    const handleHasInvalidation = (field, value) => {
        const result = hasInvalidation(field, value);
        
        handleChangeInvalidation(result.field, result.isInvalid, result.error);
    };

    //Para verificar si alguno de los campos esta en estado inválido
    const hasAnyInvalidation = () => {
        return Object.values(invalidation).some(field => field.isInvalid);
    };

    //Para limpiar todas las validaciones
    const clearAllValidations = () => {
        setInvalidation({});
    };

    return {
        invalidation,
        handleHasInvalidation,
        hasAnyInvalidation,
        clearAllValidations
    };
}