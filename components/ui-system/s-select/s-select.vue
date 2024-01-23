<template>
  <treeselect
    v-model="currentValue"
    :options="initialOptions"
    :multiple="multiple"
    :placeholder="placeholder"
    :searchable="false"
    :clearable="clearable"
    :no-options-text="noOptionsText"
    :disabled="isDisabled"
    value-consists-of="LEAF_PRIORITY"
    clear-value-text="Очистить значение"
  >
    <template #value-label="{ node }">
      <div v-if="multiple" data-close-tag @mousedown="onValueMouseDown">
        <STag>{{ node.raw.label }}</STag>
      </div>

      <div v-else-if="customLabels && !multiple" class="h-full" v-html="node.raw.label"></div>
      <div v-else class="h-full">{{ node.raw.label }}</div>
    </template>

    <template v-if="customLabels && !multiple" #option-label="{ node }">
      <span v-html="node.raw.label"></span>
    </template>

    <template v-if="multiple" #before-list>
      <ul
        class="flex items-center pl-3 md:pl-3.5 xl:pl-4 mb-3 md:mb-4 md:mt-1.5 xl:mt-2 leading-none"
      >
        <li class="mr-3 md:mr-3.5 xl:mr-4">
          <STagButton color="dark" @click.native="checkAll()"> Выбрать все </STagButton>
        </li>
        <li>
          <button
            class="text-comment text-main-chocolate hover:text-main-waffle duration-300"
            @click="clear"
          >
            Очистить
          </button>
        </li>
      </ul>
    </template>
  </treeselect>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import STagButton from '~/components/ui-system/s-tag-button/s-tag-button.vue'
import STag from '~/components/ui-system/s-tag.vue'

export default {
  components: {
    Treeselect,
    STagButton,
    STag,
  },

  props: {
    initialOptions: {
      type: Array,
      default: () => {
        return []
      },
      required: false,
    },
    value: { type: [Array, String, Number], default: null, required: false },
    placeholder: { type: String, default: '', required: false },
    noOptionsText: { type: String, default: 'Нет доступных вариантов', required: false },
    multiple: { type: Boolean, default: false, required: false },
    customLabels: { type: Boolean, default: false, required: false },
    clearable: { type: Boolean, default: false, required: false },
    disabled: { type: Boolean, default: false, required: false },
  },

  computed: {
    currentValue: {
      get() {
        return this.value
      },

      set(val) {
        this.$emit('input', val)
      },
    },

    isDisabled() {
      return this.disabled || !this.initialOptions.length
    },
  },

  methods: {
    checkAll() {
      const newValue = this.getAllValuesInString(this.initialOptions)
      this.$emit('check-all', newValue)
    },

    getAllValuesInString(options) {
      return options.reduce((acc, option) => {
        if (option.children) {
          return [...acc, ...this.getAllValuesInString(option.children)]
        }
        return [...acc, option.id]
      }, [])
    },

    clear() {
      this.$emit('clear', [])
    },

    onValueMouseDown(ev) {
      if (!ev.target.closest('[data-close-tag]')) {
        ev.stopPropagation()
      }
    },
  },
}
</script>

<style lang="scss">
@import 's-select';
</style>
