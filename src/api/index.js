import axios from 'axios';

const baseUri = 'https://farmreport.afshltd.com/api/';

const getAxiosInstance = () => {
  // const token = localStorage.getItem('amoAdmin');
  const requestHeader = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
    // Authorization: `Bearer ${token}`
  };

  return axios.create({
    baseURL: baseUri,
    headers: requestHeader
  });
};

export const loginUser = async (data) => getAxiosInstance().post(`admin_login.php`, data);

export const registerUser = async (data) => getAxiosInstance().post(`add_admin.php`, data);

export const authAdmin = async (data) => getAxiosInstance().post(`auth_admin.php`, data);
