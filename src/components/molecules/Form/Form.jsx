export default function Form({ name, onChangeName, invalidation, onValidation, onSubmit }) {
    const handleChangeName = (event) => {
        let value = event.target.value;

        onValidation("name", value);

        onChangeName(value);
    }

    const handleChangeImage = (event) => {
        let value = event.target.value;

        onValidation("image", value);
    }

    return (
        <form onSubmit={onSubmit}>
            <label htmlFor="name">Nombre del lugar</label>
            <input type="text" id="name" name="name" value={name} onChange={handleChangeName} placeholder="Nombre del lugar" autoComplete="name" required />
            {invalidation.name?.isInvalid && <p>{invalidation.name.error}</p>}

            <label htmlFor="image">Imagen del lugar</label>
            <input type="file" id="image" name="image" onChange={handleChangeImage} placeholder="Cargar imagen" autoCorrect="off" required />
            {invalidation.image?.isInvalid && <p>{invalidation.image.error}</p>}

            <button type="sumbit">Crear Lugar</button>
        </form>
    );
}