import express from "express";
import PLACES from "./data/data.mjs";
import PLACES_SELECTED from "./data/user.mjs";
import cors from "cors";

const PORT = 3000;
const app = express();

//Parsea el body a JSON
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET","POST","PUT","DELETE"],
    allowedHeaders: ["Content-Type", "Accept"]
}));

//Consultar los places disponibles
app.get('/api/places', (req, res) => {
    const header = req.get("Accept");

    if(!header || header != "application/json")
        res.status(415).json({ message: "No soportado"})

    const places = PLACES;
    res.status(200).json(places);
});

//Guardar los places seleccionados por el usuario
app.post('/api/places/save', (req, res) => {
    const header = req.get("Content-Type");

    if(!header || header != "application/json")
        res.status(415).json({ message: "No soportado"});

    const placesSelected = req.body;
    PLACES_SELECTED.push(...placesSelected);

    res.status(201).json({ message: "Lugares seleccionados guardados correctamente" });
});

//Crear un nuevo place por el usuario
app.post('/api/places/create', (req, res) => {
    const header = req.get("Content-Type");

    if(!header || header != "application/json")
        res.status(415).json({ message: "No soportado"});

    const place = req.body;

    if(!place)
        return res.status(400).json({ message: "No se enviaron los datos" });

    if(!place.name)
        return res.status(400).json({ message: "El nombre del lugar es obligatorio" });

    if(!place.image.src) 
        return res.status(400).json({ message: "La imagen del lugar es obligatoria" });

    //const image = place.image.src;

    const size = PLACES.length;
    const id = PLACES[size-1].id + 1; //El ID del ultimo existente + 1
    place.id = id;
    PLACES.push(place);


    res.status(201).json({ message: "Lugar creado correctamente" });
});

//Consultar los places seleccionados persistidos por el usuario
app.get('/api/places/selected', (req, res) => {
    const header = req.get("Accept");

    if(!header || header != "application/json")
        res.status(415).json({ message: "No soportado"});

    const placesSelected = PLACES_SELECTED;
    res.status(200).json(placesSelected);
});

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}/api/places`));


