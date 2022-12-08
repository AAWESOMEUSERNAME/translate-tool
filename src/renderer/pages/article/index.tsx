import { Button, Divider, Empty, message, Modal, Space, Typography } from "antd"
import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { LoadingMask } from "renderer/components/Mask"
import Page from "renderer/components/Page"
import { PAGE } from "renderer/constants/path"
import { loadArticles, useArticleList } from "renderer/redux/slice/modelSlice"
import dao from "renderer/utils/dao"
import { useAppDispatch } from "renderer/utils/hooks"
import ArticleCard from "./ArticleCard"
import ArticleEditModal from "./ArticleEditModal"
import ArticleExportModal from "./ArticleExportModal"
import styles from "./index.module.scss"
const { Title } = Typography

export type ArticleListProps = {}

const ArticleList: React.FC<ArticleListProps> = (props) => {
  const { state } = useLocation()
  const { repositoryId, repositoryName } = state
  const navigate = useNavigate()

  const [edittingArticle, setEdittingArticle] = useState<Partial<DTO.ArticleInfo> | null>()
  const [operating, setOperating] = useState<{ id: number, name: string, tags?: string[], type: 'delete' | 'export' } | null>(null)
  const [waitting, setWaitting] = useState(false)

  const dispatch = useAppDispatch()
  const { loading: listLoading, data: articles } = useArticleList()
  console.log('articles', articles);


  const refresh = () => {
    dispatch(loadArticles(repositoryId))
  }

  useEffect(() => {
    dispatch(loadArticles(repositoryId))
  }, [repositoryId])

  return <Page>
    <div className={styles.container}>
      {listLoading && <LoadingMask />}
      <div className={styles.title}>
        <Title>{repositoryName}</Title>
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
    {edittingArticle && <ArticleEditModal repoId={repositoryId} article={edittingArticle} onClose={() => {
      setEdittingArticle(null)
      refresh()
    }} />}
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
          dao.article.remove(operating.id).then(() => {
            message.success('删除成功')
            setOperating(null)
            refresh()
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
