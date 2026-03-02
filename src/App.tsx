import { AppProviders } from './app/providers/AppProviders';
import { AppRouter } from './app/router';
import { ErrorBoundary } from './shared/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </ErrorBoundary>
  );
}

export default App;
