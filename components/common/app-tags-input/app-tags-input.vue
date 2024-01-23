<template>
  <div class="header-search">
    <ul
      v-show="tags.length"
      ref="tags"
      class="header-search__tags"
      :class="{ 'header-search__tags--overflow': tagsOverflow }"
    >
      <li v-for="(tag, i) in tags" :key="i" data-header-search>
        <div class="search-tag">
          <span>{{ tag }}</span>
          <button class="search-tag__delete" @click="$emit('delete-tag', i)">
            <IconX class="w-2.5 h-2.5 md:w-3 md:h-3" />
          </button>
        </div>
      </li>
    </ul>
    <div class="header-search__input-wrapper">
      <input
        class="text-main"
        :value="inputValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="onInput"
        @focus="$emit('focus')"
        @keydown.enter="$emit('keydown-enter')"
        @keydown.delete="$emit('keydown-delete')"
      />
    </div>
    <span
      class="
        flex
        justify-center
        items-center
        absolute
        bottom-0
        right-0
        w-8
        md:w-9
        xl:w-10
        h-8
        md:h-9
        xl:h-10
      "
    >
      <IconSearch class="w-4 xl:w-5 h-4 xl:h-5" />
    </span>
  </div>
</template>

<script>
import { IconSearch, IconX } from '~/components/feather-icons'
import { BREAKPOINT_NAMES, SEARCH_INPUT_PLACEHOLDER } from '~/utils/constants'

export default {
  components: { IconSearch, IconX },

  props: {
    tags: { type: Array, default: () => [], required: false },
    inputValue: { type: String, default: '', required: true },
    placeholder: { type: String, default: SEARCH_INPUT_PLACEHOLDER, required: false },
    disabled: { type: Boolean, default: false, required: false },
  },

  data() {
    return {
      tagsOverflow: false,
    }
  },

  watch: {
    tags(val) {
      if (!val.length || this.$store.state.currentBreakpoint === BREAKPOINT_NAMES.MOBILE) {
        this.tagsOverflow = false
        return
      }
      const tagContainerWidth = this.$refs.tags.offsetWidth
      const tagsWidth = this.getTagsFullWidth(val.length)
      if (tagsWidth > tagContainerWidth) {
        this.tagsOverflow = true
        return
      }
      this.tagsOverflow = false
    },
  },

  methods: {
    onInput({ target }) {
      this.$emit('input', target.value)
    },

    getTagsFullWidth(tagsLength) {
      const tagsWidth = Array.from(this.$refs.tags.querySelectorAll('li')).reduce(
        (sum, el) => el.offsetWidth + sum,
        0,
      )
      const gaps = (tagsLength - 1) * 5
      return tagsWidth + gaps
    },
  },
}
</script>

<style lang="scss">
@import 'app-tags-input';
</style>
