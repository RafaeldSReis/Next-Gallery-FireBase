import { Photo } from "../types/photos";
import { storage } from "../libs/firebase";
// eslint-disable-next-line prettier/prettier
import { ref, listAll, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';
import { v4 as createId } from "uuid";

export const getAll = async () => {
    const list: Photo[] = [];

    const imagesFolder = ref(storage, "images");
    const photoList = await listAll(imagesFolder);
    for (const i in photoList.items) {
        const photoUrl = await getDownloadURL(photoList.items[i]);
        list.push({
            id: photoList.items[i].fullPath,
            name: photoList.items[i].name,
            url: photoUrl,
        });
    }
    return list;
};

export const insert = async (file: File) => {
    if (["image/jpeg", "image.jpg", "image.png"].includes(file.type)) {
        const randomName = createId();
        const newFile = ref(storage, `images/${randomName}`);
        const upload = await uploadBytes(newFile, file);
        const photoUrl = await getDownloadURL(upload.ref);

        return {
            name: upload.ref.name,
            url: photoUrl,
        } as Photo;
    } else {
        return new Error("Tipo de arquivo nao permitido");
    }
};

export const deletePhoto = async ({ id }: Photo) => {
    const DeleteRefFile = ref(storage, id);
    await deleteObject(DeleteRefFile);
};
