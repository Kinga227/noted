import { useNavigate } from 'react-router-dom';

export function useMenuBar() {
  const navigate = useNavigate();

  const navigateToToDo = () => {
    navigate('/todos');
  };

  const navigateToTimetable = () => {
    navigate('/timetable');
  };

  const navigateToExams = () => {
    navigate('/exams');
  };

  const navigateToGrades = () => {
    navigate('/grades');
  };

  const navigateToStudy = () => {
    navigate('/study');
  };

  return {
    navigateToToDo,
    navigateToTimetable,
    navigateToExams,
    navigateToGrades,
    navigateToStudy,
  };
}
