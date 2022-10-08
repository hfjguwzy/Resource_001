import request from './request';
//登录
export function login(parameter) {
  return request({
    method: 'post',
    url: 'login',
    data: parameter,
  });
}
//获取导航列表
export function getmenu() {
  return request({
    method: 'get',
    url: 'menus',
  });
}
// 获取用户列表
export function getuserlist(parameter){
  return request({
    method:'get',
    url:'users',
    params:parameter, //除了get方法使用params，其他三种方法使用data
  })
}
// 改变用户状态
export function userstatechange(parameter){
  return request({
    method:'put',
    url:`users/${parameter.id}/state/${parameter.mg_state}`,
  })
}
// 添加用户
export function adduser(parameter){
  return request({
    method:'post',
    url:'users',
    data:parameter,
  })
}
// 通过id获取用户信息
export function getuserinform(id){
  return request({
    mehthod:'get',
    url:`users/${id}`,
  })
}
// 修改用户信息
export function edituserinform(parameter){
  return request({
    method:'put',
    url:`users/${parameter.id}`,
    data:{
      email:parameter.email,
      mobile:parameter.mobile,
    },
  })
}
// 通过id删除用户
export function removeuser(id){
  return request({
    method:'delete',
    url:`users/${id}`,
  })
}
// 获取角色
export function getrole(){
  return request({
    method:'get',
    url:'roles',
  })
}
// 修改用户角色
export function changerole(userid,selectid){
  return request({
    method:'put',
    url:`users/${userid}/role`,
    data:{
      rid:selectid,
    }
  })
}
// 获取权限列表(树形)
export function getrightslistTree(){
  return request({
    method:'get',
    url:'rights/tree',
  })
}
// 获取权限列表(列表)
export function getrightslistList(){
  return request({
    method:'get',
    url:'rights/list',
  })
}
//通过id删除角色权限
export function removerightbyid(roleid,rightid){
  return request({
    method:'delete',
    url:`roles/ ${roleid}/rights/${rightid}`,
  })
}
// 角色授权
export function setRight(roleid,parameter){
  return request({
    method:'post',
    url:`roles/ ${roleid}/rights/`,
    data:parameter,
  })
}