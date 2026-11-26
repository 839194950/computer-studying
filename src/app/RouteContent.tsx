import { t } from '../i18n/locale';
import { Component, Suspense, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';

interface BoundaryProps {
  pathname: string;
  children: ReactNode;
}

class RouteErrorBoundary extends Component<BoundaryProps, { failed: boolean; pathname: string }> {
  state = { failed: false, pathname: this.props.pathname };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  static getDerivedStateFromProps(props: BoundaryProps, state: { pathname: string }) {
    return props.pathname !== state.pathname ? { failed: false, pathname: props.pathname } : null;
  }

  render() {
    if (this.state.failed) {
      return (
        <Screen>
          <div role="alert" className="space-y-4">
            <h1 className="text-xl font-black">{t("页面加载失败")}</h1>
            <p>{t("请检查网络后刷新页面。如果有未保存提示，请先返回首页处理。")}</p>
            <Button onClick={() => window.location.reload()}>{t("刷新页面")}</Button>
            <Link to="/" className="ml-4 font-bold text-brand-dark underline">{t("返回首页")}</Link>
          </div>
        </Screen>
      );
    }
    return this.props.children;
  }
}

export function RouteContent({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <RouteErrorBoundary pathname={pathname}>
      <Suspense fallback={<Screen><p role="status">{t("正在加载页面…")}</p></Screen>}>
        {children}
      </Suspense>
    </RouteErrorBoundary>
  );
}
