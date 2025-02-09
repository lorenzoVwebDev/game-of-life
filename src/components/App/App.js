import { Footer, GitRepositoryHeader} from '../common'
import Table from '../Table/Table.js'

function App() {
  return (
    <div className="app-wrapper">
      <GitRepositoryHeader/>
      <section className="main-section">
        <Table/>
      </section>
      <Footer/>
    </div>
  );
}

export default App;
