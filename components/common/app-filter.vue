<template>
  <div class="app-filter" :class="{ 'app-filter--closed': !isFilterExpanded }">
    <div class="bg-main-souffle pt-5 pb-6 xl:pb-7">
      <div class="app-filter__grid">
        <div class="app-filter__grid-item">
          <div class="text-h5 mb-1">Коллекция</div>
          <SSelect
            :value="currentFilters.collectionIds"
            :initial-options="options.collections"
            clearable
            placeholder="Все коллекции"
            @input="changeFilter($event, 'collectionIds')"
          >
          </SSelect>
        </div>
        <div class="app-filter__grid-item">
          <div class="text-h5 mb-1">Металл</div>
          <SSelect
            :value="currentFilters.metals"
            :initial-options="options.metals"
            clearable
            placeholder="Все металлы"
            @input="changeFilter($event, 'metals')"
          >
          </SSelect>
        </div>
        <div class="app-filter__grid-item">
          <div class="text-h5 mb-1">Вид изделия</div>
          <SSelect
            :value="currentFilters.kindIds"
            :initial-options="options.kinds"
            multiple
            placeholder="Все изделия"
            @input="changeFilter($event, 'kindIds')"
            @check-all="currentFilters.kindIds = $event"
            @clear="currentFilters.kindIds = $event"
          >
          </SSelect>
        </div>
        <div class="app-filter__grid-item">
          <div class="text-h5 mb-1">Наличие</div>
          <SSelect
            :value="currentFilters.availability"
            :initial-options="options.availability"
            clearable
            placeholder="Все варианты наличия"
            @input="changeFilter($event, 'availability')"
          >
          </SSelect>
        </div>
        <div class="app-filter__grid-item">
          <div class="text-h5 mb-1">Размер изделия</div>
          <RangeInput
            :from-value="currentFilters.minSize"
            :to-value="currentFilters.maxSize"
            :min="rangeOptions.minSize"
            :max="rangeOptions.maxSize"
            :show-range-control="isShowedRangeControl"
            measure="р"
            @change-range="changeRangeFilter($event, ['minSize', 'maxSize'])"
            @changes-completed="updateFilters"
          />
        </div>
        <div class="app-filter__grid-item">
          <div class="text-h5 mb-1">Вес изделия, гр.</div>
          <RangeInput
            :from-value="currentFilters.minWeight"
            :to-value="currentFilters.maxWeight"
            :min="rangeOptions.minWeight"
            :max="rangeOptions.maxWeight"
            :show-range-control="isShowedRangeControl"
            :interval="0.01"
            measure="гр."
            @change-range="changeRangeFilter($event, ['minWeight', 'maxWeight'])"
            @changes-completed="updateFilters"
          />
        </div>
        <div class="app-filter__grid-item">
          <div class="text-h5 mb-1">Вставка</div>
          <SSelect
            :value="currentFilters.insertIds"
            :initial-options="options.inserts"
            multiple
            placeholder="Все вставки"
            @input="changeFilter($event, 'insertIds')"
            @check-all="currentFilters.insertIds = $event"
            @clear="currentFilters.insertIds = $event"
          >
          </SSelect>
        </div>
        <div class="app-filter__grid-item">
          <div class="text-h5 mb-1">Цвет металла</div>
          <SSelect
            :value="currentFilters.colors"
            :initial-options="options.colors"
            clearable
            placeholder="Все цвета металла"
            @input="changeFilter($event, 'colors')"
          >
          </SSelect>
        </div>
        <div class="app-filter__grid-item">
          <div class="text-h5 mb-1">Проба</div>
          <SSelect
            :value="currentFilters.probes"
            :initial-options="options.probes"
            clearable
            placeholder="Все пробы"
            @input="changeFilter($event, 'probes')"
          >
          </SSelect>
        </div>
        <div class="app-filter__grid-item">
          <div class="text-h5 mb-1">Покрытие</div>
          <SSelect
            :value="currentFilters.coatingIds"
            :initial-options="options.coatings"
            clearable
            placeholder="Все покрытия"
            @input="changeFilter($event, 'coatingIds')"
          >
          </SSelect>
        </div>
      </div>
      <div class="mt-4 md:hidden">
        <button
          class="app-filter__btn app-filter__btn--reset mx-auto"
          @click="resetFilters"
        >
          <IconRefreshCw class="w-4 h-4 mr-2.5 xl:w-5 xl:h-5" />
          <span class="text-main-b">Сбросить фильтр</span>
        </button>
      </div>
      <div class="app-filter__actions">
        <div class="app-filter__actions-container">
          <button
            class="app-filter__btn app-filter__btn--toggle"
            @click="toggleFilterExpanded"
          >
            <IconChevronDown class="w-4 h-4 mr-2.5 xl:w-5 xl:h-5"  :class="{'transform rotate-180': isFilterExpanded}" />
            <span v-if="isFilterExpanded" class="text-main-b">Скрыть фильтр</span>
            <span v-else class="text-main-b">Показать фильтр</span>
          </button>
          <button
            class="app-filter__btn app-filter__btn--reset"
            @click="resetFilters"
          >
            <IconRefreshCw class="w-4 h-4 mr-2.5 xl:w-5 xl:h-5" />
            <span class="text-main-b">Сбросить</span>
          </button>
        </div>
      </div>

    </div>
    <div v-show="!isFilterExpanded" class="app-filter__lock-block"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SSelect from '~/components/ui-system/s-select/s-select.vue'
import RangeInput from '~/components/range-input/range-input.vue'
import { IconChevronDown, IconRefreshCw } from '~/components/feather-icons'
import {
  BREAKPOINT_NAMES,
  INITIAL_CATALOG_OPTIONS,
  INITIAL_CATALOG_PARAMS,
  INITIAL_RANGE_OPTIONS,
} from '~/utils/constants'
import ProductGroups from '~/domain/product-groups'

export default {
  components: {
    IconChevronDown,
    SSelect,
    RangeInput,
    IconRefreshCw,
  },

  props: {
    options: { type: Object, default: () => ({ ...INITIAL_CATALOG_OPTIONS }), required: true },
    rangeOptions: { type: Object, default: () => ({ ...INITIAL_RANGE_OPTIONS }), required: true },
    filters: {
      type: Object,
      default: () => ({ ...INITIAL_CATALOG_PARAMS.filter }),
      required: true,
    },
  },

  data() {
    return {
      currentFilters: { ...this.filters },
    }
  },

  computed: {
    ...mapState(['isCatalogFilterExpanded', 'currentBreakpoint']),
    isFilterExpanded() {
      if (this.$store.state.currentBreakpoint === BREAKPOINT_NAMES.MOBILE) {
        return true
      }
      return this.isCatalogFilterExpanded
    },

    isShowedRangeControl() {
      return this.currentBreakpoint === BREAKPOINT_NAMES.DESKTOP
    },
  },

  watch: {
    filters: {
      handler(val) {
        this.currentFilters = { ...val }
      },
      deep: true,
    },
  },

  methods: {
    toggleFilterExpanded() {
      this.$store.commit('SET_CATALOG_FILTER_EXPANDED', !this.isCatalogFilterExpanded)
    },

    changeRangeFilter(val, fields) {
      const [min, max] = val
      const [minField, maxField] = fields
      this.currentFilters[minField] = min
      this.currentFilters[maxField] = max
    },

    // TODO: Не очень хорошо прям тут сбрасывать фильтры, но из-за ползунков придется пока сюда вставить
    resetFilters() {
      if (ProductGroups.hasSomeFilter(this.currentFilters)) {
        this.currentFilters = { ...INITIAL_CATALOG_PARAMS.filter }
        this.updateFilters()
      }
    },

    changeFilter(val, field) {
      this.currentFilters[field] = val
      this.updateFilters()
    },

    updateFilters() {
      this.$emit('change-filters', this.currentFilters)
    },
  },
}
</script>
<style lang="scss">
.app-filter {
  width: 100%;
  position: relative;
  max-height: 1000px;
  transition: max-height 0.3s cubic-bezier(1, 0, 1, 0);

  &--closed {
    max-height: 178px;
    transition: max-height 0.3s cubic-bezier(0, 1, 0, 1);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: 10fr;
    column-gap: 20px;
    row-gap: 20px;
    position: relative;

    @media (min-width: theme('screens.md')) {
      grid-template-columns: repeat(12, 1fr);
      row-gap: 24px;
    }

    @media (min-width: theme('screens.xl')) {
      grid-template-columns: repeat(5, 1fr);
      row-gap: 32px;
    }
  }

  &__grid-item {
    &:nth-child(1) {
      grid-column-start: 1;
      grid-column-end: 13;
      grid-row-start: 1;
      grid-row-end: 1;
    }
    &:nth-child(2) {
      grid-column-start: 1;
      grid-column-end: 13;
      grid-row-start: 2;
      grid-row-end: 2;
    }
    &:nth-child(3) {
      grid-column-start: 1;
      grid-column-end: 13;
      grid-row-start: 3;
      grid-row-end: 3;
    }
    &:nth-child(4) {
      grid-column-start: 1;
      grid-column-end: 13;
      grid-row-start: 4;
      grid-row-end: 4;
    }
    &:nth-child(5) {
      grid-column-start: 1;
      grid-column-end: 7;
      grid-row-start: 5;
      grid-row-end: 5;
    }
    &:nth-child(6) {
      grid-column-start: 7;
      grid-column-end: 13;
      grid-row-start: 5;
      grid-row-end: 5;
    }
    &:nth-child(7) {
      grid-column-start: 1;
      grid-column-end: 13;
      grid-row-start: 6;
      grid-row-end: 6;
    }
    &:nth-child(8) {
      grid-column-start: 1;
      grid-column-end: 13;
      grid-row-start: 7;
      grid-row-end: 7;
    }
    &:nth-child(9) {
      grid-column-start: 1;
      grid-column-end: 13;
      grid-row-start: 8;
      grid-row-end: 8;
    }
    &:nth-child(10) {
      grid-column-start: 1;
      grid-column-end: 13;
      grid-row-start: 9;
      grid-row-end: 9;
    }
    @media (min-width: theme('screens.md')) {
      &:nth-child(1) {
        grid-column-start: 1;
        grid-column-end: 7;
        grid-row-start: 1;
        grid-row-end: 1;
      }
      &:nth-child(2) {
        grid-column-start: 7;
        grid-column-end: 13;
        grid-row-start: 1;
        grid-row-end: 1;
      }
      &:nth-child(3) {
        grid-column-start: 1;
        grid-column-end: 7;
        grid-row-start: 2;
        grid-row-end: 2;
      }
      &:nth-child(4) {
        grid-column-start: 7;
        grid-column-end: 13;
        grid-row-start: 2;
        grid-row-end: 2;
      }

      &:nth-child(5) {
        grid-column-start: 1;
        grid-column-end: 5;
        grid-row-start: 3;
        grid-row-end: 3;
      }
      &:nth-child(6) {
        grid-column-start: 5;
        grid-column-end: 9;
        grid-row-start: 3;
        grid-row-end: 3;
      }
      &:nth-child(7) {
        grid-column-start: 9;
        grid-column-end: 13;
        grid-row-start: 3;
        grid-row-end: 3;
      }
      &:nth-child(8) {
        grid-column-start: 1;
        grid-column-end: 5;
        grid-row-start: 4;
        grid-row-end: 4;
      }
      &:nth-child(9) {
        grid-column-start: 5;
        grid-column-end: 9;
        grid-row-start: 4;
        grid-row-end: 4;
      }

      &:nth-child(10) {
        grid-column-start: 9;
        grid-column-end: 13;
        grid-row-start: 4;
        grid-row-end: 4;
      }
    }
    @media (min-width: theme('screens.xl')) {
      &:nth-child(1) {
        grid-column-start: initial;
        grid-column-end: initial;
        grid-row-start: initial;
        grid-row-end: initial;
      }
      &:nth-child(2) {
        grid-column-start: initial;
        grid-column-end: initial;
        grid-row-start: initial;
        grid-row-end: initial;
      }
      &:nth-child(3) {
        grid-column-start: initial;
        grid-column-end: initial;
        grid-row-start: initial;
        grid-row-end: initial;
      }
      &:nth-child(4) {
        grid-column-start: initial;
        grid-column-end: initial;
        grid-row-start: initial;
        grid-row-end: initial;
      }

      &:nth-child(5) {
        grid-column-start: initial;
        grid-column-end: initial;
        grid-row-start: initial;
        grid-row-end: initial;
      }
      &:nth-child(6) {
        grid-column-start: initial;
        grid-column-end: initial;
        grid-row-start: initial;
        grid-row-end: initial;
      }
      &:nth-child(7) {
        grid-column-start: initial;
        grid-column-end: initial;
        grid-row-start: initial;
        grid-row-end: initial;
      }
      &:nth-child(8) {
        grid-column-start: initial;
        grid-column-end: initial;
        grid-row-start: initial;
        grid-row-end: initial;
      }
      &:nth-child(9) {
        grid-column-start: initial;
        grid-column-end: initial;
        grid-row-start: initial;
        grid-row-end: initial;
      }

      &:nth-child(10) {
        grid-column-start: initial;
        grid-column-end: initial;
        grid-row-start: initial;
        grid-row-end: initial;
      }
    }
  }

  &__actions {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -20px;
    display: none;
    z-index: 11;
    justify-content: center;

    @media (min-width: theme('screens.md')) {
      display: flex;
      margin-right: 8px;
    }
  }

  &__actions-container {
    display: flex;
    align-items: center;
    padding: 0 5px;
    position: relative;

    @media (min-width: theme('screens.xl')) {
      padding: 0 3px;
    }

    &::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: -4px;
      height: 25px;
      background-color: theme('colors.main.souffle');
      border-radius: 0px 0px 20px 20px;
    }
  }

  &__btn {
    display: flex;
    align-items: center;
    border-radius: 200px;
    padding: 4px 12px;
    height: 32px;
    user-select: none;
    transition: 0.3s;
    z-index: 1;

    &--toggle {
      display: none;
      background: theme('colors.main.chocolate');
      color: theme('colors.main.sugar');

      @media (min-width: theme('screens.md')) {
        display: flex;
        margin-right: 8px;
      }

      &:hover {
        color: theme('colors.main.chocolate');
        background: theme('colors.main.souffle');
      }
    }

    &--reset {
      border: 2px solid theme('colors.main.chocolate');
      background: theme('colors.main.souffle');
      color: theme('colors.main.chocolate');

      &:hover {
       border-color: theme('colors.main.souffle');
      }
    }
  }

  &__lock-block {
    position: absolute;
    left: 50%;
    bottom: 0;
    z-index: 5;
    width: calc(100% + 10px);
    height: 85px;
    transform: translateX(-50%);
    background: linear-gradient(
      180deg,
      rgba(248, 248, 248, 0) 0%,
      rgba(248, 248, 248, 0.5) 18.06%,
      rgba(248, 248, 248, 0.75) 39.81%,
      #f8f8f8 81.94%
    );
  }
}
</style>
