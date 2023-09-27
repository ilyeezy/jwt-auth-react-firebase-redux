import { toast } from "react-toastify";

export const errorNotify = (message) => {
  toast.error(message, {
    position: "bottom-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
};
export const successNotify = (message) => {
  toast.success(message, {
    position: "bottom-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
};

export const infoNotify = (message) => {
  toast.info(message, {
    position: "bottom-center",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,

    draggable: true,
    progress: undefined,
    theme: "dark",
  });
};
