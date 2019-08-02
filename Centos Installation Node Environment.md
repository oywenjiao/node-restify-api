# nodejs 环境安装

## 一、安装node最新版本

### 1.下载node安装包到指定位置,这里以<code>/usr/local/src</code>为例
~~~ node
wget https://npm.taobao.org/mirrors/node/v11.0.0/node-v11.0.0.tar.gz
~~~

### 2.解压安装包
~~~
tar -xvf node-v11.0.0.tar.gz
~~~

### 3.进入目录并安装插件
~~~
cd node-v11.0.0
sudo yum install gcc gcc-c++
~~~

### 4.进行默认配置并编译
~~~
./configure --prefix=/data/apps/node
make
~~~

### 5.开始安装
~~~
sudo make install
~~~

### 6.添加环境变量
新增文件<code>vim /etc/profile.d/node.sh</code>
~~~
export PATH=$PATH:/data/apps/node/bin
~~~
加载文件<code>source /etc/profile.d/node.sh</code>

## 二、nginx配置nodejs的反向代理
~~~ bash
upstream nodejs {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    server_name www.penguu.com penguu.com;
    access_log /var/log/nginx/test.log;
    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host  $http_host;
        proxy_set_header X-Nginx-Proxy true;
        proxy_set_header Connection "";
        proxy_pass      http://nodejs;
    }
}
~~~

## 三、运行环境利器PM2的安装及使用

### 1.安装
~~~
npm install pm2 -g
~~~
参考链接 [https://pm2.io/doc/zh/runtime/guide/installation/](http://)
参考链接 [https://pm2.io/doc/zh/runtime/guide/process-management/](http://)
参考链接 http://pm2.keymetrics.io/docs/usage/cluster-mode/

## 2.常用命令
~~~ bash
#启动命令
pm2 start app.js				        #启动app.js应用程序
pm2 start app.js -i 4			        #cluster mode 模式启动4个app.js的应用实例,4个应用程序会自动进行负载均衡
pm2 start app.js --name="api"	        #启动应用程序并命名为 "api"
pm2 start app.js --watch		        #当文件变化时自动重启应用
pm2 start app.js --name="api" --watch	#启动程序并命名为 "api",且监听文件改动时自动重启应用

#常规操作命令
pm2 list 				#列表 PM2 启动的所有的应用程序
pm2 monit 				#显示每个应用程序的CPU和内存占用情况
pm2 show [app-name] 	#显示应用程序的所有信息
pm2 logs [app-name] 	#显示指定应用程序的日志
pm2 scale api 10 		#把名字叫api的应用扩展到10个实例

# 停止或删除命令
pm2 stop all 	#停止所有的应用程序
pm2 stop 0 		#停止 id为 0的指定应用程序
pm2 delete all 	#关闭并删除所有应用
pm2 delete 0 	#删除指定应用 id 0

#重启命令
pm2 restart all 		#重启所有应用
pm2 reload all 			#重启 cluster mode下的所有应用
pm2 reset [app-name] 	#重置重启数量
~~~







