import React, { Suspense } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../hooks/AuthContext';
import Login from './Login';
import Registration from './Registration';
import ToDos from './todoPage/ToDos';
import Timetable from './timetablePage/Timetable';
import Exams from './examsPage/Exams';
import Grades from './gradesPage/Grades';
import Study from './studyPage/Study';
import '../style.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000,
      refetchInterval: 30000,
    },
  },
});

function PageContainer({ children }) {
  return (
    <Suspense fallback={<p>Loading page</p>}>
      <div className="page-container">{children}</div>
    </Suspense>
  );
}

export default function Root() {
  return (
    <DndProvider backend={HTML5Backend}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route
                path="/login"
                element={
                  <PageContainer>
                    <Login />
                  </PageContainer>
                }
              />
              <Route
                path="/registration"
                element={
                  <PageContainer>
                    <Registration />
                  </PageContainer>
                }
              />
              <Route
                path="/todos"
                element={
                  <PageContainer>
                    <ToDos />
                  </PageContainer>
                }
              />
              <Route
                path="/timetable"
                element={
                  <PageContainer>
                    <Timetable />
                  </PageContainer>
                }
              />
              <Route
                path="/exams"
                element={
                  <PageContainer>
                    <Exams />
                  </PageContainer>
                }
              />
              <Route
                path="/grades"
                element={
                  <PageContainer>
                    <Grades />
                  </PageContainer>
                }
              />
              <Route
                path="/study"
                element={
                  <PageContainer>
                    <Study />
                  </PageContainer>
                }
              />
              <Route
                path="/"
                element={
                  <PageContainer>
                    <ToDos />
                  </PageContainer>
                }
              />
            </Routes>
          </BrowserRouter>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </AuthProvider>
    </DndProvider>
  );
}
