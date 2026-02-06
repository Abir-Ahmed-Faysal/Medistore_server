export const normalizeSearch = (value: string): string[] =>
  value
    .trim()
    .split(/\s+/) // napa+extra+500mg → ["napa","extra","500mg"]
    .filter(Boolean)
