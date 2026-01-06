import { createFileRoute } from '@tanstack/react-router'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'
import { useManagementAudioMusicList } from '@/modules/management/audio-music/hooks'
import { AudioCard } from '@/modules/management/audio-music/components/audio-card'
import { EmptyAudioCard } from '@/modules/management/audio-music/components/empty-audio-card'
import { useEffect, useState } from 'react'
import { managementAudioMusicSearchSchema, type Media } from '@/modules/management/audio-music/model'
import { AudioMusicDialog } from '@/modules/management/audio-music/components/audio-music-dialog'
import { Button } from '@/components/ui/button'
import { AudioPlayerDialog } from '@/modules/management/audio-music/components/audio-player-dialog'
import { DeleteAudioDialog } from '@/modules/management/audio-music/components/delete-audio-dialog'
import { toast } from 'sonner'
import { useDeleteManagementAudioMusic } from '@/modules/management/audio-music/hooks'

export const Route = createFileRoute('/_app/_layout/management/audio_music')({
  component: ManagementAudioMusic,
  validateSearch: managementAudioMusicSearchSchema,
  loader: () => ({ crumb: ['Gerenciamento', 'Áudios e Músicas'] }),
})

function ManagementAudioMusic() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  const [searchTerm, setSearchTerm] = useState(search.filter || '')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [dialogMedia, setDialogMedia] = useState<Media | null>(null)
  const [initialFile, setInitialFile] = useState<File | null>(null)

  const [playerOpen, setPlayerOpen] = useState(false)
  const [playerMedia, setPlayerMedia] = useState<Media | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteMedia, setDeleteMedia] = useState<Media | null>(null)

  const deleteMutation = useDeleteManagementAudioMusic()

  useEffect(() => {
    setSearchTerm(search.filter || '')
  }, [search.filter])

  const { isLoading, data } = useManagementAudioMusicList(search.filter, search.page, search.perPage)

  const openCreate = (file?: File) => {
    setDialogMode('create')
    setDialogMedia(null)
    setInitialFile(file ?? null)
    setDialogOpen(true)
  }

  const openEdit = (media: Media) => {
    setDialogMode('edit')
    setDialogMedia(media)
    setInitialFile(null)
    setDialogOpen(true)
  }

  const openPlayer = (media: Media) => {
    setPlayerMedia(media)
    setPlayerOpen(true)
  }

  const openDelete = (media: Media) => {
    setDeleteMedia(media)
    setDeleteOpen(true)
  }

  return (
    <div className="flex-1 space-y-5 min-w-0 overflow-hidden">
      <div className="flex items-center justify-between gap-5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Pesquisar áudios..."
            value={searchTerm}
            onChange={(e) => {
              const value = e.target.value
              setSearchTerm(value)
              navigate({
                search: (prev) => ({
                  ...prev,
                  filter: value.trim() ? value : undefined,
                  page: 1,
                }),
              })
            }}
            className='flex-1 pl-10 outline-none ring-none focus-visible:ring-0'
          />
        </div>

        <Button size="sm" className="bg-emerald-600 text-white" onClick={() => openCreate()}>
          <Plus className="h-4 w-4" />
          Novo Áudio
        </Button>
      </div>

      <AudioMusicDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) {
            setInitialFile(null)
            setDialogMedia(null)
            setDialogMode('create')
          }
        }}
        mode={dialogMode}
        media={dialogMedia}
        initialFile={initialFile}
      />

      <AudioPlayerDialog
        open={playerOpen}
        onOpenChange={(open) => {
          setPlayerOpen(open)
          if (!open) setPlayerMedia(null)
        }}
        title="Player de Áudio"
        description="Lorem ipsum ipsum ipsum ipsum ipsum"
        src={playerMedia?.download_url ?? null}
      />

      <DeleteAudioDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open)
          if (!open) setDeleteMedia(null)
        }}
        audioName={deleteMedia?.nome}
        isPending={deleteMutation.isPending}
        onConfirm={async () => {
          if (!deleteMedia?.id) return
          try {
            await deleteMutation.mutateAsync(deleteMedia.id)
            toast.success('Áudio teste excluido com sucesso!')
            setDeleteOpen(false)
            setDeleteMedia(null)
          } catch {
            toast.error('Falha ao excluir áudio')
          }
        }}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-40 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <EmptyAudioCard onClick={() => openCreate()} onDropFile={(file) => openCreate(file)} />
          
          {data?.data?.map((audio: Media) => (
            <AudioCard
              key={audio.id}
              fileName={audio.nome || 'audio.mp3'}
              onDownload={() => console.log('Download', audio)}
              onDelete={() => openDelete(audio)}
              onEdit={() => openEdit(audio)}
              onPlay={() => openPlayer(audio)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ManagementAudioMusic
