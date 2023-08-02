import { createContext, useContext, useState, useEffect } from "react";
import { useLocation, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import moment from "moment";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['token', 'user']);
  const [user, setUser] = useState(cookies.user);
  const [token, setToken] = useState(cookies.token);
  const [loginTime, setLoginTime] = useState(moment(new Date(), 'DD MMMM YYYY hh:mm:ssA'));
  const [logoutTime, setLogoutTime] = useState(moment(new Date(), 'DD MMMM YYYY hh:mm:ssA'));


  const handleLogin = (user, token) => {
    // Set the user and token cookies
    setCookie('user', user, { path: '/' });
    setCookie('token', token, { path: '/' });
    // Set the user and token states
    setUser(user);
    setToken(token);
    setLoginTime(moment(new Date(), 'DD MMMM YYYY hh:mm:ssA'));
  };

  const handleLogout = () => {
    // Remove the user and token cookies
    removeCookie('user', { path: '/' });
    removeCookie('token', { path: '/' });
    // Set the user and token states to null
    setUser(null);
    setToken(null);
    let loggedOut = moment(new Date(), 'DD MMMM YYYY hh:mm:ssA');
    setLogoutTime(loggedOut);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, loginTime, setLoginTime, logoutTime, setLogoutTime, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const RequireAuth = () => {
  const { user, token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      console.log("not authenticated!");
      window.location.href = "/auth/signin";
    } else {
      if (user) {
        if (user.Role === "Tester" && window.location.href.includes("application")) {
          console.log("unauthorized access");
          navigate("/dashboard");
        }
      }
    }
  }, []);

  return <Outlet />;
};
