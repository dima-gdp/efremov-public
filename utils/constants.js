export const BREAKPOINT_NAMES = {
  MOBILE: 'xs',
  TABLET: 'md',
  DESKTOP: 'xl',
  WIDE: 'xxl',
}

export const BREAKPOINT_SIZES = {
  MOBILE: 0,
  TABLET: 768,
  DESKTOP: 1280,
  WIDE: 1920,
}

export const CATALOG_WIDGET_TYPES = {
  CART: 'cart',
  PRODUCT: 'product',
}

export const GROUP_PRODUCTS = {
  PRODUCTS: {
    value: 'products',
    label: 'без группировки',
  },
  KITS: {
    value: 'kits',
    label: 'по комплектам',
  },
}

export const SORT_PRODUCTS = {
  WEIGHT_DECREASE: {
    value: '-weight,id',
    label: 'по убыванию веса',
  },
  WEIGHT_INCREASE: {
    value: 'weight,id',
    label: 'по возрастанию веса',
  },
  UPLOADED_AT: {
    value: '-uploadedAt,id',
    label: 'по новизне',
  },
}

export const FILE_TYPES = {
  IMAGE: 'image',
  VIDEO_PREVIEW: 'video_preview',
  VIDEO: 'video',
}

export const PRODUCT_AVAILABLE_STATUSES = {
  AVAILABLE: {
    text: 'В наличии/заказ',
    colorClass: 'text-status-success',
  },
  ORDER_ONLY: {
    text: 'Только на заказ',
    colorClass: 'text-status-warning',
  },
  DISCONTINUED: {
    text: 'Снят с производства',
    colorClass: 'text-status-error',
  },
}

export const CACHED_IMAGE_SIZES = {
  60: 60,
  120: 120,
  250: 250,
  350: 350,
  450: 450,
  600: 600,
  800: 800,
  1200: 1200,
}

export const INSERT_WEIGHT_MEASURE = 'кар'

export const DEFAULT_DATE_FORMAT = 'dd.MM.yyyy'

export const MAX_FACETS_COUNT_IN = '17,57'

export const INITIAL_CATALOG_PARAMS = {
  sort: SORT_PRODUCTS.UPLOADED_AT.value,
  page: {
    number: 1,
    size: 35,
  },
  filter: {
    collectionIds: null,
    metals: null,
    kindIds: [],
    availability: null,
    minSize: null,
    maxSize: null,
    minWeight: null,
    maxWeight: null,
    insertIds: [],
    colors: null,
    probes: null,
    coatingIds: null,
  },
  groupType: GROUP_PRODUCTS.PRODUCTS.value,
}

export const INITIAL_CATALOG_OPTIONS = {
  availability: [],
  coatings: [],
  collections: [],
  colors: [],
  inserts: [],
  metals: [],
  probes: [],
}
export const INITIAL_CART_OPTIONS = {
  availability: [],
  coatings: [],
  collections: [],
  colors: [],
  inserts: [],
  metals: [],
  probes: [],
}

export const INITIAL_RANGE_OPTIONS = {
  maxSize: 0,
  minSize: 0,
  maxWeight: 0,
  minWeight: 0,
}

export const PRODUCT_VERSIONS_MAP = {
  colorAndMetal: {
    selectTitle: 'Металл',
    name: 'colorAndMetal',
    emptyId: 'empty',
    emptyLabel: 'Не задан',
  },

  coatings: {
    selectTitle: 'Покрытие',
    name: 'coatings',
    emptyId: 'empty',
    emptyLabel: 'Не задано',
  },

  inserts: {
    selectTitle: 'Вставка',
    name: 'productInserts',
    emptyId: 'empty',
    emptyLabel: 'Не задана',
  },
}

export const PRODUCT_FILTER_AVAILABILITY = {
  isAvailable: 'isAvailable',
  isAvailableAndOrder: 'isAvailableAndOrder',
  isOrder: 'isOrder',
}

export const PRODUCT_MEDALS = {
  isHit: {
    name: 'isHit',
    sort: 1,
  },
  isNew: {
    name: 'isNew',
    sort: 2,
  },
  isSale: {
    name: 'isSale',
    sort: 3,
  },
}

export const FILES_KIND = {
  image: 'image',
  video: 'video',
}

export const PRODUCT_WITH_PAIR_OFFERS = 'Кольцо'
export const NO_SIZE_OFFER_NAME = 'Без размера'
export const CART_OPEN_QUERY_PARAM = 'isOpenCart'
export const PROMISE_STATUSES = {
  fulfilled: 'fulfilled',
  rejected: 'rejected'
}
export const BASE_DEBOUNCE_DELAY = 800
export const SEARCH_PAGE_NAME = 'search'
export const ESC_KEY_CODE = 27
export const SEARCH_INPUT_PLACEHOLDER_XL = 'Поиск по названию/артикулу'
export const SEARCH_INPUT_PLACEHOLDER = 'Поиск'
export const NAVIGATE_MENU_LIST = [
  {
    title: 'Новинки',
    to: '/catalog?params[sort]=-uploadedAt%2Cid',
  },
  {
    title: 'Интернет-магазин',
    href: 'https://efremov.gold/',
  },
  {
    title: 'Клуб EFREMOV',
    href: 'https://club.efremov.jewelry/',
  },
  {
    title: 'О компании',
    to: '/about',
  },
]

export const APP_ENV_MAP = {
  PROD: 'prod',
  STAGE: 'stage',
  dev: 'dev'
}
