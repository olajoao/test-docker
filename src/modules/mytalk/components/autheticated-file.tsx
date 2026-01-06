import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useRef } from "react";
import { AudioComponent } from "./audio/audio-component";

interface AuthenticatedFileProps {
  src: string;
  alt?: string;
  className?: string;
  duration?: number;
  fileType: string;
}

function AuthenticatedFile({
  src,
  alt,
  className,
  duration,
  fileType,
}: AuthenticatedFileProps) {
  const abortControllerRef = useRef<AbortController | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const auth_payload = atob(localStorage.getItem("app_token") || "{}");
  const authData = auth_payload ? JSON.parse(auth_payload) : null;
  const authToken = authData?.access_token || "";
  const authUser = authData?.user || "";

  const newUrl = new URL(src);
  const authPayload = auth_payload ? JSON.parse(auth_payload) : null;

  const nyaUrl = authPayload.base_url + newUrl.pathname;

  const {
    data: fileUrl,
    isPending: isLoadingFile,
    isError: error,
  } = useQuery({
    queryKey: ["authenticated-file", src],
    queryFn: async () => {
      const endpoint = `${nyaUrl}?${new URLSearchParams({ user: authUser })}`;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error("Não foi possível carregar a imagem.");
      }

      const blob = await response.blob();
      const objectURL = URL.createObjectURL(blob);

      objectUrlRef.current = objectURL;
      return objectUrlRef.current;
    },
    enabled: !!src,
  });

  if (isLoadingFile) return <Loader2Icon className="animate-spin" />;

  if (error)
    return (
      <div className="text-[10px] text-destructive p-1">
        Erro ao carregar imagem
      </div>
    );

   if (fileType === "img" || fileType === "svg") {
    return fileUrl ? (
      <img
        src={fileUrl}
        alt={alt || "Imagem"}
        className={className}
        width={150}
        height={150}
      />
    ) : null;
  }


  if (fileType === "doc") {
    return fileUrl ? (
      <iframe src={fileUrl} width="100%" height="600" className={className} />
    ) : null;
  }

  if (fileType === "video") {
    return fileUrl ? (
      <video
        src={fileUrl}
        width={210}
        height={110}
        className={className}
        controls
      />
    ) : null;
  }

  if (fileType === "audio") {
    return fileUrl ? (
      <>
        <AudioComponent src={fileUrl} duration={duration} variant="chat" size="sm"/>
      </>
    ) : null;
  }

  return null;
}

export default AuthenticatedFile;
