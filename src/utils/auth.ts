export const signInGithub = () =>
  window.open(`https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}`)

export const signout = () => {
  localStorage.removeItem('access_token')
  location.reload()
}