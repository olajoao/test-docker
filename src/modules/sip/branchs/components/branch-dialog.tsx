import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
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
import { Globe, Plus, Settings, Shield, UserIcon } from "lucide-react"

export function BranchDialog() {
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
          <Button variant="outline" className="cursor-pointer bg-emerald-600 text-white">
            <Plus />
            Novo Ramal
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Ramal SIP</DialogTitle>
            <DialogDescription>Preencha as informações para criar um novo ramal no sistema</DialogDescription>
          </DialogHeader>
          <Accordion
            type="multiple"
            className="w-full grid gap-4 max-h-[70dvh] overflow-y-auto"
          >
            <AccordionItem value="item-1" className="border p-3 rounded-md">
              <AccordionTrigger className="justify-between outline-none focus-visible:ring-transparent hover:no-underline cursor-pointer font-semibold">
                <div className="flex items-center gap-x-2">
                  <UserIcon />
                  Informações Básicas
                </div>
              </AccordionTrigger>
              <AccordionContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-balance">
                <form.Field
                  name="sipBranch"
                  children={(field) => (
                    <div className="col-span-2 flex items-center justify-center py-2">
                      <Label htmlFor="avatar" className="overflow-clip w-14 h-14 rounded-full ring-1 ring-neutral-400">
                        <img className="w-full h-full" />
                      </Label>
                      <Input
                        id="avatar"
                        className="hidden"
                        name={field.name}
                        value={field.state.value}
                        type='file'
                        onChange={(e) => field.handleChange(e.target.value)}
                      />

                    </div>
                  )}
                />

                <form.Field
                  name="sipBranch"
                  children={(field) => (
                    <div className="space-y-2">
                      <Label>Ramal SIP</Label>
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
                      <Label>Regra de Saída</Label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione uma regra" />
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
                      <Label>Grupo</Label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione um grupo" />
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


              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border p-3 rounded-md">
              <AccordionTrigger className="justify-between outline-none focus-visible:ring-transparent hover:no-underline cursor-pointer font-semibold">
                <div className="flex items-center gap-x-2">
                  <Settings />
                  Configurações Avançadas
                </div>
              </AccordionTrigger>
              <AccordionContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-balance">
                <form.Field
                  name="sipBranch"
                  children={(field) => (
                    <div className="space-y-2">
                      <Label>Ramal SIP</Label>
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
                      <Label>Regra de Saída</Label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a fruit" />
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
                      <Label>Grupo</Label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a fruit" />
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


              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border p-3 rounded-md">
              <AccordionTrigger className="justify-between outline-none focus-visible:ring-transparent hover:no-underline cursor-pointer font-semibold">
                <div className="flex items-center gap-x-2">
                  <Shield />
                  Segurança e Recursos
                </div>
              </AccordionTrigger>
              <AccordionContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-balance">
                <form.Field
                  name="sipBranch"
                  children={(field) => (
                    <div className="space-y-2">
                      <Label>Ramal SIP</Label>
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
                      <Label>Regra de Saída</Label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a fruit" />
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
                      <Label>Grupo</Label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a fruit" />
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


              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="last:border p-3 rounded-md">
              <AccordionTrigger className="justify-between outline-none focus-visible:ring-transparent hover:no-underline cursor-pointer font-semibold">
                <div className="flex items-center gap-x-2">
                  <Globe />
                  Gestão Web
                </div>
              </AccordionTrigger>
              <AccordionContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-balance">
                <form.Field
                  name="sipBranch"
                  children={(field) => (
                    <div className="space-y-2">
                      <Label>Ramal SIP</Label>
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
                      <Label>Regra de Saída</Label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a fruit" />
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
                      <Label>Grupo</Label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a fruit" />
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


              </AccordionContent>
            </AccordionItem>
          </Accordion>
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

