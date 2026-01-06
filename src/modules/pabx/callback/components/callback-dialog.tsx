import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "@tanstack/react-form"
import { Plus } from "lucide-react"

export function CallbackDialog() {
  const form = useForm({
    defaultValues: {
      sipBranch: '',
      name: '',
      exitRule: '',
      group: '',
    },
  })

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="text-xs 2xl:text-sm cursor-pointer bg-emerald-600 text-white">
            <Plus />
            Novo Ramal
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastrar Callback</DialogTitle>
            <DialogDescription>Preencha as informações para criar um novo callback no sistema</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-6  max-h-[70dvh] text-balance">
            <form.Field
              name="name"
              children={(field) => (
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input
                    className='flex-1 outline-none ring-none focus-visible:ring-0'
                    name={field.name}
                    value={field.state.value}
                    type='text'
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            />

            <form.Field
              name="exitRule"
              children={(field) => (
                <div className="space-y-2">
                  <Label>Tipo da Chamada</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o tipo da chamada" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>regras</SelectLabel>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="blueberry">Blueberry</SelectItem>
                        <SelectItem value="grapes">Grapes</SelectItem>
                        <SelectItem value="pineapple">Pineapple</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />

            <form.Field
              name="group"
              children={(field) => (
                <div className="space-y-2">
                  <Label>Enviar Chamada</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um destino" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>grupos</SelectLabel>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="blueberry">Blueberry</SelectItem>
                        <SelectItem value="grapes">Grapes</SelectItem>
                        <SelectItem value="pineapple">Pineapple</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" className="bg-emerald-600 text-white">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog >
  )
}

