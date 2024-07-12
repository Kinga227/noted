import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuth } from '../hooks/AuthContext';
import { useMenuBar } from '../hooks/useMenuBar';

export default function MenuBar() {
  const { handleLogout } = useLogout();
  const { logout } = useAuth();
  const { navigateToToDo, navigateToTimetable, navigateToExams, navigateToGrades, navigateToStudy } = useMenuBar();
  const location = useLocation();

  const handleLogoutClick = async () => {
    await logout();
    await handleLogout();
  };

  return (
    <div className="menubar">
      <h3 className="menu-title">MENU</h3>
      <button
        type="button"
        className={`menu-button ${location.pathname === '/todos' ? 'active-menu-button' : ''}`}
        onClick={location.pathname === '/todos' ? null : navigateToToDo}
      >
        To do
      </button>
      <button
        type="button"
        className={`menu-button ${location.pathname === '/timetable' ? 'active-menu-button' : ''}`}
        onClick={location.pathname === '/timetable' ? null : navigateToTimetable}
      >
        Timetable
      </button>
      <button
        type="button"
        className={`menu-button ${location.pathname === '/exams' ? 'active-menu-button' : ''}`}
        onClick={location.pathname === '/exams' ? null : navigateToExams}
      >
        Exams
      </button>
      <button
        type="button"
        className={`menu-button ${location.pathname === '/grades' ? 'active-menu-button' : ''}`}
        onClick={location.pathname === '/grades' ? null : navigateToGrades}
      >
        Grades
      </button>
      <button
        type="button"
        className={`menu-button ${location.pathname === '/study' ? 'active-menu-button' : ''}`}
        onClick={location.pathname === '/study' ? null : navigateToStudy}
      >
        Study
      </button>
      <button type="button" id="logout-button" className="menu-button" onClick={handleLogoutClick}>
        <FaSignOutAlt />
        Logout
      </button>
    </div>
  );
}
