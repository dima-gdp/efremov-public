import createHmac from 'create-hmac'

const IMAGE_PROXY_KEY =
  '9cd4b5f9d26b7344268ece776f104aca6daa015f83add15e73abde4b4c008ae2f687976fc4569edece139a14a15304a7674804a06a2c9f1b6646a7c8f22e86ad'
const IMAGE_PROXY_SALT =
  '9e8122da2464b4f3adab0d1ac554e791261e842cb9d783c3fdc5b4d8eda14a66d2e09f78498bca5e9f20a4226f59b25c623e1a9dd4b52e9d47b2c99b636749fc'
const IMAGE_SERVER = 'https://img.s256.dev'
const CDN_URL = 'https://img-cdn.s256.dev'
const DEFAULT_PARAMS = {
  resizingType: 'fill',
  useCDN: true,
  blur: null,
  sharp: null,
  enlarge: null,
  crop: null,
  quality: 100,
  extension: undefined, // в зависимости от заголовка запроса отдастся webp или не webp
  gravity: {
    enable: false,
    type: 'ce',
    xOffset: '0',
    yOffset: '0',
  },
}

function urlSafeBase64(string) {
  return Buffer.from(string)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function hexDecode(hex) {
  return Buffer.from(hex, 'hex')
}

function sign(salt, target, secret) {
  const hmac = createHmac('sha256', hexDecode(secret))
  hmac.update(hexDecode(salt))
  hmac.update(target)
  return urlSafeBase64(hmac.digest())
}

export default function resizeImage(
  url = '',
  w = 0,
  h = 0,
  params = DEFAULT_PARAMS,
  localHost = null,
) {
  const { resizingType, enlarge, crop, blur, sharp, quality, useCDN, gravity } = {
    ...DEFAULT_PARAMS,
    ...params,
  }

  if (params.extension && !['png', 'jpg', 'jpeg'].includes(params.extension)) {
    throw new Error('Недопустимое значение параметра extension')
  }

  const extension = params.extension || 'png'

  const encodedUrl = urlSafeBase64(url)

  const path =
    `/rs:${resizingType}:${w}:${h}${
    blur ? `/bl:${blur}` : ''
    }${sharp ? `/sh:${sharp}` : ''
    }${quality ? `/q:${quality}` : ''
    }${enlarge ? `/el:${enlarge}` : ''
    }${crop ? `/c:${crop.width}:${crop.height}` : ''
    }${gravity.enable ? `/g:${gravity.type}:${gravity.xOffset}:${gravity.yOffset}` : ''
    }/${encodedUrl}.${extension}`

  const signature = sign(IMAGE_PROXY_SALT, path, IMAGE_PROXY_KEY)

  let baseUrl
  if (localHost) {
    baseUrl = localHost
  } else {
    baseUrl = useCDN ? CDN_URL : IMAGE_SERVER
  }

  return `${baseUrl}/${signature}${path}`
}
