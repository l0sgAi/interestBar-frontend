import { useI18n } from 'vue-i18n'

export const useFormatTime = () => {
  const { t } = useI18n()

  const formatTime = (timestamp) => {
    if (!timestamp) return ''

    const now = Date.now()
    const time = new Date(timestamp).getTime()
    const diff = now - time

    // 小于1分钟
    if (diff < 60000) {
      return t('time.justNow')
    }

    // 小于1小时
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000)
      return t('time.minutesAgo', { minutes })
    }

    // 小于1天
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000)
      return t('time.hoursAgo', { hours })
    }

    // 小于30天
    if (diff < 2592000000) {
      const days = Math.floor(diff / 86400000)
      return t('time.daysAgo', { days })
    }

    // 超过30天显示具体日期
    return new Date(time).toLocaleDateString()
  }

  return { formatTime }
}
