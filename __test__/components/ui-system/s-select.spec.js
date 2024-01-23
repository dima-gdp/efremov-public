import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Treeselect from '@riophae/vue-treeselect'
import SSelect from '~/components/ui-system/s-select/s-select.vue'
import STag from '~/components/ui-system/s-tag.vue'

describe('~/components/ui-system/s-select/s-select.vue', () => {
  const SELECT_OPTIONS = [
    { id: 1, label: 'первое' },
    { id: 2, label: 'второе' },
    { id: 3, label: 'третье' },
  ]

  let wrapper
  const selectArrow = () => wrapper.find('.vue-treeselect__control-arrow-container')
  const checkAllButton = () =>
    wrapper.findAll('button').wrappers.find((button) => button.text() === 'Выбрать все')
  const clearAllButton = () =>
    wrapper.findAll('button').wrappers.find((button) => button.text() === 'Очистить')
  const MULTISELECT_LABEL_SELECTOR = '.vue-treeselect__multi-value-label'
  const MULTISELECT_VALUE_SELECTOR = '.vue-treeselect__multi-value'

  const createComponent = (propsData) => {
    wrapper = mount(SSelect, {
      propsData,
    })
  }

  afterEach(() => {
    wrapper.destroy()
  })

  it('Передает принятое значение в treeselect', () => {
    const singleValueObject = SELECT_OPTIONS[0]
    createComponent({ value: singleValueObject.id, initialOptions: SELECT_OPTIONS })

    expect(wrapper.findComponent(Treeselect).props('value')).toBe(singleValueObject.id)
  })

  it('При изменении значения сверху передает новое значение в treeselect', async () => {
    const singleValueObject = SELECT_OPTIONS[0]
    createComponent({ value: singleValueObject.id, initialOptions: SELECT_OPTIONS })

    expect(wrapper.findComponent(Treeselect).props('value')).toBe(singleValueObject.id)

    const newSingleValueObject = SELECT_OPTIONS[1]
    wrapper.setProps({ value: newSingleValueObject.id })
    await nextTick()

    expect(wrapper.findComponent(Treeselect).props('value')).toBe(newSingleValueObject.id)
  })

  it('При изменении значения отправляет его наверх', async () => {
    createComponent({ value: SELECT_OPTIONS[0].id, initialOptions: SELECT_OPTIONS })

    const newSingleValueObject = SELECT_OPTIONS[1]
    await selectArrow().trigger('mousedown')
    const clickedOptionHtml = wrapper
      .findAll('label')
      .wrappers.find((option) => option.text() === newSingleValueObject.label)
    await clickedOptionHtml.trigger('mousedown')

    expect(wrapper.emitted('input')[0][0]).toBe(newSingleValueObject.id)
  })

  it('Передает принятые опции в treeselect', async () => {
    createComponent({ value: SELECT_OPTIONS[0].id, initialOptions: SELECT_OPTIONS })

    expect(wrapper.findComponent(Treeselect).props('options')).toEqual(SELECT_OPTIONS)
  })

  it('При изменении опций сверху, передает новые опции в treeselect', async () => {
    const newSingleSelectOptions = [...SELECT_OPTIONS, { id: 'newId', label: 'newLabel' }]
    createComponent({ value: SELECT_OPTIONS[0].id, initialOptions: SELECT_OPTIONS })

    wrapper.setProps({ initialOptions: newSingleSelectOptions })
    await nextTick()

    expect(wrapper.findComponent(Treeselect).props('options')).toEqual(newSingleSelectOptions)
  })

  it('Селект должен быть без поиска', () => {
    createComponent({ value: SELECT_OPTIONS[0].id, initialOptions: SELECT_OPTIONS })
    expect(wrapper.findComponent(Treeselect).props('searchable')).toBe(false)
  })

  it('Передаем в treeselect свой плейсхолдер', () => {
    const PLACEHOLDER = 'placeholder'
    createComponent({
      value: SELECT_OPTIONS[0].id,
      initialOptions: SELECT_OPTIONS,
      placeholder: PLACEHOLDER,
    })
    expect(wrapper.findComponent(Treeselect).props('placeholder')).toBe(PLACEHOLDER)
  })

  it('Передаем в treeselect пропс multiply', () => {
    const multiple = true
    createComponent({ value: [SELECT_OPTIONS[0].id], initialOptions: SELECT_OPTIONS, multiple })
    expect(wrapper.findComponent(Treeselect).props('multiple')).toBe(multiple)
  })

  it('Пропс noOptionsText по умолчанию: Нет доступных вариантов', () => {
    const noOptionsTextDefault = 'Нет доступных вариантов'
    createComponent({ value: [SELECT_OPTIONS[0].id], initialOptions: SELECT_OPTIONS })
    expect(wrapper.findComponent(Treeselect).props('noOptionsText')).toBe(noOptionsTextDefault)
  })

  it('Передаем в treeselect пропс noOptionsText', () => {
    const noOptionsText = 'noOptionsText'
    createComponent({ value: [SELECT_OPTIONS[0].id], initialOptions: SELECT_OPTIONS, noOptionsText })
    expect(wrapper.findComponent(Treeselect).props('noOptionsText')).toBe(noOptionsText)
  })

  it('Передаем в treeselect пропс value-consists-of="LEAF_PRIORITY"', () => {
    createComponent({ value: SELECT_OPTIONS[0].id, initialOptions: SELECT_OPTIONS })
    expect(wrapper.findComponent(Treeselect).props('valueConsistsOf')).toBe('LEAF_PRIORITY')
  })

  describe('Single-select', () => {
    it('В одиночном селекте не отображается кнопка "выбрать все"', async () => {
      createComponent({
        value: SELECT_OPTIONS[0].id,
        initialOptions: SELECT_OPTIONS,
        multiple: false,
      })
      await selectArrow().trigger('mousedown')

      expect(checkAllButton()).toBeFalsy()
    })

    it('В одиночном селекте не отображается кнопка "очистить"', async () => {
      createComponent({
        value: SELECT_OPTIONS[0].id,
        initialOptions: SELECT_OPTIONS,
        multiple: false,
      })
      await selectArrow().trigger('mousedown')

      expect(clearAllButton()).toBeFalsy()
    })
  })

  describe('Мультиселект', () => {
    it('Отображает выбранные значения в виде компонента STag', () => {
      const multiSelectValue = SELECT_OPTIONS.map((option) => option.id)
      createComponent({ value: multiSelectValue, initialOptions: SELECT_OPTIONS, multiple: true })

      wrapper
        .find(MULTISELECT_VALUE_SELECTOR)
        .findAllComponents(STag)
        .wrappers.forEach((option, idx) => {
          expect(option.text()).toBe(SELECT_OPTIONS[idx].label)
        })
    })

    it('В мультиселекте отображается кнопка "выбрать все"', async () => {
      const multiSelectValue = SELECT_OPTIONS.map((option) => option.id)
      createComponent({ value: multiSelectValue, initialOptions: SELECT_OPTIONS, multiple: true })
      await selectArrow().trigger('mousedown')

      expect(checkAllButton().exists).toBeTruthy()
    })

    it('В мультиселекте отображается кнопка "очистить"', async () => {
      const multiSelectValue = SELECT_OPTIONS.map((option) => option.id)
      createComponent({ value: multiSelectValue, initialOptions: SELECT_OPTIONS, multiple: true })
      await selectArrow().trigger('mousedown')

      expect(clearAllButton().exists).toBeTruthy()
    })

    it('По клику на кнопку "выбрать все", выбираем все значения', async () => {
      const SELECT_OPTIONS_BRANCHED = [
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
      ]
      const SELECT_VALUE_FROM_BRANCH = [3, 5, 2]

      createComponent({ value: [], initialOptions: SELECT_OPTIONS_BRANCHED, multiple: true })
      await selectArrow().trigger('mousedown')
      await checkAllButton().trigger('click')
      expect(wrapper.emitted('check-all')[0][0]).toEqual(SELECT_VALUE_FROM_BRANCH)
    })

    it('По клику на кнопку "очистить", удаляем значение', async () => {
      const multiSelectValue = SELECT_OPTIONS.map((option) => option.id)
      createComponent({ value: multiSelectValue, initialOptions: SELECT_OPTIONS, multiple: true })

      await selectArrow().trigger('mousedown')
      await clearAllButton().trigger('click')

      expect(wrapper.emitted('clear')[0][0]).toEqual([])
    })

    it('По клику на кнопку опцию, удаляем опцию из значения', async () => {
      const multiSelectValue = SELECT_OPTIONS.map((option) => option.id)
      createComponent({ value: multiSelectValue, initialOptions: SELECT_OPTIONS, multiple: true })

      const deletedOptionFromValue = SELECT_OPTIONS[0]
      const firstOptionFromValue = wrapper
        .findAll(MULTISELECT_LABEL_SELECTOR)
        .wrappers.find((option) => option.text() === deletedOptionFromValue.label)
      await firstOptionFromValue.trigger('mousedown')
      const newValue = multiSelectValue.filter((id) => id !== deletedOptionFromValue.id)

      expect(wrapper.emitted('input')[0][0]).toEqual(newValue)
    })
  })
})

// TODO: Не написаны тесты для вставки html в опции и значение, disabled, отключение деселекта по нажатию на значение
