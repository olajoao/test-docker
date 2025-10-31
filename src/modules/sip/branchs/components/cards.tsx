import { Card, CardContent } from "@/components/ui/card";
import { Phone } from "lucide-react";

interface CardProps {
  createdBranchs: number
  onlineBranchs: number
  offlineBranchs: number
  registeredIP: string
}

export function Cards({ cardData }: { cardData: CardProps }) {
  return (
    <div className="flex gap-5">
      <Card className="w-full p-3">
        <CardContent className="flex items-center justify-between px-2 2xl:px-3">
          <p className="flex flex-col">
            <span className="text-muted-foreground text-xs 2xl:text-sm">Ramais criados</span>
            <span className="font-semibold text-xl 2xl:text-xl">{cardData?.createdBranchs ?? 0}</span>
          </p>
          <div className="p-2 rounded-md bg-sky-100">
            <Phone className="w-4 2xl:w-5 h-4 2xl:h-5 text-sky-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="w-full p-3">
        <CardContent className="flex items-center justify-between px-2 2xl:px-3">
          <p className="flex flex-col">
            <span className="text-muted-foreground text-xs 2xl:text-sm">Ramais online</span>
            <span className="font-semibold text-xl 2xl:text-xl text-green-600">{cardData?.onlineBranchs ?? 0}</span>
          </p>
          <div className="p-2 rounded-md bg-green-100">
            <Phone className="w-4 2xl:w-5 h-4 2xl:h-5 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="w-full p-3">
        <CardContent className="flex items-center justify-between px-2 2xl:px-3">
          <p className="flex flex-col">
            <span className="text-muted-foreground text-xs 2xl:text-sm">Ramais offline</span>
            <span className="font-semibold text-xl 2xl:text-xl text-red-600">{cardData?.offlineBranchs ?? 0}</span>
          </p>
          <div className="p-2 rounded-md bg-red-100">
            <Phone className="w-4 2xl:w-5 h-4 2xl:h-5 text-red-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="w-full p-3">
        <CardContent className="flex items-center justify-between px-2 2xl:px-3">
          <p className="flex flex-col gap-y-1">
            <span className="text-muted-foreground text-xs 2xl:text-sm">IP de Registro</span>
            <span className="max-w-32 font-semibold text-lg text-purple-600 truncate">{cardData?.registeredIP ?? 0}</span>
          </p>
          <div className="p-2 rounded-md bg-purple-100">
            <Phone className="w-4 2xl:w-5 h-4 2xl:h-5 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
