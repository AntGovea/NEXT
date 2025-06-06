import { WidgetItem } from "@/components";
import { Product, products } from "@/data/products";
import { ItemCard } from "@/shoopping-cart";
import { cookies } from "next/headers";

export const metada = {
    title: 'Carrito de compras',
    description: 'SEO Title'
}
interface ProductInCart {
    product: Product,
    quanity: number;

}

const getProductsInCar = (cart: { [key: string]: number }): ProductInCart[] => {

    const productsInCart: ProductInCart[] = [];

    for (const id of Object.keys(cart)) {
        const producto = products.find((prod) => prod.id === id);

        if (producto) {
            productsInCart.push({ product: producto, quanity: cart[id] })
        }

    }
    return productsInCart

}



export default async function CartPage() {

    const cookieStore = await cookies();
    const cart = JSON.parse(cookieStore.get('cart')?.value ?? '{}');
    const productsInCart = getProductsInCar(cart);

    const totalToPay = productsInCart.reduce((prev, current) => current.product.price * current.quanity + prev, 0)



    return (
        <div>
            <h1 className="text-5xl text-gray-800">Productos en el carrito</h1>
            <hr className="mb-2" />
            <div className="flex flex-col sm:flex-row- gap-2 w-full">

                <div className="flex flex-col gap-2 w-full sm:w-8/12">
                    {
                        productsInCart.map(({ product, quanity }) => (
                            <ItemCard
                                key={product.id}
                                product={product}
                                quantity={quanity}
                            />
                        ))
                    }

                </div>
                <div className="flex flex-col  w-full sm:w-4/12">
                    <WidgetItem
                        title={'Total a pagar'}
                        children={
                            <div className="mt-2 flex justify-center gap-4" >
                                <h3 className="text-3xl text-gray-800 font-bold">${(totalToPay * 1.15).toFixed(2)}</h3>
                                <span className="text-gray-700 font-bold text-center">
                                    Impuestos 15%: {(totalToPay * .15).toFixed(2)}
                                </span>
                            </div>
                        } />
                </div>
            </div>

        </div>
    )
}
