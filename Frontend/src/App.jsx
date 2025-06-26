import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Following from './pages/Following';
import VideoPlayer from './pages/VideoPlayer';
import VideoSection from './pages/VideoSection';
import Dashboard from './pages/Dashboard';
import User_pro from './components/User_pro';
import View from './pages/View';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const toggleSidebar = () => {
    if (window.innerWidth <= 992) {
      setShowSidebarMobile(!showSidebarMobile);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const closeSidebarMobile = () => {
    setShowSidebarMobile(false);
  };

  return (
    <Router>
      <div className="d-flex flex-column vh-100" data-theme={theme}>
        <Navbar
          theme={theme}
          toggleTheme={toggleTheme}
          toggleSidebar={toggleSidebar}
        />

        <div className="d-flex flex-grow-1 overflow-hidden position-relative">
          {/* Sidebar Overlay for mobile */}
          {showSidebarMobile && (
            <div
              className="sidebar-overlay active"
              onClick={closeSidebarMobile}
            />
          )}
          
          {/* Main content */}
          <div className="flex-grow-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/following" element={<Following />} />
              <Route path="/video/:id" element={<VideoPlayer />} />
              <Route path="/videosection" element={<VideoSection />} />
              <Route path="/liveStream" element={<Dashboard />} />
              <Route path="/profile" element={<User_pro />} />
              <Route path="/view" element={<View />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;