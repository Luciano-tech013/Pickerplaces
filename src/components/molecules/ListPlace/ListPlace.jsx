import Place from "../Place/Place.jsx";

export default function ListPlace({ onClick, children }) {
    return (
        <ul>
            {children.length > 0 && children.map(place => (
                <Place key={place.id} {...place} onClick={() => onClick(place.id)} />
            ))}
        </ul>
    );
}
