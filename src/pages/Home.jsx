import { useSelector } from "react-redux";

const Home = () => {
  const user = useSelector((state) => state.user);
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>
        Добро пожаловать {user.userInfo?.nickname && user.userInfo.nickname}
      </h1>
    </div>
  );
};

export default Home;
