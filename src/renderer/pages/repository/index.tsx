import { Button, Divider, Dropdown, List, Menu, Modal, Popover, Space, Typography } from "antd"
import React, { useEffect, useState } from "react"
import Page from "renderer/components/Page"
import { loadAllRepo, useRepoList } from "renderer/redux/slice/modelSlice"
import { SettingOutlined, FileDoneOutlined, FileSyncOutlined } from '@ant-design/icons';
import { PAGE } from "renderer/constants/path"
import styles from "./index.module.scss"
import { useAppDispatch } from "renderer/utils/hooks";
import { NavLink } from "react-router-dom";
import RepositoryEditModal from "./RepositoryEditModal";
import _dao from "renderer/utils/dao";

const { Title } = Typography

enum RepoOperation {
  ADD = 'ADD',
  EDIT = 'EDIT',
  MERGE = 'MERGE',
  EXPORT = 'EXPORT',
  DELETE = 'DELETE'
}
const RepoOperateMenu: React.FC<{
  onOperate: (type: RepoOperation) => void
}> = ({
  onOperate
}) => {
    return <Menu items={[
      { label: '编辑', key: RepoOperation.EDIT },
      { label: '合并', key: RepoOperation.MERGE, disabled: true },
      { label: '导出', key: RepoOperation.EXPORT, disabled: true },
      { label: '删除', key: RepoOperation.DELETE, danger: true },
    ]} onClick={({ key }) => { onOperate(key as RepoOperation) }} />
  }

export const RepositoryList: React.FC = () => {
  const dispatch = useAppDispatch()
  const repoList = useRepoList()
  const [operating, setOperating] = useState<{ type: RepoOperation, repo: Partial<DTO.RepositoryInfo> } | null>(null)
  useEffect(() => {
    dispatch(loadAllRepo())
  }, [])


  return <Page>
    <div className={styles.container}>
      <div className={styles.title}>
        <Title>所有仓库</Title>
        <Button type="primary" onClick={() => setOperating({ type: RepoOperation.ADD, repo: {} })}>新建仓库</Button>
      </div>
      <Divider />
      <List
        className={styles.list}
        itemLayout="vertical"
        size="large"
        pagination={false}
        dataSource={repoList.data}
        renderItem={item => (
          <List.Item
            key={item.id}
            extra={<Dropdown placement='bottomLeft' overlay={<RepoOperateMenu onOperate={(type) => { setOperating({ type, repo: item }) }} />}
              trigger={['click']} >
              <SettingOutlined style={{ fontSize: 16 }} />
            </Dropdown>}
          >
            <List.Item.Meta
              title={<NavLink to={PAGE.ARTICLE} state={{ repositoryId: item.id }}>{item.name}</NavLink>}
              description={<Space size={'large'}>
                <Space>
                  <span>文章总数</span>
                  <span>123</span>
                </Space>
                <Space>
                  <span>未完成数</span>
                  <span>123</span>
                </Space>
              </Space>
              }
            />
            {item.description}
          </List.Item>
        )}
      />
    </div>
    {operating && (operating.type === RepoOperation.EDIT || operating.type === RepoOperation.ADD) ?
      <RepositoryEditModal repo={operating.repo} onClose={() => setOperating(null)} /> : <></>}
    {operating && operating.type === RepoOperation.DELETE ?
      <Modal open okType="danger" title='删除项目'
        onCancel={() => setOperating(null)}
        onOk={() => {
          setOperating(null)
          operating.repo.id !== undefined && _dao.repo.remove(operating.repo.id)
        }}>
        确定删除以下项目?<br /> {operating.repo.name}
      </Modal> : <></>}
  </Page>
}

export default RepositoryList
