import React, { ReactNode } from "react"
import styles from "./index.module.scss"

export type PageProps = {
  children: ReactNode
}

const Page: React.FC<PageProps> = (props) => {
  return <div className={styles.container}>{props.children}</div>
}

export default Page
