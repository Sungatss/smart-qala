import { GoogleGenAI } from '@google/genai';
import { AIAnalysisResult, Category, Department, PriorityLevel } from '@/types';

const VALID_CATEGORIES: Category[] = [
  'Дороги',
  'Освещение',
  'Мусор',
  'Транспорт',
  'Благоустройство',
  'Экология',
  'Водоснабжение',
  'Безопасность',
  'Другое'
];

const VALID_DEPARTMENTS: Department[] = [
  'ЖКХ',
  'Транспорт',
  'Благоустройство',
  'Экология',
  'Городская инфраструктура'
];

const VALID_PRIORITIES: PriorityLevel[] = ['high', 'medium', 'low'];

/**
 * Deterministic fallback rule-based classifier for civic requests
 * Used when Gemini API key is missing or when network/API call fails.
 */
export function analyzeWithFallback(text: string, location?: string): AIAnalysisResult {
  const lower = text.toLowerCase();

  let category: Category = 'Другое';
  let subcategory = 'Городское хозяйство';
  let department: Department = 'ЖКХ';
  let priority: PriorityLevel = 'medium';
  let priority_reason = 'Стандартное обращение жителей, плановое рассмотрение.';
  let title = 'Городское обращение';

  // Rule 1: Lighting / Освещение
  if (
    lower.includes('фонар') ||
    lower.includes('свет') ||
    lower.includes('темно') ||
    lower.includes('освещен') ||
    lower.includes('ламп') ||
    lower.includes('столб')
  ) {
    category = 'Освещение';
    subcategory = 'Наружное освещение';
    department = 'ЖКХ';
    priority = lower.includes('школ') || lower.includes('сад') || lower.includes('переход') || lower.includes('дет')
      ? 'high'
      : 'medium';
    priority_reason = priority === 'high'
      ? 'Отсутствие освещения на социально значимом объекте или пешеходной зоне в темное время суток.'
      : 'Неисправность элементов уличного освещения.';
    title = 'Неисправность уличного освещения';
  }
  // Rule 2: Roads / Дороги
  else if (
    lower.includes('яма') ||
    lower.includes('асфальт') ||
    lower.includes('дорог') ||
    lower.includes('выбоин') ||
    lower.includes('колея') ||
    lower.includes('люк') ||
    lower.includes('проезж')
  ) {
    category = 'Дороги';
    subcategory = lower.includes('люк') ? 'Колодцы и люки' : 'Ямочный ремонт';
    department = 'ЖКХ';
    priority = 'high';
    priority_reason = 'Дефект дорожного полотна создает непосредственную угрозу ДТП и повреждения автотранспорта.';
    title = lower.includes('люк') ? 'Открытый или поврежденный люк' : 'Повреждение дорожного полотна';
  }
  // Rule 3: Waste / Мусор
  else if (
    lower.includes('мусор') ||
    lower.includes('контейнер') ||
    lower.includes('отход') ||
    lower.includes('свалк') ||
    lower.includes('бак') ||
    lower.includes('тбо')
  ) {
    category = 'Мусор';
    subcategory = lower.includes('свалк') ? 'Ликвидация несанкционированных свалок' : 'Вывоз ТБО';
    department = 'Экология';
    priority = lower.includes('детск') || lower.includes('двор') ? 'medium' : 'low';
    priority_reason = 'Нарушение санитарных норм и графика вывоза отходов на территории города.';
    title = 'Скопление бытовых отходов';
  }
  // Rule 4: Water Supply / Водоснабжение
  else if (
    lower.includes('вода') ||
    lower.includes('порыв') ||
    lower.includes('затоп') ||
    lower.includes('труб') ||
    lower.includes('течь') ||
    lower.includes('канализац') ||
    lower.includes('колодец')
  ) {
    category = 'Водоснабжение';
    subcategory = 'Аварии на сетях водоснабжения';
    department = 'ЖКХ';
    priority = 'high';
    priority_reason = 'Аварийная ситуация на водопроводных или канализационных сетях с риском подтопления инфраструктуры.';
    title = 'Аварийная утечка на сетях водоснабжения';
  }
  // Rule 5: Transport / Транспорт
  else if (
    lower.includes('автобус') ||
    lower.includes('маршрут') ||
    lower.includes('остановк') ||
    lower.includes('транспорт') ||
    lower.includes('водитель') ||
    lower.includes('рейс')
  ) {
    category = 'Транспорт';
    subcategory = 'Городской пассажирский транспорт';
    department = 'Транспорт';
    priority = 'medium';
    priority_reason = 'Нарушение регулярности пассажирских перевозок и транспортного обслуживания населения.';
    title = 'Нарушение работы общественного транспорта';
  }
  // Rule 6: Safety / Безопасность
  else if (
    lower.includes('знак') ||
    lower.includes('пешеход') ||
    lower.includes('светофор') ||
    lower.includes('переход') ||
    lower.includes('опасн') ||
    lower.includes('огражден')
  ) {
    category = 'Безопасность';
    subcategory = 'Организация дорожного движения';
    department = 'Городская инфраструктура';
    priority = 'high';
    priority_reason = 'Факторы риска для жизни и безопасности пешеходов и участников дорожного движения.';
    title = 'Обеспечение безопасности дорожного движения';
  }
  // Rule 7: Parks / Благоустройство
  else if (
    lower.includes('скамейк') ||
    lower.includes('лавочк') ||
    lower.includes('парк') ||
    lower.includes('сквер') ||
    lower.includes('урн') ||
    lower.includes('детск') ||
    lower.includes('площадк') ||
    lower.includes('газон') ||
    lower.includes('дерев') ||
    lower.includes('бордюр')
  ) {
    category = 'Благоустройство';
    subcategory = 'Малые архитектурные формы и озеленение';
    department = 'Благоустройство';
    priority = 'low';
    priority_reason = 'Вопросы текущего содержания элементов благоустройства и зон отдыха.';
    title = 'Ремонт элементов благоустройства';
  }
  // Rule 8: Ecology / Экология
  else if (
    lower.includes('смог') ||
    lower.includes('дым') ||
    lower.includes('запах') ||
    lower.includes('иртыш') ||
    lower.includes('река') ||
    lower.includes('выброс')
  ) {
    category = 'Экология';
    subcategory = 'Охрана окружающей среды';
    department = 'Экология';
    priority = 'medium';
    priority_reason = 'Воздействие на экологическую обстановку и качество атмосферного воздуха/водоемов.';
    title = 'Экологический инцидент';
  }

  // Civic language cleaner:
  // Strip emotional noise, remove repetitive punctuation, make concise institutional Russian sentence
  let cleaned = text
    .replace(/[!]{2,}/g, '.')
    .replace(/[?]{2,}/g, '?')
    .replace(/\b(здравствуйте|добрый день|пожалуйста|срочно сделайте что-нибудь|куда смотрят власти|ужас|бардак|кошмар)\b/gi, '')
    .trim();

  // Ensure first letter uppercase
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    if (!cleaned.endsWith('.') && !cleaned.endsWith('?') && !cleaned.endsWith('!')) {
      cleaned += '.';
    }
  }

  // Prepend institutional context if location is given
  if (location && !cleaned.toLowerCase().includes(location.toLowerCase())) {
    cleaned = `${cleaned} Адрес: ${location}.`;
  }

  return {
    title,
    cleaned_text: cleaned || text,
    category,
    subcategory,
    department,
    priority,
    priority_reason
  };
}

/**
 * Main AI analysis entry point.
 * Uses Google Gemini when API key is provided, with structured JSON schema.
 * Preserves core meaning without hallucinating or inventing extra facts.
 * Falls back to deterministic rule engine on error or absent key.
 */
export async function analyzeRequest(text: string, location?: string): Promise<AIAnalysisResult> {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY;

  if (!apiKey) {
    return analyzeWithFallback(text, location);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `Ты — беспристрастный ИИ-диспетчер цифрового сервиса городского мониторинга «Smart Qala» (г. Семей, Казахстан).
Твоя задача — преобразовать эмоциональное или неструктурированное сообщение жителя в официальный, четкий протокол городского инцидента.

СТРОГИЕ ПРАВИЛА:
1. НИКОГДА НЕ ПРИДУМЫВАЙ ФАКТЫ. Не добавляй подробностей, чисел или обстоятельств, которых нет в исходном тексте.
2. Исключай эмоции, жалобы, ругательства, приветствия и риторические вопросы.
3. Сохраняй суть проблемы, конкретные ориентиры, адреса и дефекты.
4. cleaned_text должен быть лаконичным, строго деловым описанием дефекта на русском языке (1-3 предложения).
5. category ДОЛЖНА быть строго одной из: 'Дороги' | 'Освещение' | 'Мусор' | 'Транспорт' | 'Благоустройство' | 'Экология' | 'Водоснабжение' | 'Безопасность' | 'Другое'.
6. department ДОЛЖЕН быть строго одним из: 'ЖКХ' | 'Транспорт' | 'Благоустройство' | 'Экология' | 'Городская инфраструктура'.
7. priority ДОЛЖЕН быть строго: 'high' (угроза жизни, безопасности детей, открытые люки, порыв труб, ДТП), 'medium' (срыв транспорта, переполненные баки, темные дворы), 'low' (косметика, сломанная лавочка, плановый покос).
8. priority_reason — короткое (1 предложение) объективное обоснование присвоенного приоритета.
9. title — емкий заголовок проблемы (3-6 слов).`;

    const userPrompt = `Сообщение жителя:
"""${text}"""
${location ? `Указанный адрес/локация: """${location}"""` : ''}

Сформируй ответ строго в формате JSON со следующими полями:
{
  "title": "Краткий заголовок проблемы",
  "cleaned_text": "Структурированное официальное описание инцидента без лишних эмоций и без выдуманных фактов",
  "category": "Дороги | Освещение | Мусор | Транспорт | Благоустройство | Экология | Водоснабжение | Безопасность | Другое",
  "subcategory": "Уточняющая подкатегория",
  "department": "ЖКХ | Транспорт | Благоустройство | Экология | Городская инфраструктура",
  "priority": "high | medium | low",
  "priority_reason": "Обоснование приоритета"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json'
      }
    });

    const rawOutput = response.text?.trim() || '';
    if (!rawOutput) {
      return analyzeWithFallback(text, location);
    }

    const parsed = JSON.parse(rawOutput);

    // Validate category, department and priority
    const category: Category = VALID_CATEGORIES.includes(parsed.category)
      ? parsed.category
      : 'Другое';

    const department: Department = VALID_DEPARTMENTS.includes(parsed.department)
      ? parsed.department
      : 'ЖКХ';

    const priority: PriorityLevel = VALID_PRIORITIES.includes(parsed.priority)
      ? parsed.priority
      : 'medium';

    return {
      title: typeof parsed.title === 'string' && parsed.title.length > 0 ? parsed.title : 'Городской инцидент',
      cleaned_text: typeof parsed.cleaned_text === 'string' && parsed.cleaned_text.length > 0 ? parsed.cleaned_text : text,
      category,
      subcategory: typeof parsed.subcategory === 'string' ? parsed.subcategory : 'Общее',
      department,
      priority,
      priority_reason: typeof parsed.priority_reason === 'string' ? parsed.priority_reason : 'Определено моделью анализа инцидентов.'
    };
  } catch (err) {
    console.warn('Gemini API call failed, falling back to deterministic engine:', err);
    return analyzeWithFallback(text, location);
  }
}
