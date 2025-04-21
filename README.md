# icode-fe

icode-fe，快速搭建自己的管理系统。

## 快速开始

其实这个项目直接双击 `index.html` 都能看大部分效果，不过为了更完整体验，
请运行下面的命令：

```bash

# 安装依赖
npm i
# 打开服务
npm start
```

## 部署上线

这个例子中的 amis 等依赖使用外部 cdn，为了稳定请在自己部署的时候将文件下载到本地。


# 端口占用解决
netstat -ano | findstr :9856
taskkill /PID <PID> /F
taskkill /PID 21532 /F
