export const verificarEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

export const validarEdad = (edad) => {
    const numero = parseInt(edad, 10);
    return !isNaN(numero) && numero > 0 && numero < 130;
};

