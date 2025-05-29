import Place from "../Place/Place.jsx";

export default function ListPlace({ places, message, onClick }) {
    if(message != null)
        return message

    return (
        <ul>
            {places.map(place => (
                <Place key={place.id} {...place} onClick={onClick}/>
            ))}
        </ul>
    );
}