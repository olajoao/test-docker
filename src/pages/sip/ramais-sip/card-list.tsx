import { Card, CardContent } from "@/components/ui/card";
import { Phone } from "lucide-react";

function CardList() {
  return (
    <div className="flex items-center gap-5">
      <Card className="w-full">
        <CardContent className="flex items-center justify-between">
          <p className="flex flex-col">
            <span className="text-muted-foreground text-sm">Ramais criados</span>
            <span className="font-semibold text-2xl">17</span>
          </p>
          <div className="p-3 rounded-md bg-sky-200">
            <Phone className="w-5 h-5 text-sky-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardContent className="flex items-center justify-between">
          <p className="flex flex-col">
            <span className="text-muted-foreground text-sm">Ramais online</span>
            <span className="font-semibold text-2xl text-green-600">17</span>
          </p>
          <div className="p-3 rounded-md bg-green-200">
            <Phone className="w-5 h-5 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardContent className="flex items-center justify-between">
          <p className="flex flex-col">
            <span className="text-muted-foreground text-sm">Ramais offline</span>
            <span className="font-semibold text-2xl text-red-600">17</span>
          </p>
          <div className="p-3 rounded-md bg-red-200">
            <Phone className="w-5 h-5 text-red-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardContent className="flex items-center justify-between">
          <p className="flex flex-col">
            <span className="text-muted-foreground text-sm">IP de Registro</span>
            <span className="font-semibold text-2xl text-purple-600">17</span>
          </p>
          <div className="p-3 rounded-md bg-purple-200">
            <Phone className="w-5 h-5 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CardList;
