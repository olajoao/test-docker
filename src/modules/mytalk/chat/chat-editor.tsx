import { ClassicEditor } from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import { lazy, useEffect } from "react";
import { useChatModel } from "./chat.model";

const CKEditorLazy = lazy(() =>
  import("@ckeditor/ckeditor5-react").then((module) => ({
    default: module.CKEditor,
  })),
);

export function ChatEditor({
  message,
  messageId,
  isService = false,
}: {
  message?: string;
  messageId?: number;
  isService?: boolean;
}) {
  const { state, data, actions } = useChatModel({
    messageId,
    message,
    isService,
  });

  useEffect(() => {
    data.channelIdRef.current = data.channelId;
  }, [data.channelId]);

  useEffect(() => {
    data.isServiceRef.current = isService;
  }, [isService]);

  return (
    <div className="w-full overflow-hidden">
      <div className="main-container">
        <div className="editor-container" ref={data.editorContainerRef}>
          <div className="editor-container__editor">
            <div className="break-all max-w-full max-h-20 overflow-auto scrollbar text-xs">
              {state.isLayoutReady && (
                <CKEditorLazy
                  editor={data.ClassicEditor}
                  config={data.editorConfig}
                  onReady={(editor) =>
                    actions.handleEditorReady(editor as ClassicEditor)
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
