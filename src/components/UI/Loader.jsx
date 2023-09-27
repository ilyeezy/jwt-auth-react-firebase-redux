import cs from "./Loader.module.css";
const Loader = () => {
  return (
    <div className={cs.blockLoader}>
      <span className={cs.loader}></span>
    </div>
  );
};

export default Loader;
