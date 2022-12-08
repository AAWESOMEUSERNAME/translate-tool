import { Button, Form, Input, message, Modal, Upload } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import React, { useState } from "react";
import dao from "renderer/utils/dao";
import type { RcFile, UploadFile } from 'antd/es/upload/interface';

const { Item } = Form

export type ArticleEditProps = {
  repoId: string,
  article?: Partial<DTO.ArticleInfo>
  onClose: () => void
}

const ArticleEditModal: React.FC<ArticleEditProps> = ({ article, repoId, onClose }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const FORM_ID = 'article-edit-form'
  const isCreate = article?.id === undefined

  return <Modal closable={false} open footer={<div>
    <Button onClick={onClose}>取消</Button>
    <Button form={FORM_ID} key='submit' htmlType="submit">提交</Button>
  </div>}>
    <Form id={FORM_ID}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      initialValues={article}
      autoComplete="off"
      onFinish={(v) => {
        console.log(fileList);

        const content = v.content
        const ps = content?.split('\n')
        dao.article.save({
          id: v.id,
          name: v.name,
          paragraphes: ps,
          description: v.description,
          repoId,
          coverPath: fileList[0]?.url
        }).then(() => {
          message.success('保存成功')
          onClose()
        }).catch(e => {
          console.error(e);
          message.error('保存失败')
        })
      }}
    >
      <Item label='id' name='id' style={{ display: 'none' }}>
        <Input />
      </Item>
      <Item label='文章名' name='name' rules={[{ required: true, message: '文章名不能为空' }]} >
        <Input />
      </Item>
      <Item label='描述' name='description' >
        <Input.TextArea />
      </Item>
      {isCreate && <Item label='内容' name='content' rules={[{ required: true, message: '文章内容不能为空' }]} >
        <Input.TextArea rows={10} />
      </Item>}
      <Item label="封面" valuePropName="fileList">
        <Upload action="/upload.do" maxCount={1} fileList={fileList} listType="picture-card"
          onRemove={() => {
            setFileList([])
          }}
          customRequest={(opt) => {
            const file = opt.file as RcFile
            setFileList([{ ...file, url: file.path, thumbUrl: file.path }])
            console.log(opt);
          }}>
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>上传</div>
          </div>
        </Upload>
      </Item>
    </Form>
  </Modal>
}

export default ArticleEditModal
