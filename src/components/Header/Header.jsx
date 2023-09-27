import "./Header.scss";
import { NavLink, useNavigate } from "react-router-dom";

import Cookies from "js-cookie";
const Header = () => {
  const navigate = useNavigate();
  function logOut() {
    Cookies.remove("_AT");
    Cookies.remove("_RT");
    navigate(0);
  }
  return (
    <header className="header">
      <div className="header__body">
        <nav style={{ display: "flex", alignItems: "center" }}>
          {Cookies.get("_RT") ? (
            <ul>
              <li>
                <NavLink to="/">Главня</NavLink>
              </li>
              <li>
                <NavLink to="/profile">Личный кабинет</NavLink>
              </li>
              <li style={{ cursor: "pointer" }} onClick={logOut}>
                Выйти
              </li>
            </ul>
          ) : (
            <ul>
              <li>
                <NavLink to="/">Главня</NavLink>
              </li>
              <li>
                <NavLink to="/login">Войти</NavLink>
              </li>
              <li>
                <NavLink to="/signUp">Зарегистрироваться</NavLink>
              </li>
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
