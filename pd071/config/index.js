// 开发环境
const dev = {
  baseURL: 'http://localhost:3000'
}

// 生产环境
const prod = {
  baseURL: 'https://api.example.com'
}

// 根据环境导出配置
export const {
  baseURL
} = process.env.NODE_ENV === 'development' ? dev : prod 