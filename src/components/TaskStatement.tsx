import Formula from "./Formula";
import { resolveImageUrl } from "../utils/image";

interface TaskStatementProps {
  text?: string;
  imageUrl?: string;
  contentOrder?: "image-first" | "text-first";
}

function looksLikeMath(text: string) {
  const hasLatexCommand = /\\[a-zA-Z]+/.test(text);
  const hasMathTokens = /\^|_|\{|\}|\frac|\sqrt|log|\sin|\cos|\tan/.test(text);
  const hasCyrillic = /[А-Яа-яЁё]/.test(text);

  if (hasCyrillic && !hasLatexCommand) {
    return false;
  }

  return hasLatexCommand || hasMathTokens;
}

function TextBlock({ text }: { text: string }) {
  if (looksLikeMath(text)) {
    return <Formula value={text} />;
  }

  return <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">{text}</p>;
}

export default function TaskStatement({
  text,
  imageUrl,
  contentOrder = "text-first",
}: TaskStatementProps) {
  const hasText = Boolean(text?.trim());
  const resolvedImageUrl = resolveImageUrl(imageUrl);
  const hasImage = Boolean(resolvedImageUrl);

  if (!hasText && !hasImage) {
    return <p className="text-slate-500">Условие задачи отсутствует.</p>;
  }

  const content = {
    text: hasText ? <TextBlock text={text!} /> : null,
    image: hasImage ? (
      <img
        src={resolvedImageUrl}
        alt="Условие задачи"
        className="max-h-[460px] w-full rounded-xl border border-slate-200 object-contain bg-white"
      />
    ) : null,
  };

  const ordered =
    contentOrder === "image-first"
      ? [content.image, content.text]
      : [content.text, content.image];

  return <div className="space-y-4">{ordered.filter(Boolean)}</div>;
}
