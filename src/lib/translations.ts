export type Language = 'ru' | 'kz' | 'en';

export interface Translations {
  // Navigation & Branding
  brandName: string;
  brandCity: string;
  brandTagline: string;
  navShowcase: string;
  navMap: string;
  navIdeas: string;
  navCalendar: string;
  calendar: {
    title: string;
    description: string;
    addCard: string;
    backToCalendar: string;
    creationHint: string;
    today: string;
    previousMonth: string;
    nextMonth: string;
    month: string;
    selectedDay: string;
    allTypes: string;
    problems: string;
    ideas: string;
    typeFilter: string;
    statusFilter: string;
    allStatuses: string;
    underReview: string;
    assigned: string;
    search: string;
    searchPlaceholder: string;
    cards: string;
    more: string;
    emptyDay: string;
    emptyMonth: string;
    latestCard: string;
    refresh: string;
    refreshError: string;
    retry: string;
    created: string;
    openCard: string;
    clearFilters: string;
  };
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
  authResidentTabSignIn: string;
  authResidentTabSignUp: string;
  authStaffTitle: string;
  authStaffSubtitle: string;
  authStaffRoleSelect: string;
  authStaffDispatcher: string;
  authStaffAkimat: string;
  authLinkToStaff: string;
  authLinkToResident: string;
  authOrDivider: string;
  authContinueAsGuest: string;
  authDemoAccountsTitle: string;
  authDemoResident: string;
  authDemoDispatcher: string;
  authDemoAkimat: string;
  authQuickLoginAction: string;
  authHeroHeadline: string;
  authHeroSubtext: string;
  authFooterConcept: string;
  authErrorFillFields: string;
  authErrorInvalidCredentials: string;

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
  createPhotoCamera: string;
  createPhotoDevice: string;
  createPhotoDropzone: string;
  createPhotoHint: string;
  createPhotoAttached: string;
  createPhotoDelete: string;
  createPhotoReplace: string;
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
    brandName: 'VoiceOfSemey',
    brandCity: 'Семей',
    brandTagline: 'Платформа прямого городского диалога',
    navShowcase: 'Что изменилось',
    navMap: 'Карта проблем',
    navIdeas: 'Банк идей',
    navCalendar: 'Календарь',
    calendar: {
      title: 'Календарь обращений',
      description: 'Все обращения и идеи по дате подачи. Время города Семей.',
      addCard: 'Добавить карточку',
      backToCalendar: 'Вернуться в календарь',
      creationHint: 'Новая карточка появится в календаре в день её подачи.',
      today: 'Сегодня',
      previousMonth: 'Предыдущий месяц',
      nextMonth: 'Следующий месяц',
      month: 'Месяц',
      selectedDay: 'Выбранный день',
      allTypes: 'Все карточки',
      problems: 'Проблемы',
      ideas: 'Идеи',
      typeFilter: 'Тип карточки',
      statusFilter: 'Статус',
      allStatuses: 'Все статусы',
      underReview: 'На рассмотрении',
      assigned: 'Назначено',
      search: 'Поиск карточек',
      searchPlaceholder: 'Название, номер или адрес',
      cards: 'Карточки',
      more: 'Ещё',
      emptyDay: 'Нет карточек за этот день с выбранными фильтрами.',
      emptyMonth: 'В этом месяце нет карточек с выбранными фильтрами.',
      latestCard: 'К последней карточке',
      refresh: 'Обновить',
      refreshError: 'Не удалось обновить календарь. Показаны последние загруженные карточки.',
      retry: 'Повторить',
      created: 'Карточка добавлена в календарь.',
      openCard: 'Открыть карточку',
      clearFilters: 'Сбросить фильтры',
    },
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
    navRoleCitizen: 'Житель',
    navRoleGuest: 'Гость',
    navRoleJkh: 'Государственные службы',
    navRoleAdmin: 'Администрация сайта',
    navMenu: 'Меню',
    langKz: 'Қазақша',
    langRu: 'Русский',
    langEn: 'English',
    demoNoticeBadge: 'ДЕМОНСТРАЦИОННЫЕ ДАННЫЕ / СЕМЕЙ',
    demoNoticeText: 'Концепт городской платформы VoiceOfSemey для города Семей.',
    demoNoticeDismiss: 'Скрыть',
    footerConceptTitle: 'Концептуальный проект платформы VoiceOfSemey • Семей',
    footerConceptSubtitle: 'Прототип системы взаимодействия жителей и государственных служб города',
    footerConceptNotice: 'Демонстрационный концепт. Не является официальным сайтом администрации.',
    footerCopyright: '© 2026 VoiceOfSemey. Разработано для открытого города.',
    footerStandards: 'Проект в рамках открытых стандартов Smart City',
    mapHeaderTitle: 'Интерактивная карта городской среды • Семей',
    mapHeaderSubtitle: 'Мониторинг инцидентов, тепловая карта скопления проблем и городские идеи жителей в реальном времени.',
    mapGeotag: 'Геопривязка: г. Семей, область Абай',
    ideasHeaderTitle: 'Банк городских идей • Семей',
    ideasHeaderSubtitle: 'Инициативы жителей по развитию инфраструктуры, благоустройству и экологии города.',
    analyticsHeaderTitle: 'Городская статистика и аналитика инцидентов',
    analyticsHeaderSubtitle: 'Мониторинг динамики решения проблем, распределения по районам и оперативности служб.',
    profileHeaderTitle: 'Личный кабинет жителя',
    profileHeaderSubtitle: 'История поданных обращений, статус их рассмотрения и городские инициативы.',

    authTitle: 'VoiceOfSemey • Семей',
    authSubtitle: 'Единая городская система взаимодействия жителей и государственных служб города',
    authChooseRole: 'Выберите категорию входа:',
    authRoleCitizen: 'Житель',
    authRoleCitizenDesc: 'Жители города Семей',
    authRoleJkh: 'Государственные службы',
    authRoleJkhDesc: 'Городские и коммунальные службы',
    authRoleAdmin: 'Администрация сайта',
    authRoleAdminDesc: 'Администрация сайта',
    authLoginTab: 'Вход для жителей',
    authRegisterTab: 'Создать профиль',
    authPhoneOrEmail: 'Номер телефона или Email',
    authPassword: 'Пароль',
    authLoginBtn: 'Войти в личный кабинет',
    authGuestBtn: 'Войти как гость (Только просмотр)',
    authGuestHint: 'В гостевом режиме доступен просмотр карты и витрины без пароля.',
    authFastCitizenDemo: 'Быстрый вход жителя (Азамат Султанов)',
    authFastJkhDemo: 'Войти как представитель госслужб (Канат Сериков)',
    authFastAdminDemo: 'Войти как Администрация сайта (Даурен Байжанов)',
    authFullName: 'ФИО жителя',
    authPhone: 'Номер телефона',
    authDistrict: 'Район проживания',
    authRegisterBtn: 'Зарегистрироваться и войти',
    authOfficialLogin: 'Служебный логин (Email)',
    authBackToSite: 'Вернуться на сайт',
    authResidentTabSignIn: 'Вход',
    authResidentTabSignUp: 'Регистрация',
    authStaffTitle: 'Служебный вход',
    authStaffSubtitle: 'Для сотрудников государственных служб и администрации сайта',
    authStaffRoleSelect: 'Выберите категорию службы',
    authStaffDispatcher: 'Государственные службы',
    authStaffAkimat: 'Администрация сайта',
    authLinkToStaff: 'Вход для сотрудников служб',
    authLinkToResident: 'Вход для жителей города',
    authOrDivider: 'или',
    authContinueAsGuest: 'Продолжить как гость (просмотр)',
    authDemoAccountsTitle: 'Демо-аккаунты для тестирования',
    authDemoResident: 'Житель (Айгүл Ахметова)',
    authDemoDispatcher: 'Государственные службы (Канат Сериков)',
    authDemoAkimat: 'Администрация сайта (Даурен Байжанов)',
    authQuickLoginAction: 'Войти',
    authHeroHeadline: 'Умный и открытый город для каждого жителя',
    authHeroSubtext: 'Открытый контроль городских инцидентов, благоустройство и прямой диалог со службами Семея.',
    authFooterConcept: 'Концептуальный проект платформы VoiceOfSemey • Семей. Не является официальным сайтом администрации.',
    authErrorFillFields: 'Пожалуйста, заполните обязательные поля',
    authErrorInvalidCredentials: 'Пожалуйста, введите корректные данные',

    heroPilotBadge: 'Концептуальный проект цифровизации • г. Семей',
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
    createPhotoCamera: 'Сделать фото с камеры',
    createPhotoDevice: 'Загрузить с устройства',
    createPhotoDropzone: 'Перетащите фото сюда или нажмите для выбора',
    createPhotoHint: 'Поддерживаются JPG, PNG, WebP до 15 МБ',
    createPhotoAttached: 'Фото дефекта успешно прикреплено',
    createPhotoDelete: 'Удалить фото',
    createPhotoReplace: 'Заменить фото',
    createAnonymousLabel: 'Подать анонимно',
    createAnonymousHint: 'Ваши контакты будут скрыты от операторов служб.',
    createSubmitBtn: 'Отправить заявку',
    createSubmitting: 'ИИ обрабатывает и направляет в службу 109...',
    createSuccessMsg: 'Обращение успешно передано в городские службы!',

    adminTitleJkh: 'Государственные службы',
    adminTitleAdmin: 'Администрация сайта',
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
    brandName: 'VoiceOfSemey',
    brandCity: 'Семей',
    brandTagline: 'Қала мен тұрғындардың тікелей байланыс алаңы',
    navShowcase: 'Қалада не өзгерді',
    navMap: 'Мәселелер картасы',
    navIdeas: 'Идеялар банкі',
    navCalendar: 'Күнтізбе',
    calendar: {
      title: 'Өтініштер күнтізбесі',
      description: 'Барлық өтініштер мен идеялар берілген күні бойынша. Семей қаласының уақыты.',
      addCard: 'Карточка қосу',
      backToCalendar: 'Күнтізбеге оралу',
      creationHint: 'Жаңа карточка күнтізбеде берілген күні көрсетіледі.',
      today: 'Бүгін',
      previousMonth: 'Алдыңғы ай',
      nextMonth: 'Келесі ай',
      month: 'Ай',
      selectedDay: 'Таңдалған күн',
      allTypes: 'Барлық карточкалар',
      problems: 'Мәселелер',
      ideas: 'Идеялар',
      typeFilter: 'Карточка түрі',
      statusFilter: 'Мәртебе',
      allStatuses: 'Барлық мәртебелер',
      underReview: 'Қаралуда',
      assigned: 'Тағайындалды',
      search: 'Карточкаларды іздеу',
      searchPlaceholder: 'Атауы, нөмірі немесе мекенжайы',
      cards: 'Карточкалар',
      more: 'Тағы',
      emptyDay: 'Таңдалған сүзгілер бойынша бұл күнге карточкалар жоқ.',
      emptyMonth: 'Таңдалған сүзгілер бойынша бұл айда карточкалар жоқ.',
      latestCard: 'Соңғы карточкаға өту',
      refresh: 'Жаңарту',
      refreshError: 'Күнтізбені жаңарту мүмкін болмады. Соңғы жүктелген карточкалар көрсетілген.',
      retry: 'Қайталау',
      created: 'Карточка күнтізбеге қосылды.',
      openCard: 'Карточканы ашу',
      clearFilters: 'Сүзгілерді тазарту',
    },
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
    navRoleJkh: 'Мемлекеттік қызметтер',
    navRoleAdmin: 'Сайт әкімшілігі',
    navMenu: 'Мәзір',
    langKz: 'Қазақша',
    langRu: 'Русский',
    langEn: 'English',
    demoNoticeBadge: 'ДЕМОНСТРАЦИЯЛЫҚ ДЕРЕКТЕР / СЕМЕЙ',
    demoNoticeText: 'Семей қаласына арналған VoiceOfSemey қалалық платформасы тұжырымдамасы.',
    demoNoticeDismiss: 'Жабу',
    footerConceptTitle: 'VoiceOfSemey • Семей тұжырымдамалық жобасы',
    footerConceptSubtitle: 'Қала тұрғындары мен мемлекеттік қызметтерінің өзара іс-қимыл жүйесінің прототипі',
    footerConceptNotice: 'Демонстрациялық тұжырымдама. Әкімшіліктің ресми сайты болып табылмайды.',
    footerCopyright: '© 2026 VoiceOfSemey тұжырымдамасы. Ашық қала үшін әзірленген.',
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

    authTitle: 'VoiceOfSemey • Семей',
    authSubtitle: 'Семей қаласы тұрғындары мен қалалық қызметтердің бірыңғай жүйесі',
    authChooseRole: 'Кіру санатын таңдаңыз:',
    authRoleCitizen: 'Тұрғын',
    authRoleCitizenDesc: 'Семей қаласының тұрғындары',
    authRoleJkh: 'Мемлекеттік қызметтер',
    authRoleJkhDesc: 'Қалалық және коммуналдық қызметтер',
    authRoleAdmin: 'Сайт әкімшілігі',
    authRoleAdminDesc: 'Сайт әкімшілігі',
    authLoginTab: 'Тұрғындар үшін кіру',
    authRegisterTab: 'Профиль жасау',
    authPhoneOrEmail: 'Телефон нөмірі немесе Email',
    authPassword: 'Құпиясөз',
    authLoginBtn: 'Жеке кабинетке кіру',
    authGuestBtn: 'Қонақ ретінде кіру (Тек көру)',
    authGuestHint: 'Қонақ режимінде карта мен нәтижелер витринасын көруге болады.',
    authFastCitizenDemo: 'Тұрғын ретінде жылдам кіру (Азамат Сұлтанов)',
    authFastJkhDemo: 'Мемлекеттік қызметтер ретінде кіру (Қанат Серіков)',
    authFastAdminDemo: 'Сайт әкімшілігі ретінде кіру (Дәурен Байжанов)',
    authFullName: 'Тұрғынның Аты-жөні',
    authPhone: 'Телефон нөмірі',
    authDistrict: 'Тұратын ауданы',
    authRegisterBtn: 'Тіркелу және кіру',
    authOfficialLogin: 'Қызметтік логин (Email)',
    authBackToSite: 'Сайтқа қайту',
    authResidentTabSignIn: 'Кіру',
    authResidentTabSignUp: 'Тіркелу',
    authStaffTitle: 'Қызметтік кіру',
    authStaffSubtitle: 'Мемлекеттік қызметтер мен сайт әкімшілігі қызметкерлеріне арналған',
    authStaffRoleSelect: 'Қызмет санатын таңдаңыз',
    authStaffDispatcher: 'Мемлекеттік қызметтер',
    authStaffAkimat: 'Сайт әкімшілігі',
    authLinkToStaff: 'Қызметкерлер үшін кіру',
    authLinkToResident: 'Қала тұрғындары үшін кіру',
    authOrDivider: 'немесе',
    authContinueAsGuest: 'Қонақ ретінде жалғастыру (тек көру)',
    authDemoAccountsTitle: 'Тестілеуге арналған демо-есептік жазбалар',
    authDemoResident: 'Тұрғын (Айгүл Ахметова)',
    authDemoDispatcher: 'Мемлекеттік қызметтер (Қанат Серіков)',
    authDemoAkimat: 'Сайт әкімшілігі (Дәурен Байжанов)',
    authQuickLoginAction: 'Кіру',
    authHeroHeadline: 'Әрбір тұрғын үшін ақылды және ашық қала',
    authHeroSubtext: 'Қалалық мәселелерді ашық бақылау, абаттандыру және Семей қызметтерімен тікелей диалог.',
    authFooterConcept: 'VoiceOfSemey • Семей тұжырымдамалық жобасы. Әкімшіліктің ресми сайты емес.',
    authErrorFillFields: 'Міндетті өрістерді толтырыңыз',
    authErrorInvalidCredentials: 'Дұрыс мәліметтерді енгізіңіз',

    heroPilotBadge: 'Цифрландыру тұжырымдамалық жобасы • Семей қ.',
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
    createPhotoCamera: 'Камерадан түсіру',
    createPhotoDevice: 'Құрылғыдан жүктеу',
    createPhotoDropzone: 'Суретті осы жерге апарыңыз немесе таңдаңыз',
    createPhotoHint: 'JPG, PNG, WebP 15 МБ дейін қолданылады',
    createPhotoAttached: 'Мәселе фотосуреті сәтті тіркелді',
    createPhotoDelete: 'Суретті өшіру',
    createPhotoReplace: 'Суретті ауыстыру',
    createAnonymousLabel: 'Анонимді түрде жіберу',
    createAnonymousHint: 'Байланыс деректеріңіз операторлардан жасырылады.',
    createSubmitBtn: 'Өтінішті жіберу',
    createSubmitting: 'ЖИ өңдеп, 109 қызметіне бағыттауда...',
    createSuccessMsg: 'Өтініш қалалық қызметтерге сәтті жолданды!',

    adminTitleJkh: 'Мемлекеттік қызметтер',
    adminTitleAdmin: 'Сайт әкімшілігі',
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
    brandName: 'VoiceOfSemey',
    brandCity: 'Semey',
    brandTagline: 'Civic interaction & urban response platform',
    navShowcase: 'City Results',
    navMap: 'Issues Map',
    navIdeas: 'Ideas Bank',
    navCalendar: 'Calendar',
    calendar: {
      title: 'Requests calendar',
      description: 'All requests and ideas by submission date, in Semey time.',
      addCard: 'Add card',
      backToCalendar: 'Back to calendar',
      creationHint: 'New cards appear on the day they are submitted.',
      today: 'Today',
      previousMonth: 'Previous month',
      nextMonth: 'Next month',
      month: 'Month',
      selectedDay: 'Selected day',
      allTypes: 'All cards',
      problems: 'Problems',
      ideas: 'Ideas',
      typeFilter: 'Card type',
      statusFilter: 'Status',
      allStatuses: 'All statuses',
      underReview: 'Under review',
      assigned: 'Assigned',
      search: 'Search cards',
      searchPlaceholder: 'Title, ID or address',
      cards: 'Cards',
      more: 'More',
      emptyDay: 'No cards match this day and the selected filters.',
      emptyMonth: 'No cards match this month and the selected filters.',
      latestCard: 'Go to latest card',
      refresh: 'Refresh',
      refreshError: 'Could not refresh the calendar. Showing the last loaded cards.',
      retry: 'Retry',
      created: 'Card added to the calendar.',
      openCard: 'Open card',
      clearFilters: 'Clear filters',
    },
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
    navRoleCitizen: 'Resident',
    navRoleGuest: 'Guest',
    navRoleJkh: 'Public Services',
    navRoleAdmin: 'Site Administration',
    navMenu: 'Menu',
    langKz: 'Қазақша',
    langRu: 'Русский',
    langEn: 'English',
    demoNoticeBadge: 'DEMO DATA / SEMEY',
    demoNoticeText: 'VoiceOfSemey civic platform prototype concept for Semey.',
    demoNoticeDismiss: 'Dismiss',
    footerConceptTitle: 'VoiceOfSemey • Semey Concept Project',
    footerConceptSubtitle: 'Prototype system for interaction between residents and public services',
    footerConceptNotice: 'Demonstration concept. Not an official administration website.',
    footerCopyright: '© 2026 VoiceOfSemey Concept. Built for an open city.',
    footerStandards: 'Project developed under Smart City open standards',
    mapHeaderTitle: 'Interactive Urban Environment Map • Semey',
    mapHeaderSubtitle: 'Real-time incident monitoring, problem hotspot heatmaps, and resident urban initiatives.',
    mapGeotag: 'Geo-reference: Semey, Abai Region',
    ideasHeaderTitle: 'Urban Ideas Bank • Semey',
    ideasHeaderSubtitle: 'Citizen initiatives for infrastructure development, public spaces, and urban ecology.',
    analyticsHeaderTitle: 'Urban Statistics & Incident Analytics',
    analyticsHeaderSubtitle: 'Monitoring incident resolution velocity, district distribution, and public service responsiveness.',
    profileHeaderTitle: 'Resident Account',
    profileHeaderSubtitle: 'History of submitted requests, review statuses, and tracked municipal responses.',

    authTitle: 'VoiceOfSemey • Semey',
    authSubtitle: 'Integrated municipal system connecting residents with city public services',
    authChooseRole: 'Select access category:',
    authRoleCitizen: 'Resident',
    authRoleCitizenDesc: 'Residents of Semey city',
    authRoleJkh: 'Public Services',
    authRoleJkhDesc: 'City and municipal public services',
    authRoleAdmin: 'Site Administration',
    authRoleAdminDesc: 'Site Administration',
    authLoginTab: 'Citizen Sign In',
    authRegisterTab: 'Create Profile',
    authPhoneOrEmail: 'Phone Number or Email',
    authPassword: 'Password',
    authLoginBtn: 'Sign In to Profile',
    authGuestBtn: 'Continue as Guest (View only)',
    authGuestHint: 'Browse the city map and showcase without registration.',
    authFastCitizenDemo: 'Quick Citizen Demo (Azamat Sultanov)',
    authFastJkhDemo: 'Enter as Public Services (Kanat Serikov)',
    authFastAdminDemo: 'Enter as Site Administration (Dauren Baizhanov)',
    authFullName: 'Full Name',
    authPhone: 'Phone Number',
    authDistrict: 'City District',
    authRegisterBtn: 'Register & Continue',
    authOfficialLogin: 'Official Login (Email)',
    authBackToSite: 'Back to site',
    authResidentTabSignIn: 'Sign in',
    authResidentTabSignUp: 'Create account',
    authStaffTitle: 'Staff sign in',
    authStaffSubtitle: 'For public services and site administration staff',
    authStaffRoleSelect: 'Select municipal role',
    authStaffDispatcher: 'Public Services',
    authStaffAkimat: 'Site Administration',
    authLinkToStaff: 'Sign in as municipal staff',
    authLinkToResident: 'Sign in as city resident',
    authOrDivider: 'or',
    authContinueAsGuest: 'Continue as guest (view only)',
    authDemoAccountsTitle: 'Demo accounts for testing',
    authDemoResident: 'Resident (Aigul Akhmetova)',
    authDemoDispatcher: 'Public Services (Kanat Serikov)',
    authDemoAkimat: 'Site Administration (Dauren Baizhanov)',
    authQuickLoginAction: 'Log in',
    authHeroHeadline: 'Smart and open city for every resident',
    authHeroSubtext: 'Transparent civic tracking, public improvements, and direct response from Semey public services.',
    authFooterConcept: 'VoiceOfSemey • Semey Concept Project. Not an official administration portal.',
    authErrorFillFields: 'Please fill in required fields',
    authErrorInvalidCredentials: 'Please enter valid credentials',

    heroPilotBadge: 'Smart City Concept Project • Semey',
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
    createPhotoCamera: 'Take photo with camera',
    createPhotoDevice: 'Upload from device',
    createPhotoDropzone: 'Drag & drop image here or browse files',
    createPhotoHint: 'Supports JPG, PNG, WebP up to 15 MB',
    createPhotoAttached: 'Incident photo successfully attached',
    createPhotoDelete: 'Remove photo',
    createPhotoReplace: 'Change photo',
    createAnonymousLabel: 'Submit anonymously',
    createAnonymousHint: 'Your contact details will not be shared with utility operators.',
    createSubmitBtn: 'Submit Request',
    createSubmitting: 'AI is structuring and dispatching to 109 services...',
    createSuccessMsg: 'Request successfully submitted to city services!',

    adminTitleJkh: 'Public Services',
    adminTitleAdmin: 'Site Administration',
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
