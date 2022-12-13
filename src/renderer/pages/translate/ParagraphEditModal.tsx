import { Button, Input, message, Modal } from "antd"
import React, { useEffect, useState } from "react"
import { BarsOutlined, CloseOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { LoadingMask } from "renderer/components/Mask"
import dao from "renderer/utils/dao"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from "./ParagraphEditModal.module.scss"

const { confirm } = Modal

const Paragraph = ({ p, onDelete }: { p: DTO.ParagraphInfo, onDelete: (id: number) => void }) => {
  const [value, setValue] = useState(p.content)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: p.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return <div className={styles.item} ref={setNodeRef} style={style} {...attributes}>
    <div className={styles.item__bar}>
      <BarsOutlined className={styles.item__bar__move} {...listeners} />
      <div className={styles.item__bar__delete} onClick={() => onDelete(p.id)}>
        <CloseOutlined />
      </div>
    </div>
    <Input.TextArea value={value} rows={4} onChange={(e) => setValue(e.target.value)} onBlur={() => {
      dao.paragraph.save({
        id: p.id,
        text: value,
      })
    }} />
  </div>
}

const ParagraphList = ({ articleId, ps }: { articleId: number, ps: DTO.ParagraphInfo[] }) => {
  const [paragraphes, setParagraphes] = useState(ps)

  useEffect(() => {
    dao.paragraph.reOrder(paragraphes.map((p, i) => ({ id: p.id, newOrderNo: i })))
  }, [paragraphes])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );


  const handleAdd = () => {
    dao.paragraph.save({
      articleId,
      text: '',
    }).then((id) => {
      setParagraphes(paragraphes.concat([{
        id: id,
        content: '',
        orderNo: paragraphes.length,
      }]))
    })
  }

  const handleDelete = (id: number) => {
    confirm({
      title: '删除？',
      content: '确认删除该段落么？',
      icon: <ExclamationCircleFilled />,
      onOk: () => {
        return dao.paragraph.delete(id).then(() => {
          setParagraphes((ps) => {
            const targetIndex = ps.findIndex(p => p.id === id)
            return ps.slice(0, targetIndex).concat(ps.slice(targetIndex + 1))
          })
        })
      }
    })
  }

  return <DndContext
    sensors={sensors}
    collisionDetection={closestCenter}
    onDragEnd={(evt) => {
      const { active, over } = evt;

      if (over && active.id !== over.id) {
        setParagraphes((oldPsArr) => {
          const oldIndex = oldPsArr.findIndex(o => o.id === active.id)
          const newIndex = oldPsArr.findIndex(o => o.id === over.id)
          const newArr = arrayMove(oldPsArr, oldIndex, newIndex)
          return newArr
        })
      }
    }}
  >
    <SortableContext
      items={paragraphes}
      strategy={verticalListSortingStrategy}
    >
      <div className={styles.container}>
        {paragraphes.map(p => <Paragraph key={p.id} p={p} onDelete={(id) => handleDelete(id)} />)}
        <Button block onClick={handleAdd}>添加段落</Button>
      </div>
    </SortableContext>
  </DndContext>
}

export type ParagraphEditModalProps = {
  articleId: number
  onClose: () => void
}

const ParagraphEditModal: React.FC<ParagraphEditModalProps> = ({ articleId, onClose }) => {
  const [article, setArticle] = useState<Model.Article>()
  const [loading, setLoading] = useState(true)
  const paragraphes = article?.paragraphes

  useEffect(() => {
    dao.article.detail(articleId)
      .then(a => setArticle(a))
      .catch(e => message.error('加载文章失败'))
      .finally(() => setLoading(false))
  }, [articleId])


  return <Modal open onCancel={onClose} footer={null} title={null}>
    {loading || !paragraphes ? <LoadingMask /> : <ParagraphList articleId={articleId} ps={paragraphes} />}
  </Modal>
}

export default ParagraphEditModal
