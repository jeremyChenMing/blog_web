import { stringify } from 'qs';
import request from '@/utils/request';




// 获取批次详情
export async function getListOfDetail(params) {
  return request(`/api/v1/sign/contract-list?${stringify(params)}`);
}


export async function logins(params) {
  return request(`/api/v1/user/login`, {
    method: 'POST',
    body: params,
  });
}
// 直接登录
export async function launchLogin(params) {
  return request(`/api/v1/user/server-company-info`, {
    method: 'POST',
    body: params,
  });
}


// 获取项目详情
export async function getCompany(params) {
  return request(`/api/v1/contract/create-organize`);
}

//确认支付
export async function submitAndPay(params) {
  return request(`/api/v1/company/order-status/${params.uuid}`, {
    method:'PUT',
    body: params.req,
  });
}








// blog 获取博客列表
export async function getBlogList(params) {
  return request(`/blog/example?${stringify(params)}`);
}

// blog 获取博客详情
export async function getBlogDetail(id) {
  return request(`/blog/details/${id}`);
}
// blog 增加一条博客
export async function addBlog(params) {
  return request(`/blog/postexam`, {
    method: 'POST',
    body: params,
  });
}


export async function deleteBlog(id, params) {
  return request(`/blog/delexam/${id}`, {
    method: 'DELETE',
    body: params,
  });
}


//确认支付
export async function updateBlog(params, id) {
  return request(`/blog/putexam/${id}`, {
    method:'PUT',
    body: params,
  });
}



// 获取个人文章列表
export async function getUserArticals(id) {
  return request(`/blog/artical_list/${id}`);
}





// blog 添加注册用户
export async function registerUser(params) {
  return request(`/blog/create_user`, {
    method: 'POST',
    body: params,
  });
}
// 用户登录
export async function loginUser(params) {
  return request(`/blog/login`, {
    method: 'POST',
    body: params,
  });
}

// blog 获取个人详情
export async function getUserDetail(id) {
  return request(`/blog/user_detail/${id}`);
}
// 编辑
export async function updateUser(params, id) {
  return request(`/blog/user_edit/${id}`, {
    method: 'POST',
    body: params,
  });
}

// 上传文件
export async function uploadFile(params) {
  return request(`/blog/upload`, {
    method: 'POST',
    body: params,
  });
}





// 创建评论 create_comment
export async function createComments(params) {
  return request(`/blog/create_comment`, {
    method: 'POST',
    body: params,
  });
}
// 评论列表
export async function commentList(params) {
  return request(`/blog/comments?${stringify(params)}`);
}

// 关于个人的评论列表
export async function commentUser(params) {
  return request(`/blog/comments_user?${stringify(params)}`);
}



// 创建评论 create_comment
export async function handleNice(params) {
  return request(`/blog/handle_nice`, {
    method: 'POST',
    body: params,
  });
}

