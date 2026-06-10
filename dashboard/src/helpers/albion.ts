interface AllyGuildInput {
  guild?: { name: string } | null;
  alliance?: { tag?: string; name?: string } | null;
}

export const formatAllyGuildName = ({
  guild,
  alliance,
}: AllyGuildInput): string | null => {
  if (!guild?.name) return null;

  const ally = alliance?.tag || alliance?.name;
  return ally ? `[${ally}] ${guild.name}` : guild.name;
};
