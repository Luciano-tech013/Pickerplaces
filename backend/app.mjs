import express from "express";
import cors from "cors";
import { readDatabase, writeDatabase } from "./data/database.mjs";

const PORT = 3000;
const QUANTITY_PLACES_DEFAULT = 9;

const app = express();

//Parsea el body a JSON
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET","POST","PUT","DELETE"],
    allowedHeaders: ["Content-Type", "Accept"]
}));

const findMatchingPlace = userPlaces => {
    const db = readDatabase();
    return userPlaces.find(userPlace => 
        db.placesSelected.find(place => place.name === userPlace.name)
    );
};

const deletePlace = (places, id) => {
    const index = places.findIndex(place => place.id === id);
    
    if (index === -1)
        return false;

    places.splice(index, 1);

    return !places.some(place => place.id === id);
}

const findPlaceById = id => {
    const db = readDatabase();
    return db.placesSelected.find(place => place.id === id)
}

//Consultar los places disponibles
app.get('/api/places', (req, res) => {
    const header = req.get("Accept");

    if (!header || header !== "application/json")
        return res.status(415).json({ message: "No soportado" });

    const db = readDatabase();
    res.status(200).json(db.places);
});


//Guardar los places seleccionados por el usuario
app.post('/api/places/selected/save', (req, res) => {
    const header = req.get("Content-Type");

    if (!header || header !== "application/json")
        return res.status(415).json({ message: "No soportado" });

    const placesSelected = req.body;

    const placeRepited = findMatchingPlace(placesSelected);
    console.log("Lugar repetido: ", placesSelected);
    if(placeRepited) {
        console.log("Debería entrar aca!")
        res.status(400).json({ message: `${placeRepited.name} ya se encuentra persistido. NO puede duplicar lugares`})
        return;
    }

    const db = readDatabase();
    db.placesSelected.push(...placesSelected);

    writeDatabase(db);

    console.log("Lugares seleccionados persistidos:", db.placesSelected);
    res.status(201).json({ message: "Lugares seleccionados guardados correctamente" });
});

//Crear un nuevo place por el usuario
app.post('/api/places/create', (req, res) => {
    const header = req.get("Content-Type");

    if (!header || header !== "application/json")
        return res.status(415).json({ message: "No soportado" });

    const place = req.body;

    if (!place)
        return res.status(400).json({ message: "No se enviaron los datos" });

    if (!place.name)
        return res.status(400).json({ message: "El nombre del lugar es obligatorio" });

    if (!place.image?.src)
        return res.status(400).json({ message: "La imagen del lugar es obligatoria" });

    const db = readDatabase();
    const places = db.places;
    
    const id = places.length > 0 ? places[places.length - 1].id + 1 : 1;
    place.id = id;

    places.push(place);
    writeDatabase(db);

    res.status(201).json({ message: "Lugar creado correctamente" });
});

//Consultar los places seleccionados persistidos por el usuario
app.get('/api/places/selected', (req, res) => {
    const header = req.get("Accept");

    if (!header || header !== "application/json")
        return res.status(415).json({ message: "No soportado" });

    const db = readDatabase();

    res.status(200).json(db.placesSelected);
});

//Borrar un place seleccionado persistido
app.delete('/api/places/selected/delete/:id', (req, res) => {
    const header = req.get("Accept");

    if (!header || header !== "application/json")
        return res.status(415).json({ message: "No soportado" });

    const id = parseInt(req.params.id);

    if (!id)
        return res.status(400).json({ message: "El ID es obligatorio" });

    if(id < 0)
        return res.status(400).json({ message: "Un ID no puede ser negativo"})

    const db = readDatabase();

    const placeFinded = findPlaceById(id);

    if(!placeFinded)
        return res.status(400).json({ message: "NO existe un lugar con ese ID"})

    const deletedA = deletePlace(db.placesSelected, placeFinded.id)

    if(!deletedA)
        return res.status(400).json({ message: "NO se pudo eliminar de los lugares seleccionados persistidos"})

    //Si el lugar tiene default igual a false, se debe eliminar tambie de los places comunes
    if(!placeFinded.default) {
        const deletedB = deletePlace(db.places, placeFinded.id);

        if(!deletedB) 
            return res.status(400).json({ message: "NO se pudo eliminar como lugar disponible para seleccionar"})
    }
    
    writeDatabase(db);

    res.status(200).json({ message: "Lugar eliminado correctamente" });
});

app.delete("/api/places/selected/clear", (req, res) => {
    const header = req.get("Accept");

    if (!header || header !== "application/json")
        return res.status(415).json({ message: "No soportado" });

    const db = readDatabase();

    db.placesSelected = [];
    db.places = db.places.filter(place => place.default)

    writeDatabase(db);

    if(db.placesSelected.length > 0 || db.places.length > QUANTITY_PLACES_DEFAULT)
        res.status(400).json({ message: "NO se pudo vaciar los lugares seleccionados"})

    res.status(200).json({ message: "Vaciado correctamente"})
})

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}/api/places`));


