// Interface words in each language, and the small rules that differ between languages.
import { lang } from './state';
import type { Lang, Ref } from './types';

const bg = {
  title: 'Картата на Илиада', subtitle: 'около 1200 г. пр.Хр.',
  search: 'Търси герой или място', searchNone: 'Няма такова име на картата.', searchHint: 'Напиши име на герой, град, река или събитие.',
  vTroad: 'Троада', vTroy: 'Троя отблизо', vAll: 'Родините на героите',
  themes: 'Теми', books: 'Песни', heroes: 'Герои', legend: 'Легенда', close: 'Затвори', back: 'Назад',
  reading: 'Чета Песен {n}', startReading: 'Чета „Илиада“', book: 'Песен {n}', bookShort: 'Песен',
  achaean: 'Ахейци', trojan: 'Троянци и съюзници', story: 'Място от сюжета', water: 'Реки и води',
  event: 'Събитие', dig: 'Археология', hittite: 'Хетско име', town: 'Град от Каталога', alt: 'Друго възможно място',
  route: 'Маршрут', overlay: 'Древен бряг и води', point: 'Място от разказа', theme: 'Тема',
  c1: 'Сигурно', c2: 'Приблизително', c3: 'Спорно или неизвестно',
  howSure: 'Точност', inPoem: 'В поемата', leaders: 'Водачи', ships1: '{n} кораб', shipsN: '{n} кораба',
  towns: 'Градове от Каталога на корабите', alts: 'Други възможни места', altOf: 'Друго възможно място за', townOf: 'Град на', source: 'Източник',
  digHere: 'Какво е разкопано', notInHomer: 'Името не е у Омир', odyssey: '„Одисея“', lines: 'ст.', line: 'ст.',
  scene: 'Сцена {i} от {n}', scenes: 'Сцени', overview: 'Преглед', next: 'Напред', prev: 'Назад', replay: 'Пусни пътя отново',
  startScenes: 'Започни от първата сцена', placesHere: 'Места в тази песен', mentioned: 'Споменати', action: 'Действието е тук',
  nextBook: 'Към Песен {n}', otherBook: 'Друга песен', leaveBook: 'Затвори песента', noScenes: 'За тази песен още няма сцени.',
  bookmark: 'Отметка', bookmarkAt: 'Отметката ти е на Песен {n}', bookmarkAll: 'Прочел си цялата поема', moveBookmark: 'Премести отметката тук',
  beyond: 'Тази песен е след отметката ти. Картата я крие, за да не ти разкаже края.', peek: 'Покажи я въпреки това',
  willMove: 'Отметката ти ще се премести на Песен {n}.', showSummary: 'Покажи заглавието и резюмето', summaryNote: 'Резюмето разказва цялата песен, затова е скрито, докато я четеш.', sceneN: 'Сцена {n}', hiddenTitle: 'заглавието е скрито', pickBook: 'Избери песен',
  pickBookText: 'Картата показва местата и сцените на избраната песен. Останалото избледнява.',
  onboardTitle: 'Докъде си стигнал?', onboardText: 'Избери песента, която четеш. Картата ще крие всичко, което се случва по-нататък. Можеш да го смениш по всяко време.',
  readAll: 'Чел съм цялата поема', changeLater: 'Отметката се мести от „Песни“.',
  spoiler: 'Песен {n}', spoilerEnd: 'след края', spoilerTitle: 'Скрито, за да не разваля четенето. Докосни, за да го видиш.',
  introTitle: 'Троада по времето на „Илиада“',
  introText: 'Докосни град, събитие или маршрут. Формата и цветът показват чия е земята, а запълването показва колко сигурно е мястото.',
  introCoast: 'Морето северно от Троя е брегът около 1200 г. пр.Хр. Днес там е суша.',
  legendTitle: 'Как се чете картата', legendShape: 'Кръг = ахейци, квадрат = троянци и съюзници, зелен кръг = място от сюжета, лилав ромб = събитие.',
  legendFill: 'Пълен знак = сигурно място. Наполовина = приблизително. Празен с въпросителна = спорно.',
  coast: 'Бряг и реки', coastThen: 'около 1200 пр.Хр.', coastNow: 'днес',
  coastNote: 'Сините зони с пунктир са суша днес, но са били вода около 1200 г. пр.Хр.',
  coastPlay: 'Пусни промяната', coastBlend: 'Плъзгачът само прелива едната карта в другата. Междинните положения не са отделни възстановки.',
  tilt: '3D релеф', tiltOn: 'Изглед отгоре', north: 'Север нагоре', zoomIn: 'Приближи', zoomOut: 'Отдалечи',
  themeOff: 'Изключи темата', otherThemes: 'Други теми', stop: 'Спирка {i} от {n}', hiddenItems: 'Още {n} са скрити до по-късна песен.',
  heroesTitle: 'Кой откъде е', heroesFilter: 'Име на герой',
  peopleTitle: 'Хора и богове', tabHeroes: 'Герои', tabGods: 'Богове', tabFamilies: 'Родове', forAchaeans: 'За ахейците', forTrojans: 'За троянците', aboveBoth: 'Над двете страни',
  frontTitle: 'Бойната линия', frontShips: 'корабите', frontCity: 'Троя', frontNote: 'Схематично. Показва само докъде е стигнал боят между корабите и града.',
  family: 'Род', father: 'Баща', mother: 'Майка', home: 'Родина', godsFor: 'Богове на тази страна', inScenes: 'В сцените, които си прочел', notYet: 'Още не се появява в прочетеното.', mainHeroes: 'Главни герои', hero: 'Герой', allLeaders: 'Всички водачи по родина',
  dayOf: 'Ден {a} от около {n}', daysSpan: 'Дни {a}–{b} от около {n}', today: 'Днес', todayHint: 'Днешни градове и държави', lookFrom: 'Погледни оттук към Троя',
  credits: 'Източници', creditsText: 'Брегова линия: © участниците в OpenStreetMap (ODbL). Релеф: © Mapterhorn, по Copernicus DEM (© DLR, Airbus; предоставен от ЕС и ЕКА). Древни места: Pleiades (CC BY). Реки и днешни граници: Natural Earth. Номерата на стиховете са сверени с гръцкия текст в Perseus Digital Library. Текстовете са писани за тази карта и не цитират превод на поемата.',
  creditsAll: 'Всички източници и лицензи', sourceCode: 'Изходен код',
  schematic: 'Местата на битките и пътищата са схематични. Омир назовава точките, но не и точното място.',
  lang: 'English', langCode: 'EN', loading: 'Зареждане…', realmsHint: 'Докосни област, за да видиш царя и градовете му.',
};

const en: typeof bg = {
  title: 'The Iliad Map', subtitle: 'around 1200 BC',
  search: 'Search a hero or a place', searchNone: 'No such name on the map.', searchHint: 'Type the name of a hero, town, river or event.',
  vTroad: 'Troad', vTroy: 'Troy up close', vAll: 'Homelands',
  themes: 'Themes', books: 'Books', heroes: 'Heroes', legend: 'Legend', close: 'Close', back: 'Back',
  reading: 'Reading Book {n}', startReading: 'Reading the Iliad', book: 'Book {n}', bookShort: 'Book',
  achaean: 'Achaeans', trojan: 'Trojans and allies', story: 'Place in the story', water: 'Rivers and waters',
  event: 'Event', dig: 'Archaeology', hittite: 'Hittite name', town: 'Catalogue town', alt: 'Other possible location',
  route: 'Route', overlay: 'Ancient coast and waters', point: 'Place in the tale', theme: 'Theme',
  c1: 'Certain', c2: 'Approximate', c3: 'Disputed or unknown',
  howSure: 'How sure', inPoem: 'In the poem', leaders: 'Leaders', ships1: '{n} ship', shipsN: '{n} ships',
  towns: 'Towns in the Catalogue of Ships', alts: 'Other possible locations', altOf: 'Another possible location for', townOf: 'A town of', source: 'Source',
  digHere: 'What has been excavated', notInHomer: 'The name is not in Homer', odyssey: 'Odyssey', lines: 'lines', line: 'line',
  scene: 'Scene {i} of {n}', scenes: 'Scenes', overview: 'Overview', next: 'Next', prev: 'Back', replay: 'Play the journey again',
  startScenes: 'Start with the first scene', placesHere: 'Places in this book', mentioned: 'Mentioned', action: 'The action is here',
  nextBook: 'On to Book {n}', otherBook: 'Another book', leaveBook: 'Close the book', noScenes: 'There are no scenes for this book yet.',
  bookmark: 'Bookmark', bookmarkAt: 'Your bookmark is at Book {n}', bookmarkAll: 'You have read the whole poem', moveBookmark: 'Move the bookmark here',
  beyond: 'This book is past your bookmark. The map keeps it hidden so it does not give the story away.', peek: 'Show it anyway',
  willMove: 'Your bookmark will move to Book {n}.', showSummary: 'Show the title and the summary', summaryNote: 'The summary tells the whole book, so it stays hidden while you read it.', sceneN: 'Scene {n}', hiddenTitle: 'title hidden', pickBook: 'Choose a book',
  pickBookText: 'The map shows the places and scenes of the book you choose. Everything else fades.',
  onboardTitle: 'How far have you read?', onboardText: 'Choose the book you are reading. The map will hide whatever happens later. You can change this at any time.',
  readAll: 'I have read the whole poem', changeLater: 'You can move the bookmark under “Books”.',
  spoiler: 'Book {n}', spoilerEnd: 'after the end', spoilerTitle: 'Hidden so it does not spoil your reading. Tap to see it.',
  introTitle: 'The Troad in the time of the Iliad',
  introText: 'Tap a town, an event or a route. Shape and colour show whose land it is. The filling shows how sure the location is.',
  introCoast: 'The sea north of Troy is the coast of around 1200 BC. Today it is dry land.',
  legendTitle: 'How to read the map', legendShape: 'Circle = Achaeans, square = Trojans and allies, green circle = place in the story, purple diamond = event.',
  legendFill: 'Full mark = certain location. Half = approximate. Hollow with a question mark = disputed.',
  coast: 'Coast and rivers', coastThen: 'around 1200 BC', coastNow: 'today',
  coastNote: 'The blue areas with a dotted edge are dry land today, but were water around 1200 BC.',
  coastPlay: 'Play the change', coastBlend: 'The slider only fades one map into the other. The positions in between are not separate reconstructions.',
  tilt: '3D relief', tiltOn: 'View from above', north: 'North up', zoomIn: 'Zoom in', zoomOut: 'Zoom out',
  themeOff: 'Turn the theme off', otherThemes: 'Other themes', stop: 'Stop {i} of {n}', hiddenItems: '{n} more are hidden until a later book.',
  heroesTitle: 'Who comes from where', heroesFilter: 'Name of a hero',
  peopleTitle: 'People and gods', tabHeroes: 'Heroes', tabGods: 'Gods', tabFamilies: 'Families', forAchaeans: 'For the Achaeans', forTrojans: 'For the Trojans', aboveBoth: 'Above both sides',
  frontTitle: 'The battle line', frontShips: 'the ships', frontCity: 'Troy', frontNote: 'Schematic. It only shows how far the fighting has reached between the ships and the city.',
  family: 'Family', father: 'Father', mother: 'Mother', home: 'Home', godsFor: 'Gods on this side', inScenes: 'In the scenes you have read', notYet: 'Not in what you have read yet.', mainHeroes: 'Main heroes', hero: 'Hero', allLeaders: 'All leaders by homeland',
  dayOf: 'Day {a} of about {n}', daysSpan: 'Days {a}–{b} of about {n}', today: 'Today', todayHint: 'Modern towns and countries', lookFrom: 'Look towards Troy from here',
  credits: 'Sources', creditsText: 'Coastline: © OpenStreetMap contributors (ODbL). Relief: © Mapterhorn, from Copernicus DEM (© DLR, Airbus; provided by the EU and ESA). Ancient places: Pleiades (CC BY). Rivers and modern borders: Natural Earth. Line numbers were checked against the Greek text of the Perseus Digital Library. The texts were written for this map and quote no translation of the poem.',
  creditsAll: 'All sources and licences', sourceCode: 'Source code',
  schematic: 'Battle sites and routes are schematic. Homer names the points, not the exact spot.',
  lang: 'Български', langCode: 'БГ', loading: 'Loading…', realmsHint: 'Tap a region to see its king and towns.',
};

const UI: Record<Lang, typeof bg> = { bg, en };
export type Key = keyof typeof bg;

export function t(key: Key, vars?: Record<string, string | number>): string {
  let s = UI[lang.value][key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace('{' + k + '}', String(v));
  return s;
}
export const ships = (n: number) => t(n === 1 ? 'ships1' : 'shipsN', { n });
const range = (r: Ref) => (r.to ? `${r.from}–${r.to}` : String(r.from));

/** "Песен 2, ст. 494–510" or "Book 2, lines 494–510". */
export function fmtRef(r: Ref): string {
  if (r.od) return `${t('odyssey')} ${r.b}${r.from ? '.' + range(r) : ''}`;
  if (!r.from) return t('book', { n: r.b });
  return `${t('book', { n: r.b })}, ${t(r.to ? 'lines' : 'line')} ${range(r)}`;
}
export const fmtLines = (from: number, to: number) => `${t('lines')} ${from}–${to}`;
