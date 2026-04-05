import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

export default function Formula({ value }: { value: string }) {
  return (
    <BlockMath
      math={value}
      renderError={() => <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">{value}</p>}
    />
  );
}
