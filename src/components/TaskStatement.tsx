import Formula from "./Formula";

interface TaskStatementProps {
  text?: string;
  imageUrl?: string;
  contentOrder?: "image-first" | "text-first";
}

function looksLikeMath(text: string) {
  return /\\|\^|_|\{|\}|\frac|\sqrt|log|\sin|\cos|\tan/.test(text);
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
  const hasImage = Boolean(imageUrl?.trim());

  if (!hasText && !hasImage) {
    return <p className="text-slate-500">Условие задачи отсутствует.</p>;
  }

  const content = {
    text: hasText ? <TextBlock text={text!} /> : null,
    image: hasImage ? (
      <img
        src={imageUrl}
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
