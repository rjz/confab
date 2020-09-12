type Filter<C extends {}> = (c: C) => C;

const confab: {
  <C extends {}>(filters: Filter<C>[]): C;
  loadJSON<C extends {}>(paths: string[]): Filter<C>;
  defaults<C extends {}>(c: Partial<C>, warn?: boolean): Filter<C>;
  required<C extends {}>(k: (keyof C)[]): Filter<C>;
  loadEnvironment<C extends {}>(keyMap: Record<string, keyof C>): Filter<C>;
};

export default confab;
