import { Button, message, Modal, Space } from "antd"
import React, { useEffect, useState } from "react"
import dao from "renderer/utils/dao"
import styles from "./ArticleExportModal.module.scss"

export type ArticleExportModalProps = {
  id: number
  name: string
  onClose: () => void
}

const ArticleExportModal: React.FC<ArticleExportModalProps> = ({ id, name, onClose }) => {
  const [tags, setTags] = useState<string[]>([])

  useEffect(() => {
    dao.translation.listTag(id)
      .then(tags => setTags(tags))
      .catch(e => {
        console.error('error load article tags', e);
      })
  }, [id])

  const exportArticle = (type: DTO.ArticleExportType) => {
    if (!tags[0]) {
      message.error('未选择有效的标签')
      return
    }
    dao.article.export({ id, tag: tags[0], type })
      .then(() => {
        message.success('导出成功')
        onClose()
      })
      .catch(e => {
        console.error(e);
        message.error('导出失败')
      })
  }

  return <Modal open title={name} closeIcon={<></>} footer={null} onCancel={onClose}>
    <div className={styles.container}>
      {/* <Button onClick={() => exportArticle('database')}>
        导出数据库
      </Button> */}
      <Button onClick={() => exportArticle('raw')}>
        导出原文
      </Button>
      <Button onClick={() => exportArticle('raw_translated')}>
        导出双语
      </Button>
      <Button onClick={() => exportArticle('translated')}>
        导出译文
      </Button>
    </div>
  </Modal>
}

export default ArticleExportModal
