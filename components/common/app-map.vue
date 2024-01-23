<template>
  <div style="position: relative; overflow: hidden">
    <a
      href="https://yandex.ru/maps/7/kostroma/?utm_medium=mapframe&utm_source=maps"
      style="color: #eee; font-size: 12px; position: absolute; top: 0px"
      >Кострома</a
    ><a
      href="https://yandex.ru/maps/7/kostroma/?ll=40.849311%2C57.739332&mode=usermaps&source=constructorLink&um=constructor%3A5248a0b74c54fb083e3c3329cf60e16edbf9b2228586c81cae648e631c7db254&utm_medium=mapframe&utm_source=maps&z=17"
      style="color: #eee; font-size: 12px; position: absolute; top: 14px"
      >Яндекс Карты — транспорт, навигация, поиск мест</a
    ><iframe
      class="iframe-map"
      src="https://yandex.ru/map-widget/v1/?ll=40.849311%2C57.739332&mode=usermaps&source=constructorLink&um=constructor%3A5248a0b74c54fb083e3c3329cf60e16edbf9b2228586c81cae648e631c7db254&z=17"
      frameborder="1"
      allowfullscreen="true"
      style="position: relative"
    ></iframe>
  </div>
</template>

<style lang="scss">
.iframe-map {
  width: 100%;
  height: 320px;

  @media (min-width: theme('screens.md')) {
    height: 420px;
  }

  @media (min-width: theme('screens.xl')) {
    height: 460px;
  }
}
</style>
