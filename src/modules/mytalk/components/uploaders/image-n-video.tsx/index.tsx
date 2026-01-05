import { Input } from "@/components/ui/input";
import { useImageAndVideoStore } from "@/modules/mytalk/stores/image-n-video-store";
import { ImageIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB em bytes

export function ImageAndVideoUploader() {
  const { upload } = useImageAndVideoStore();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const tooLargeFiles: string[] = [];
    const dataTransfer = new DataTransfer();

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        tooLargeFiles.push(file.name);
      } else {
        dataTransfer.items.add(file);
      }
    }

    if (tooLargeFiles.length > 0) {
      toast.error(
        `Os seguintes arquivos são maiores que 5MB e não podem ser enviados:\n- ${tooLargeFiles.join(
"\n- ",
)}`,
        { duration: 10000 },
      );
    }

    const validFiles = dataTransfer.files;
    if (validFiles.length > 0) {
      upload(validFiles);
    }
  };

  return (
    <label
      htmlFor="uploadImage"
      className="flex items-center gap-x-2 cursor-pointer"
      onDragOver={(event) => event.preventDefault()}
    >
      <Input
        id="uploadImage"
        accept="
        image/*,video/mp4,video/3gpp,video/quicktime,audio/mp3,application/pdf,
        text/csv,
        application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, 
        application/vnd.ms-excel,
        application/msword,
        application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        multiple
        type="file"
        className="hidden"
        onChange={handleImageChange}
      />
      <ImageIcon className="w-5 h-5 text-sky-500" />
      Fotos, vídeos ou documentos
    </label>
  );
}
