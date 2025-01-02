interface IGoldenRule {
    rule: string,
    title: string,
    index: number
}

export default function GoldenRule({ rule, title, index }: IGoldenRule) {
    return (
        <div className="max-w-sm">
            <h3 className="text-2xl md:text-4xl font-bold text-hackomania-blue mb-2">{index + 1} {title}</h3>
            <p className="md:text-lg">{ rule }</p>
        </div>
    )
}