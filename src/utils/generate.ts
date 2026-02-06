export const generateSuggestions = (username: string): string[] => {
    const clean = username.toLowerCase();

    const suffixes = ["dev", "real", "io", "hq", "ofc"];
    const separators = ["_", "."];
    const numbers = ["1", "2", "3", "01"];

    const suggestions = new Set<string>();

    numbers.forEach(n => suggestions.add(`${clean}${n}`));

    separators.forEach(sep =>
        numbers.forEach(n =>
            suggestions.add(`${clean}${sep}${n}`)
        )
    );

    separators.forEach(sep =>
        suffixes.forEach(s =>
            suggestions.add(`${clean}${sep}${s}`)
        )
    );

    suffixes.forEach(s => suggestions.add(`${clean}${s}`));

    suggestions.add(`its${clean}`);
    suggestions.add(`hey${clean}`);

    return Array.from(suggestions);
}