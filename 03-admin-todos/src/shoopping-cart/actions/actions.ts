import { getCookie, hasCookie, setCookie } from "cookies-next";

const cookieName = 'cart';

const getCookieCart = (): { [id: string]: number } => {


    if (hasCookie(cookieName)) {
        const cookieCart = JSON.parse(getCookie(cookieName) as string ?? '{}');
        return cookieCart;
    }
    return {}
}

export const addProductCart = (id: string) => {

    const cookieCart = getCookieCart();
    if (cookieCart[id]) {
        cookieCart[id] = cookieCart[id] + 1;
    } else {

        cookieCart[id] = 1
    }
    setCookie(cookieName, JSON.stringify(cookieCart));
}
export const removeProductFromCart = (id: string): void => {
    const cookieCart = getCookieCart();
    delete cookieCart[id]
    setCookie(cookieName, JSON.stringify(cookieCart));
}
export const removeSingleItemFromCart = (id: string): void => {
    const cookieCart = getCookieCart();

    if (!cookieCart[id]) return


    cookieCart[id] -= 1
    if (!cookieCart[id]) {
        delete cookieCart[id]
    }
    setCookie(cookieName, cookieCart)


}