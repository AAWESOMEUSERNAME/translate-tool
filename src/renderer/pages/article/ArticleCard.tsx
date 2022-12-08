import { Button, Card, Progress, Space } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Mask from "renderer/components/Mask";
import { PAGE } from "renderer/constants/path";
import styles from "./ArticleCard.module.scss";


const { Meta } = Card;
export type ArticleCardProps = DTO.ArticleInfo & {
  onEdit: () => void
  onExport: () => void
  onDelete: () => void
}

const ArticleCard: React.FC<ArticleCardProps> = ({ id, name, description, coverPath, progress, createdTime, updatedTime, onEdit, onExport,onDelete }) => {
  const [showMenu, setShowMenu] = useState(false)

  console.log('progress', progress);


  return <div className={styles.container}>
    {showMenu && <Mask onClick={() => setShowMenu(false)}>
      <div className={styles.mask__menu}>
        <Button className={styles.mask__menu__item} type='primary' shape='circle'>
          <Link to={PAGE.TRANSLATE} state={{ id }}>继续</Link>
        </Button>
        <Button className={styles.mask__menu__item} type='primary' shape='circle' onClick={() => onEdit()}>编辑</Button>
        <Button className={styles.mask__menu__item} type='primary' shape='circle' onClick={() => onExport()}>导出</Button>
        <Button className={styles.mask__menu__item} type='primary' shape='circle' disabled>合并</Button>
        <Button className={styles.mask__menu__item} type='primary' shape='circle' disabled>定稿</Button>
        <Button className={styles.mask__menu__item} type='primary' danger shape='circle' onClick={() => onDelete()}>删除</Button>
      </div>
    </Mask>}
    <Card
      hoverable
      cover={<div className={styles.cover} style={coverPath ? { backgroundImage: `url(file://${coverPath.replaceAll('\\','/')})` } : undefined} />}
      onClick={(e) => {
        setShowMenu(true)
      }}
    >
      <Meta className={styles.meta} title={name} description={<div >
        <Space><span>创建时间</span><span>{createdTime}</span></Space>
        <Space><span>更新时间</span><span>{updatedTime}</span></Space>
      </div>} />
      <Progress className={styles.progress} percent={progress} />
      {description}
    </Card>
  </div>
}

export default ArticleCard
