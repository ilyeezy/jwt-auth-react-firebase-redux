import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./SignUp.scss";
import "react-toastify/dist/ReactToastify.css";

import Loader from "../../components/UI/Loader";
import { useDispatch, useSelector } from "react-redux";
import { auTh } from "../../store/reducers/auth";
import { db } from "../../firebase";
import { ref, set } from "firebase/database";

const SignUp = () => {
  const dispatch = useDispatch();
  const auth = useSelector((store) => store.auth);
  const [user, setUser] = useState({ email: "", password: "" });

  const [formError, setFormError] = useState({
    emailError: "Поле email не может быть пустым",
    passwordError: "Поле пароль не может быть пустым",
    ConfirmPasswordError: "Поле должно быть заполнено",
  });
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [errorValidation, setErrorValidation] = useState({
    emailValid: false,
    passwordValid: false,
    ConfirmPasswordValid: false,
  });
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    if (
      formError.emailError ||
      formError.passwordError ||
      formError.ConfirmPasswordError
    ) {
      setFormValid(false);
    } else {
      setFormValid(true);
    }
  }, [formError]);

  async function signUp() {
    dispatch(auTh({ user, type: "signUp" })).then(
      (res) =>
        res != undefined &&
        set(ref(db, "users/" + res.payload.localId), res.payload),
    );
  }
  function emailHandler(e) {
    setUser({ ...user, email: e.target.value });
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(e.target.value).toLowerCase())) {
      setFormError({ ...formError, emailError: "Некоректный email" });
    } else {
      setFormError({ ...formError, emailError: "" });
    }
  }
  function passwordHandler(e) {
    setUser({ ...user, password: e.target.value });
    if (e.target.value.length < 6 || e.target.value.length > 12) {
      setFormError({
        ...formError,
        passwordError: "Пароль должен быть не меньше 6 и не больше 12 символов",
      });

      if (!e.target.value) {
        setFormError({
          ...formError,
          passwordError: "Поле пароль не может быть пустым",
        });
      }
    } else {
      setFormError({ ...formError, passwordError: "" });
    }
  }

  function ConfirmPasswordHandler(e) {
    setConfirmPassword(e.target.value);

    if (e.target.value !== user.password) {
      setFormError({
        ...formError,
        ConfirmPasswordError: "Пароли должны совпадать",
      });
      if (!e.target.value) {
        setFormError({
          ...formError,
          ConfirmPasswordError: "Поле пароль не может быть пустым",
        });
      }
    } else {
      setFormError({ ...formError, ConfirmPasswordError: "" });
    }
  }

  function blurHandler(e) {
    switch (e.target.placeholder) {
      case "Введите Email":
        setErrorValidation({ ...errorValidation, emailValid: true });
        break;
      case "Введите пароль":
        setErrorValidation({ ...errorValidation, passwordValid: true });
        break;
      case "Подтвердите пароль":
        setErrorValidation({ ...errorValidation, ConfirmPasswordValid: true });
        break;
    }
  }

  return (
    <div className="signUp">
      <div className="signUp__top">
        <h1>Регистриация</h1>

        <p>
          Уже есть аккаунт? <Link to="/Login">Login</Link>
        </p>
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="form-reg">
        <div className="form-reg__body">
          <p>{errorValidation.emailValid && formError.emailError}</p>
          <input
            onBlur={(e) => blurHandler(e)}
            value={user.email}
            onChange={(e) => emailHandler(e)}
            type="email"
            placeholder="Введите Email"
          />
          <p>{errorValidation.passwordValid && formError.passwordError}</p>
          <input
            onBlur={(e) => blurHandler(e)}
            value={user.password}
            onChange={(e) => passwordHandler(e)}
            type="password"
            placeholder="Введите пароль"
          />
          <p>
            {errorValidation.ConfirmPasswordValid &&
              formError.ConfirmPasswordError}
          </p>
          <input
            onBlur={(e) => blurHandler(e)}
            value={ConfirmPassword}
            type="password"
            onChange={(e) => ConfirmPasswordHandler(e)}
            placeholder="Подтвердите пароль"
          />
        </div>
        {auth.loading ? (
          <Loader></Loader>
        ) : (
          <div className="form-reg__btn">
            <button disabled={!formValid} onClick={signUp}>
              Зарегистрироваться
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default SignUp;
