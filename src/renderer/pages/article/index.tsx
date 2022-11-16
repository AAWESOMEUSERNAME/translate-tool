import { Button, Divider, Empty, message, Modal, Space, Typography } from "antd"
import React, { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Page from "renderer/components/Page"
import { useRepoList } from "renderer/redux/slice/modelSlice"
import ArticleCard from "./ArticleCard"
import styles from "./index.module.scss"
import { RollbackOutlined } from '@ant-design/icons';
import { PAGE } from "renderer/constants/path"
import ArticleEditModal from "./ArticleEditModal"
import ArticleExportModal from "./ArticleExportModal"
import _dao from "renderer/utils/dao"
const { Title } = Typography

export type ArticleListProps = {}

const ArticleList: React.FC<ArticleListProps> = (props) => {
  const { state } = useLocation()
  const { repositoryId } = state
  const currentRepo = useRepoList().data.find(repo => repo.id === repositoryId)
  const navigate = useNavigate()
  const articles = currentRepo?.articles || []

  const [edittingArticle, setEdittingArticle] = useState<Partial<DTO.ArticleInfo> | null>()
  const [operating, setOperating] = useState<{ id: number, name: string, type: 'delete' | 'export' } | null>(null)
  const [waitting, setWaitting] = useState(false)

  return <Page>
    <div className={styles.container}>
      <div className={styles.title}>
        <Title>{currentRepo?.name}</Title>
        <Space>
          <Button onClick={() => navigate(PAGE.REPO)}>返回仓库列表</Button>
          <Button type="primary" onClick={() => setEdittingArticle({})}>添加文章</Button>
        </Space>
      </div>
      <Divider />
      <div className={styles.grid}>
        {articles.length === 0 && <Empty />}
        {articles.length > 0 && articles.map(a =>
          <ArticleCard key={a.id} {...a}
            onEdit={() => setEdittingArticle(a)}
            onExport={() => setOperating({ id: a.id, name: a.name, type: 'export' })}
            onDelete={() => setOperating({ id: a.id, name: a.name, type: 'delete' })}
          />)}
      </div>
    </div>
    {edittingArticle && <ArticleEditModal article={edittingArticle} onClose={() => setEdittingArticle(null)} />}
    {operating !== null && operating.type === 'export' && <ArticleExportModal id={operating.id} name={operating.name} onClose={() => setOperating(null)} />}
    {operating !== null && operating.type === 'delete' &&
      <Modal open
        title={'删除文章'}
        onCancel={() => setOperating(null)}
        okType='danger'
        okButtonProps={{
          loading: waitting
        }}
        onOk={() => {
          setWaitting(true)
          _dao.article.remove(operating.id).then(() => {
            message.success('删除成功')
            setOperating(null)
          }).catch(e => {
            console.error(e);
            message.error('删除失败')
          }).finally(() => setWaitting(false))
        }}
      >
        确认删除以下文章?<br />
        {operating.name}
      </Modal>}
  </Page>
}

export default ArticleList
