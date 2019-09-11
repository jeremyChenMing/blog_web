import { stringify } from 'qs';
import request from '@/utils/request';
// 用户登录
export async function loginUser(params) {
  return request(`/blog/api/login`, {
    method: 'POST',
    body: params,
  });
  // return request(`/blog/login`, {
  //   method: 'POST',
  //   body: params,
  // });
}
// 上传文件
export async function uploadFile(params) {
  return request(`/blog/upload`, {
    method: 'POST',
    body: params,
  });
}





// blog 获取博客列表
export async function getBlogList(params) {
  // return request(`/blog/example?${stringify(params)}`);
  return request(`/blog/articals?${stringify(params)}`);
}

// blog 获取博客详情
export async function getBlogDetail(id, params) {
  // return request(`/blog/details/${id}?${stringify(params)}`);
  return request(`/blog/articals/${id}?${stringify(params)}`);
}
// blog 增加一条博客
export async function addBlog(params) {
  // return request(`/blog/postexam`, {
  //   method: 'POST',
  //   body: params,
  // });
  return request(`/blog/articals`, {
    method: 'POST',
    body: params,
  });
}

// 更新一篇博客文章
export async function updateBlog(params, id) {
  return request(`/blog/articals/${id}`, {
    method:'PUT',
    body: params,
  });
  // return request(`/blog/putexam/${id}`, {
  //   method:'PUT',
  //   body: params,
  // });
}

// 删除一条博客
export async function deleteBlog(id, params) {
  return request(`/blog/articals/${id}`, {
    method: 'DELETE',
    body: params,
  });
  // return request(`/blog/delexam/${id}`, {
  //   method: 'DELETE',
  //   body: params,
  // });
}

// 获取某一用户发表过的文章
export async function getUserArticals(params) {
  // return request(`/blog/artical_list/${id}`);
  return request(`/blog/articals?${stringify(params)}`);
}






// blog 添加注册用户
export async function registerUser(params) {
  return request(`/blog/api/create_user`, {
    method: 'POST',
    body: params,
  });
  // return request(`/blog/create_user`, {
  //   method: 'POST',
  //   body: params,
  // });
}

// blog 获取个人详情
export async function getUserDetail() {
  // return request(`/blog/user_detail/${id}`);
  return request(`/blog/api/user`);
}
// 编辑
export async function updateUser(params) {
  return request(`/blog/api/user`, {
    method: 'PUT',
    body: params,
  });
  // return request(`/blog/user_edit/${id}`, {
  //   method: 'POST',
  //   body: params,
  // });
}


// 创建评论 create_comment
export async function createComments(params) {
  return request(`/blog/comment_info`, {
    method: 'POST',
    body: params,
  });
  // return request(`/blog/create_comment`, {
  //   method: 'POST',
  //   body: params,
  // });
}
// 评论列表
export async function commentList(params) {
  // return request(`/blog/comments?${stringify(params)}`);
  return request(`/blog/comment_info?${stringify(params)}`);
}
// 关于个人的评论列表
export async function commentUser(params) {
  // return request(`/blog/comments_user?${stringify(params)}`);
  return request(`/blog/comment_info?${stringify(params)}`);
}



// 点赞
export async function handleNice(params) {
  return request(`/blog/nice`, {
    method: 'POST',
    body: params,
  });
  // return request(`/blog/handle_nice`, {
  //   method: 'POST',
  //   body: params,
  // });
}
// 获取个人下的点赞过的文章
export async function getUserOfNice(id) {
  return request(`/blog/nice_count/${id}`);
  // return request(`/blog/get_nice/${id}`);
}





// 关注
export async function postFollow(id, params) {
  return request(`/blog/followed/${id}`, {
    method: 'POST',
    body: params,
  });
  // return request(`/blog/follow`, {
  //   method: 'POST',
  //   body: params,
  // });
}
// 获取是否被关注
export async function getFollowed(id, params) {
  return request(`/blog/followed/${id}?${stringify(params)}`);
}


// 获取登录人的粉丝
export async function getUserOfFan(id, params) {
  return request(`/blog/friend/${id}?${stringify(params)}`);
  // return request(`/blog/fans/${id}`);
}

// 获取登录人的关注
export async function getUserOfFollow(id) {
  return request(`/blog/followers/${id}`);
}





// 获取游戏记录
export async function getGameOfList(params) {
  return request(`/blog/record_list?${stringify(params)}`);
}

// 创建游戏记录
export async function createGameRecord(params) {
  return request(`/blog/record`, {
    method: 'POST',
    body: params,
  });
}



















// 练习接口tutorial
export async function getTest(params) {
  return request(`/tutorial/snippets?${stringify(params)}`);
}
export async function getTestDetail(id) {
  return request(`/tutorial/snippets/${id}`);
}
export async function createTest(params) {
  return request(`/tutorial/snippets`, {
    method: 'POST',
    body: params,
  });
}
export async function putTest(id, params) {
  return request(`/tutorial/snippets/${id}`, {
    method: 'PUT',
    body: params,
  });
}
export async function deleteTest(id) {
  return request(`/tutorial/snippets/${id}`, {
    method: 'DELETE',
    body: {},
  });
}

export async function getAPITest(params) {
  return request(`/tutorial/api/test?${stringify(params)}`);
}


