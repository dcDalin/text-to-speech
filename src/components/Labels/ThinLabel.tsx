interface IThinLabelProps {
  text: string;
}

export default function ThinLabel({ text }: IThinLabelProps) {
  return <div className="flex items-center space-x-2 text-xs font-semibold text-gray font-source-sans">{text}</div>;
}
