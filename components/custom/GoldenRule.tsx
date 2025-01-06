interface IGoldenRule {
  rule: string;
  title: string;
  index: number;
}

export default function GoldenRule({ rule, title, index }: IGoldenRule) {
  return (
    <li className="max-w-sm">
      <h3 className="mb-2 text-2xl font-bold text-hackomania-blue md:text-4xl">
        {index + 1} {title}
      </h3>
      <p className="md:text-lg">{rule}</p>
    </li>
  );
}
