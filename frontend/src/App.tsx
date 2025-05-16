import { useState, useEffect, useContext } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { useActions } from './hooks/useActions';
import { useTypedSelector } from './hooks/useTypedSelector';
import { useDebounce } from './hooks/useDebounce';

import AuthProvider, { AuthContext } from './context/AuthContext';
import PrivateRoute from './services/PrivateRoute';

import Home from './pages/Home/Home';
import Olympiads from './pages/Olympiads/Olympiads';
import News from './pages/News/News';
// import Discounts from './pages/Discounts/Discounts';
import FaqPage from './pages/FaqPage/FaqPage';
import PaymentDelivery from './pages/PaymentDelivery/PaymentDelivery';
import Courses from './pages/Courses/Courses';
// import About from './pages/About/About';
import CorporateTraining from './pages/CorporateTraining/CorporateTraining';
// import TaxDeduction from './pages/TaxDeduction/TaxDeduction';
// import CreativeCompetition from './pages/CreativeCompetition/CreativeCompetition';
import CourseDetails from './pages/CourseDetails/CourseDetails';
// import ArticlesPublication from './pages/ArticlesPublication/ArticlesPublication';
import PublishedMaterials from './pages/PublishedMaterials/PublishedMaterials';
import Publications from './pages/Publications/Publications';
import PublicationDetails from './pages/PublicationDetails/PublicationDetails';
import Provisions from './pages/Provisions/Provisions';
import ProvisionCompetition from './pages/ProvisionCompetition/ProvisionCompetition';
import PublicOffer from './pages/PublicOffer/PublicOffer';
import Policy from './pages/Policy/Policy';
import NewsDetails from './pages/NewsDetails/NewsDetails';
import DocumentDetails from './pages/DocumentDetails/DocumentDetails';

import CabProfile from './pages/CabProfile/CabProfile';
import CabIssue from './pages/CabIssue/CabIssue';
import CabDocuments from './pages/CabDocuments/CabDocuments';
import CabCheck from './pages/CabCheck/CabCheck';
import CabWallet from './pages/CabWallet/CabWallet';
import CabCourses from './pages/CabCourses/CabCourses';

import Header from './components/Header/Header';
import ModalComponent from './components/ModalComponent/ModalComponent';
import ModalAuth from './components/ModalAuth/ModalAuth';
import ModalPasswordReset from './components/ModalPasswordReset/ModalPasswordReset';
import Footer from './components/Footer/Footer';

import styles from './App.module.sass';

function App() {
  const { setWindowSize } = useActions();
  const location = useLocation();
  const [isDocumentDetails, setIsDocumentDetails] = useState(location.pathname.startsWith('/document-details/'));
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isNoScroll = useTypedSelector((state) => state.mainReducer.isNoScroll);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] = useState(false);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { login, isAuthenticated, loading } = authContext;

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const params = new URLSearchParams(location.search);
      const tokenParam = params.get('token');
      const passwordResetParam = params.get('password_reset_token');
      const refParam = params.get('ref');
      if (tokenParam) {
        console.log('Token:', tokenParam);

        const data = { token: tokenParam };

        const registerUser = async () => {
          try {
            const responseToken = await fetch(`${apiBaseUrl}/api/v1/common/csrf`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (!responseToken.ok) {
              throw new Error('Failed to fetch token');
            }

            const dataToken = await responseToken.json();

            const response = await fetch(`${apiBaseUrl}/api/v1/auth/confirm_registration`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': dataToken.csrf_token
              },
              body: JSON.stringify(data),
            });

            if (response.ok) {
              const responseData = await response.json();
              await login(responseData.email, 'password');
              window.location.reload();
            } else {
              console.error('Ошибка при отправке формы');
            }
          } catch (error) {
            console.error('Ошибка сети:', error);
          }
        };

        registerUser();
      }
      if (passwordResetParam) {
        const data = { token: passwordResetParam };

        const validateTokenResetPassword = async () => {
          try {
            const responseToken = await fetch(`${apiBaseUrl}/api/v1/common/csrf`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (!responseToken.ok) {
              throw new Error('Failed to fetch token');
            }

            const dataToken = await responseToken.json();

            const response = await fetch(`${apiBaseUrl}/api/v1/auth/password_reset/validate_token/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': dataToken.csrf_token
              },
              body: JSON.stringify(data),
            });

            if (response.ok) {
              const responseData = await response.json();
              console.log(responseData);
              console.log('OK!');
              localStorage.setItem('passwordResetToken', passwordResetParam);
              setIsPasswordResetModalOpen(true)
            } else {
              console.error('Ошибка при отправке формы');
            }
          } catch (error) {
            console.error('Ошибка сети:', error);
          }
        };

        validateTokenResetPassword();
      }
      if (refParam) {
        localStorage.setItem('refId', refParam);

      }
    }
  }, [location, isAuthenticated, loading, login]);

  useEffect(() => {
    const handleWindowResize = async (_event: Event) => {
      getWindowSize();
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsDocumentDetails(location.pathname.startsWith('/document-details/'));
  }, [pathname]);

  const getWindowSize = useDebounce(() => {
    const { innerWidth, innerHeight } = window;
    setWindowSize({ innerWidth, innerHeight });
  }, 5);

  useEffect(() => {
    if (location.state?.showAlert) {
      setIsAuthModalOpen(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);

  return (
    <AuthProvider>
      <div className={`${styles.wrapper} ${isNoScroll ? styles.no_scroll : ''}`}>

        {!isDocumentDetails && (
          <>
            <Header openFirstModal={() => setIsAuthModalOpen(true)} />
            <ModalComponent
              isOpen={isAuthModalOpen}
              onRequestClose={() => setIsAuthModalOpen(false)}
              content={<ModalAuth />}
              customClassName=''
            />
            <ModalComponent
              isOpen={isPasswordResetModalOpen}
              onRequestClose={() => setIsPasswordResetModalOpen(false)}
              content={<ModalPasswordReset />}
              customClassName=''
            />
          </>
        )}

        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/olympiads" element={<Olympiads />} />
          <Route path="/news" element={<News />} />
          {/* <Route path="/discounts" element={<Discounts />} /> */}
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/payment-delivery" element={<PaymentDelivery />} />
          <Route path="/courses" element={<Courses setModalOpen={setIsAuthModalOpen} />} />
          {/* <Route path="/about" element={<About />} /> */}
          <Route path="/corporate-training" element={<CorporateTraining />} />
          {/* <Route path="/tax-deduction" element={<TaxDeduction />} /> */}
          {/* <Route path="/creative-competition" element={<CreativeCompetition />} /> */}
          {/* <Route path="/articles-publication" element={<ArticlesPublication />} /> */}
          <Route path="/published-materials" element={<PublishedMaterials />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/provisions" element={<Provisions />} />
          <Route path="/provision-competition" element={<ProvisionCompetition />} />
          <Route path="/public-offer" element={<PublicOffer />} />
          <Route path="/policy" element={<Policy />} />

          <Route path="/course-details/:id" element={<CourseDetails setModalOpen={setIsAuthModalOpen} />} />
          <Route path="/publication-details/:id" element={<PublicationDetails />} />
          <Route path="/news-details/:id" element={<NewsDetails />} />
          <Route path="/document-details/:id" element={<DocumentDetails />} />

          <Route path="/cab-profile" element={<PrivateRoute component={CabProfile} />} />
          <Route path="/cab-issue" element={<PrivateRoute component={CabIssue} />} />
          <Route path="/cab-documents" element={<PrivateRoute component={CabDocuments} />} />
          <Route path="/cab-check" element={<PrivateRoute component={CabCheck} />} />
          <Route path="/cab-wallet" element={<PrivateRoute component={CabWallet} />} />
          <Route path="/cab-courses" element={<PrivateRoute component={CabCourses} />} />

          <Route path="*" element={<Home />} />
        </Routes>

        {!isDocumentDetails && <Footer setModalOpen={setIsAuthModalOpen} />}

      </div>
    </AuthProvider>
  );
}

export default App;
