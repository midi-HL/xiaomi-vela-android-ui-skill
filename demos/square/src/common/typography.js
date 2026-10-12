// Demo typography roles. Keep CSS values in pages/components aligned to this scale.
export const TYPE_SIZE = { caption: 10, body: 12, itemTitle: 14, sectionTitle: 16, pageTitle: 18, clock: 20, icon: 20, largeIcon: 24 }
export function bodyCopySize(preference) {
  const value = Number(preference)
  if (value === 22) return 10
  if (value === 26) return 12
  return 11
}
