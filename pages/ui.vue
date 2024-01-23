<template>
  <div class="p-4">
    <ul class="mb-14 flex">
      <li class="mr-3"><STabs v-model="currentTab" :tabs="tabs" /></li>
      <li><STabs v-model="currentTab" :tabs="tabs" color="light" /></li>
    </ul>

    <div class="w-96" :class="{ 'w-full': full }">
      <AppTagsInput @update-input-value="taggedInput = $event" />
    </div>
    <button @click="full = !full">full</button>
    <div class="mt-5 mb-7">
      <button @click="useAlert">ALERT</button>
    </div>

    <div class="mb-16 flex">
      <span class="mr-3">Сортировка:</span>
      <SelectSort v-model="sort.value" :options="sort.options" />
    </div>

    <div class="w-40 mb-32">
      <RangeInput
        :from-value="rangeInput.from"
        :to-value="rangeInput.to"
        :min="10"
        :max="30"
        measure="гр."
        @change-range="changeRangeFilter"
      />
    </div>

    <ul class="flex space-x-16 mb-4">
      <li>
        <SInputNumber v-model="sInputNumber" />
      </li>
      <li>
        <SInputNumber v-model="sInputNumber1" disabled />
      </li>
      <li>
        <SInputNumber v-model="sInputNumber" color="dark" />
      </li>
      <li>
        <SInputNumber v-model="sInputNumber1" color="dark" disabled />
      </li>
    </ul>
    <ul class="flex space-x-16 mb-4">
      <li class="flex">
        <SCheckBox v-model="checkbox" />
        <span>Checkbox</span>
      </li>
      <li class="flex">
        <SToggle v-model="toggle" />
        <span>Toggle</span>
      </li>
      <li class="flex">
        <SToggle v-model="toggleDis" disabled />
        <span>Toggle-disabled</span>
      </li>
    </ul>

    <div class="flex space-x-16 mb-4">
      <div class="w-96">
        <SSelect
          v-model="selectValue"
          :initial-options="selectOptions"
          placeholder="введите введите введите введите введите"
        />
      </div>
      <div style="width: 220px">
        <SSelect
          v-model="selectValue2"
          :initial-options="selectOptions2"
          placeholder="введите введите введите введите введите введите"
          multiple
          @check-all="selectValue2 = $event"
          @clear="selectValue2 = $event"
        />
      </div>
    </div>
    <div class="text-h1">Hello!</div>
    <div class="text-h2">grandis</div>
    <div class="text-h3">grandis</div>
    <div class="text-h4">grandis</div>
    <div class="text-h5">grandis</div>
    <div class="text-h6">grandis</div>
    <div class="text-main">grandis</div>
    <div class="text-main-b">grandis</div>
    <div class="text-comment">grandis</div>
    <div class="text-comment-b">grandis</div>
    <div class="text-but-lin">grandis</div>
    <div class="text-ma">grandis</div>
    <div class="text-a">grandis</div>
    <div class="text-ha">grandis</div>

    <div class="grid grid-cols-2 gap-10 mt-6">
      <SButton variant="solid" color="light">
        <span class="flex">
          <span>solid-light</span>
          <span><IconSearch /></span>
        </span>
      </SButton>
      <SButton variant="solid" color="dark">solid-dark</SButton>
      <SButton variant="solid" color="light" disabled>solid-light-disabled</SButton>
      <SButton variant="solid" color="dark" disabled>solid-dark-disabled</SButton>

      <SButton variant="ghost" color="light">ghost-light</SButton>
      <SButton variant="ghost" color="dark">ghost-dark</SButton>
      <SButton variant="ghost" color="light" disabled>ghost-light-disabled</SButton>
      <SButton variant="ghost" color="dark" disabled>ghost-dark-disabled</SButton>

      <SButton variant="transparent" color="light">transparent-light</SButton>
      <SButton variant="transparent" color="dark">transparent-dark</SButton>
      <SButton variant="transparent" color="light" disabled>transparent-light-disabled</SButton>
      <SButton variant="transparent" color="dark" disabled>transparent-dark-disabled</SButton>

      <SButton variant="solid" color="dark">solid-dark</SButton>

      <SButton to="#" variant="solid" color="dark">Nuxt-link</SButton>
      <SButton href="#" variant="transparent" color="dark">LINK</SButton>
      <SButton href="#" variant="ghost" color="dark">LINK</SButton>
    </div>

    <ul class="flex space-x-1 mb-4">
      <li>
        <STag>tag</STag>
      </li>
      <li>
        <STag>tag</STag>
      </li>
    </ul>

    <ul class="flex space-x-1 mb-4">
      <li>
        <SInput v-model="inputValue" variant="standard" :placeholder="'placeholder'" />
      </li>
      <li>
        <SInput variant="standard" with-search-icon :placeholder="'placeholder'" />
      </li>
      <li>
        <SInput v-model="textAreaValue" variant="multirow" :placeholder="'placeholder'" />
      </li>
    </ul>

    <ul class="flex space-x-1 mb-4">
      <li>
        <STagButton>s-tag-button-light</STagButton>
      </li>
      <li>
        <STagButton color="dark">s-tag-button-dark</STagButton>
      </li>
      <li>
        <STagButton disabled>s-tag-button-light-disabled</STagButton>
      </li>
      <li>
        <STagButton disabled color="dark">s-tag-button-dark-disabled</STagButton>
      </li>
    </ul>

    <ul class="flex space-x-1 mb-4">
      <li>
        <AppAvailableTag />
      </li>
      <li>
        <AppAvailableTag status="orderOnly" />
      </li>
      <li>
        <AppAvailableTag status="discontinued" />
      </li>
    </ul>

    <ul class="flex space-x-1 mb-4">
      <li>
        <AppMedal />
      </li>
      <li>
        <AppMedal type="isHit" />
      </li>
      <li>
        <AppMedal type="isSale" />
      </li>
    </ul>

    <div class="mb-10"></div>

    <div>
      <SButton variant="solid" color="dark" @click.native="dialog = !dialog">dialog</SButton>
      <SDialog v-model="dialog" />
    </div>
  </div>
</template>

<script>
import useGlobalAlert from '~/application/global-alert'
import SButton from '~/components/ui-system/s-button/s-button.vue'
import STagButton from '~/components/ui-system/s-tag-button/s-tag-button.vue'
import STag from '~/components/ui-system/s-tag.vue'
import SCheckBox from '~/components/ui-system/s-checkbox/s-checkbox.vue'
import SToggle from '~/components/ui-system/s-toggle/s-toggle.vue'
import SInput from '~/components/ui-system/s-input.vue'
import SInputNumber from '~/components/ui-system/s-input-number/s-input-number.vue'
import SSelect from '~/components/ui-system/s-select/s-select.vue'
import AppAvailableTag from '~/components/common/app-available-tag.vue'
import AppMedal from '~/components/common/app-medal/app-medal.vue'
import { IconSearch, IconMaximize, IconInfo } from '~/components/feather-icons'
import SDialog from '~/components/ui-system/s-dialog/s-dialog.vue'
import RangeInput from '~/components/range-input/range-input.vue'
import SelectSort from '~/components/common/app-select-sort/app-select-sort.vue'
import AppTagsInput from '~/components/common/app-tags-input/app-tags-input.vue'
import STabs from '~/components/ui-system/s-tabs/s-tabs.vue'

export default {
  components: {
    STabs,
    AppTagsInput,
    RangeInput,
    SButton,
    STag,
    SInput,
    STagButton,
    SSelect,
    SCheckBox,
    SToggle,
    IconSearch,
    AppAvailableTag,
    AppMedal,
    SInputNumber,
    SDialog,
    SelectSort,
  },

  validate({ isDev }) {
    return isDev
  },

  data() {
    return {
      currentTab: 'one',
      tabs: [
        {
          icon: IconMaximize,
          html: 'one',
          value: 'one',
        },
        {
          icon: IconInfo,
          html: 'two',
          value: 'two',
        },
        {
          icon: IconSearch,
          html: 'three',
          value: 'three',
        },
      ],

      taggedInput: null,
      full: false,
      dialog: false,

      sort: {
        value: 'weight',
        options: [
          {
            value: 'price',
            label: 'по возрастанию цены',
          },
          {
            value: '-price',
            label: 'по убыванию цены',
          },
          {
            value: 'weight',
            label: 'по весу',
          },
        ],
      },

      rangeInput: {
        from: 10,
        to: 12,
      },

      sInputNumber: 0,
      sInputNumber1: 3,
      checkbox: false,
      toggle: false,
      toggleDis: false,

      inputValue: '',
      textAreaValue: '',

      selectValue: 'a',
      selectOptions: [
        {
          id: 'a',
          label: 'Первый уровень аха хаа хаха ахах а хахахаха',
        },
        {
          id: 'b',
          label: 'b',
        },
      ],

      selectValue2: [],
      selectOptions2: [
        {
          id: 1,
          label: 'Все из первого',
          children: [
            {
              id: 3,
              label: 'первое',
            },
            {
              id: 4,
              label: 'Все из второго',
              children: [
                {
                  id: 5,
                  label: 'второе',
                },
              ],
            },
          ],
        },
        { id: 2, label: 'третье' },
      ],
    }
  },
  methods: {
    useAlert() {
      useGlobalAlert().createAlert('wfwef', 'error')
    },

    changeRangeFilter([from, to]) {
      this.rangeInput.from = from
      this.rangeInput.to = to
    },
  },
}
</script>
