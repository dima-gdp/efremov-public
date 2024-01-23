import Auth from '~/domain/auth'

export default async function ({ store, req, res }) {
  try {
    const authService = new Auth(store)
    await authService.authServer(req.headers.cookie, () => {
      res.setHeader('Set-Cookie', Auth.deleteAuthCookieByServer())
    })
  } catch (e) {
    console.error(e)
  }
}
