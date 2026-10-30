// Ergast IDs shown in the "Legends" sub-tab
export const legendDrivers = [
  'senna',
  'michael_schumacher',
  'prost',
  'lauda',
  'fangio',
  'clark',
  'stewart',
  'piquet',
  'mansell',
  'hakkinen',
  'vettel',
  'alonso',
  'hamilton',
  'max_verstappen',
  'jack_brabham',
  'raikkonen',
];

export const legendTeams = [
  'ferrari',
  'mclaren',
  'williams',
  'team_lotus',
  'brabham',
  'tyrrell',
  'benetton',
  'mercedes',
];

// A team's own Wikipedia image is its current logo (often a sponsor's), so each
// legendary team shows the page of its most iconic car instead
export const legendTeamImages: Record<string, string> = {
  ferrari: 'https://en.wikipedia.org/wiki/Ferrari_312T',
  mclaren: 'https://en.wikipedia.org/wiki/McLaren_MP4/4',
  williams: 'https://en.wikipedia.org/wiki/Williams_FW14B',
  team_lotus: 'https://en.wikipedia.org/wiki/Lotus_72',
  brabham: 'https://en.wikipedia.org/wiki/Brabham_BT46',
  tyrrell: 'https://en.wikipedia.org/wiki/Tyrrell_P34',
  benetton: 'https://en.wikipedia.org/wiki/Benetton_B194',
  mercedes: 'https://en.wikipedia.org/wiki/Mercedes_F1_W11',
};
