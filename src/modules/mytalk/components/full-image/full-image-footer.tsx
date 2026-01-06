import { handleDownload } from "@/helpers/download-image";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";

interface FullImageFooterProps {
  url: string;
  type: string;
  description: string
}

export default function FullImageFooter({ url, type, description }: FullImageFooterProps) {
  return (
    <Button onClick={() => 
      handleDownload(
        url,
        type,
        description,
      )
    } 
      size="sm"
      variant="outline"
      className="w-max"
    >
      <DownloadIcon />
      Salvar imagem
    </Button> 
  )
}
