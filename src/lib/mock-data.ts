import { CityRequest, CreateRequestInput, RequestStats, UpdateRequestInput, UserProfile, NotificationItem, DeveloperFeedback, OfficialFeedbackMessage } from '@/types';

export const DEMO_PHOTOS = {
  trash_before: '/images/issues/trash_overflow.jpg',
  trash_after: '/images/issues/trash_cleaned.jpg',
  pothole_before: '/images/issues/pothole_defect.jpg',
  pothole_after: '/images/issues/pothole_fixed.jpg',
  streetlight_before: '/images/issues/streetlight_dark.jpg',
  streetlight_after: '/images/issues/streetlight_bright.jpg',
  bench_before: '/images/issues/bench_damaged.jpg',
  bench_after: '/images/issues/bench_restored.jpg',
  water_leak: '/images/issues/water_leak.jpg',
  bus_stop: '/images/issues/warm_stop.jpg',
  crosswalk: '/images/semey/auezov.jpg',
  river_cleanup: '/images/issues/river_cleanup.jpg',
  bikeway: '/images/semey/sunset_irtysh.jpg',
  warm_bus_stop: '/images/issues/warm_stop.jpg',
  recycling: '/images/issues/recycling_point.jpg',
  semey_bridge: '/images/semey/bridge.jpg',
  semey_auezov: '/images/semey/auezov.jpg',
  semey_station: '/images/semey/station.jpg',
  semey_sunset: '/images/semey/sunset_irtysh.jpg'
};

export const MOCK_USERS: Record<string, UserProfile> = {
  citizen: {
    id: 'user-citizen-1',
    name: 'Азамат Султанов',
    role: 'citizen',
    roleTitle: 'Житель г. Семей',
    email: 'azamat.s@mail.kz',
    phone: '+7 (705) 412-88-99',
    district: 'Центральный'
  },
  employee: {
    id: 'user-employee-1',
    name: 'Канат Сериков',
    role: 'employee',
    roleTitle: 'Государственные службы г. Семей',
    email: 'k.serikov@semey-gov.kz',
    phone: '+7 (7222) 52-20-10',
    district: 'Центральный'
  },
  admin: {
    id: 'user-admin-1',
    name: 'Даурен Байжанов',
    role: 'admin',
    roleTitle: 'Администрация сайта',
    email: 'd.baizhanov@abai.gov.kz',
    phone: '+7 (7222) 56-00-01',
    district: 'Центральный'
  }
};

const SEED_REQUESTS: CityRequest[] = [
  {
    id: 'SQ-00122',
    type: 'problem',
    title: 'Ямочный ремонт дорожного покрытия по ул. Абая',
    original_text: 'На проезжей части улицы Абая возле остановки образовалась глубокая опасная яма с острыми краями, машины разбивали подвеску.',
    cleaned_text: 'Устранение локального разрушения асфальтобетонного покрытия (выбоины глубиной до 15 см) на проезжей части по ул. Абая.',
    category: 'Дороги',
    subcategory: 'Ямочный ремонт',
    department: 'ЖКХ',
    priority: 'high',
    priority_reason: 'Угроза безопасности дорожного движения на центральной магистрали города.',
    status: 'resolved',
    location_address: 'г. Семей, ул. Абая, 88',
    latitude: 50.4102,
    longitude: 80.2514,
    district: 'Центральный',
    photo_before_url: DEMO_PHOTOS.pothole_before,
    photo_after_url: DEMO_PHOTOS.pothole_after,
    resolution_report: 'Бригадой ДЭУ-1 выполнен комплексный ямочный ремонт дорожного полотна. Выбоина вырезана дорожной фрезой, уложен горячий мелкозернистый асфальтобетон и укатан катком в уровень с проезжей частью.',
    created_at: '2026-09-24T10:15:00.000Z',
    resolved_at: '2026-09-25T16:30:00.000Z',
    upvotes: 38,
    author_name: 'Ербол Сапаров',
    moderation_status: 'approved'
  },
  {
    id: 'SQ-00123',
    type: 'problem',
    title: 'Восстановление освещения пешеходного перехода по ул. Мухтара Ауэзова',
    original_text: 'Не горел фонарь над пешеходным переходом и магазином, пешеходов в темноте вообще не было видно.',
    cleaned_text: 'Восстановление работоспособности наружного освещения пешеходного перехода и прилегающей зоны по ул. Мухтара Ауэзова.',
    category: 'Освещение',
    subcategory: 'Наружное освещение',
    department: 'ЖКХ',
    priority: 'high',
    priority_reason: 'Безопасность движения пешеходов через проезжую часть в вечернее и ночное время.',
    status: 'resolved',
    location_address: 'г. Семей, ул. Мухтара Ауэзова, 42',
    latitude: 50.4078,
    longitude: 80.2442,
    district: 'Центральный',
    photo_before_url: DEMO_PHOTOS.streetlight_before,
    photo_after_url: DEMO_PHOTOS.streetlight_after,
    resolution_report: 'Аварийной бригадой «Горсвет» заменен сгоревший патрон, смонтирован новый энергоэффективный светодиодный консольный светильник LED 120W. Освещенность перехода приведена в норму.',
    created_at: '2026-09-25T18:40:00.000Z',
    resolved_at: '2026-09-26T20:15:00.000Z',
    upvotes: 29,
    author_name: 'Нурлан Ибраев',
    moderation_status: 'approved'
  },
  {
    id: 'SQ-00124',
    type: 'problem',
    title: 'Не работают уличные фонари возле школы №1',
    original_text: 'Здравствуйте! Уже третью неделю темнота около школы на Ауэзова 12. Дети возвращаются со второй смены в потемках, пешеходный переход вообще не освещен, водители не замечают пешеходов! Сделайте что-нибудь срочно!',
    cleaned_text: 'Отсутствует уличное освещение на участке возле школы по ул. Мухтара Ауэзова, 12. Пешеходный переход не освещен, что создает угрозу безопасности учащихся второй смены.',
    category: 'Освещение',
    subcategory: 'Наружное освещение',
    department: 'ЖКХ',
    priority: 'high',
    priority_reason: 'Угроза безопасности детей возле образовательного учреждения в темное время суток.',
    status: 'in_progress',
    location_address: 'г. Семей, ул. Мухтара Ауэзова, 12',
    latitude: 50.4111,
    longitude: 80.2458,
    district: 'Центральный',
    photo_before_url: DEMO_PHOTOS.streetlight_before,
    created_at: '2026-09-27T08:15:00.000Z',
    upvotes: 18,
    author_id: 'user-citizen-1',
    author_name: 'Азамат Султанов',
    author_phone: '+7 (705) 412-88-99',
    author_email: 'azamat.s@mail.kz',
    is_anonymous: false,
    moderation_status: 'approved',
    official_feedback: [
      {
        id: 'fb-1',
        author: 'Канат Сериков (Диспетчер ЖКХ)',
        department: 'ЖКХ',
        text: 'Заявка принята в работу. Выезд бригады Горсвет запланирован на 29.09.2026. Проводится замена предохранителей на трансформаторной подстанции.',
        created_at: '2026-09-28T09:30:00.000Z'
      }
    ]
  },
  {
    id: 'SQ-00125',
    type: 'problem',
    title: 'Глубокая яма на проезжей части пр. Шакарима',
    original_text: 'По Шакарима 45 прямо напротив остановки огромная яма в правом ряду, сантиметров 20 глубиной. Все машины резко тормозят или вылетают на встречку, вчера чуть не произошло лобовое ДТП. Срочно заделайте асфальт.',
    cleaned_text: 'Дефект дорожного покрытия (глубокая выбоина) на проезжей части правого ряда по пр. Шакарима, 45, провоцирующий аварийные ситуации и выезд автотранспорта на встречную полосу.',
    category: 'Дороги',
    subcategory: 'Ямочный ремонт',
    department: 'ЖКХ',
    priority: 'high',
    priority_reason: 'Высокий риск дорожно-транспортного происшествия на магистральной улице с плотным движением.',
    status: 'new',
    location_address: 'г. Семей, пр. Шакарима, 45',
    latitude: 50.4082,
    longitude: 80.2589,
    district: 'Центральный',
    photo_before_url: DEMO_PHOTOS.pothole_before,
    created_at: '2026-09-29T09:30:00.000Z',
    upvotes: 24,
    author_name: 'Марат Касымов',
    author_phone: '+7 (777) 321-44-55',
    author_email: 'marat.k@gmail.com',
    is_anonymous: false,
    moderation_status: 'approved'
  },
  {
    id: 'SQ-00126',
    type: 'problem',
    title: 'Переполнены мусорные баки и стихийное скопление отходов',
    original_text: 'Кабанбай батыра 18 во дворе мусор не вывозили уже 5 дней. Баки переполнены с горкой, пакеты растаскивают бродячие собаки и разносит ветром по всей детской площадке. Неприятный запах стоит до верхних этажей.',
    cleaned_text: 'Нарушение графика вывоза ТБО по ул. Кабанбай батыра, 18. Переполнение контейнерной площадки и распространение мусора на прилегающую дворовую территорию.',
    category: 'Мусор',
    subcategory: 'Вывоз ТБО',
    department: 'Экология',
    priority: 'medium',
    priority_reason: 'Нарушение санитарно-эпидемиологических норм на дворовой территории многоквартирного дома.',
    status: 'resolved',
    location_address: 'г. Семей, ул. Кабанбай батыра, 18',
    latitude: 50.4155,
    longitude: 80.2312,
    district: 'Левобережный',
    photo_before_url: DEMO_PHOTOS.trash_before,
    photo_after_url: DEMO_PHOTOS.trash_after,
    resolution_report: 'Спецавтотранспортом коммунальной службы произведен внеплановый вывоз накопившихся твердых бытовых отходов. Контейнерная площадка и прилегающая зона очищены, проведена дезинфекция.',
    created_at: '2026-09-25T11:20:00.000Z',
    resolved_at: '2026-09-26T14:45:00.000Z',
    upvotes: 12,
    author_name: 'Айгуль Токтарова',
    author_phone: '+7 (701) 998-11-22',
    author_email: 'aigul.t@mail.ru',
    is_anonymous: false,
    moderation_status: 'approved',
    official_feedback: [
      {
        id: 'fb-2',
        author: 'Отдел экологии и санитарии',
        department: 'Экология',
        text: 'Вывоз ТБО выполнен в полном объеме, контейнерная площадка вымыта и продезинфицирована.',
        created_at: '2026-09-26T14:50:00.000Z'
      }
    ]
  },
  {
    id: 'SQ-00127',
    type: 'problem',
    title: 'Отсутствует дорожный знак пешеходного перехода у поликлиники',
    original_text: 'На Ибраева возле 34 дома снесли знак пешеходного перехода при ремонте, разметка стерлась. Здесь поликлиника, переходят пожилые люди и мамы с колясками, водители несутся и не уступают. Нужен знак обратно!',
    cleaned_text: 'Отсутствует дорожный знак 5.19.1/5.19.2 «Пешеходный переход» и изношена дорожная разметка по ул. Ибраева, 34 вблизи медицинского учреждения.',
    category: 'Безопасность',
    subcategory: 'Дорожные знаки и разметка',
    department: 'Городская инфраструктура',
    priority: 'high',
    priority_reason: 'Угроза безопасности пешеходов и маломобильных граждан возле социального объекта.',
    status: 'assigned',
    location_address: 'г. Семей, ул. Ибраева, 34',
    latitude: 50.419,
    longitude: 80.2521,
    district: 'Центральный',
    photo_before_url: DEMO_PHOTOS.crosswalk,
    created_at: '2026-09-28T10:05:00.000Z',
    upvotes: 31,
    author_name: 'Руслан С.',
    author_phone: '+7 (771) 505-60-70',
    author_email: 'ruslan.s@inbox.kz',
    is_anonymous: true,
    moderation_status: 'approved'
  },
  {
    id: 'SQ-00128',
    type: 'problem',
    title: 'Повреждение парковой скамейки и урны в сквере Победы',
    original_text: 'В сквере Победы со стороны Чайжунусова сломали спинку у центральной деревянной лавочки и перевернули бетонную урну, мусор валяется вокруг. Пенсионерам негде присесть.',
    cleaned_text: 'Повреждение малых архитектурных форм (сломана спинка парковой скамьи, опрокинута урна) в сквере Победы со стороны ул. Чайжунусова.',
    category: 'Благоустройство',
    subcategory: 'Малые архитектурные формы',
    department: 'Благоустройство',
    priority: 'low',
    priority_reason: 'Повреждение элемента парковой мебели без угрозы для жизни и здоровья жителей.',
    status: 'resolved',
    location_address: 'г. Семей, сквер Победы, ул. Чайжунусова',
    latitude: 50.4045,
    longitude: 80.241,
    district: 'Центральный',
    photo_before_url: DEMO_PHOTOS.bench_before,
    photo_after_url: DEMO_PHOTOS.bench_after,
    resolution_report: 'Бригадой МП «Благоустройство» выполнен ремонт и укрепление парковой скамьи, произведена замена деревянных реек с покраской, урна восстановлена на основание.',
    created_at: '2026-09-24T14:00:00.000Z',
    resolved_at: '2026-09-26T16:10:00.000Z',
    upvotes: 9,
    author_name: 'Бауржан М.'
  },
  {
    id: 'SQ-00129',
    type: 'problem',
    title: 'Регулярный срыв интервалов автобуса №35',
    original_text: 'Автобус №35 с 18:30 до 20:00 невозможно дождаться на Центральном рынке. Интервал должен быть 10 минут, а стоим по 40-50 минут на холоде. Автобусы проезжают мимо переполненные.',
    cleaned_text: 'Систематическое несоблюдение утвержденного графика движения автобусного маршрута №35 на остановочном пункте «Центральный рынок» в вечерние часы пик.',
    category: 'Транспорт',
    subcategory: 'Общественный транспорт',
    department: 'Транспорт',
    priority: 'medium',
    priority_reason: 'Сбой в графике движения магистрального пассажирского маршрута, затрагивающий большое число пассажиров.',
    status: 'under_review',
    location_address: 'г. Семей, ост. «Центральный рынок»',
    latitude: 50.4128,
    longitude: 80.2475,
    district: 'Центральный',
    photo_before_url: DEMO_PHOTOS.bus_stop,
    created_at: '2026-09-28T16:40:00.000Z',
    upvotes: 56,
    author_id: 'user-citizen-1',
    author_name: 'Азамат Султанов'
  },
  {
    id: 'SQ-00130',
    type: 'problem',
    title: 'Порыв водопроводной трубы и подтопление пешеходной зоны',
    original_text: 'На Селевина 8 из-под земли бьет вода уже второй день, весь тротуар и подход к подъездам затоплены холодной водой, размывает грунт около фундамента.',
    cleaned_text: 'Аварийная утечка на линии холодного водоснабжения по ул. Селевина, 8, сопровождающаяся подтоплением пешеходного тротуара и угрозой размытия грунта.',
    category: 'Водоснабжение',
    subcategory: 'Аварии на водопроводе',
    department: 'ЖКХ',
    priority: 'high',
    priority_reason: 'Авария на инженерных коммуникациях с риском повреждения дорожного основания и отключения потребителей.',
    status: 'in_progress',
    location_address: 'г. Семей, ул. Селевина, 8',
    latitude: 50.4305,
    longitude: 80.264,
    district: 'Затон',
    photo_before_url: DEMO_PHOTOS.water_leak,
    created_at: '2026-09-29T07:10:00.000Z',
    upvotes: 19,
    author_name: 'Елена В.'
  },
  {
    id: 'SQ-00131',
    type: 'problem',
    title: 'Стихийная свалка строительного мусора в водоохранной зоне',
    original_text: 'Возле подвесного моста на набережной Иртыша неизвестные выгрузили гору строительных отходов: битый кирпич, мешки с цементом, куски рубероида. Прямо у береговой линии реки!',
    cleaned_text: 'Несанкционированное складирование строительных отходов (бетонные осколки, битый кирпич, гидроизоляция) в водоохранной полосе реки Иртыш в районе подвесного моста.',
    category: 'Экология',
    subcategory: 'Несанкционированные свалки',
    department: 'Экология',
    priority: 'medium',
    priority_reason: 'Загрязнение природной водоохранной зоны отходами строительного происхождения.',
    status: 'new',
    location_address: 'г. Семей, набережная р. Иртыш, район подвесного моста',
    latitude: 50.401,
    longitude: 80.228,
    district: 'Левобережный',
    photo_before_url: DEMO_PHOTOS.river_cleanup,
    created_at: '2026-09-29T11:45:00.000Z',
    upvotes: 27,
    author_name: 'Ерлан Д.'
  },

  // 💡 REALISTIC CITIZEN IDEAS FOR SEMEY
  {
    id: 'SQ-00133',
    type: 'idea',
    title: 'Обустройство освещенной велодорожки вдоль набережной реки Иртыш',
    original_text: 'Предлагаю проложить непрерывную вело-пешеходную дорожку с безопасным энергосберегающим освещением от подвесного моста до речного вокзала. Сейчас велосипедисты делят тротуар с мамами с колясками, это неудобно и опасно.',
    cleaned_text: 'Проект организации выделенной велопешеходной трассы протяженностью 4.2 км вдоль набережной Иртыша с установкой LED-освещения и разметки.',
    category: 'Благоустройство',
    subcategory: 'Городская мобильность и спорт',
    department: 'Благоустройство',
    priority: 'medium',
    priority_reason: 'Развитие экологичного транспорта и повышение безопасности пешеходных зон отдыха.',
    status: 'under_review',
    location_address: 'г. Семей, набережная р. Иртыш',
    latitude: 50.405,
    longitude: 80.235,
    district: 'Центральный',
    photo_before_url: DEMO_PHOTOS.bikeway,
    created_at: '2026-09-26T15:00:00.000Z',
    upvotes: 84,
    author_id: 'user-citizen-1',
    author_name: 'Азамат Султанов'
  },
  {
    id: 'SQ-00134',
    type: 'idea',
    title: 'Установка закрытых теплых остановочных комплексов на пр. Шакарима',
    original_text: 'Зимой в Семее морозы доходят до -40 градусов с ветром. Предлагаем установить современные теплые остановки с инфракрасным обогревом и электронным табло расписания на узловых пунктах проспекта Шакарима.',
    cleaned_text: 'Модернизация пассажирских остановок по пр. Шакарима: монтаж отапливаемых павильонов закрытого типа с табло онлайн-прибытия маршрутов.',
    category: 'Транспорт',
    subcategory: 'Остановочная инфраструктура',
    department: 'Транспорт',
    priority: 'high',
    priority_reason: 'Защита здоровья пассажиров в экстремальных климатических условиях резкоконтинентальной зимы.',
    status: 'assigned',
    location_address: 'г. Семей, пр. Шакарима (ост. «Динамо» и «ЦУМ»)',
    latitude: 50.4095,
    longitude: 80.254,
    district: 'Центральный',
    photo_before_url: DEMO_PHOTOS.warm_bus_stop,
    created_at: '2026-09-27T12:30:00.000Z',
    upvotes: 142,
    author_name: 'Гульнара К.'
  },
  {
    id: 'SQ-00135',
    type: 'idea',
    title: 'Пункты раздельного приема пластика и макулатуры в микрорайоне Юность',
    original_text: 'В микрорайоне Юность нет ни одного бака для раздельного сбора отходов. Давайте установим пилотные фандоматы и сетки для сбора пластика возле супермаркетов с начислением эко-бонусов.',
    cleaned_text: 'Внедрение раздельного сбора вторичного сырья (ПЭТ, алюминий, макулатура) в жилом массиве «Юность» в партнерстве с перерабатывающими предприятиями региона.',
    category: 'Экология',
    subcategory: 'Раздельный сбор отходов',
    department: 'Экология',
    priority: 'low',
    priority_reason: 'Снижение нагрузки на полигон ТБО и формирование экологической культуры.',
    status: 'new',
    location_address: 'г. Семей, мкр. Юность, 14',
    latitude: 50.435,
    longitude: 80.275,
    district: 'Юность',
    photo_before_url: DEMO_PHOTOS.recycling,
    created_at: '2026-09-28T09:15:00.000Z',
    upvotes: 63,
    author_name: 'Данияр Ж.',
    author_phone: '+7 (702) 654-11-00',
    author_email: 'daniyar.zh@mail.kz',
    is_anonymous: false,
    moderation_status: 'approved'
  },
  {
    id: 'SQ-00136',
    type: 'problem',
    title: 'Нецензурные граффити и оскорбительные надписи на фасаде дома',
    original_text: 'Подростки разрисовали весь торец жилого дома отборными матами и оскорблениями. Требуем немедленно закрасить это безобразие!',
    cleaned_text: 'Нанесение несанкционированных надписей и граффити оскорбительного характера на фасадной стене жилого дома по ул. Достоевского, 77.',
    category: 'Благоустройство',
    subcategory: 'Фасады и граффити',
    department: 'Благоустройство',
    priority: 'medium',
    priority_reason: 'Нарушение правил благоустройства и этических норм городской среды.',
    status: 'new',
    location_address: 'г. Семей, ул. Достоевского, 77',
    latitude: 50.412,
    longitude: 80.249,
    district: 'Центральный',
    photo_before_url: DEMO_PHOTOS.bench_before,
    created_at: '2026-09-29T12:00:00.000Z',
    upvotes: 4,
    author_name: 'Жанар Оспанова',
    author_phone: '+7 (778) 991-33-22',
    author_email: 'zhanar.o@mail.kz',
    is_anonymous: false,
    moderation_status: 'flagged_inappropriate',
    moderation_reason: 'Флаг автоматической модерации: текст содержит упоминание ненормативной лексики. Требуется подтверждение модератора Администрации сайта.'
  },
  {
    id: 'SQ-00137',
    type: 'problem',
    title: 'Повреждение деформационного шва на подвесном мосту через р. Иртыш',
    original_text: 'На подвесном мосту на стыке пролетов образовалась яма с торчащей металлической полосой. Машины пробивают колеса на скорости, создается затор в сторону левого берега!',
    cleaned_text: 'Разрушение асфальтобетонного примыкания деформационного шва проезжей части подвесного моста через р. Иртыш с обнажением металлоконструкции.',
    category: 'Дороги',
    subcategory: 'Мостовые сооружения',
    department: 'ЖКХ',
    priority: 'high',
    priority_reason: 'Угроза безопасности движения на стратегическом мостовом переходе города с высокой интенсивностью потока.',
    status: 'in_progress',
    location_address: 'г. Семей, Подвесной мост через р. Иртыш',
    latitude: 50.4035,
    longitude: 80.2315,
    district: 'Центральный',
    photo_before_url: DEMO_PHOTOS.semey_bridge,
    created_at: '2026-09-29T08:10:00.000Z',
    upvotes: 68,
    author_name: 'Серик Ахметов',
    author_phone: '+7 (707) 345-88-11',
    author_email: 'serik.a@mail.kz',
    is_anonymous: false,
    moderation_status: 'approved'
  },
  {
    id: 'SQ-00138',
    type: 'problem',
    title: 'Открытый технологический люк на пешеходном тротуаре по ул. Бозтаева',
    original_text: 'На Бозтаева возле магазина крышка люка сломана пополам, дыра ничем не огорожена. Ночью запросто можно провалиться, рядом остановка и большой поток людей.',
    cleaned_text: 'Аварийное состояние смотрового колодца подземных коммуникаций (разрушена чугунная крышка) на пешеходном тротуаре по ул. Бозтаева, 24.',
    category: 'Безопасность',
    subcategory: 'Люки и колодцы',
    department: 'Городская инфраструктура',
    priority: 'high',
    priority_reason: 'Прямая угроза падения пешеходов в открытый колодец глубиной более 2 метров.',
    status: 'new',
    location_address: 'г. Семей, ул. Бозтаева, 24 (Левый берег)',
    latitude: 50.3985,
    longitude: 80.219,
    district: 'Левобережный',
    photo_before_url: DEMO_PHOTOS.water_leak,
    created_at: '2026-09-29T14:20:00.000Z',
    upvotes: 42,
    author_name: 'Алия Каримова',
    author_phone: '+7 (775) 890-44-33',
    author_email: 'aliya.k@inbox.kz',
    is_anonymous: false,
    moderation_status: 'approved'
  },
  {
    id: 'SQ-00139',
    type: 'idea',
    title: 'Модернизация уличного освещения в районе Затон (ул. Селевина)',
    original_text: 'В частном секторе Затона по Селевина фонари стоят через два столба, зимой темно уже в пять вечера. Предлагаем установить энергоэффективные LED-светильники по всей улице.',
    cleaned_text: 'Комплексная модернизация наружного освещения жилого массива «Затон» по ул. Селевина с монтажом дополнительных светодиодных консолей.',
    category: 'Освещение',
    subcategory: 'Энергосберегающее освещение',
    department: 'ЖКХ',
    priority: 'medium',
    priority_reason: 'Повышение уровня комфорта и безопасности в жилом секторе.',
    status: 'assigned',
    location_address: 'г. Семей, район Затон, ул. Селевина, 14',
    latitude: 50.432,
    longitude: 80.266,
    district: 'Затон',
    photo_before_url: DEMO_PHOTOS.streetlight_after,
    created_at: '2026-09-28T11:00:00.000Z',
    upvotes: 51,
    author_name: 'Тимур Садыков',
    author_phone: '+7 (701) 456-99-88',
    author_email: 'timur.s@gmail.com',
    is_anonymous: false,
    moderation_status: 'approved'
  }
];

const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Статус заявки изменен на «В работе»',
    message: 'Ваше обращение #SQ-00124 (Освещение на ул. Ауэзова) принято аварийной бригадой «Горсвет».',
    created_at: '2026-09-28T09:30:00.000Z',
    read: false,
    link: '/requests/SQ-00124',
    type: 'status_change'
  },
  {
    id: 'notif-2',
    title: 'Ваша городская идея набирает поддержку',
    message: 'Идея «Велодорожка вдоль набережной Иртыша» собрала более 80 голосов жителей Семея.',
    created_at: '2026-09-28T14:10:00.000Z',
    read: false,
    link: '/requests/SQ-00133',
    type: 'idea_support'
  },
  {
    id: 'notif-3',
    title: 'Проблема успешно решена',
    message: 'По обращению #SQ-00126 (Мусор на ул. Кабанбай батыра) опубликован акт и фотоотчет «ПОСЛЕ».',
    created_at: '2026-09-26T16:00:00.000Z',
    read: true,
    link: '/requests/SQ-00126',
    type: 'status_change'
  }
];

declare global {
  var __mockCityRequests: CityRequest[] | undefined;
  var __mockNotifications: NotificationItem[] | undefined;
  var __mockDeveloperFeedbacks: DeveloperFeedback[] | undefined;
}

const SEED_DEV_FEEDBACK: DeveloperFeedback[] = [
  {
    id: 'df-1',
    sender_name: 'Даурен Байжанов',
    sender_email: 'd.baizhanov@abai.gov.kz',
    sender_role: 'admin',
    topic: 'Интеграция с диспетчерской системой 109',
    message: 'Необходимо предусмотреть экспорт еженедельного сводного реестра обращений в формате XLSX/PDF для аппарата акима города Семей.',
    created_at: '2026-09-28T11:00:00.000Z'
  }
];

function getDeveloperFeedbacksDb(): DeveloperFeedback[] {
  if (!globalThis.__mockDeveloperFeedbacks) {
    globalThis.__mockDeveloperFeedbacks = [...SEED_DEV_FEEDBACK];
  }
  return globalThis.__mockDeveloperFeedbacks;
}

export function getDeveloperFeedbacks(): DeveloperFeedback[] {
  return getDeveloperFeedbacksDb();
}

export function addDeveloperFeedback(data: Omit<DeveloperFeedback, 'id' | 'created_at'>): DeveloperFeedback {
  const db = getDeveloperFeedbacksDb();
  const newFeedback: DeveloperFeedback = {
    id: `df-${Date.now()}`,
    sender_name: data.sender_name,
    sender_email: data.sender_email,
    sender_role: data.sender_role,
    topic: data.topic,
    message: data.message,
    created_at: new Date().toISOString()
  };
  db.unshift(newFeedback);
  return newFeedback;
}

function getDatabase(): CityRequest[] {
  if (!globalThis.__mockCityRequests) {
    globalThis.__mockCityRequests = [...SEED_REQUESTS];
  }
  return globalThis.__mockCityRequests;
}

function getNotificationsDb(): NotificationItem[] {
  if (!globalThis.__mockNotifications) {
    globalThis.__mockNotifications = [...SEED_NOTIFICATIONS];
  }
  return globalThis.__mockNotifications;
}

export function getRequests(): CityRequest[] {
  const db = getDatabase();
  return [...db].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getRequestById(id: string): CityRequest | undefined {
  const db = getDatabase();
  return db.find((r) => r.id.toLowerCase() === id.toLowerCase());
}

export function getUserRequests(userId: string): CityRequest[] {
  const db = getDatabase();
  return db.filter((r) => r.author_id === userId);
}

export function getNotifications(): NotificationItem[] {
  return getNotificationsDb();
}

export function markNotificationAsRead(id: string): void {
  const db = getNotificationsDb();
  const notif = db.find((n) => n.id === id);
  if (notif) {
    notif.read = true;
  }
}

export function upvoteRequest(id: string): CityRequest | null {
  const db = getDatabase();
  const index = db.findIndex((r) => r.id.toLowerCase() === id.toLowerCase());
  if (index === -1) return null;

  db[index].upvotes = (db[index].upvotes || 0) + 1;
  return db[index];
}

export function findSimilarRequests(text: string, address?: string): CityRequest[] {
  const db = getDatabase();
  const words = text.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  const addrWords = address ? address.toLowerCase().split(/\s+/).filter((w) => w.length > 3) : [];

  return db.filter((req) => {
    // Only check unresolved problems
    if (req.status === 'resolved') return false;

    // Check street match
    const streetMatch = addrWords.some((aw) => req.location_address.toLowerCase().includes(aw));
    // Check keyword overlap
    const textMatch = words.filter((w) => req.original_text.toLowerCase().includes(w) || req.title.toLowerCase().includes(w)).length >= 2;

    return streetMatch && textMatch;
  });
}

export function createRequest(input: CreateRequestInput): CityRequest {
  const db = getDatabase();
  const nextNumber = 124 + db.length;
  const newId = `SQ-00${nextNumber}`;

  const newRequest: CityRequest = {
    id: newId,
    type: input.type || 'problem',
    title: input.title || (input.cleaned_text ? input.cleaned_text.slice(0, 60) + '...' : 'Новое обращение'),
    original_text: input.original_text,
    cleaned_text: input.cleaned_text || input.original_text,
    category: input.category || 'Другое',
    subcategory: input.subcategory || 'Общие вопросы',
    department: input.department || 'ЖКХ',
    priority: input.priority || 'medium',
    priority_reason: input.priority_reason || 'Автоматическая классификация на основе первичного анализа.',
    status: 'new',
    location_address: input.location_address,
    latitude: input.latitude || 50.4111,
    longitude: input.longitude || 80.2458,
    district: input.district || 'Центральный',
    photo_before_url: input.photo_before_url || (input as any).photo_url,
    video_url: input.video_url,
    created_at: new Date().toISOString(),
    upvotes: 1,
    author_id: input.author_id || 'user-citizen-1',
    author_name: input.author_name || 'Азамат Султанов',
    author_phone: input.author_phone || '+7 (705) 412-88-99',
    author_email: input.author_email || 'azamat.s@mail.kz',
    is_anonymous: Boolean(input.is_anonymous),
    moderation_status: 'approved'
  };

  db.unshift(newRequest);
  return newRequest;
}

export function updateRequestStatus(id: string, updateData: UpdateRequestInput): CityRequest | null {
  const db = getDatabase();
  const index = db.findIndex((r) => r.id.toLowerCase() === id.toLowerCase());
  if (index === -1) return null;

  const current = db[index];
  let newFeedback = current.official_feedback || [];
  if (updateData.add_feedback) {
    newFeedback = [
      ...newFeedback,
      {
        id: `fb-${Date.now()}`,
        author: updateData.add_feedback.author,
        department: updateData.add_feedback.department,
        text: updateData.add_feedback.text,
        created_at: new Date().toISOString()
      }
    ];
  }

  const updated: CityRequest = {
    ...current,
    status: updateData.status ?? current.status,
    department: updateData.department ?? current.department,
    priority: updateData.priority ?? current.priority,
    resolution_report: updateData.resolution_report ?? current.resolution_report,
    photo_after_url: updateData.photo_after_url ?? current.photo_after_url,
    upvotes: updateData.upvotes ?? current.upvotes,
    moderation_status: updateData.moderation_status ?? current.moderation_status,
    moderation_reason: updateData.moderation_reason ?? current.moderation_reason,
    official_feedback: newFeedback,
    resolved_at:
      updateData.status === 'resolved' && !current.resolved_at
        ? new Date().toISOString()
        : current.resolved_at
  };

  db[index] = updated;
  return updated;
}

export function getRequestStats(): RequestStats {
  const db = getDatabase();
  const resolved = db.filter((r) => r.status === 'resolved');

  const byCat: Record<string, number> = {};
  const byDist: Record<string, number> = {};

  db.forEach((r) => {
    byCat[r.category] = (byCat[r.category] || 0) + 1;
    if (r.district) {
      byDist[r.district] = (byDist[r.district] || 0) + 1;
    }
  });

  return {
    total: db.length,
    in_progress: db.filter((r) => r.status === 'in_progress' || r.status === 'assigned').length,
    high_priority: db.filter((r) => r.priority === 'high').length,
    resolved: resolved.length,
    total_ideas: db.filter((r) => r.type === 'idea').length,
    avg_resolution_days: 1.8,
    by_category: byCat,
    by_district: byDist
  };
}
