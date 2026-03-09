import { Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Learn from './pages/Learn';
import AssetDetail from './pages/AssetDetail';
import AccountTypeSelect from './pages/AccountTypeSelect';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/asset/:id" element={<AssetDetail />} />
      <Route path="/learn" element={<Learn />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/account-type" element={<AccountTypeSelect />} />
    </Routes>
  );
};

export default App;
