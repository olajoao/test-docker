import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PersonIcon } from "@radix-ui/react-icons";
import { useUserProfileModel } from "./user-profile.model";
import type { WhoAmIUser } from "../../interfaces/who-am-i";

function UserProfileForm({ user }: { user: WhoAmIUser }) {
  const { data, state, actions } = useUserProfileModel({ user });
  return (
    <Form {...data.form}>
      <form
        id="handleUserProfileForm"
        className="space-y-8"
        onSubmit={data.form.handleSubmit(actions.handleSubmit)}
      >
        <FormField
          control={data.form.control}
          name="avatar"
          disabled={state.isPending}
          render={() => (
            <FormItem>
              <FormLabel htmlFor="avatar">Imagem de perfil</FormLabel>
              <FormControl>
                <label
                  htmlFor="avatar"
                  className="cursor-pointer rounded-lg flex items-center justify-center"
                >
                  <Input
                    type="file"
                    accept="image/*"
                    id="avatar"
                    className="hidden"
                    disabled={state.isPending}
                    {...data.form.register("avatar")}
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      actions.handleImageChange(file);
                    }}
                  />
                  <div className="relative group w-20 h-20 cursor-pointer bg-sky-100 dark:bg-sky-900/30 border-sky-500 dark:border-sky-800 hover:border-neutral-500 shadow-md hover:shadow-none rounded-full overflow-clip border border-dashed flex items-center justify-center">
                    {!data.localImage && !user?.avatar && (
                      <PersonIcon className="w-10 h-10 opacity-30 group-hover:text-sky-500 group-hover:opacity-100" />
                    )}

                    {data.localImage ? (
                      <img
                        src={data.localImage}
                        alt="Foto de perfil do usuário"
                      />
                    ) : null}

                    {user?.avatar && !data.localImage ? (
                      <img src={user.avatar} alt={user.nome} />
                    ) : null}
                  </div>
                </label>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

export default UserProfileForm;
