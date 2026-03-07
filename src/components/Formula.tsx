import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

export default function Formula({ value }: { value: string }) {
  return <BlockMath math={value} />;
}
