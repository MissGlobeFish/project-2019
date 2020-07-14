import defaultSettings from '@/settings'

const title = defaultSettings.title || 'integrated surveillance manage'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
