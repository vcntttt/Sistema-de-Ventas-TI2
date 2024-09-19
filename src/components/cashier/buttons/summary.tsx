import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  quantity: number;
  totalPrice: number;
  originalPrice: number;
  discountedPrice?: number;
}

interface Props {
  products: Product[];
  total: number;
  onClose: () => void;
}

const ProductSummary: React.FC<Props> = ({ products, total, onClose }) => {
  return (
    <div className="px-6 pt-6">
      <div className="max-h-96 overflow-y-auto">
        {products.map((product, index) => {
          const formattedOriginalPrice = new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
          }).format(product.originalPrice);
          const formattedTotalPrice = new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
          }).format(product.totalPrice);
          const formattedDiscountedPrice = new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
          }).format(product.discountedPrice || product.totalPrice);
          const discount = product.discountedPrice
            ? (product.originalPrice - product.discountedPrice) / product.originalPrice * 100
            : 0;

          return (
            <div
              key={index}
              className={`flex justify-between items-center py-3 px-4 rounded-md transition-colors 
                          ${index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"} hover:bg-gray-200`}
            >
              <div className="text-gray-700 font-medium">
                {String(product.id).padStart(3, "0")} - {product.name}{" "}
                <span className="text-gray-500">x{product.quantity}</span>
              </div>
              <div className="ml-8 text-right text-gray-700 font-semibold">
                {product.discountedPrice && discount > 0 ? (
                  <div className="flex flex-col items-end">
                    <span className="line-through text-gray-500">{formattedOriginalPrice}</span>
                    <span className="text-red-500">{formattedDiscountedPrice}</span>
                    <span className="text-gray-500">(-{Math.round(discount)}%)</span>
                  </div>
                ) : (
                  formattedTotalPrice
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-right font-bold text-lg mt-4 text-gray-800 border-t pt-4 border-gray-200">
        Total: {new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(total)}
      </div>

      <div className="w-full flex justify-end pt-4">
        <Button onClick={onClose}>Finalizar compra</Button>
      </div>
    </div>
  );
};

export default ProductSummary;
