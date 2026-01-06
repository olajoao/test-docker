import { fileType } from "@/helpers/get-file-type";
import { DocumentTextIcon, SpeakerWaveIcon } from "@heroicons/react/24/outline";
import { PaperPlaneIcon, VideoIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePreviewFilesModel } from "./preview-files.model";
import { Loader2 } from "lucide-react";
import { useImageAndVideoStore } from "../../stores/image-n-video-store";

export function ShowImageModal() {
  const { state, actions } = usePreviewFilesModel();
  const { files } = useImageAndVideoStore();

  const [imageURL, setImageURL] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const createImgUrl = (currentFile: File) => {
    return URL.createObjectURL(currentFile);
  };

  const changeImgUrl = (currentIndex: number) => {
    const currentFile = files![currentIndex];
    const imgUrl = createImgUrl(currentFile);
    setCurrentImageIndex(currentIndex);
    setImageURL(imgUrl);
      if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

    const isAudioFile = (file: File | null | undefined): file is File => {
      if (!file) return false;
      const type = fileType(file.type);
      return type === "audio" || type.includes("audio") || file.type.startsWith("audio/");
    };
  

  useEffect(() => {
    if (files?.length) {
      actions.toggleModal(true);
      const imgUrl = URL.createObjectURL(files[0]);
      setImageURL(imgUrl);
    } else {
      actions.toggleModal(false);
    }
  }, [files]);

  const CURRENT_FILE: File | null =
    files?.length && currentImageIndex! >= 0 ? files[currentImageIndex!] : null;

  return (
    <Dialog open={state.isOpen} onOpenChange={actions.toggleModal}>
      <DialogContent className="min-w-[80dvw] max-w-[90dvw] sm:max-w-[80dvw] min-h-[80dvh] max-h-[80dvh] sm:max-h-[95dvh] overflow-x-auto scrollbar rounded-2xl">
        <DialogHeader>
          <DialogTitle>{CURRENT_FILE?.name}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden"></DialogDescription>
        <div className="p-3 rounded-lg sm:min-h-[70dvh] max-h-[40dvh] sm:max-h-[70dvh] overflow-y-auto flex items-center justify-center">
          {CURRENT_FILE ? (
            <>
              {imageURL && fileType(CURRENT_FILE.type) === "image" && (
                <img
                  src={imageURL}
                  alt="Prévia da imagem"
                  className="rounded-lg h-full"
                />
              )}

              {imageURL && fileType(CURRENT_FILE.type) === "document" && (
                <iframe src={imageURL} width="100%" height="600"></iframe>
              )}

              {imageURL && fileType(CURRENT_FILE.type).includes("video") && (
                <video
                  width="500"
                  height="500"
                  controls
                  className="w-[500px] h-full md:w-[900px] rounded-xl overflow-hidden"
                >
                  <source src={imageURL} type="video/mp4" />
                  <source src={imageURL} type="video/ogg" />
                  Your browser does not support the video tag.
                </video>
              )}
            </>
          ) : null}

          {imageURL && isAudioFile(CURRENT_FILE) && (
                <div className="flex flex-col items-center justify-center gap-6 w-full max-w-md">
                  <SpeakerWaveIcon className="w-20 h-20 text-gray-600 dark:text-gray-400" />
                  <audio
                    ref={audioRef}
                    controls
                    className="w-full"
                    preload="metadata"
                  >
                    <source src={imageURL} type={CURRENT_FILE.type} />
                    <source src={imageURL} type="audio/mpeg" />
                    <source src={imageURL} type="audio/mp3" />
                    <source src={imageURL} type="audio/ogg" />
                    <source src={imageURL} type="audio/wav" />
                    Seu navegador não suporta o elemento de áudio.
                  </audio>
                </div>
              )}
        </div>
        <hr className="my-3" />
        <DialogFooter className="flex flex-col sm:flex-row gap-5 sm:gap-0 sm:justify-between items-center">
          <div className="flex gap-x-3 flex-1 overflow-x-auto max-w-[75dvw] sm:max-w-[calc(80dvw-180px)]">
            {files?.length &&
              Array.from(files).map((file, idx) => (
                <Button
                  className={`rounded bg-muted-foreground p-0 min-w-28 h-16 ring-2 overflow-clip ${
                    currentImageIndex === idx
                      ? "ring-indigo-600 shadow shadow-indigo-950"
                      : "ring-0"
                  }`}
                  key={file.name + idx}
                  onClick={() => changeImgUrl(idx)}
                >
                  {fileType(file.type) === "image" && (
                    <img
                      src={createImgUrl(file)}
                      alt="Prévia da imagem"
                      className="object-contain h-full"
                    />
                  )}

                  {fileType(file.type) === "document" && (
                    <DocumentTextIcon className="w-10 h-10 text-red-900" />
                  )}

                  {fileType(file.type) === "video" && (
                    <VideoIcon className="w-10 h-10 text-red-900" />
                  )}

                  {isAudioFile(file) && (
                    <SpeakerWaveIcon className="w-10 h-10 text-red-900" />
                  )}
                </Button>
              ))}
          </div>
          <Button
            className="w-full sm:w-24 flex items-center gap-x-2 text-xs bg-emerald-600 text-white"
            variant="ghost"
            onClick={actions.handleSendImages}
            disabled={state.isSendingImageMessage}
          >
            {state.isSendingImageMessage ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <PaperPlaneIcon className="w-5 h-5 transform mb-1 -rotate-45" />
                Enviar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
