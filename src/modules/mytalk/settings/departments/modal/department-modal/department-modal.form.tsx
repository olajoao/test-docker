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
import { DepartmentProps } from "../../departments.types";
import { useDepartmentModalModel } from "./department-modal.model";

function DepartmentModalForm({ department }: { department?: DepartmentProps }) {
  const { data, actions } = useDepartmentModalModel({ department });

  return (
    <Form {...data.form}>
      <form
        id="handleDepartmentForm"
        encType="multipart/form-data"
        className="space-y-5"
        onSubmit={data.form.handleSubmit(actions.handleDepartment)}
      >
        <FormField
          name="name"
          control={data.form.control}
          render={() => (
            <FormItem className="flex flex-col gap-y-1 relative">
              <FormLabel>Nome</FormLabel>
              <Input
                placeholder="Ex: Dep. financeiro"
                {...data.form.register("name")}
              />
              <FormMessage className="text-red-500 text-[10px] absolute -bottom-4 right-0" />
            </FormItem>
          )}
        />
        <FormField
          name="description"
          control={data.form.control}
          render={() => (
            <FormItem className="flex flex-col gap-y-1 relative">
              <FormLabel>Descrição</FormLabel>
              <Input
                placeholder="Ex: controle financeiro"
                {...data.form.register("description")}
              />
              <FormMessage className="text-red-500 text-[10px] absolute -bottom-4 right-0" />
            </FormItem>
          )}
        />
        <FormField
          control={data.form.control}
          name="user_ids"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Membros</FormLabel>
              <div className="space-y-1 max-h-[50dvh] overflow-auto">
                {Array.isArray(data?.contactList?.data) && data.contactList.data.map((contact) => (
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
        <div>{JSON.stringify(data.form.formState.errors)}</div>
      </form>
    </Form>
  );
}

export default DepartmentModalForm;
