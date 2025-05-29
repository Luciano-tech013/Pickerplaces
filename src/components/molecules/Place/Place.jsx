
export default function Place({ id, image, name, onClick }) {
    const handleClick = () => {
        onClick(id);
    };

    return (
        <li>
            <button onClick={handleClick}><img src={image.src} alt={image.alt}/> {name}</button>
        </li>
    );
}