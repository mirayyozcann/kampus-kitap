const COVERS = [
  "#AFA9EC",
  "#5DCAA5",
  "#F0997B",
  "#ED93B1",
  "#85B7EB",
  "#97C459",
];

export function coverColor(department: string) {
  let hash = 0;
  for (const ch of department.toLowerCase()) {
    hash = (hash * 31 + (ch.codePointAt(0) ?? 0)) >>> 0;
  }
  return COVERS[hash % COVERS.length];
}