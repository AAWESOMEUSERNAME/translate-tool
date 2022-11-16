import { Button, Col, Form, Input, message, Modal, Row, Upload } from "antd"
import React, { useState } from "react"
import _dao from "renderer/utils/dao"
import { PlusOutlined } from '@ant-design/icons';
import styles from "./ArticleEditModal.module.scss"

const { Item } = Form

export type ArticleEditProps = {
  article: Partial<DTO.ArticleInfo>
  onClose: () => void
}

const ArticleEditModal: React.FC<ArticleEditProps> = ({ article, onClose }) => {
  const FORM_ID = 'article-edit-form'

  return <Modal closable={false} open footer={<div>
    <Button onClick={onClose}>取消</Button>
    <Button form={FORM_ID} key='submit' htmlType="submit">提交</Button>
  </div>}>
    <Form id={FORM_ID}
      name={'basic'}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      initialValues={article}
      autoComplete="off"
      onFinish={(v) => {
        _dao.article.save(v)
          .then(() => {
            message.success('保存成功')
            onClose()
          })
          .catch(e => {
            console.error(e);
            message.error('保存失败')
          })
      }}
    >
      <Item hidden name='id' />
      <Item label='文章名' name='name' rules={[{ required: true, message: '文章名不能为空' }]} >
        <Input />
      </Item>
      <Item label='描述' name='description' >
        <Input.TextArea />
      </Item>
      {/* <Item label="封面" valuePropName="fileList">
        <Upload action="/upload.do" listType="picture-card" customRequest={(opt) => {
          console.log(opt);
        }}>
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>上传</div>
          </div>
        </Upload>
      </Item> */}
    </Form>
  </Modal>
}

export default ArticleEditModal
