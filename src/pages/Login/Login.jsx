import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.scss";
import "react-toastify/dist/ReactToastify.css";

import Loader from "../../components/UI/Loader";
import { useDispatch, useSelector } from "react-redux";
import { auTh } from "../../store/reducers/auth";
import { ref, update } from "firebase/database";
import { db } from "../../firebase";

import { Context } from "../../context";

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [userDirty, setUserDirty] = useState({ email: false, password: false });
  const [userError, setUserError] = useState({
    email: "Поле email не может быть пустым",
    password: "Поле пароль не может быть пустым",
  });
  const dispatch = useDispatch();
  const auth = useSelector((store) => store.auth);
  const [formValid, setFormValid] = useState(false);
  const { isLoading } = useContext(Context);

  useEffect(() => {
    if (userError.email || userError.password) {
      setFormValid(false);
    } else {
      setFormValid(true);
    }
  }, [userError]);

  function login() {
    dispatch(auTh({ user, type: "signInWithPassword" })).then((res) =>
      update(ref(db, "users/" + res.payload.localId), res.payload),
    );
  }

  function emailHandler(e) {
    setUser({ ...user, email: e.target.value });
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(e.target.value).toLowerCase())) {
      setUserError({ ...userError, email: "Некоректный email" });
    } else {
      setUserError({ ...userError, email: "" });
    }
  }
  function passwordHandler(e) {
    setUser({ ...user, password: e.target.value });
    if (e.target.value.length < 6 || e.target.value.length > 12) {
      setUserError({
        ...userError,
        password: "Пароль должен быть не меньше 6 и не больше 12 символов",
      });
      if (!e.target.value) {
        setUserError({
          ...userError,
          password: "Поле пароль не может быть пустым",
        });
      }
    } else {
      setUserError({ ...userError, password: "" });
    }
  }
  function blurHandler(e) {
    switch (e.target.type) {
      case "email":
        setUserDirty({ ...userDirty, email: true });
        break;
      case "password":
        setUserDirty({ ...userDirty, password: true });
        break;
    }
  }
  return (
    !isLoading && (
      <div className="login">
        <div className="login__top">
          <h1>Вход</h1>
          <p>
            Нет аккаунта? <Link to="/signup">Создать аккаунт</Link>
          </p>
        </div>
        <form className="login-form">
          <div className="login-form__body">
            {userDirty.email && userError.email && (
              <div style={{ color: "red", marginBottom: "10px" }}>
                {userError.email}
              </div>
            )}
            <input
              onBlur={(e) => blurHandler(e)}
              value={user.email}
              onChange={(e) => emailHandler(e)}
              type="email"
              placeholder="Введите Email "
            />
            {userDirty.password && userError.password && (
              <div style={{ color: "red", marginBottom: "10px" }}>
                {userError.password}
              </div>
            )}

            <input
              onBlur={(e) => blurHandler(e)}
              value={user.password}
              onChange={(e) => passwordHandler(e)}
              type="password"
              placeholder="Введите пароль"
            />
          </div>
          {auth.loading ? (
            <Loader />
          ) : (
            <div className="login-form__btn">
              <button type="submit" disabled={!formValid} onClick={login}>
                Войти
              </button>
            </div>
          )}
        </form>
      </div>
    )
  );
};

export default Login;
