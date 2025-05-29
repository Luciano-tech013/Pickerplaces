export const validations = {
    name: [
        { expr: /^(?=.{0,30}$)/, error: "Excedió el límite de caracteres permitidos" }
    ],
    image: [
        { expr: /\.(jpe?g|png|avif|webp)$/i, error: "El tipo de la imagen NO es aceptado" }
    ]
};