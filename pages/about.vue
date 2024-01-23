<template>
  <main class="container">
    <div class="pt-4 md:pt-10 xl:pt-8">
      <h1 class="text-h1 text-center mb-4 md:mb-8 xl:mb-12">О компании</h1>
      <div class="about">
        <div class="grid-about">
          <div class="grid-about__photo">
            <picture>
              <source
                type="image/avif"
                srcset="~/assets/img/about/about.avif 440w, ~/assets/img/about/about--x2.avif 880w"
                sizes="440px"
              />
              <source
                type="image/webp"
                srcset="~/assets/img/about/about.webp 440w, ~/assets/img/about/about--x2.webp 880w"
                sizes="440px"
              />
              <img src="~/assets/img/about/about.jpg" />
            </picture>
          </div>
          <div class="mb-6 md:mb-8 xl:mb-9">
            <p class="text-h4 mb-7 md:mb-8 xl:mb-9">
              Компания EFREMOV успешно работает на рынке ювелирных изделий уже более 10 лет. За это
              время мы зарекомендовали себя как надежная команда профессионалов.
            </p>
            <p class="text-h4">
              Своими ювелирными украшениями мы сумели покорить сердца покупателей по всей России.
            </p>
          </div>
          <div class="order-2">
            <p class="text-main mb-6 xl:mb-7">
              EFREMOV постоянно совершенствует технологии производства. Каждая деталь создаётся с
              вниманием и заботой, начиная от художников и до мастеров-ювелиров. Все изделия
              отвечают европейской моде.
            </p>
            <p class="text-main">
              Постоянно пополняемый ассортимент — свыше 20 000 изделий — представлен в 2500
              магазинах от Калининграда до Владивостока.
            </p>
          </div>
        </div>
        <div class="md:flex md:mb-14 xl:mb:16">
          <div class="about__photo">
            <picture>
              <source
                type="image/avif"
                srcset="
                  ~/assets/img/about/about-1.avif      600w,
                  ~/assets/img/about/about-1--x2.avif 1200w
                "
                sizes="600px"
              />
              <source
                type="image/webp"
                srcset="
                  ~/assets/img/about/about-1.webp      600w,
                  ~/assets/img/about/about-1--x2.webp 1200w
                "
                sizes="600px"
              />
              <img src="~/assets/img/about/about-1.jpg" />
            </picture>
          </div>
          <div class="mb-10 md:order-0 md:mb-0">
            <IconLongEfremov class="logo-about" />
            <p class="text-main mb-6 md:mb-7 xl:mb-8">
              EFREMOV — современный ювелирный бренд, история которого началась в 2008 году. С 2012
              года компания входит в ТОП-5 лидеров производителей украшений России.
            </p>
            <p class="text-main">
              EFREMOV является надежным и профессиональным партнером для множества компаний по всей
              России и рад сотрудничеству с Вами!
            </p>
          </div>
        </div>
      </div>
      <section class="contacts-section">
        <div class="contacts-section__contacts contacts">
          <h2 class="text-h2 text-main-sugar mb-3 xl:mb-4">Контакты</h2>
          <div class="contacts__content">
            <address class="text-h5 text-main-marzipan">
              156001, г. Кострома,<br class="xl:hidden" />
              ул. Московская, 105
            </address>
            <a
              class="text-h5 text-main-sugar hover:text-main-nuga transition"
              href="tel:+74942425311"
              >+7 (4942) 42-53-11</a
            >
            <a
              class="text-h5 text-main-sugar hover:text-main-nuga transition"
              href="mailto:info@efremov.gold"
              >info@efremov.gold</a
            >
          </div>
        </div>
        <AppMap />
      </section>
    </div>
  </main>
</template>

<script>
import { IconLongEfremov } from '~/components/icons'
import AppMap from '~/components/common/app-map.vue'

export default {
  components: {
    IconLongEfremov,
    AppMap,
  },
}
</script>

<style lang="scss">
.about {
  margin: 0 auto;
  @media (min-width: theme('screens.xl')) {
    max-width: 1008px;
  }

  &__photo {
    width: 300px;
    margin: 0 auto 32px auto;
    @media (min-width: theme('screens.md')) {
      width: 424px;
      flex: 0 0 424px;
      order: 1;
      margin: 0 0 0 24px;
    }
    @media (min-width: theme('screens.xl')) {
      width: 600px;
      flex: 0 0 600px;
      margin: 0 0 0 40px;
    }
  }
}

.grid-about {
  display: grid;
  grid-template-columns: 1fr;
  align-items: start;
  margin-bottom: 32px;
  @media (min-width: theme('screens.md')) {
    grid-template-rows: auto 1fr;
    grid-template-columns: 400px 1fr;
    grid-column-gap: 24px;
    margin-bottom: 56px;
  }

  @media (min-width: theme('screens.xl')) {
    grid-column-gap: 62px;
    grid-template-columns: 440px 1fr;
    margin-bottom: 64px;
  }

  &__photo {
    order: 1;
    display: flex;
    justify-content: center;
    margin-bottom: 32px;

    @media (min-width: theme('screens.md')) {
      order: initial;
      grid-row: span 2;
      margin-bottom: 0;
    }

    img {
      max-width: 300px;

      @media (min-width: theme('screens.md')) {
        max-width: 100%;
      }
    }
  }
}

.logo-about {
  width: 194px;
  margin-bottom: 28px;
}

.contacts-section {
  position: relative;
  margin: 0 -10px;

  @media (min-width: theme('screens.md')) {
    margin: 0 -20px;
  }

  @media (min-width: theme('screens.xl')) {
    margin: 0 -40px;
  }

  &__contacts {
    z-index: 1;

    @media (min-width: theme('screens.md')) {
      position: absolute;
      top: 110px;
      left: 80px;
    }

    @media (min-width: theme('screens.xl')) {
      top: 130px;
      left: 140px;
    }
  }
}

.contacts {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: theme('colors.main.chocolate');
  padding: 20px 34px;

  @media (min-width: theme('screens.md')) {
    display: block;
    text-align: initial;
    padding: 20px 30px;
  }

  @media (min-width: theme('screens.xl')) {
    padding: 30px 40px;
  }

  &__content {
    display: flex;
    flex-direction: column;
  }
}
</style>
