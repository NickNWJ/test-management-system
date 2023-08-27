import { Suspense, lazy, useEffect, useState } from 'react';
import { Navigate, Route, Routes, Switch } from 'react-router-dom';
import { AuthProvider, RequireAuth } from "./context/Auth";

import TestAnalysis from './pages/Dashboard/TestAnalysis';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Loader from './common/Loader';
import TableTwo from './components/TableTwo';
import TableThree from './components/TableThree';
import UserListPage from './pages/Table/UserListPage';
import UserInfo from './pages/Form/UserInfo';
import RequirementListPage from './pages/Table/RequirementListPage';
import RequirementInfo from './pages/Form/RequirementInfo';
import TestPlanListPage from './pages/Table/TestPlanListPage';
import TestPlanInfo from './pages/Form/TestPlanInfo';
import TestCaseListPage from './pages/Table/TestCaseListPage';
import TestCaseInfo from './pages/Form/TestCaseInfo';
import TestDataInfo from './pages/Form/TestDataInfo';
import TestDataListPage from './pages/Table/TestDataListPage';
import TestRunListPage from './pages/Table/TestRunListPage';
import TestRunInfo from './pages/Form/TestRunInfo';
import DefectListPage from './pages/Table/DefectListPage';
import DefectInfo from './pages/Form/DefectInfo';
import ApplicationInfo from './pages/Form/ApplicationInfo';
import ApplicationListPage from './pages/Table/ApplicationListPage';
import NotFoundPage from './pages/NotFound';
import TestReportInfo from './pages/Form/TestReportInfo';
import TestReportListPage from './pages/Table/TestReportListPage';
import TestPlanSchedule from './pages/SchedulePlan/TestPlanSchedule';

const Calendar = lazy(() => import('./pages/Calendar'));
const Chart = lazy(() => import('./pages/Chart'));
const FormElements = lazy(() => import('./pages/Form/FormElements'));
const FormElementsTwo = lazy(() => import('./pages/Form/ApplicationInfo'));
const FormLayout = lazy(() => import('./pages/Form/FormLayout'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const Tables = lazy(() => import('./pages/Tables'));
const Alerts = lazy(() => import('./pages/UiElements/Alerts'));
const Buttons = lazy(() => import('./pages/UiElements/Buttons'));
const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <AuthProvider>
      <Routes>
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route index element={<SignIn />} />

        <Route element={<DefaultLayout scrollTop={scrollTop} setScrollTop={setScrollTop}/>}>
            <Route index element={
              <Suspense fallback={<Loader />}>
                <TestAnalysis />
                <RequireAuth />
                
              </Suspense>
               }
             />
                  <Route
                    path="/calendar"
                    element={
                      <Suspense fallback={<Loader />}>
                        <Calendar />
                        <RequireAuth />
                      </Suspense>
                    }
                  />
            <Route
              path="/dashboard"
              element={
                <Suspense fallback={<Loader />}>
                  <TestAnalysis />
                  <RequireAuth />
                </Suspense>
              }
            />
                  <Route
                    path="/schedule-plans"
                    element={
                      <Suspense fallback={<Loader />}>
                        <TestPlanSchedule />
                        <RequireAuth />
                      </Suspense>
                    }
                  />
            <Route
              path="/chart"
              element={
                <Suspense fallback={<Loader />}>
                  <Chart />
                  <RequireAuth />
                </Suspense>
              }
            />
            <Route
              path="/user-profile"
              element={
                <Suspense fallback={<Loader />}>
                  <Profile />
                  <RequireAuth />
                </Suspense>
              }
            />
                    <Route
                      path="/user/details"
                      element={
                        <Suspense fallback={<Loader />}>
                          <UserInfo />
                          <RequireAuth />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/users"
                      element={
                        <Suspense fallback={<Loader />}>
                          <UserListPage />
                          <RequireAuth />
                        </Suspense>
                      }
                    />
            <Route
              path="/application/details"
              element={
                <Suspense fallback={<Loader />}>
                  <ApplicationInfo />
                  <RequireAuth />
                </Suspense>
              }
            />
            <Route
              path="/applications"
              element={
                <Suspense fallback={<Loader />}>
                  <ApplicationListPage scrollTop={scrollTop}/>
                  <RequireAuth />
                </Suspense>
              }
            />
                    <Route
                      path="/requirements"
                      element={
                        <Suspense fallback={<Loader />}>
                          <RequirementListPage scrollTop={scrollTop}/>
                          <RequireAuth />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/requirement/details"
                      element={
                        <Suspense fallback={<Loader />}>
                          <RequirementInfo />
                          <RequireAuth />
                        </Suspense>
                      }
                    />
            <Route
              path="/test/test-plans"
              element={
                <Suspense fallback={<Loader />}>
                  <TestPlanListPage scrollTop={scrollTop}/>
                  <RequireAuth />
                </Suspense>
              }
            />
            <Route
              path="/test/test-plan/details"
              element={
                <Suspense fallback={<Loader />}>
                  <TestPlanInfo />
                  <RequireAuth />
                </Suspense>
              }
            />
                    <Route
                      path="/test/test-cases"
                      element={
                        <Suspense fallback={<Loader />}>
                          <TestCaseListPage scrollTop={scrollTop}/>
                          <RequireAuth />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/test/test-case/details"
                      element={
                        <Suspense fallback={<Loader />}>
                          <TestCaseInfo />
                          <RequireAuth />
                        </Suspense>
                      }
                    />
            <Route
              path="/test/test-datas"
              element={
                <Suspense fallback={<Loader />}>
                  <TestDataListPage />
                  <RequireAuth />
                </Suspense>
              }
            />
            <Route
              path="/test/test-data/details"
              element={
                <Suspense fallback={<Loader />}>
                  <TestDataInfo />
                  <RequireAuth />
                </Suspense>
              }
            />          
                    <Route
                      path="/test/test-runs"
                      element={
                        <Suspense fallback={<Loader />}>
                          <TestRunListPage scrollTop={scrollTop}/>
                          <RequireAuth />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/test/test-run/details"
                      element={
                        <Suspense fallback={<Loader />}>
                          <TestRunInfo />
                          <RequireAuth />
                        </Suspense>
                      }
                    />  
            <Route
              path="/test/test-reports"
              element={
                <Suspense fallback={<Loader />}>
                  <TestReportListPage scrollTop={scrollTop}/>
                  <RequireAuth />
                </Suspense>
              }
            />
            <Route
              path="/test/test-report/details"
              element={
                <Suspense fallback={<Loader />}>
                  <TestReportInfo />
                  <RequireAuth />
                </Suspense>
              }
            />
                    <Route
                      path="/defects"
                      element={
                        <Suspense fallback={<Loader />}>
                          <DefectListPage scrollTop={scrollTop}/>
                          <RequireAuth />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/defect/details"
                      element={
                        <Suspense fallback={<Loader />}>
                          <DefectInfo />
                          <RequireAuth />
                        </Suspense>
                      }
                    />

            <Route path="*" element={<Navigate to="/not-found" />} />
            <Route
              path="/not-found"
              element={
                <Suspense fallback={<Loader />}>
                  <NotFoundPage />
                  <RequireAuth />
                </Suspense>
              }
            />
            <Route
              path="/forms/form-elements"
              element={
                <Suspense fallback={<Loader />}>
                  <FormElements />
                </Suspense>
              }
            />

            <Route
              path="/forms/form-elements2"
              element={
                <Suspense fallback={<Loader />}>
                  <FormElementsTwo />
                </Suspense>
              }
            />

            <Route
              path="/forms/form-layout"
              element={
                <Suspense fallback={<Loader />}>
                  <FormLayout />
                </Suspense>
              }
            />
            <Route
              path="/settings"
              element={
                <Suspense fallback={<Loader />}>
                  <Settings />
                </Suspense>
              }
            />
            <Route
              path="/settings2"
              element={
                <Suspense fallback={<Loader />}>
                  <Settings />
                </Suspense>
              }
            />
            <Route
              path="/settings3"
              element={
                <Suspense fallback={<Loader />}>
                  <Settings />
                </Suspense>
              }
            />
            <Route
              path="/calendar"
              element={
                <Suspense fallback={<Loader />}>
                  <Calendar />
                </Suspense>
              }
            />
            <Route
              path="/chart"
              element={
                <Suspense fallback={<Loader />}>
                  <Chart />
                </Suspense>
              }
            />
            <Route
              path="/tables"
              element={
                <Suspense fallback={<Loader />}>
                  <Tables />
                </Suspense>
              }
            />
            <Route
              path="/ui/alerts"
              element={
                <Suspense fallback={<Loader />}>
                  <Alerts />
                </Suspense>
              }
            />
            <Route
              path="/ui/buttons"
              element={
                <Suspense fallback={<Loader />}>
                  <Buttons />
                </Suspense>
              }
            />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
