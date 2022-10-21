import { Button } from "antd"
import React, { useEffect } from "react"
import Page from "renderer/components/Page"
import styles from "./index.module.scss"

export type HomeProps = {}

const Home: React.FC<HomeProps> = (props) => {
  useEffect(() => {

  }, [])

  return <Page>
    <a href="/">打开项目</a>
    <a href="/">新建项目</a>
    <Button>测试</Button>

  </Page>
}

export default Home
