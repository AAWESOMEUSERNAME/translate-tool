import { Spin } from "antd"
import React from "react"
import styles from "./index.module.scss"

export const LoadingMask: React.FC = () => {
  return <Mask>
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spin />
    </div>
  </Mask>
}

const Mask: React.FC<{ children: React.ReactNode, onClick?: () => void }> = (props) => {
  return <div className={styles.mask} onClick={props.onClick}>{props.children}</div>
}

export default Mask
