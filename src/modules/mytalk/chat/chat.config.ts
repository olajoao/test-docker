import { Autosave, Bold, Essentials, Italic, Paragraph, Undo } from "ckeditor5";
import translations from "ckeditor5/translations/pt.js";

export const editorConfig = {
  plugins: [Autosave, Bold, Essentials, Italic, Paragraph, Undo],
  image: {
    toolbar: ["imageTextAlternative"],
  },
  language: "pt",
  placeholder: "Escreva uma mensagem",
  translations: [translations],
};
