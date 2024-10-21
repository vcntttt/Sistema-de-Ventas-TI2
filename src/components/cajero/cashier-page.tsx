import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ProductSearch from "@/components/cajero/buttons/product-search";
import ProductSummary from "@/components/cajero/buttons/summary";
import useCarrito from "@/hooks/cajero/use-carrito";
import ProductTable from "@/components/cajero/data-table";
import Logo from "@/components/icons/logo";
import PaymentDialog from "@/components/cajero/Payment";
import { useState } from "react";
import { ResponsiveModal } from "../responsive-modal";
import ClientSearch from "./buttons/search-client";
import { RegisterNewClientForm } from "./buttons/client-form";

const CajeroLayout = () => {
  const { user, logOut } = useAuthStore();
  const setLocation = useLocation()[1];
  const {
    addedProducts,
    code,
    quantity,
    total,
    setCode,
    setQuantity,
    handleAddProduct,
    handleKeyPress,
    endSale,
  } = useCarrito();

  const [isDialogOpen, setIsDialogOpen] = useState({
    payment: false,
    receipt: false,
  });

  const handleOpenDialog = (dialogName: "payment" | "receipt") => {
    setIsDialogOpen({
      payment: dialogName === "payment",
      receipt: dialogName === "receipt",
    });
  };

  const handlePaymentMethodSelect = (method: string) => {
    console.log(`Selected payment method: ${method}`);
    handleOpenDialog("receipt"); // Open Receipt Dialog
    setIsDialogOpen((prevState) => ({ ...prevState, payment: false }));
  };

  const [isPaymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const dynamicTotalCost = total;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header Section */}
      <header className="bg-white shadow-md p-4 fixed top-0 left-0 w-full flex justify-between items-center z-10">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Logo className="size-12 filter invert" />
          </Link>
          <h2 className="text-2xl font-semibold text-gray-800 ml-10">
            Panel de Cajero
          </h2>
        </div>
        <div className="text-gray-600 flex flex-col items-end">
          <p className="text-sm">
            Cajero: <span className="font-medium">{user.name}</span>
          </p>
          <p className="text-xl font-semibold mt-1">
            Total: <span className="font-bold text-blue-600">${total}</span>
          </p>
        </div>
      </header>

      <div className="flex flex-1 pt-20">
        {/* Sidebar Section */}
        <aside className="bg-white shadow-md rounded-lg p-4 w-64 fixed top-20 left-0 border-r border-gray-200 flex flex-col h-auto min-h-[calc(100vh-5rem)] lg:min-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="flex flex-col gap-4 mb-auto">
            <h3 className="text-lg font-semibold mb-4">Opciones</h3>


            <ResponsiveModal
              trigger={
                <Button className="bg-blue-700 text-white hover:bg-blue-800 rounded-lg shadow-md transition duration-200 w-full">
                  Buscar Producto
                </Button>
              }
              title="Buscar Producto"
              description="Buscador de productos"
            >
              <ProductSearch />
            </ResponsiveModal>
            <ResponsiveModal
              trigger={
                <Button className="bg-teal-700 text-white hover:bg-teal-800 active:bg-teal-900 rounded-lg shadow-md transition duration-200 w-full">
                  Buscar Cliente
                </Button>
              }
              title="Buscar Cliente"
              description="Buscador de clientes por nombre o rut"
              className="md:min-w-[700px]"
            >
              <ClientSearch/>
            </ResponsiveModal>
            <ResponsiveModal
              trigger={
                <Button className="bg-teal-700 text-white hover:bg-teal-800 active:bg-teal-900 rounded-lg shadow-md transition duration-200 w-full">
                  Registrar Cliente
                </Button>
              }
              title="Registrar Cliente"
              description="Registrar nuevos clientes"
            >
              <RegisterNewClientForm/>
            </ResponsiveModal>

            <Button
              className="rounded-lg shadow-md transition duration-200 w-full"
              onClick={() => setPaymentDialogOpen(true)} 
            >
              Finalizar Compra
            </Button>
          </div>
          <div className="mt-auto space-y-2">
            {user.role === "admin" && (
              <Button
                asChild
                className="rounded-lg shadow-md transition duration-200 w-full whitespace-normal text-center"
              >
                <Link href="/dashboard">Volver al panel de administración</Link>
              </Button>
            )}
            <Button
              asChild
              className="rounded-lg shadow-md transition duration-200 w-full"
              onClick={() => {
                logOut()
                setLocation("/")
              }}
            >
              Cerrar Sesión
            </Button>
          </div>
        </aside>

        {/* Main Content Section */}
        <main className="flex-1 ml-64 p-6 flex flex-col">
          <section className="shadow-md rounded-lg border mb-7 flex-grow">
            <ProductTable products={addedProducts} />
          </section>
          <section
            className="bg-white shadow-md rounded-lg p-4 border border-gray-200 flex flex-col"
            style={{ minHeight: "120px" }}
          >
            <h3 className="text-lg font-semibold mb-4">Ingresar Producto</h3>
            <div className="flex gap-4">
              <div className="flex-col items-center gap-4">
                <Label htmlFor="code" className="text-right">
                  Código
                </Label>
                <Input
                  id="code"
                  type="number"
                  value={code ?? ""}
                  onChange={(e) => setCode(parseInt(e.target.value))}
                  placeholder="001"
                  className="col-span-3"
                  required
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div className="flex-col items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Cantidad
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="col-span-3"
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <Button
                size="lg"
                className="rounded-lg shadow-md transition duration-200"
                onClick={handleAddProduct}
              >
                Confirmar
              </Button>
            </div>
          </section>
        </main>
      </div>

      {/* Payment Dialog */}
      <PaymentDialog
        isOpen={isPaymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        onSelectPaymentMethod={handlePaymentMethodSelect}
        totalCost={dynamicTotalCost}
      />

      {/* Receipt Dialog */}
      <Dialog
        open={isDialogOpen.receipt}
        onOpenChange={() =>
          setIsDialogOpen((prevState) => ({ ...prevState, receipt: false }))
        }
      >
        <DialogContent className="min-w-[425px]">
          <DialogHeader>
            <DialogTitle>Boleta</DialogTitle>
            <DialogDescription>Detalle de productos y total.</DialogDescription>
          </DialogHeader>
          <ProductSummary
            products={addedProducts}
            total={total}
            onClose={() => {
              setIsDialogOpen((prevState) => ({
                ...prevState,
                receipt: false,
              }));
              endSale();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CajeroLayout;