import moment from 'moment'

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'
export const dateToStr = (date: moment.Moment) => date.format(DATE_FORMAT)
export const strToDate = (str: string) => moment(str, DATE_FORMAT)
