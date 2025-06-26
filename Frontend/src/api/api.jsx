import instance from "./instance";

export const gen_user = async (data) => {
  return await instance.post('/api/user', data)
}

export const search_user = async (data) => {
  return await instance.get(`/api/search?email=${data.email}`, data)
}

export const old_message = async (data) => {
  return await instance.get(`/api/message?rec_id=${data.rec_id}&page=1`, data)
}

export const own_profile = async (data) => {
  return await instance.get(`/api/get-user`, data)
}


export const get_user = async (user_id) => {
  return await instance.get(`/api/get-users?user_id=${user_id}`, user_id)
}

export const send_requ = async (user_id) => {
  return await instance.post(`/api/create-req?rec_id=${user_id}`, user_id)
}


export const user_req = async (data) => {
  return await instance.get(`/api/get-req`, data)
}


export const req_acp = async (data) => {
  return await instance.post(`/api/accept-req`, data)
}


export const my_fri = async (data) => {
  return await instance.get(`/api/my-fri`, data)
}