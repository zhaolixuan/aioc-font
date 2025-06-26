# 认证配置说明

## 概述
本项目已将用户名和密码从代码中移出，改为使用外部配置文件管理。

## 配置文件位置
- 开发环境：`config/auth.config.js`
- 生产环境：`public/auth-config.json`

## 修改方法

### 开发环境
修改 `config/auth.config.js` 文件中的值：
```javascript
module.exports = {
  DEFAULT_USERNAME: 'your_username',
  DEFAULT_PASSWORD: 'your_password'
}
```

### 生产环境（打包后）
修改 `public/auth-config.json` 文件中的值：
```json
{
  "username": "your_username",
  "password": "your_password"
}
```

## 注意事项
1. 修改配置文件后需要重新启动应用
2. 生产环境中，`public/auth-config.json` 文件会被复制到 `dist` 目录
3. 如果配置文件加载失败，系统会使用默认值（admin/admin123）
4. 请确保配置文件中的用户名和密码正确

## 安全建议
- 生产环境中建议使用更复杂的密码
- 定期更换密码
- 确保配置文件有适当的访问权限 