import { Input } from "@/components/ui/input";
import { useImageAndVideoStore } from "@/store/image-n-video-store";
import { FileTextIcon } from "@radix-ui/react-icons";

export function FileUploader() {
  const { upload } = useImageAndVideoStore();

  const handleDocumentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      upload(files);
    }
  };

  return (
    <label
      htmlFor="uploadFile"
      className="flex items-center gap-x-2 cursor-pointer"
      onDragOver={(event) => event.preventDefault()}
    >
      <Input
        id="uploadFile"
        accept="
          application/pdf,
          text/csv,
          application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, 
          application/vnd.ms-excel,
          application/msword,
          application/vnd.openxmlformats-officedocument.wordprocessingml.document
        "
        multiple
        type="file"
        className="hidden"
        onChange={handleDocumentChange}
      />
      <FileTextIcon className="w-5 h-5 text-indigo-500" />
      Documentos
    </label>
  );
}
