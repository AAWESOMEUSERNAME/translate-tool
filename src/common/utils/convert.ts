const SEPERATOR = ','
export const toTagArr = (tags: string) => tags.split(SEPERATOR)
export const toTagStr = (tags: string[]) => tags.join(SEPERATOR)
