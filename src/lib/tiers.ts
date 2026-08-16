// Разворот-сравнение прайса: базовый уровень против уровня ТОП-майстра.
// Пары не назначаются вручную и не додумываются — они выводятся из самих данных CRM:
// две позиции с одинаковым нормализованным названием и разной ценой = одна услуга в двух уровнях.
// Там, где таких пар нет, страница честно молчит о градации, а не заявляет её.

export interface Item {
  name: string;
  price: number;
  duration: number;
  desc: string;
  masters: string[];
  premium: boolean;
}

export interface Tiered {
  /** общее имя услуги без метки уровня */
  title: string;
  base: Item;
  top: Item;
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/\bpremium\b/gi, '')
    .replace(/топ[- ]?майстер/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

export function splitTiers(items: Item[]): { tiered: Tiered[]; flat: Item[] } {
  const groups = new Map<string, Item[]>();
  for (const it of items) {
    const k = norm(it.name);
    (groups.get(k) ?? groups.set(k, []).get(k)!).push(it);
  }

  const tiered: Tiered[] = [];
  const flat: Item[] = [];

  for (const [, g] of groups) {
    const prices = new Set(g.map((i) => i.price));
    if (g.length >= 2 && prices.size >= 2) {
      const sorted = [...g].sort((a, b) => a.price - b.price);
      tiered.push({
        title: norm(sorted[0].name).replace(/^./, (c) => c.toUpperCase()),
        base: sorted[0],
        top: sorted[sorted.length - 1],
      });
    } else {
      flat.push(...g);
    }
  }
  return { tiered, flat };
}

/** true, только если ни одна услуга категории не стоит по-разному у разных мастеров. */
export const priceIsMasterAgnostic = (items: Item[]) => splitTiers(items).tiered.length === 0;
