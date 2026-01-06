import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

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
import { cn } from "@/lib/utils"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useMp3Dropzone } from "../use-mp3-dropzone"
import { inferAudioNameFromFile, isMp3, revokeObjectUrl, toObjectUrl } from "../utils"
import { useUpdateManagementAudioMusic, useUploadManagementAudioMusic } from "../hooks"
import type { Media } from "../model"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"

const formSchema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("create"),
    file: z.instanceof(File, { message: "Campo obrigatório" }).refine((f) => isMp3(f), "Arquivo com o tipo não suportado"),
  }),
  z
    .object({
      mode: z.literal("edit"),
      id: z.string().min(1),
      nome: z.string().min(1, "Campo obrigatório"),
      existingUrl: z.string().optional().nullable(),
      file: z
        .instanceof(File)
        .refine((f) => isMp3(f), "Arquivo com o tipo não suportado")
        .optional()
        .nullable(),
    })
    .superRefine((v, ctx) => {
      const hasAny = Boolean(v.file) || Boolean(v.existingUrl)
      if (!hasAny) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["file"], message: "Campo obrigatório" })
      }
    }),
])

type FormValues = z.infer<typeof formSchema>

type AudioMusicDialogProps = {
  children?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  mode: "create" | "edit"
  media?: Media | null
  initialFile?: File | null
}

export function AudioMusicDialog({ children, open, onOpenChange, mode, media, initialFile }: AudioMusicDialogProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const uploadMutation = useUploadManagementAudioMusic()
  const updateMutation = useUpdateManagementAudioMusic()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues:
      mode === "edit"
        ? ({
            mode: "edit",
            id: media?.id ?? "",
            nome: media?.nome ?? "",
            existingUrl: media?.download_url ?? null,
            file: null,
          } satisfies FormValues)
        : ({
            mode: "create",
            file: undefined as unknown as File,
          } satisfies FormValues),
  })

  const file = form.watch("file" as any) as File | null | undefined
  const existingUrl = mode === "edit" ? ((form.watch("existingUrl" as any) as string | null | undefined) ?? null) : null
  const canPreview = Boolean(file) || Boolean(existingUrl)

  useEffect(() => {
    if (!open) return

    if (mode === "edit") {
      form.reset({
        mode: "edit",
        id: media?.id ?? "",
        nome: media?.nome ?? "",
        existingUrl: media?.download_url ?? null,
        file: null,
      } as FormValues)
      return
    }

    form.reset({ mode: "create", file: (undefined as unknown) as File } as FormValues)
    if (initialFile) {
      form.setValue("file" as any, initialFile, { shouldValidate: true })
    }
  }, [open, mode, media?.id, media?.nome, media?.download_url, initialFile, form])

  useEffect(() => {
    revokeObjectUrl(previewUrl)

    if (file instanceof File) {
      setPreviewUrl(toObjectUrl(file))
    } else {
      setPreviewUrl(null)
    }

    return () => revokeObjectUrl(previewUrl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])

  useEffect(() => {
    if (!open) {
      setIsPlaying(false)
      audioRef.current?.pause()
      audioRef.current = null
    }
  }, [open])

  const activeSrc = previewUrl || existingUrl || null

  const { isDragOver, acceptFile, bind } = useMp3Dropzone({
    onFile: (f) => {
      if (mode === "create") {
        form.setValue("file" as any, f, { shouldValidate: true })
        return
      }

      form.setValue("file" as any, f, { shouldValidate: true })
      form.setValue("existingUrl" as any, null, { shouldValidate: true })
    },
  })

  const fileLabel = useMemo(() => {
    if (file instanceof File) return file.name
    if (mode === "edit" && existingUrl) return "Arquivo carregado"
    return "Arraste e solte ou clique para selecionar"
  }, [file, mode, existingUrl])

  const pickFile = () => inputRef.current?.click()

  const clearFile = () => {
    form.setValue("file" as any, null, { shouldValidate: true })
    if (mode === "edit") {
      form.setValue("existingUrl" as any, null, { shouldValidate: true })
    }
    setIsPlaying(false)
    audioRef.current?.pause()
  }

  const toggleInlinePlay = async () => {
    if (!activeSrc) return

    if (!audioRef.current) {
      audioRef.current = new Audio(activeSrc)
      audioRef.current.addEventListener("ended", () => setIsPlaying(false))
    } else if (audioRef.current.src !== activeSrc) {
      audioRef.current.pause()
      audioRef.current = new Audio(activeSrc)
      audioRef.current.addEventListener("ended", () => setIsPlaying(false))
      setIsPlaying(false)
    }

    if (audioRef.current.paused) {
      await audioRef.current.play()
      setIsPlaying(true)
    } else {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const submit = async (values: FormValues) => {
    try {
      if (values.mode === "create") {
        const nome = inferAudioNameFromFile(values.file)
        await uploadMutation.mutateAsync({ file: values.file, nome })
        toast.success("Áudio cadastrado com sucesso!")
      } else {
        await updateMutation.mutateAsync({
          id: values.id,
          nome: values.nome,
          file: values.file ?? undefined,
        })
        toast.success("Áudio atualizado com sucesso!")
      }

      onOpenChange?.(false)
    } catch {
      toast.error("Falha ao salvar áudio")
    }
  }

  const isPending = uploadMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Editar Áudio e Música" : "Cadastrar Áudio e Música"}</DialogTitle>
          <DialogDescription>Lorem ipsum ipsum ipsum ipsum ipsum</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(submit as any)}>
            {mode === "edit" ? (
              <FormField
                control={form.control}
                name={"nome" as any}
                render={({ field }) => (
                  <FormItem>
                    <Label>Nome *</Label>
                    <FormControl>
                      <Input className="flex-1 outline-none ring-none focus-visible:ring-0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}

            <FormField
              control={form.control}
              name={"file" as any}
              render={() => (
                <FormItem>
                    <Label>Importar arquivo MP3 *</Label>
                  <FormControl>
                    <div
                      className={cn(
                        "relative rounded-lg border border-dashed p-6 cursor-pointer transition-colors",
                        isDragOver && "border-primary",
                      )}
                      onClick={pickFile}
                      {...bind}
                    >
                      {mode === "edit" && canPreview ? (
                        <>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="absolute top-2 right-2 h-7 w-7 text-white bg-red-600 hover:bg-red-400 hover:text-white"
                            onClick={(e) => {
                              e.stopPropagation()
                              clearFile()
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>

                          <div className="flex items-center justify-center">
                            <div
                              role="button"
                              tabIndex={0}
                              className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center"
                              onClick={(e) => {
                                e.stopPropagation()
                                void toggleInlinePlay()
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault()
                                  void toggleInlinePlay()
                                }
                              }}
                            >
                              <div
                                className="h-0 w-0 border-y-8 border-y-transparent border-l-12 border-l-sky-600"
                                style={{ display: isPlaying ? "none" : "block" }}
                              />
                              <div
                                className="h-4 w-4"
                                style={{
                                  display: isPlaying ? "grid" : "none",
                                  gridTemplateColumns: "repeat(2, 1fr)",
                                  gap: 3,
                                }}
                              >
                                <div className="h-4 bg-sky-600" />
                                <div className="h-4 bg-sky-600" />
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2 text-center">
                          <svg className="h-20 w-h-20 text-gray-400" width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M27.9993 58.6663H47.9994C49.4138 58.6663 50.7704 58.1044 51.7706 57.1042C52.7708 56.104 53.3327 54.7475 53.3327 53.333V18.6663L39.9993 5.33301H15.9993C14.5849 5.33301 13.2283 5.89491 12.2281 6.8951C11.2279 7.8953 10.666 9.25185 10.666 10.6663V33.0663" stroke="#62748E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M21.334 48V27.4667L42.6673 24V42.6667" stroke="#62748E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M37.3333 47.9997C40.2789 47.9997 42.6667 45.6119 42.6667 42.6663C42.6667 39.7208 40.2789 37.333 37.3333 37.333C34.3878 37.333 32 39.7208 32 42.6663C32 45.6119 34.3878 47.9997 37.3333 47.9997Z" stroke="#62748E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M15.9993 53.3337C18.9449 53.3337 21.3327 50.9458 21.3327 48.0003C21.3327 45.0548 18.9449 42.667 15.9993 42.667C13.0538 42.667 10.666 45.0548 10.666 48.0003C10.666 50.9458 13.0538 53.3337 15.9993 53.3337Z" stroke="#62748E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                          <div className="text-sm text-muted-foreground">{fileLabel}</div>
                        </div>
                      )}

                      <input
                        ref={inputRef}
                        type="file"
                        accept="audio/mpeg,.mp3"
                        className="hidden"
                        onChange={(e) => {
                          const picked = e.target.files?.[0]
                          if (picked) acceptFile(picked)
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isPending}>
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" className="bg-emerald-600 text-white" disabled={isPending}>
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
