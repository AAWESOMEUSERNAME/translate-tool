import { Button, Form, Input, message, Modal } from "antd"
import React from "react"
import _dao from "renderer/utils/dao"
import styles from "./RepositoryEditModal.module.scss"

const { Item } = Form

export type RepositoryEditModalProps = {
  repo: Partial<DTO.RepositoryInfo>
  onClose: () => void
}

const RepositoryEditModal: React.FC<RepositoryEditModalProps> = ({ repo, onClose }) => {
  const FORM_ID = 'repo_edit_form'

  return <Modal closable={false} open footer={<div>
    <Button onClick={onClose}>取消</Button>
    <Button form={FORM_ID} key='submit' htmlType="submit">提交</Button>
  </div>}>
    <Form id={FORM_ID}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      initialValues={repo}
      autoComplete="off"
      onFinish={(v) => {
        _dao.repo.save(v)
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
      <Item label='项目名' name='name' rules={[{ required: true, message: '项目名不能为空' }]} >
        <Input />
      </Item>
      <Item label='描述' name='description' >
        <Input.TextArea />
      </Item>
    </Form>
  </Modal>
}

export default RepositoryEditModal
