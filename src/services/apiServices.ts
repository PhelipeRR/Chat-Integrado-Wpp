import {create, read} from "./httpServices";

export async function apiPost(urL:string, Message:any) {
    return await create(urL, Message);
}

export async function apiGet(urL:string) {
    return await read(urL);
}