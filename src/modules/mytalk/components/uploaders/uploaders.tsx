import { Button } from "@/components/ui/button";
import { FileIcon } from "@radix-ui/react-icons";
import { useRef, useState } from "react";
import type { RefObject } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { ImageAndVideoUploader } from "./image-n-video.tsx";

export function Uploaders() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLUListElement | null>(null);

  const handleClickOutside = () => {
    setIsOpen(false);
  };

  useOnClickOutside(ref as RefObject<HTMLElement>, handleClickOutside);

  return (
    <div className="relative">
      <Button
        className=" dark:text-white cursor-pointer"
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FileIcon className="w-5 h-5 sm:w-6 sm:h-6" />
      </Button>
      {isOpen && (
        <ul
          ref={ref}
          className="ring-1 ring-muted-foreground/20 absolute bottom-10 left-2 flex flex-col p-2 rounded bg-white dark:bg-neutral-900 shadow-md shadow-muted z-30"
        >
          <li className="text-sm w-max py-2 px-1 hover:bg-muted rounded">
            <ImageAndVideoUploader />
          </li>
        </ul>
      )}
    </div>
  );
}
