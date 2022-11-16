import {
  LoadingOutlined
} from '@ant-design/icons'
import { Input, Tabs, Typography } from "antd"
import TextArea from "antd/lib/input/TextArea"
import React, { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { LoadingMask } from "renderer/components/Mask"
import Page from "renderer/components/Page"
import _dao from "renderer/utils/dao"
import styles from "./index.module.scss"
const { Title, Text } = Typography

const TagEditor: React.FC<{ origin: string, onSave: (newTag: string) => void }> = ({ origin, onSave }) => {
  const [value, setValue] = useState(origin)
  return <Input autoFocus defaultValue={value}
    onKeyDown={(e) => {
      if (e.key.toLocaleLowerCase() === 'enter') {
        onSave(value)
        e.stopPropagation()
      }
    }}
    onChange={(e) => {
      setValue(e.target.value)
    }}
    onBlur={() => {
      onSave(value)
    }}
  />
}

const TranslateArea: React.FC<{ tag: string, content?: string, onSave?: (text: string) => void }> = ({ tag, content, onSave }) => {
  const [value, setValue] = useState<string>()

  useEffect(() => {
    setValue(content)
  }, [tag, content])

  return <TextArea value={value} onChange={(e) => setValue(e.target.value)} onBlur={(e) => {
    onSave && onSave(e.target.value || '')
  }} />
}

export type TranslatePageProps = {}

const TranslatePage: React.FC<TranslatePageProps> = (props) => {
  const [loading, setLoading] = useState(false)
  const [article, setArticle] = useState<Model.Article>()
  const tags = article?.translationTags || []
  const [currentTag, setCurrentTag] = useState<string>(tags[0])
  const [saveLoading, setSaveLoading] = useState(false)
  const [edittingTag, setEdittingTag] = useState<string | null>(null)

  const navigate = useNavigate()
  const { state } = useLocation()
  const { id } = state

  const paragraphes = article?.paragraphes || []
  const gridElements: React.ReactNode[] = paragraphes.flatMap(p => {
    return [
      <div key={p.id} className={styles.cell}>{p.content}</div>,
      <TranslateArea key={p.id + 'trans'} tag={currentTag} content={p.translation.find(t => t.tag === currentTag)?.content} onSave={(text) => {
        setSaveLoading(true)
        _dao.paragraph.saveTranslation(p.id, text).finally(() => {
          try {
            setSaveLoading(false)
          } catch (error) {
            console.warn(error)
          }
        })
      }} />
    ]
  })

  const refresh = () => {
    loadArticle(id)
  }

  const loadArticle = (id: number) => {
    _dao.article.detail(id)
      .then(res => setArticle(res))
      .catch(e => console.error(e))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadArticle(id)
  }, [id])

  return <Page>
    {loading ?
      <LoadingMask /> :
      <div className={styles.container}>
        <div className={styles.title}>
          <Title>{article?.name}<LoadingOutlined hidden={!saveLoading} className={styles.saveLoading} /></Title>
          <Text>
            {article?.description}
          </Text>
        </div>
        <div className={styles.toolbar}>
          <div className={styles.operate}>
            <a onClick={() => navigate(-1)}>返回</a>
          </div>
          <Tabs className={styles.tab} activeKey={currentTag} type="editable-card"
            onEdit={(e, action) => {
              if (!article) return
              if (action === 'add') {
                _dao.article.addTranslateTag(article.id)
              } else {
                _dao.article.removeTranslateTag(article.id, e.toString())
              }
            }}
            items={tags.map((v, i, arr) => ({
              label: edittingTag === v ?
                <TagEditor origin={v} onSave={(newTag) => {
                  setEdittingTag(null)
                  _dao.article.renameTranslateTag(v, newTag).finally(() => refresh())
                }} /> :
                <div onDoubleClick={() => setEdittingTag(v)}>{v}</div>,
              key: v,
              closable: true,
            }))}
            onChange={k => setCurrentTag(k)}
          />
        </div>
        <div className={styles.grid}>
          {gridElements}
        </div>
      </div>
    }
  </Page>
}

export default TranslatePage
