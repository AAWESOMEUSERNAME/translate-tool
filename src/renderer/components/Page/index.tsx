import React from "react"
import styles from "./index.module.scss"

export type PageProps = {
  children: React.ReactElement[] | React.ReactElement | string
}

const Page: React.FC<PageProps> = (props) => {
  return <div className={styles.container}>{props.children}</div>
}

export default Page
