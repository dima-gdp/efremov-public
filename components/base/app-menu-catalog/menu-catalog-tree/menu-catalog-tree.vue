<template>
  <!-- Мобильное дерево -->
  <div v-if="isMobile" class="catalog-tree-mobile">
    <MenuCatalogMobileLink
      :name="category.name"
      :url="category.url"
      :is-soon="category.isSoon"
      :has-children="Boolean(category.customItems.length)"
      @click-button-link="$emit('click-button-link', category.id)"
    />
    <!-- Второй уровень -->
    <div v-if="category.customItems.length && !category.isSoon">
      <SlideUpDown :active="category.id === activeCategory">
        <ul>
          <li
            v-for="catLvl2 in category.customItems"
            :key="catLvl2.id"
            class="catalog-tree-mobile__item"
          >
            <MenuCatalogMobileLink
              :name="catLvl2.name"
              :url="catLvl2.url"
              :is-soon="catLvl2.isSoon"
              :has-children="Boolean(catLvl2.customItems.length)"
              @click-button-link="changeActiveCategory(catLvl2.id)"
            />
            <!-- Третий уровень -->
            <div v-if="catLvl2.customItems.length && !catLvl2.isSoon">
              <SlideUpDown :active="activeSubCategoryId === catLvl2.id">
                <ul>
                  <li v-for="catLvl3 in catLvl2.customItems" :key="catLvl3.id">
                    <MenuCatalogMobileLink
                      :is-soon="catLvl3.isSoon"
                      :name="catLvl3.name"
                      :url="catLvl3.url"
                      :has-children="false"
                    />
                  </li>
                </ul>
              </SlideUpDown>
            </div>
            <!-- Конец третьего уровня -->
          </li>
        </ul>
      </SlideUpDown>
    </div>

    <!-- Конец второго уровня -->
  </div>

  <!-- Десктопное дерево -->
  <div v-else class="catalog-tree-desktop" @mouseover="onMouseOver" @mouseout="onMouseOut">
    <MenuCatalogDesktopLink
      :name="category.name"
      :url="category.url"
      :is-soon="category.isSoon"
      :class="{ 'bg-main-nuga': hoverIds.grandParent === category.id }"
    />
    <!-- Второй уровень -->
    <ul v-if="category.customItems.length && !category.isSoon">
      <li
        v-for="catLvl2 in category.customItems"
        :key="catLvl2.id"
        class="catalog-tree-desktop__item"
      >
        <MenuCatalogDesktopLink
          :name="catLvl2.name"
          :url="catLvl2.url"
          :is-soon="catLvl2.isSoon"
          :data-grand-parent="category.id"
          :class="{ 'bg-main-nuga': hoverIds.parent === catLvl2.id }"
        />
        <!-- Третий уровень -->
        <ul v-if="catLvl2.customItems.length && !catLvl2.isSoon">
          <li v-for="catLvl3 in catLvl2.customItems" :key="catLvl3.id">
            <MenuCatalogDesktopLink
              :name="catLvl3.name"
              :url="catLvl3.url"
              :is-soon="catLvl3.isSoon"
              :data-grand-parent="category.id"
              :data-parent="catLvl2.id"
            />
          </li>
        </ul>
        <!-- Конец третьего уровня -->
      </li>
    </ul>
    <!-- Конец второго уровня -->
  </div>
</template>

<script>
import SlideUpDown from 'vue-slide-up-down'
import MenuCatalogDesktopLink from '~/components/base/app-menu-catalog/menu-catalog-desktop-link.vue'
import MenuCatalogMobileLink from '~/components/base/app-menu-catalog/menu-catalog-mobile-link.vue'

export default {
  components: { MenuCatalogMobileLink, MenuCatalogDesktopLink, SlideUpDown },

  props: {
    category: { type: Object, default: () => ({}), required: false },
    isMobile: { type: Boolean, default: false, required: false },
    activeCategory: { type: String, default: '', required: false },
  },

  data() {
    return {
      activeSubCategoryId: null,
      hoverIds: {
        grandParent: null,
        parent: null,
      },
    }
  },

  methods: {
    changeActiveCategory(id) {
      if (id !== this.activeSubCategoryId) {
        this.activeSubCategoryId = id
      } else {
        this.activeSubCategoryId = ''
      }
    },

    onMouseOver({ target }) {
      const parent = target.closest('[data-parent]')
      const grandParent = target.closest('[data-grand-parent]')
      if (parent) {
        this.hoverIds.parent = parent.dataset.parent
      }
      if (grandParent) {
        this.hoverIds.grandParent = grandParent.dataset.grandParent
      }
    },

    onMouseOut({ relatedTarget }) {
      this.hoverIds.parent = relatedTarget?.dataset?.parent
      this.hoverIds.grandParent = relatedTarget?.dataset?.grandParent
    },
  },
}
</script>

<style lang="scss">
@import 'menu-catalog-tree';
</style>
