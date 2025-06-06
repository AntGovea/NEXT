import { products } from "@/data/products";
import { ProductCard } from "@/products/components";

export default function ProductsPage() {


    return (
        <div className="grid grid-cols-1 sm:grid-cold-3 gap-2">
            {
                products.map((product) => (
                    <ProductCard key={product.id} {...product} />
                ))}
        </div>
    )
}