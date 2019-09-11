import {
  LOGIN_ERROR,
  // FETCH_LOGIN,
  LOGOUT,
  FETCH_USER_DATA,
  PUT_PROFILE_DATA
} from "../../constants/constants";
import api from "../../sevices/userRequests";
import { notification } from "antd";
import moment from "moment";
import "moment/locale/uk";

const putProfileData = user => {
  return {
    type: PUT_PROFILE_DATA,
    payload: user
  };
};
// const putLoginError = error => {
//   return {
//     type: LOGIN_ERROR,
//     payload: error
//   };
// };

const putUserData = payload => {
  return {
    type: FETCH_USER_DATA,
    payload
  };
};

export const Logout = () => {
  localStorage.removeItem("TOKEN");
  localStorage.removeItem("user");
  return {
    type: LOGOUT
  };
};

const fetchUserProfileData = async () =>
  await Promise.all([api.userLoginHistory(1), api.GetUserProfile()]);

export const Registration = (payload, history) => {
  return async dispatch => {
    try {
      await api.Registration(payload);

      notification.success({
        message: "Дякуеммо за регістрацію!"
      });
      history.push("/login");
    } catch (e) {
      console.log("catch", e);
      if (e.response) {
        notification.error({
          message: e.response.statusText,
          description: Object.values(e.response.data)[0]
        });
      } else {
        notification.error({
          message: "Помилка сервера!"
        });
      }
    }
  };
};

export const getUserProfile = payload => {
  return async dispatch => {
    try {
      const userData = await fetchUserProfileData();

      const user = {
        ...userData[1].data,
        wallet: 5000,
        authHistory: userData[0].data.results.map(ipHistory => ({
          ...ipHistory,
          loginDatetime: moment(ipHistory.loginDatetime)
            .locale("uk")
            .format("L")
        }))
      };
      dispatch(putUserData(user));
    } catch (e) {
      console.log("Error in user Profile", e);
      // dispatch(putLoginError(e.data.nonFieldErrors[0]));
    }
  };
};
export const Login = (payload, history) => {
  return async dispatch => {
    try {
      const { data } = await api.login(payload);

      localStorage.setItem("TOKEN", JSON.stringify(data.access));
      localStorage.setItem("TOKENREFRESH", JSON.stringify(data.refresh));

      const userData = await fetchUserProfileData();

      const user = {
        ...userData[1].data,
        wallet: 5000,
        authHistory: userData[0].data.results.map(ipHistory => ({
          ...ipHistory,
          loginDatetime: moment(ipHistory.loginDatetime)
            .locale("uk")
            .format("lll")
        }))
      };

      localStorage.setItem("user", JSON.stringify(user));
      dispatch(putUserData(user));
    } catch (e) {
      console.log("ERROR in CaTch", e);

      notification.error({
        message: Object.values(e.response.data)[0],
        description: "Спробуйте ще раз!"
      });
    }
  };
};

export const editUserPRofile = userData => {
  return async dispatch => {
    try {
      const { data } = await api.editProfileInfo(userData);
      notification.success({
        message: "Профіль оновлено!"
      });

      console.log("prfile", data);
      dispatch(putProfileData(data));
    } catch (e) {
      console.log(e);
      notification.error({
        message: "Помилка сервера!"
      });
    }
  };
};
