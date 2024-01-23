export default function redirectAlreadyLoggedIn({ store, redirect }) {
  if (store.state.user.isLoggedIn) {
    console.info('[already-auth]: перенаправление уже авторизованного пользователя в каталог')
    redirect('/catalog')
  }
}
