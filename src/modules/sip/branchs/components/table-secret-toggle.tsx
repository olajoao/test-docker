import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";

function TableSecretToggle({ secret }: { secret: string }) {
  const [show, setShow] = useState(false);
  const hiddenSecret = "*".repeat(secret.length);

  return (
    <div
      className="flex items-center gap-2 w-32 group relative"
      title={show ? secret : undefined}
    >
      <span
        className={`
          flex-1 truncate text-xs
          ${show ? "font-mono text-gray-800" : "text-gray-500 tracking-widest"}
        `}
      >
        {show ? secret : hiddenSecret}
      </span>

      <button
        type="button"
        className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => setShow(!show)}
      >
        {show ? <EyeClosed className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

export default TableSecretToggle;

