import { useEffect, useState } from "react";
import Loader from "../../components/UI/Loader";
import "./profile.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  addPhoto,
  getUserById,
  handleInput,
  removePhoto,
  saveChanges,
} from "../../store/reducers/user";

const Profile = () => {
  const [change, setChange] = useState(false);

  const [editMenuPhoto, setEditMenuPhoto] = useState(false);
  const [img, setImg] = useState(null);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  function uploadPhoto(e) {
    dispatch(addPhoto(e.target.files[0]));
    setImg(e.target.files[0]);
    setEditMenuPhoto(false);
  }

  function deletePhoto() {
    dispatch(removePhoto());
    dispatch(getUserById());
    setEditMenuPhoto(false);
  }
  function save() {
    dispatch(saveChanges());
    setChange(false);
    setImg(null);
  }
  function changeProfile() {
    setChange(true);
  }
  useEffect(() => {
    dispatch(getUserById());
  }, []);

  return (
    <div className="profile">
      <div className="profile__container">
        {user.loading ? (
          <Loader />
        ) : (
          <div className="profile__body">
            <div className="profile__img">
              {img && <button onClick={save}>Сохранить</button>}
              {user.loadingPhoto ? (
                <Loader />
              ) : (
                <img
                  src={
                    user.userInfo.imgUrl
                      ? user.userInfo.imgUrl
                      : user.defaultImg
                  }
                  alt="avatar"
                  onClick={() => setEditMenuPhoto(!editMenuPhoto)}
                />
              )}

              <input
                onChange={(e) => uploadPhoto(e)}
                name="photo"
                id="photo"
                alt="Изменить фото"
                type="file"
              />

              <div className="profile__img-edit">
                <span onClick={() => setEditMenuPhoto(!editMenuPhoto)}>
                  &#9998; Edit
                </span>
                {editMenuPhoto && (
                  <div className="profile__img-menu">
                    <label onClick={deletePhoto} htmlFor="">
                      Remove photo
                    </label>
                    <label htmlFor="photo">Upload photo</label>
                  </div>
                )}
              </div>
            </div>

            <div className="info">
              <div className="info__body">
                <div className="info__body-email info__body-item">
                  <label htmlFor="Name" name="Name">
                    Name
                  </label>

                  {change ? (
                    <input
                      onChange={(e) =>
                        dispatch(
                          handleInput({
                            value: e.target.value,
                            key: "nickname",
                          }),
                        )
                      }
                      value={user.userInfo.nickname}
                      type="text"
                      id="Name"
                    />
                  ) : (
                    <p>{user.userInfo.nickname}</p>
                  )}
                </div>
                <div className="info__body-email info__body-item">
                  <label htmlFor="email" name="email">
                    Email
                  </label>

                  {change ? (
                    <input
                      value={user.userInfo.email}
                      onChange={(e) =>
                        dispatch(
                          handleInput({
                            value: e.target.value,
                            key: "email",
                          }),
                        )
                      }
                      type="email"
                      id="email"
                    />
                  ) : (
                    <p>{user.userInfo && user.userInfo.email}</p>
                  )}
                </div>
                <div className="info__body-phone info__body-item">
                  <label htmlFor="phone" name="phone">
                    Phone Number
                  </label>

                  {change ? (
                    <input
                      value={user.userInfo.phoneNumber}
                      onChange={(e) =>
                        dispatch(
                          handleInput({
                            value: e.target.value,
                            key: "phoneNumber",
                          }),
                        )
                      }
                      type="tel"
                      id="phone"
                    />
                  ) : (
                    <p>{user.userInfo && user.userInfo.phoneNumber}</p>
                  )}
                </div>
                <div className="info__body-about info__body-item">
                  <label htmlFor="about" name="about">
                    About you
                  </label>

                  {change ? (
                    <textarea
                      value={user.userInfo.description}
                      onChange={(e) =>
                        dispatch(
                          handleInput({
                            value: e.target.value,
                            key: "description",
                          }),
                        )
                      }
                      id="about"
                    />
                  ) : (
                    <p>{user.userInfo && user.userInfo.description}</p>
                  )}
                </div>
              </div>
              <div className="info__btn">
                <button onClick={change ? save : changeProfile}>
                  {change ? "Сохранить" : "Изменить"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
