import { Calculator } from './features/Calculator/Calculator';
import { SettingsMenu } from './components/SettingsMenu/SettingsMenu';

function App() {
  return (
    <main className="app-shell">
      <SettingsMenu />
      <Calculator />
    </main>
  );
}

export default App;
