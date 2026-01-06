import { useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import AuthenticatedFile from "../autheticated-file";
import { useOnClickOutside } from "usehooks-ts";

interface FullImageProps {
  url: string;
  description: string
  children?: ReactNode 
}

function FullImage({ url, description, children }: FullImageProps) {
  const [isOpen, setIsOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement | null>(null)

  function handleClickOutside() {
    setIsOpen(false)
  }

  useOnClickOutside(modalRef as RefObject<HTMLElement>, handleClickOutside);

  return (
    <div>
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="p-px w-20 ring-1 ring-transparent hover:ring-muted-foreground rounded-md overflow-clip">
        <AuthenticatedFile
          src={url}
          alt={description}
          fileType="img"
          className="w-full h-full object-contain rounded-lg"
        />
      </button>     
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/90 flex flex-col gap-y-5 items-center justify-center">
          <div ref={modalRef} className="flex flex-col items-center gap-y-5">
            <div className="scrollbar h-[80dvh] w-[70dvw] overflow-y-auto bg-stone-800 p-5 rounded-xl">
              <AuthenticatedFile
                src={url}
                alt={url}
                fileType="img"
                className="w-full rounded-lg object-cover"
              />
            </div>
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

export default FullImage;
