import { Provider } from 'react-redux';
import { ThemeProvider } from '@/theme/theme-provider';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import store from './redux/store';
import Layout from './layout';
import TodoApp from './pages';
import AuthPage from './pages/auth';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import { ErrorBoundary } from './components/errors/ErrorBoundary';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: RootState) => state.auth.user);
  return user ? <>{children}</> : <Navigate to="/auth" />;
}

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <TodoApp />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </Layout>
          </Router>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;