import { Photo } from "../../types/photos";
import * as C from "./styles";

type Props = {
    data: Photo;
    url: string;
    name: string;
    onDeleteItem: (item: Photo) => void;
};

export const PhotoItem = ({ url, name, onDeleteItem, data }: Props) => {
    const handleDeleteItem = (item: Photo) => {
        onDeleteItem(item);
    };
    return (
        <C.Container>
            <img src={url} alt={name} />
            <button onClick={() => handleDeleteItem(data)}>Delete</button>
        </C.Container>
    );
};
