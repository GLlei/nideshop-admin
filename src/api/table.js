import request from '@/utils/request'

// 认证列表
export function getList(params) {
  return request({
    url: '/admin/user',
    method: 'get',
    params
  })
}

// 订单列表
export function getOrderList(params) {
  return request({
    url: '/admin/order',
    method: 'get',
    params
  })
}

// 审核认证
export function checkAttestation(params) {
  return request({
    url: '/admin/info/check-attestation',
    method: 'POST',
    data: {
      sid: params.sid,
      status: params.status
    }
  })
}

// 体现列表
export function getCashList(params) {
  return request({
    url: '/admin/goods',
    method: 'get',
    params
  })
}

// 人工体现
export function checkCash(params) {
  return request({
    url: '/admin/order/check-cash',
    method: 'POST',
    data: {
      id: params.id,
      sid: params.sid,
      status: params.status
    }
  })
}



// 分类列表
export function getCategoryList(params) {
  return request({
    url: '/admin/category',
    method: 'get',
    params
  })
}

// 商品列表
export function getGoodsList(params) {
  return request({
    url: '/admin/goods',
    method: 'get',
    params
  })
}

// 商品添加
export function addGoods(data) {
  return request({
    url: '/admin/goods/add',
    method: 'post',
    data: data
  })
}

// 商品修改
export function upadteGoods(data) {
  return request({
    url: '/admin/goods/update',
    method: 'post',
    data: data
  })
}

// 商品属性修改
export function updateGoodsSale(data) {
  return request({
    url: '/admin/goods/updateSale',
    method: 'post',
    data: data
  })
}


// 商品删除
export function removeGoods(data) {
  return request({
    url: '/admin/goods/add',
    method: 'post',
    data: data
  })
}

// 点击发货
export function doDeliver(data) {
  return request({
    url: '/admin/order/deliver',
    method: 'post',
    data: data
  })
}

// 分类列表
export function getChannelList(params) {
  return request({
    url: '/admin/category/channel',
    method: 'get',
    params
  })
}


// 商铺列表
export function getShopList(params) {
  return request({
    url: '/admin/shop',
    method: 'get',
    params
  })
}

// 商铺添加
export function addShop(data) {
  return request({
    url: '/admin/shop/add',
    method: 'post',
    data: data
  })
}

// 商铺修改
export function upadteShop(data) {
  return request({
    url: '/admin/shop/update',
    method: 'post',
    data: data
  })
}