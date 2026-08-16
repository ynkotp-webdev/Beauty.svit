// Готовит webp из оригиналов клиента + строит src/data/price.json из выгрузки Appointer.
// node _build/prep-assets.mjs
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const SRC = 'C:/webdev/vibecoded-toolz/KnowlageBase-RedesignSkill/out/svit.beauty';
const IMG = 'public/img';
mkdirSync(IMG, { recursive: true });
mkdirSync('src/data', { recursive: true });

// ── фото: файл → смысловой slug (привязка сделана глазами по контактному листу) ──
const PHOTOS = {
  'photo_5_2025-09-14_11-17-52.jpg':  { slug: 'farb-mid',      alt: 'Мідне фарбування волосся, робота салону Beauty Svit', tone: '#7A3312' },
  'photo_6_2025-09-14_11-17-52.jpg':  { slug: 'farb-chervone', alt: 'Червоне фарбування довгого волосся у залі салону',    tone: '#9A4030' },
  'photo_1_2025-09-14_11-17-52.jpg':  { slug: 'farb-kashtan',  alt: 'Каштаново-рожевий колір, укладка хвилями',            tone: '#7A4A4A' },
  'photo_7_2025-09-14_11-17-52.jpg':  { slug: 'zavyvka-med',   alt: 'Біозавивка на медовому волоссі середньої довжини',    tone: '#A08060' },
  'photo_9_2025-09-14_11-17-52.jpg':  { slug: 'stryzhka-blond',alt: 'Коротке блонд-каре, вигляд ззаду',                    tone: '#E8BC96' },
  'photo_4_2025-09-14_11-17-52.jpg':  { slug: 'farb-mokko',    alt: 'Тонування у колір мокко на довгому волоссі',          tone: '#6E5A52' },
  'photo_2025-09-14_11-05-32.jpg':    { slug: 'stryzhka-kare', alt: 'Блонд-каре після стрижки та укладки',                 tone: '#C9AE8E' },
  'photo_2025-09-14_11-05-55.jpg':    { slug: 'brovy-portret', alt: 'Обличчя клієнтки після корекції та фарбування брів',  tone: '#8A6A55' },
  'photo_2025-09-14_11-06-58.jpg':    { slug: 'brovy-proces',  alt: 'Ламінування брів у процесі, майстер у рукавичках',    tone: '#9A6A78' },
  'photo_2025-09-14_11-06-02.jpg':    { slug: 'manikur-dyzajn',alt: 'Манікюр з дизайном: глітер і графічний малюнок',      tone: '#8A6650' },
  'photo_2025-09-14_11-06-44.jpg':    { slug: 'manikur-rozhev',alt: 'Яскраво-рожевий гель-лак, довга форма',               tone: '#C43070' },
  'photo_2025-09-14_11-07-26.jpg':    { slug: 'manikur-perl',  alt: 'Перламутрове покриття, квадратна форма',              tone: '#B9B0A6' },
  'photo_2025-09-14_11-07-35.jpg':    { slug: 'manikur-nyud',  alt: 'Нюдовий манікюр, мигдалеподібна форма',               tone: '#C9A691' },
  'photo_10_2025-09-14_11-17-52.jpg': { slug: 'manikur-vyshn', alt: 'Вишневий гель-лак з акцентним нігтем',                tone: '#7A2A2A' },
  'IMG_0604-1.jpeg':                  { slug: 'pedykur-rozhev',alt: 'Педикюр з рожевим покриттям',                         tone: '#C98A88' },
};

// веер первого экрана: 4 узкие полосы + 1 раскрытый образец
const FAN = ['farb-mid', 'farb-chervone', 'farb-kashtan', 'zavyvka-med', 'stryzhka-blond'];

const manifest = {};
for (const [file, meta] of Object.entries(PHOTOS)) {
  const src = `${SRC}/assets/real/${file}`;
  const m = await sharp(src).metadata();
  const ratio = m.height / m.width;

  // галерея: нативные пропорции, две ширины
  for (const w of [480, 960]) {
    await sharp(src).resize(w).webp({ quality: 74 }).toFile(`${IMG}/${meta.slug}-${w}.webp`);
  }
  manifest[meta.slug] = { alt: meta.alt, tone: meta.tone, w: 960, h: Math.round(960 * ratio) };

  // полосы веера: узкий вертикальный срез
  if (FAN.includes(meta.slug)) {
    // ширина слота на десктопе ~125px у узкой полосы и ~275px у раскрытой:
    // 420/760 давали трёхкратный пересемпл и 244 КБ на первом экране
    await sharp(src)
      .resize(300, 900, { fit: 'cover', position: 'attention' })
      .webp({ quality: 68 }).toFile(`${IMG}/fan-${meta.slug}.webp`);
    await sharp(src)
      .resize(620, 900, { fit: 'cover', position: 'attention' })
      .webp({ quality: 70 }).toFile(`${IMG}/fan-${meta.slug}-open.webp`);
  }
}

// инструмент — своя съёмка, идёт в блок стерилизации и заточки
const TOOLS = {
  'IMG_20211121_104643_873.webp': { slug: 'instrument-nozhyci', alt: 'Набір перукарських ножиць салону, розкладений віялом' },
  'IMG_20210919_162519.webp':     { slug: 'instrument-nasadky', alt: 'Насадки машинки для стрижки після обробки' },
  'IMG_20220111_093705_414.webp': { slug: 'instrument-kusachky',alt: 'Манікюрні кусачки та ножиці після заточки' },
};
for (const [file, meta] of Object.entries(TOOLS)) {
  const src = `${SRC}/assets/tools/${file}`;
  const m = await sharp(src).metadata();
  for (const w of [480, 960]) {
    await sharp(src).resize(w).webp({ quality: 74 }).toFile(`${IMG}/${meta.slug}-${w}.webp`);
  }
  manifest[meta.slug] = { alt: meta.alt, w: 960, h: Math.round(960 * (m.height / m.width)) };
}

writeFileSync('src/data/images.json', JSON.stringify(manifest, null, 1));

// ── прайс из Appointer ──
const api = JSON.parse(readFileSync(`${SRC}/content/widget-api.json`, 'utf8'));
const order = JSON.parse(api.find((x) => x.url.includes('/api/v3/order')).body);
const users = Object.fromEntries(Object.entries(order.companyUserList)
  .map(([id, u]) => [id, { name: u.firstName, role: u.lastName, reviews: +u.feedback?.count || 0, rate: u.feedback?.averageRate || null }]));

// строки с ценой 1.00/10.00 — это не услуги, а пояснения салона в интерфейсе виджета
const isNote = (p) => +p.canonicalPurchasePrice <= 10;

const cats = Object.values(order.categoryList).sort((a, b) => +a.order - +b.order).map((c) => ({
  id: c.id,
  name: c.name,
  notes: (c.productList || []).filter(isNote).map((p) => ({ title: p.name, text: p.widgetDescription || '' })),
  items: (c.productList || []).filter((p) => !isNote(p)).sort((a, b) => +a.order - +b.order).map((p) => ({
    name: p.name,
    price: Math.round(+p.canonicalPurchasePrice),
    duration: +p.duration,
    desc: (p.widgetDescription || '').replace(/\s+/g, ' ').trim(),
    masters: (p.companyUserIdList || []).map((i) => users[i]?.name).filter(Boolean),
    premium: /Premium|ТОП-майстер/i.test(p.name + ' ' + (p.widgetDescription || '')),
  })),
}));

writeFileSync('src/data/price.json', JSON.stringify(cats, null, 1));
writeFileSync('src/data/masters.json', JSON.stringify(Object.values(users).filter((u) => u.name !== 'Адміністратор'), null, 1));

const n = cats.reduce((s, c) => s + c.items.length, 0);
console.log(`images: ${Object.keys(manifest).length} · price: ${cats.length} категорій, ${n} позицій · masters: ${Object.keys(users).length}`);
