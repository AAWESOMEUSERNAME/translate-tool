import {
  LoadingOutlined
} from '@ant-design/icons'
import { Button, Input, message, Tabs, Typography } from "antd"
import TextArea from "antd/lib/input/TextArea"
import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { LoadingMask } from "renderer/components/Mask"
import Page from "renderer/components/Page"
import dao from "renderer/utils/dao"
import styles from "./index.module.scss"
import ParagraphEditModal from './ParagraphEditModal'
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
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState<string>(tags[0])
  const [saveLoading, setSaveLoading] = useState(false)
  const [edittingTag, setEdittingTag] = useState<string | null>(null)
  const [showParagraphEdit, setShowParagraphEdit] = useState(false)

  const navigate = useNavigate()
  const { state } = useLocation()
  const { id } = state

  const paragraphes = article?.paragraphes || []
  const gridElements: React.ReactNode[] = paragraphes.flatMap(p => {
    return [
      <div key={p.id} className={styles.cell}>{p.content}</div>,
      <TranslateArea key={p.id + 'trans'} tag={currentTag} content={p.translation.find(t => t.tag === currentTag)?.content} onSave={(text) => {
        if (!article) return
        setSaveLoading(true)
        dao.translation.save({
          articleId: article.id,
          paragraphId: p.id,
          tag: currentTag,
          content: text
        }).finally(() => {
          setSaveLoading(false)
        })
      }} />
    ]
  })

  const refresh = () => {
    loadArticle(id)
  }

  const loadArticle = (id: number) => {
    Promise.all([
      dao.article.detail(id),
      dao.translation.listTag(id)
    ]).then(([article, tags]) => {
      setArticle(article)
      setTags(tags)
      setCurrentTag(tags[0])
    }).catch(e =>
      console.error(e)
    ).finally(() =>
      setLoading(false)
    )
  }

  useEffect(() => {
    loadArticle(id)
  }, [id])

  return <Page>
    {loading ?
      <LoadingMask /> :
      <div className={styles.container}>
        {showParagraphEdit && article && <ParagraphEditModal articleId={article.id} onClose={() => {
          setShowParagraphEdit(false)
          refresh()
        }} />}
        <div className={styles.title}>
          <Title>{article?.name}<LoadingOutlined hidden={!saveLoading} className={styles.saveLoading} /></Title>
          <Text>
            {article?.description}
          </Text>
        </div>
        <div className={styles.toolbar}>
          <div className={styles.operate}>
            <a onClick={() => navigate(-1)}>返回</a>
            <Button type='link' onClick={() => setShowParagraphEdit(true)}>编辑原文</Button>
          </div>
          <Tabs className={styles.tab} activeKey={currentTag}
            type='card'
            // type="editable-card"
            // onEdit={(e, action) => {
            //   if (!article) return
            //   const oldTags = article.translationTags
            //   const newTags: string[] = []

            //   if (action === 'add') {
            //     let newTag = '新标签'
            //     while (oldTags.includes(newTag)) {
            //       newTag = newTag + '\''
            //     }
            //     newTags.push(...oldTags, newTag)
            //   } else { // remove
            //     newTags.push(...oldTags.filter(t => t !== e.toString()))
            //   }

            //   dao.article.save({
            //     id: article.id,
            //     translationTags: newTags
            //   }).finally(() => refresh())
            // }}
            items={tags.map((v, i, arr) => ({
              label: edittingTag === v ?
                <TagEditor origin={v} onSave={(newTag) => {
                  const originIndex = arr.findIndex(t => t === v)
                  if (!article) return
                  if (originIndex < 0) return

                  setEdittingTag(null)
                  dao.translation.saveTag({
                    articleId: article.id,
                    oldTag: arr[originIndex],
                    newTag: newTag
                  }).then(() => {
                    message.success('保存成功')
                  }).catch(e => {
                    console.error('save tag error', e);
                    message.error('保存失败')
                  }).finally(() =>
                    refresh()
                  )
                }} /> :
                <div onDoubleClick={() => setEdittingTag(v)}>{v}</div>,
              key: v,
              closable: tags.length > 1,
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
