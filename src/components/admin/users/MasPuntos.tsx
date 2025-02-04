import { useEffect, useState } from "react";
import { getTopPuntos } from "@/api/Client";
import { UserResponse } from "@/types/users";
import { ShowNotification } from "@/components/NotificationProvider";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { User } from "lucide-react";

export default function Top5CustomersCard() {
  const [topCustomers, setTopCustomers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [clientName, setClientName] = useState<string | null>(null);
  useEffect(() => {
    const fetchTopCustomers = async () => {
      try {
        const customers = await getTopPuntos();
        console.log(customers);
        setTopCustomers(customers.slice(0, 5));
        if (customers.length > 0) {
          setClientName(customers[0].nombre);
        }
      } catch (error) {
        console.log(error);
        setError("Error al cargar clientes con más puntos.");
        ShowNotification("Error al cargar clientes con más puntos.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTopCustomers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Card className="w-80 h-auto flex-col flex p-4 justify-between">
      <CardHeader>
        <CardTitle className="flex text-sm justify-between">
          Clientes con Más Puntos <User />
        </CardTitle>
        <CardDescription className="sr-only">
          Clientes con más puntos acumulados
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2">
        {clientName && (
          <p className="text-sm text-gray-600 mb-2">
            Cliente Top: {clientName}
          </p>
        )}
        <ol className="list-decimal pl-4 space-y-2 text-sm">
          {topCustomers.map((customer, index) => (
            <li key={customer.rut} className="flex items-center">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white mr-2">
                {index + 1}
              </span>
              {customer.nombre_completo} - {customer.puntos} puntos
            </li> //nombre_completo es as de ( u.nombre "" u.apellido)
          ))}
        </ol>
      </CardContent>
      <CardFooter className=""></CardFooter>
    </Card>
  );
}
