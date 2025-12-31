import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useChannelGroupModel } from "./channel-group.model";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { DialogClose } from "@radix-ui/react-dialog";
import type { ChannelProps } from "../../channel.types";

function ChannelGroupForm({ groupChannel }: { groupChannel?: ChannelProps }) {
  const { state, data, actions } = useChannelGroupModel(groupChannel);
  const formId = groupChannel?.id ? "handleEditGroupForm" : "handleGroupForm"

  return (
    <Form {...data.channelGroupForm}>
      <form
        id={formId}
        encType="multipart/form-data"
        className="space-y-5 px-5 sm:px-0"
        onSubmit={data.channelGroupForm.handleSubmit((data) => {
          actions.handleCreateChannelGroup(data);
        })}
      >
        <FormField
          name="name"
          control={data.channelGroupForm.control}
          render={() => (
            <FormItem className="flex flex-col gap-y-1 relative">
              <FormLabel>Nome</FormLabel>
              <Input
                placeholder="Ex: Grupo financeiro"
                {...data.channelGroupForm.register("name")}
              />
              <FormMessage className="text-red-500 text-[10px] absolute -bottom-4 right-0" />
            </FormItem>
          )}
        />
        <FormField
          name="description"
          control={data.channelGroupForm.control}
          render={() => (
            <FormItem className="flex flex-col gap-y-1 relative">
              <FormLabel>Descrição</FormLabel>
              <Input
                placeholder="Ex: controle financeiro"
                {...data.channelGroupForm.register("description")}
              />
              <FormMessage className="text-red-500 text-[10px] absolute -bottom-4 right-0" />
            </FormItem>
          )}
        />

        <FormField
          control={data.channelGroupForm.control}
          name="members"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Membros</FormLabel>

              <div className="space-y-1 max-h-[50dvh] overflow-auto">
                {data?.contactList?.data && Object.values(data.contactList.data).map((contact) => (
                  <FormItem
                    key={contact.id}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(contact.id) ?? false}
                        onCheckedChange={(checked) => {
                          const currentValues = field.value || [];
                          return checked
                            ? field.onChange([...currentValues, contact.id])
                            : field.onChange(
                              currentValues.filter(
                                (value) => value !== contact.id,
                              ),
                            );
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      {contact.nome}
                    </FormLabel>
                  </FormItem>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="mt-5">
          <DialogClose>
            <Button
              variant="outline"
              type="button"
            >
              Fechar
            </Button>
          </DialogClose>
          <Button type="submit">
            {state.isCreatingChannelGroup ? (
              <Loader2 className="animate-spin" />
            ) : groupChannel?.id ? (
                "Editar grupo"
              ) : (
                  "Criar grupo"
                )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default ChannelGroupForm;
