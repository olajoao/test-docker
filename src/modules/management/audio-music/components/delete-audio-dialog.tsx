import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type DeleteAudioDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  audioName?: string
  onConfirm: () => void
  isPending?: boolean
}

export function DeleteAudioDialog({
  open,
  onOpenChange,
  audioName,
  onConfirm,
  isPending,
}: DeleteAudioDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Áudio e Música</DialogTitle>
          <DialogDescription>
            Deseja realmente excluir o som <b>{audioName ? `${audioName}` : "selecionado"}</b>?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isPending}>
              Cancelar
            </Button>
          </DialogClose>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={isPending}>
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
