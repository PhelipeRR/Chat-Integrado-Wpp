import axios from "axios";

const baseURL = process.env.NODE_ENV !== "development" ? `https://${location.hostname}:${location.port}` :  `https://localhost:5001`;
const token = localStorage.getItem('token');
const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        Authorization: `${token}`,
    }
});

export async function read(url: string) {
    const { data } = await axiosInstance.get(url);

    return data;
}

export async function exclude(url: string) {
    await axiosInstance.delete(url);
}

export async function create(url: string, object:any) {
    const { data } = await axiosInstance.post(url, object);
    return data;
}

export async function edit(url: string, object: {}) {
    const { data } = await axiosInstance.put(url, object);
    return data;
}
