// Все факты салона — из его же источников: сайта, Appointer CRM, Google Maps.
// Ничего не додумано. Незакрытые вопросы — в PRODUCT.md → Open decisions.

export const SITE = {
  name: 'Beauty Svit',
  legalName: 'Салон краси Beauty Svit',
  city: 'Львів',
  district: 'Сихів',
  street: 'вул. Сихівська, 7',
  addressFull: 'вул. Сихівська, 7, Сихівський район, м. Львів',
  phone: '+380683151100',
  phoneHuman: '+380 68 315 11 00',
  email: 'beauty.svit.salon@gmail.com',
  hours: 'Пн–Нд, 9:00–19:00',
  hoursNote: 'без вихідних, окрім великих свят',
  booking: 'https://widget.client.appointer.com.ua/uk/beautysvit',
  instagram: 'https://www.instagram.com/beautysvit.salon',
  telegramBot: 'https://t.me/BeautySvit_bot',
  maps: 'https://maps.app.goo.gl/GQtzpdFoh2PRrdut7',
  directions: 'https://maps.app.goo.gl/vXuYukxWeuBx5FCC8',
  googleReviews: 'https://maps.google.com/?cid=11922884450103271971',
  barb: 'https://barb.ua/uk/lviv/salon/bsvit/comments',
  rating: { value: 4.8, count: 116 },
  // со страницы «Про нас» текущего сайта, заявлено владельцем
  claims: { years: 3, visitsPerYear: 2894, staff: 7 },
  offer: 'https://svit.beauty/public-offer/',
  privacy: 'https://svit.beauty/privacy-policy/',
} as const;

const BASE = import.meta.env.BASE_URL || '/';

/** Ссылки и ассеты из public/ — только через u(), иначе ломаются на подпути GitHub Pages. */
export function u(path: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  return (BASE.replace(/\/$/, '') + '/' + path.replace(/^\//, '')).replace(/\/{2,}/g, '/');
}

/** Шкала довжин — собственная система салона, опубликована им же в Appointer. */
export const LENGTHS = [
  { n: 1, label: 'вуха відкриті' },
  { n: 2, label: 'плечі відкриті' },
  { n: 3, label: 'до середини лопатки' },
  { n: 4, label: 'нижче середини лопатки' },
  { n: 5, label: 'індивідуально' },
] as const;

export const NAV = [
  { href: '/tsiny/', label: 'Послуги і ціни' },
  { href: '/roboty/', label: 'Роботи' },
  { href: '/majstry/', label: 'Майстри' },
  { href: '/pro-salon/', label: 'Про салон' },
  { href: '/salon-krasy-sykhiv/', label: 'Як дістатися' },
] as const;

/** Категория Appointer → страница услуги. Порядок — как в прайсе салона. */
export const SERVICE_PAGES = [
  { slug: 'farbuvannya-volossya', title: 'Фарбування волосся', cats: ['Фарбування - Classic', 'Фарбування - Premium'], photo: 'farb-mid' },
  { slug: 'stryzhka-volossya', title: 'Стрижка волосся', cats: ['Стрижка'], photo: 'stryzhka-blond' },
  { slug: 'biozavyvka-volossya', title: 'Біозавивка волосся', cats: ['Завивка волосся'], photo: 'zavyvka-med' },
  { slug: 'manikur', title: 'Манікюр', cats: ['Манікюр'], photo: 'manikur-nyud' },
  { slug: 'pedykur', title: 'Педикюр', cats: ['Педикюр'], photo: 'pedykur-rozhev' },
  { slug: 'brovy-ta-viyi', title: 'Брови та вії', cats: ['Брови та Вії'], photo: 'brovy-proces' },
  { slug: 'shugaring', title: 'Шугарінг', cats: ['Шугарінг'], photo: 'brovy-portret' },
  { slug: 'makiyazh', title: 'Макіяж', cats: ['Макіяж'], photo: 'brovy-portret' },
  { slug: 'ukladka-ta-zachiska', title: 'Укладка та зачіска', cats: ['Укладка та Зачіска'], photo: 'stryzhka-kare' },
  { slug: 'vidnovlennya-volossya', title: 'Відновлення волосся', cats: ['Відновлення волосся'], photo: 'farb-mokko' },
  { slug: 'cholovichyj-zal', title: 'Чоловічий зал', cats: ['Чоловічий зал'], photo: 'instrument-nasadky' },
] as const;

export const fmtPrice = (n: number) => n.toLocaleString('uk-UA');
export const fmtDur = (m: number) =>
  m >= 60 ? `${Math.floor(m / 60)} год${m % 60 ? ` ${m % 60} хв` : ''}` : `${m} хв`;
/** Для діапазонів: округлення до 5 хв, щоб 241 хв не читалось як «4 год 1 хв». */
export const fmtDurRough = (m: number) => fmtDur(Math.round(m / 5) * 5);

/** Українські числівники: 1 позиція, 2 позиції, 5 позицій. */
export function plural(n: number, one: string, few: string, many: string): string {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}
export const nPos = (n: number) => `${n} ${plural(n, 'позиція', 'позиції', 'позицій')}`;
export const nRev = (n: number) => `${n} ${plural(n, 'відгук', 'відгуки', 'відгуків')}`;
export const nShot = (n: number) => `${n} ${plural(n, 'кадр', 'кадри', 'кадрів')}`;
