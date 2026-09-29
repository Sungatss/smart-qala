export type Language = 'ru' | 'kz' | 'en';

export interface Translations {
  // Navigation & Branding
  brandName: string;
  brandCity: string;
  brandTagline: string;
  navShowcase: string;
  navMap: string;
  navIdeas: string;
  navAnalytics: string;
  navMyRequests: string;
  navCreate: string;
  navAdminPanel: string;
  navLogout: string;
  navLargeFont: string;
  navLargeFontOn: string;
  themeLight: string;
  themeDark: string;
  navDisplaySettings: string;
  navTheme: string;
  navContrastAndFont: string;
  navAccessibilityMode: string;
  navNotifications: string;
  navNoNotifications: string;
  navNewCount: string;
  navProfile: string;
  navRoleCitizen: string;
  navRoleGuest: string;
  navRoleJkh: string;
  navRoleAdmin: string;
  navMenu: string;
  langKz: string;
  langRu: string;
  langEn: string;
  demoNoticeBadge: string;
  demoNoticeText: string;
  demoNoticeDismiss: string;
  footerConceptTitle: string;
  footerConceptSubtitle: string;
  footerConceptNotice: string;
  footerCopyright: string;
  footerStandards: string;
  mapHeaderTitle: string;
  mapHeaderSubtitle: string;
  mapGeotag: string;
  ideasHeaderTitle: string;
  ideasHeaderSubtitle: string;
  analyticsHeaderTitle: string;
  analyticsHeaderSubtitle: string;
  profileHeaderTitle: string;
  profileHeaderSubtitle: string;

  // Auth Gate
  authTitle: string;
  authSubtitle: string;
  authChooseRole: string;
  authRoleCitizen: string;
  authRoleCitizenDesc: string;
  authRoleJkh: string;
  authRoleJkhDesc: string;
  authRoleAdmin: string;
  authRoleAdminDesc: string;
  authLoginTab: string;
  authRegisterTab: string;
  authPhoneOrEmail: string;
  authPassword: string;
  authLoginBtn: string;
  authGuestBtn: string;
  authGuestHint: string;
  authFastCitizenDemo: string;
  authFastJkhDemo: string;
  authFastAdminDemo: string;
  authFullName: string;
  authPhone: string;
  authDistrict: string;
  authRegisterBtn: string;
  authOfficialLogin: string;
  authBackToSite: string;

  // Home Page
  heroPilotBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroSubmitBtn: string;
  heroShowcaseBtn: string;
  statsTotal: string;
  statsInProgress: string;
  statsHighPriority: string;
  statsResolved: string;

  // Showcase
  showcaseBadge: string;
  showcaseTitle: string;
  showcaseSubtitle: string;
  showcaseCompare: string;
  showcaseBefore: string;
  showcaseAfter: string;
  showcaseOfficialAct: string;

  // Create Request Page
  createTitleProblem: string;
  createTitleIdea: string;
  createSubtitle: string;
  createTypeProblem: string;
  createTypeIdea: string;
  createTextLabelProblem: string;
  createTextLabelIdea: string;
  createTextPlaceholder: string;
  createAddressLabel: string;
  createAddressPlaceholder: string;
  createGpsBtn: string;
  createPhotoLabel: string;
  createPhotoUpload: string;
  createAnonymousLabel: string;
  createAnonymousHint: string;
  createSubmitBtn: string;
  createSubmitting: string;
  createSuccessMsg: string;

  // Admin & Kanban
  adminTitleJkh: string;
  adminTitleAdmin: string;
  adminViewTable: string;
  adminViewKanban: string;
  kanbanColNew: string;
  kanbanColInProgress: string;
  kanbanColResolved: string;
  kanbanMoveInProgress: string;
  kanbanMoveResolved: string;

  // Common
  filterAll: string;
  categoryRoads: string;
  categoryLighting: string;
  categoryTrash: string;
  categoryTransport: string;
  categoryImprovement: string;
  categoryEcology: string;
  categoryWater: string;
  categorySafety: string;
  priorityHigh: string;
  priorityMedium: string;
  priorityLow: string;
  statusNew: string;
  statusInProgress: string;
  statusResolved: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  ru: {
    brandName: 'Smart Qala',
    brandCity: 'Семей',
    brandTagline: 'Платформа прямого городского диалога',
    navShowcase: 'Что изменилось',
    navMap: 'Карта проблем',
    navIdeas: 'Банк идей',
    navAnalytics: 'Статистика',
    navMyRequests: 'Мои обращения',
    navCreate: 'Подать заявку',
    navAdminPanel: 'Панель управления',
    navLogout: 'Выйти',
    navLargeFont: 'Крупный шрифт',
    navLargeFontOn: 'Крупный шрифт: ВКЛ',
    themeLight: 'Светлая тема',
    themeDark: 'Темная тема',
    navDisplaySettings: 'Настройки отображения',
    navTheme: 'Тема оформления',
    navContrastAndFont: 'Шрифт и контраст',
    navAccessibilityMode: 'Режим доступности (крупный шрифт)',
    navNotifications: 'Уведомления',
    navNoNotifications: 'Нет новых уведомлений',
    navNewCount: 'новых',
    navProfile: 'Личный кабинет',
    navRoleCitizen: 'Гражданин',
    navRoleGuest: 'Гость',
    navRoleJkh: 'Служба ЖКХ / 109',
    navRoleAdmin: 'Акимат',
    navMenu: 'Меню',
    langKz: 'Қазақша',
    langRu: 'Русский',
    langEn: 'English',
    demoNoticeBadge: 'ДЕМОНСТРАЦИОННЫЕ ДАННЫЕ / СЕМЕЙ',
    demoNoticeText: 'Концепт городской платформы Smart Qala для города Семей.',
    demoNoticeDismiss: 'Скрыть',
    footerConceptTitle: 'Концептуальный проект платформы Smart Qala • Семей',
    footerConceptSubtitle: 'Прототип системы взаимодействия жителей и коммунальных служб города',
    footerConceptNotice: 'Демонстрационный концепт. Не является официальным сайтом акимата.',
    footerCopyright: '© 2026 Концепт Smart Qala. Разработано для открытого города.',
    footerStandards: 'Проект в рамках открытых стандартов Smart City',
    mapHeaderTitle: 'Интерактивная карта городской среды • Семей',
    mapHeaderSubtitle: 'Мониторинг инцидентов, тепловая карта скопления проблем и городские идеи жителей в реальном времени.',
    mapGeotag: 'Геопривязка: г. Семей, область Абай',
    ideasHeaderTitle: 'Банк городских идей • Семей',
    ideasHeaderSubtitle: 'Инициативы жителей по развитию инфраструктуры, благоустройству и экологии города.',
    analyticsHeaderTitle: 'Городская статистика и аналитика инцидентов',
    analyticsHeaderSubtitle: 'Публичный мониторинг динамики решения проблем, распределения по районам и оперативности служб.',
    profileHeaderTitle: 'Личный кабинет жителя',
    profileHeaderSubtitle: 'История поданных обращений, статус их рассмотрения и городские инициативы.',

    authTitle: 'Smart Qala • Семей',
    authSubtitle: 'Единая городская система взаимодействия жителей и служб города',
    authChooseRole: 'Выберите категорию входа:',
    authRoleCitizen: 'Гражданин',
    authRoleCitizenDesc: 'Жители города Семей',
    authRoleJkh: 'Служба ЖКХ',
    authRoleJkhDesc: 'Контакт-центр 109 и службы',
    authRoleAdmin: 'Акимат',
    authRoleAdminDesc: 'Администрация города',
    authLoginTab: 'Вход для жителей',
    authRegisterTab: 'Создать профиль',
    authPhoneOrEmail: 'Номер телефона или Email',
    authPassword: 'Пароль',
    authLoginBtn: 'Войти в личный кабинет',
    authGuestBtn: 'Войти как гость (Только просмотр)',
    authGuestHint: 'В гостевом режиме доступен просмотр карты и витрины без пароля.',
    authFastCitizenDemo: '⚡ Быстрый вход жителя (Азамат Султанов)',
    authFastJkhDemo: '⚡ Войти как диспетчер ЖКХ (Канат Сериков • 109)',
    authFastAdminDemo: '⚡ Войти как Акимат города (Даурен Байжанов)',
    authFullName: 'ФИО жителя',
    authPhone: 'Номер телефона',
    authDistrict: 'Район проживания',
    authRegisterBtn: 'Зарегистрироваться и войти',
    authOfficialLogin: 'Служебный логин (Email)',
    authBackToSite: 'Вернуться на сайт',

    heroPilotBadge: 'Официальный проект цифровизации • г. Семей',
    heroTitle: 'Прямой диалог жителей и служб города Семей',
    heroSubtitle: 'Сообщайте о ямах, неосвещенных улицах, мусоре и авариях простым языком. Искусственный интеллект автоматически структурирует обращение и направляет в профильное ведомство.',
    heroSubmitBtn: 'Подать обращение',
    heroShowcaseBtn: 'Что изменилось в городе',
    statsTotal: 'Всего заявок',
    statsInProgress: 'В работе',
    statsHighPriority: 'Высокий приоритет',
    statsResolved: 'Устранено',

    showcaseBadge: 'Открытый контроль результатов',
    showcaseTitle: 'Что изменилось в городе',
    showcaseSubtitle: 'Фотофиксация выполненных работ коммунальными службами города Семей. Прозрачный отчет перед жителями.',
    showcaseCompare: 'Сравнение (До и После)',
    showcaseBefore: 'Было',
    showcaseAfter: 'Стало',
    showcaseOfficialAct: 'Официальный акт работ',

    createTitleProblem: 'Сообщить о городской проблеме',
    createTitleIdea: 'Предложить идею для города Семей',
    createSubtitle: 'Опишите ситуацию своими словами. ИИ автоматически исправит стилистику, определит ведомство и приоритет.',
    createTypeProblem: '🔴 Городская проблема',
    createTypeIdea: '💡 Идея по улучшению',
    createTextLabelProblem: 'Что произошло и где? (своими словами)',
    createTextLabelIdea: 'В чем суть вашего предложения?',
    createTextPlaceholder: 'Например: На перекрестке возле школы глубокая яма, машины разбивают колеса. Или: Предлагаю установить освещение на аллее...',
    createAddressLabel: 'Адрес или ориентир в г. Семей',
    createAddressPlaceholder: 'Например: ул. Мухтара Ауэзова, 12 или пр. Шакарима',
    createGpsBtn: 'Найти по GPS',
    createPhotoLabel: 'Фотофиксация дефекта',
    createPhotoUpload: 'Выбрать фото дефекта',
    createAnonymousLabel: 'Подать анонимно',
    createAnonymousHint: 'Ваши контакты будут скрыты от операторов служб.',
    createSubmitBtn: 'Отправить заявку',
    createSubmitting: 'ИИ обрабатывает и направляет в службу 109...',
    createSuccessMsg: 'Обращение успешно передано в городские службы!',

    adminTitleJkh: 'Панель ЖКХ',
    adminTitleAdmin: 'Панель Акимата',
    adminViewTable: 'Таблица обращений',
    adminViewKanban: 'Канбан-доска',
    kanbanColNew: 'Новые и на рассмотрении',
    kanbanColInProgress: 'В работе у бригад',
    kanbanColResolved: 'Успешно устранено',
    kanbanMoveInProgress: 'Взять в работу →',
    kanbanMoveResolved: 'Завершить с фото →',

    filterAll: 'Все',
    categoryRoads: 'Дороги',
    categoryLighting: 'Освещение',
    categoryTrash: 'Мусор',
    categoryTransport: 'Транспорт',
    categoryImprovement: 'Благоустройство',
    categoryEcology: 'Экология',
    categoryWater: 'Водоснабжение',
    categorySafety: 'Безопасность',
    priorityHigh: 'Высокий (Срочно)',
    priorityMedium: 'Средний',
    priorityLow: 'Низкий',
    statusNew: 'Новое',
    statusInProgress: 'В работе',
    statusResolved: 'Решено'
  },

  kz: {
    brandName: 'Smart Qala',
    brandCity: 'Семей',
    brandTagline: 'Қала мен тұрғындардың тікелей байланыс алаңы',
    navShowcase: 'Қалада не өзгерді',
    navMap: 'Мәселелер картасы',
    navIdeas: 'Идеялар банкі',
    navAnalytics: 'Статистика',
    navMyRequests: 'Менің өтініштерім',
    navCreate: 'Өтініш беру',
    navAdminPanel: 'Басқару тақтасы',
    navLogout: 'Шығу',
    navLargeFont: 'Үлкен қаріп',
    navLargeFontOn: 'Үлкен қаріп: ҚОСУЛЫ',
    themeLight: 'Ашық тақырып',
    themeDark: 'Күңгірт тақырып',
    navDisplaySettings: 'Көрсету баптаулары',
    navTheme: 'Безендіру тақырыбы',
    navContrastAndFont: 'Қаріп пен контраст',
    navAccessibilityMode: 'Қолжетімділік режимі (үлкен қаріп)',
    navNotifications: 'Хабарламалар',
    navNoNotifications: 'Жаңа хабарлама жоқ',
    navNewCount: 'жаңа',
    navProfile: 'Жеке кабинет',
    navRoleCitizen: 'Тұрғын',
    navRoleGuest: 'Қонақ',
    navRoleJkh: 'ТКШ / 109 қызметі',
    navRoleAdmin: 'Әкімдік',
    navMenu: 'Мәзір',
    langKz: 'Қазақша',
    langRu: 'Русский',
    langEn: 'English',
    demoNoticeBadge: 'ДЕМОНСТРАЦИЯЛЫҚ ДЕРЕКТЕР / СЕМЕЙ',
    demoNoticeText: 'Семей қаласына арналған Smart Qala қалалық платформасы тұжырымдамасы.',
    demoNoticeDismiss: 'Жабу',
    footerConceptTitle: 'Smart Qala • Семей тұжырымдамалық жобасы',
    footerConceptSubtitle: 'Қала тұрғындары мен коммуналдық қызметтерінің өзара іс-қимыл жүйесінің прототипі',
    footerConceptNotice: 'Демонстрациялық концепт. Әкімдіктің ресми сайты емес.',
    footerCopyright: '© 2026 Smart Qala тұжырымдамасы. Ашық қала үшін әзірленген.',
    footerStandards: 'Smart City ашық стандарттары аясындағы жоба',
    mapHeaderTitle: 'Семей қалалық ортасының интерактивті картасы',
    mapHeaderSubtitle: 'Оқиғаларды нақты уақытта бақылау, мәселелердің жылу картасы және тұрғындардың қалалық идеялары.',
    mapGeotag: 'Геобайланыс: Семей қаласы, Абай облысы',
    ideasHeaderTitle: 'Қалалық идеялар банкі • Семей',
    ideasHeaderSubtitle: 'Инфрақұрылымды дамыту, абаттандыру және қала экологиясы бойынша тұрғындардың бастамалары.',
    analyticsHeaderTitle: 'Қалалық статистика және оқиғалар талдауы',
    analyticsHeaderSubtitle: 'Мәселелерді шешу қарқынын, аудандар бойынша бөлінісін және қызметтердің жеделдігін ашық бақылау.',
    profileHeaderTitle: 'Тұрғынның жеке кабинеті',
    profileHeaderSubtitle: 'Берілген өтініштер тарихы, олардың қаралу барысы және қалалық бастамалар.',

    authTitle: 'Smart Qala • Семей',
    authSubtitle: 'Семей қаласы тұрғындары мен қалалық қызметтердің бірыңғай жүйесі',
    authChooseRole: 'Кіру санатын таңдаңыз:',
    authRoleCitizen: 'Тұрғын',
    authRoleCitizenDesc: 'Семей қаласының тұрғындары',
    authRoleJkh: 'ТКШ қызметі',
    authRoleJkhDesc: '109 байланыс орталығы мен бөлімдер',
    authRoleAdmin: 'Әкімдік',
    authRoleAdminDesc: 'Семей қаласының әкімдігі',
    authLoginTab: 'Тұрғындар үшін кіру',
    authRegisterTab: 'Профиль жасау',
    authPhoneOrEmail: 'Телефон нөмірі немесе Email',
    authPassword: 'Құпиясөз',
    authLoginBtn: 'Жеке кабинетке кіру',
    authGuestBtn: 'Қонақ ретінде кіру (Тек көру)',
    authGuestHint: 'Қонақ режимінде карта мен нәтижелер витринасын көруге болады.',
    authFastCitizenDemo: '⚡ Тұрғын ретінде жылдам кіру (Азамат Сұлтанов)',
    authFastJkhDemo: '⚡ ТКШ диспетчері ретінде кіру (Қанат Серіков • 109)',
    authFastAdminDemo: '⚡ Қала әкімдігі ретінде кіру (Дәурен Байжанов)',
    authFullName: 'Тұрғынның Аты-жөні',
    authPhone: 'Телефон нөмірі',
    authDistrict: 'Тұратын ауданы',
    authRegisterBtn: 'Тіркелу және кіру',
    authOfficialLogin: 'Қызметтік логин (Email)',
    authBackToSite: 'Сайтқа қайту',

    heroPilotBadge: 'Ресми цифрландыру жобасы • Семей қ.',
    heroTitle: 'Семей қаласы тұрғындары мен қызметтерінің тікелей диалогы',
    heroSubtitle: 'Жол шұңқырлары, жарықсыз көшелер, қоқыс пен апаттар туралы қарапайым тілмен хабарлаңыз. Жасанды интеллект өтінішті құрылымдап, жауапты мекемеге жолдайды.',
    heroSubmitBtn: 'Өтініш жіберу',
    heroShowcaseBtn: 'Қалада не өзгерді',
    statsTotal: 'Барлық өтініштер',
    statsInProgress: 'Жұмыс барысында',
    statsHighPriority: 'Жоғары басымдық',
    statsResolved: 'Шешілді',

    showcaseBadge: 'Нәтижелерді ашық бақылау',
    showcaseTitle: 'Қалада не өзгерді',
    showcaseSubtitle: 'Семей қаласының коммуналдық қызметтері атқарған жұмыстардың фотодәлелі. Тұрғындар алдындағы ашық есеп.',
    showcaseCompare: 'Салыстыру (Дейін және Кейін)',
    showcaseBefore: 'Болған жағдай',
    showcaseAfter: 'Орындалған жұмыс',
    showcaseOfficialAct: 'Ресми жұмыс актісі',

    createTitleProblem: 'Қалалық мәселе туралы хабарлау',
    createTitleIdea: 'Семей қаласын жақсарту идеясы',
    createSubtitle: 'Жағдайды өз сөзіңізбен сипаттаңыз. ЖИ ресми стильге келтіріп, тиісті бөлім мен басымдықты белгілейді.',
    createTypeProblem: '🔴 Қалалық мәселе',
    createTypeIdea: '💡 Жақсарту идеясы',
    createTextLabelProblem: 'Не болды және қай жерде? (өз сөзіңізбен)',
    createTextLabelIdea: 'Ұсынысыңыздың мәні неде?',
    createTextPlaceholder: 'Мысалы: Мектеп жанындағы қиылыста терең шұңқыр пайда болды. Немесе: Жағалау бойына жарық орнатуды ұсынамын...',
    createAddressLabel: 'Семей қаласындағы мекенжай немесе бағдар',
    createAddressPlaceholder: 'Мысалы: Мұхтар Әуезов к-сі, 12 немесе Шәкәрім даңғылы',
    createGpsBtn: 'GPS арқылы анықтау',
    createPhotoLabel: 'Мәселенің фотосуреті',
    createPhotoUpload: 'Фотосуретті таңдау',
    createAnonymousLabel: 'Анонимді түрде жіберу',
    createAnonymousHint: 'Байланыс деректеріңіз операторлардан жасырылады.',
    createSubmitBtn: 'Өтінішті жіберу',
    createSubmitting: 'ЖИ өңдеп, 109 қызметіне бағыттауда...',
    createSuccessMsg: 'Өтініш қалалық қызметтерге сәтті жолданды!',

    adminTitleJkh: 'ТКШ / 109',
    adminTitleAdmin: 'Әкімдік',
    adminViewTable: 'Өтініштер кестесі',
    adminViewKanban: 'Канбан тақтасы',
    kanbanColNew: 'Жаңа және қаралуда',
    kanbanColInProgress: 'Бригадалар жұмысында',
    kanbanColResolved: 'Сәтті шешілді',
    kanbanMoveInProgress: 'Жұмысқа алу →',
    kanbanMoveResolved: 'Фотомен аяқтау →',

    filterAll: 'Барлығы',
    categoryRoads: 'Жолдар',
    categoryLighting: 'Жарықтандыру',
    categoryTrash: 'Қоқыс',
    categoryTransport: 'Көлік',
    categoryImprovement: 'Абаттандыру',
    categoryEcology: 'Экология',
    categoryWater: 'Сумен жабдықтау',
    categorySafety: 'Қауіпсіздік',
    priorityHigh: 'Жоғары (Шұғыл)',
    priorityMedium: 'Орташа',
    priorityLow: 'Төмен',
    statusNew: 'Жаңа',
    statusInProgress: 'Орындалуда',
    statusResolved: 'Шешілді'
  },

  en: {
    brandName: 'Smart Qala',
    brandCity: 'Semey',
    brandTagline: 'Civic interaction & urban response platform',
    navShowcase: 'City Results',
    navMap: 'Issues Map',
    navIdeas: 'Ideas Bank',
    navAnalytics: 'Analytics',
    navMyRequests: 'My Requests',
    navCreate: 'Report Issue',
    navAdminPanel: 'Management Panel',
    navLogout: 'Sign Out',
    navLargeFont: 'Large Font',
    navLargeFontOn: 'Large Font: ON',
    themeLight: 'Light Theme',
    themeDark: 'Dark Theme',
    navDisplaySettings: 'Display Settings',
    navTheme: 'Theme Mode',
    navContrastAndFont: 'Font & Contrast',
    navAccessibilityMode: 'Accessibility Mode (Large Font)',
    navNotifications: 'Notifications',
    navNoNotifications: 'No new notifications',
    navNewCount: 'new',
    navProfile: 'Account Profile',
    navRoleCitizen: 'Citizen',
    navRoleGuest: 'Guest',
    navRoleJkh: 'Utilities / 109',
    navRoleAdmin: 'Akimat',
    navMenu: 'Menu',
    langKz: 'Қазақша',
    langRu: 'Русский',
    langEn: 'English',
    demoNoticeBadge: 'DEMO DATA / SEMEY',
    demoNoticeText: 'Smart Qala civic platform prototype concept for Semey.',
    demoNoticeDismiss: 'Dismiss',
    footerConceptTitle: 'Smart Qala • Semey Concept Project',
    footerConceptSubtitle: 'Prototype system for interaction between residents and city utilities',
    footerConceptNotice: 'Demonstration concept. Not an official Akimat website.',
    footerCopyright: '© 2026 Smart Qala Concept. Built for an open city.',
    footerStandards: 'Project developed under Smart City open standards',
    mapHeaderTitle: 'Interactive Urban Environment Map • Semey',
    mapHeaderSubtitle: 'Real-time incident monitoring, problem hotspot heatmaps, and resident urban initiatives.',
    mapGeotag: 'Geo-reference: Semey, Abai Region',
    ideasHeaderTitle: 'Urban Ideas Bank • Semey',
    ideasHeaderSubtitle: 'Citizen initiatives for infrastructure development, public spaces, and urban ecology.',
    analyticsHeaderTitle: 'Urban Statistics & Incident Analytics',
    analyticsHeaderSubtitle: 'Public dashboard tracking resolution rates, district breakdowns, and response velocity.',
    profileHeaderTitle: 'Resident Account',
    profileHeaderSubtitle: 'History of submitted requests, review statuses, and tracked municipal responses.',

    authTitle: 'Smart Qala • Semey',
    authSubtitle: 'Integrated municipal system connecting citizens with urban utility departments',
    authChooseRole: 'Select access category:',
    authRoleCitizen: 'Citizen',
    authRoleCitizenDesc: 'Residents of Semey city',
    authRoleJkh: 'Housing & Utilities',
    authRoleJkhDesc: '109 Contact center & work crews',
    authRoleAdmin: 'City Hall',
    authRoleAdminDesc: 'Akimat (City Administration)',
    authLoginTab: 'Citizen Sign In',
    authRegisterTab: 'Create Profile',
    authPhoneOrEmail: 'Phone Number or Email',
    authPassword: 'Password',
    authLoginBtn: 'Sign In to Profile',
    authGuestBtn: 'Continue as Guest (View only)',
    authGuestHint: 'Browse the city map and showcase without registration.',
    authFastCitizenDemo: '⚡ Quick Citizen Demo (Azamat Sultanov)',
    authFastJkhDemo: '⚡ Enter as Housing Dispatcher (Kanat Serikov • 109)',
    authFastAdminDemo: '⚡ Enter as City Administration (Dauren Baizhanov)',
    authFullName: 'Full Name',
    authPhone: 'Phone Number',
    authDistrict: 'City District',
    authRegisterBtn: 'Register & Continue',
    authOfficialLogin: 'Official Login (Email)',
    authBackToSite: 'Back to site',

    heroPilotBadge: 'Official Smart City Pilot • Semey',
    heroTitle: 'Direct Bridge Between Residents and Municipal Services',
    heroSubtitle: 'Report potholes, broken streetlights, waste, and hazards in plain everyday language. AI automatically structures the request and routes it to the right department.',
    heroSubmitBtn: 'Submit Request',
    heroShowcaseBtn: 'City Improvements',
    statsTotal: 'Total Requests',
    statsInProgress: 'In Progress',
    statsHighPriority: 'High Priority',
    statsResolved: 'Resolved',

    showcaseBadge: 'Public Proof of Work',
    showcaseTitle: 'What Changed in the City',
    showcaseSubtitle: 'Photo verification of completed municipal works in Semey. Transparent civic accountability.',
    showcaseCompare: 'Comparison (Before & After)',
    showcaseBefore: 'Before',
    showcaseAfter: 'After',
    showcaseOfficialAct: 'Official Resolution Report',

    createTitleProblem: 'Report a City Problem',
    createTitleIdea: 'Suggest an Improvement Idea',
    createSubtitle: 'Describe the issue in everyday words. AI will format it officially, identify the agency, and set priority.',
    createTypeProblem: '🔴 City Problem',
    createTypeIdea: '💡 Improvement Idea',
    createTextLabelProblem: 'What happened and where? (in your own words)',
    createTextLabelIdea: 'What is your suggestion?',
    createTextPlaceholder: 'For example: A deep pothole near the school entrance is damaging vehicles. Or: I propose installing solar lamps along the embankment...',
    createAddressLabel: 'Address or landmark in Semey',
    createAddressPlaceholder: 'e.g. Mukhtar Auezov str., 12 or Shakarim ave.',
    createGpsBtn: 'Detect by GPS',
    createPhotoLabel: 'Photo evidence',
    createPhotoUpload: 'Attach photo',
    createAnonymousLabel: 'Submit anonymously',
    createAnonymousHint: 'Your contact details will not be shared with utility operators.',
    createSubmitBtn: 'Submit Request',
    createSubmitting: 'AI is structuring and dispatching to 109 services...',
    createSuccessMsg: 'Request successfully submitted to city services!',

    adminTitleJkh: 'Utilities / 109',
    adminTitleAdmin: 'Administration',
    adminViewTable: 'Requests Table',
    adminViewKanban: 'Kanban Board',
    kanbanColNew: 'New & Under Review',
    kanbanColInProgress: 'Work In Progress',
    kanbanColResolved: 'Successfully Resolved',
    kanbanMoveInProgress: 'Take to Work →',
    kanbanMoveResolved: 'Resolve with Proof →',

    filterAll: 'All',
    categoryRoads: 'Roads',
    categoryLighting: 'Lighting',
    categoryTrash: 'Waste',
    categoryTransport: 'Transport',
    categoryImprovement: 'Improvement',
    categoryEcology: 'Ecology',
    categoryWater: 'Water Supply',
    categorySafety: 'Safety',
    priorityHigh: 'High (Urgent)',
    priorityMedium: 'Medium',
    priorityLow: 'Low',
    statusNew: 'New',
    statusInProgress: 'In Progress',
    statusResolved: 'Resolved'
  }
};
