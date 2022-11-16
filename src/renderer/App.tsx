import { MemoryRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import './App.css';
import RepositoryList from './pages/repository';
import { Provider } from 'react-redux';
import TranslatePage from './pages/translate';
import { store } from './redux/store';
import { PAGE } from './constants/path';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import ArticleList from './pages/article';
import { ReactNode, useEffect } from 'react';

window.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})

const DebugRouter: React.FC = () => {
  const location = useLocation()
  useEffect(() => {
    console.log(location.pathname, location.state);
  }, [location])

  return <>
    <Outlet />
  </>
}

export default function App() {
  return (
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
        <Router>
          <Routes>
            <Route path='/' element={<DebugRouter />}>
              <Route path={PAGE.ARTICLE} element={<ArticleList />} />
              <Route path={PAGE.REPO} element={<RepositoryList />} />
              <Route path={PAGE.TRANSLATE} element={<TranslatePage />} />
              <Route path='/' element={<Navigate to={PAGE.REPO} />} />
            </Route>
          </Routes>
        </Router>
      </ConfigProvider>
    </Provider>
  );
}
