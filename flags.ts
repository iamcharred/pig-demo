export const flag = (
  flagName: keyof typeof flagOverrides,
  defaultValue: boolean
) => flagOverrides[flagName] || defaultValue;

export const flagOverrides = {
  showLeaderboard: true,
};
