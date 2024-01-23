<script>
// TODO: Сделать универсальнее, вынести логику в сервис
import resizeImage from '~/utils/img-resizer'
import { CACHED_IMAGE_SIZES } from '~/utils/constants'

export default {
  props: {
    url: { type: String, default: '', required: false },
    width: { type: Number, default: 0, required: false },
    h: { type: Number, default: 0, required: false },
    params: { type: Object, default: () => ({ quality: 80 }), required: false },
    isSwiperLazy: { type: Boolean, default: false, required: false },
  },

  methods: {
    getImgSrcSet() {
      return Object.entries(CACHED_IMAGE_SIZES)
        .filter(([, value]) => value <= this.width)
        .map(([, value]) => {
          return `${resizeImage(this.url, value, this.h, this.params)} ${value}w`
        })
        .join()
    },
  },

  render(createElement) {
    return createElement('img', {
      attrs: {
        [this.isSwiperLazy ? 'data-srcset' : 'srcset']: this.getImgSrcSet(),
        [this.isSwiperLazy ? 'data-src' : 'src']: resizeImage(this.url, this.w, this.h, this.params),
      },
    })
  },
}
</script>
