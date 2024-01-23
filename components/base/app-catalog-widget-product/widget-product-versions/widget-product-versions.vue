<template>
  <div v-if="selectsNeeded" class="mb-5 md:mb-6 xl:mb-5">
    <button class="flex items-center mb-2 md:hidden" @click="versionsVisible = !versionsVisible">
      <span class="text-main-b mr-0.5">
        <span v-show="versionsVisible">Скрыть</span>
        <span v-show="!versionsVisible">Показать</span>
        варианты
      </span>
      <IconChevronUp
        class="w-2.5 h-2.5 transition-transform"
        :class="{ 'transform rotate-180': !versionsVisible }"
      />
    </button>
    <SlideUpDown
      :active="versionsVisible || currentBreakpoint !== $options.BREAKPOINT_NAMES.MOBILE"
    >
      <div class="flex flex-col space-y-5 md:space-y-0 md:space-x-2.5 md:flex-row">
        <div
          v-for="versionSelect in versionsSelects"
          :key="versionSelect.name"
          class="select-container"
        >
          <span class="text-main-b mb-1">{{ versionSelect.title }}</span>
          <SSelect
            v-model="versionSelect.id"
            :initial-options="versionSelect.options"
            @input="onInputSelect(versionSelect.name)"
          />
        </div>
      </div>
    </SlideUpDown>
  </div>
</template>

<script>
import SlideUpDown from 'vue-slide-up-down'
import { mapState } from 'vuex'
import { BREAKPOINT_NAMES } from '~/utils/constants'
import { IconChevronUp } from '~/components/feather-icons'
import SSelect from '~/components/ui-system/s-select/s-select.vue'
import {
  findProductVersion,
  getVersionSelects,
  isVersionsSelectsVisible,
} from '~/domain/product-versions'
import flushPromises from '~/utils/flush-promises'

export default {
  components: {
    SSelect,
    IconChevronUp,
    SlideUpDown,
  },

  props: {
    productVersions: { type: Array, default: () => [], required: true },
    product: {
      type: Object,
      default: () => ({ colorAndMetal: '', coatings: [], versionInsertFilter: '' }),
      required: true,
    },
  },

  BREAKPOINT_NAMES,

  data() {
    return {
      versionsSelects: [],
      versionsVisible: false,
      selectsNeeded: true,
    }
  },

  computed: {
    ...mapState(['currentBreakpoint']),
  },

  watch: {
    productVersions(val) {
      this.setVersions(val)
    },
  },

  created() {
    this.setVersions(this.productVersions)
  },

  methods: {
    setVersions(productVersions) {
      this.versionsSelects = getVersionSelects({
        colorAndMetal: this.product.colorAndMetal,
        coatings: this.product.coatings,
        versionInsertFilter: this.product.versionInsertFilter,
        productVersions,
      })

      this.selectsNeeded = isVersionsSelectsVisible(this.versionsSelects)
    },

    async onInputSelect(selectName) {
      await flushPromises()
      const productVersion = findProductVersion(
        this.versionsSelects,
        this.productVersions,
        selectName,
      )
      if (productVersion) {
        this.$emit('change-version', productVersion.id)
      }
    },
  },
}
</script>

<style lang="scss">
.select-container {
  display: flex;
  flex-direction: column;

  .vue-treeselect--single .vue-treeselect__label {
    white-space: normal;
  }

  @media (min-width: theme('screens.md')) {
    width: 208px;

    &:last-child {
      flex: 1 1 auto;
    }
  }
}
</style>
