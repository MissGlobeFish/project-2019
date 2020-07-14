import defaultSettings from '@/settings'

const title = defaultSettings.title || '旺小宝RPA'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
