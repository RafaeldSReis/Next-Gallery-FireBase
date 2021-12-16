import { useState, useEffect, FormEvent } from "react";
import Head from "next/head";
import * as Photos from "../services/photos";
import * as C from "../styles/styled";
import { Photo } from "../types/photos";
import { PhotoItem } from "../components/PhotoItem";

export default function Home() {
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [photos, setPhotos] = useState<Photo[]>([]);

    useEffect(() => {
        const getPhotos = async () => {
            setLoading(true);
            setPhotos(await Photos.getAll());
            setLoading(false);
        };
        getPhotos();
    }, []);

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formeData = new FormData(e.currentTarget);
        const file = formeData.get("image") as File;

        if (file && file.size > 0) {
            setUploading(true);
            const result = await Photos.insert(file);
            setUploading(false);
            if (result instanceof Error) {
                alert(`${result.name} - ${result.message}`);
            } else {
                const newPhotoList = [...photos];
                newPhotoList.push(result);
                setPhotos(newPhotoList);
            }
        }
    };
    const handleDeleteItem = (item: Photo) => {
        Photos.deletePhoto(item);
        const UpdateList = photos.filter((CurrentItem) => {
            if (CurrentItem.id != item.id) return item;
        });
        setPhotos(UpdateList);
    };

    return (
        <C.Container>
            <Head>
                <title>Next Gallery</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            <C.Area>
                <C.Header>GALERIA DE FOTOS</C.Header>

                <C.UploadForm method="POST" onSubmit={handleFormSubmit}>
                    <input type="file" name="image" />
                    <input type="submit" value="Enviar" />
                    {uploading && "Enviando..."}
                </C.UploadForm>

                {loading && (
                    <C.ScreenWarning>
                        <div className="emoji">🤚</div>
                        <div>Carregando...</div>
                    </C.ScreenWarning>
                )}

                {!loading && photos.length > 0 && (
                    <C.PhotoList>
                        {photos.map((item, key) => (
                            <PhotoItem
                                key={key}
                                url={item.url}
                                name={item.name}
                                data={item}
                                onDeleteItem={(item) => handleDeleteItem(item)}
                            />
                        ))}
                    </C.PhotoList>
                )}
                {!loading && photos.length === 0 && (
                    <C.ScreenWarning>
                        <div className="emoji">😔</div>
                        <div>Não há fotos cadastradas...</div>
                    </C.ScreenWarning>
                )}
            </C.Area>
        </C.Container>
    );
}
