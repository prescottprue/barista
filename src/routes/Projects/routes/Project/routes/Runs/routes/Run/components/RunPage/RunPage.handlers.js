export function goBack({ router, runsPagePath }) {
  return () => {
    router.push(runsPagePath)
  }
}
