
## jenkins 发布 docker 服务


```shell script
# 先定义镜像和版本信息
DOCKERNAME='cloudspiderTest'
REPOSITORIES='cloudspider/test'
TAG=`date +%Y%m%d-%H%M%S`

# 删除原来的容器
CONTAINER_ID=`docker ps | grep "${DOCKERNAME}" | awk '{print $1}'`
if [ -n "$CONTAINER_ID" ]; then
    docker stop $CONTAINER_ID
    docker rm $CONTAINER_ID
else #如果容器启动时失败了，就需要docker ps -a才能找到那个容器
    CONTAINER_ID=`docker ps -a | grep "${DOCKERNAME}" | awk '{print $1}'`
    if [ -n "$CONTAINER_ID" ]; then  # 如果是第一次在这台机器上拉取运行容器，那么docker ps -a也是找不到这个容器的
        docker rm $CONTAINER_ID
    fi
fi

# 删除原来的镜像
IMAGE_ID=`sudo docker images | grep ${REPOSITORIES} | awk '{print $3}'`
if [ -n "${IMAGE_ID}" ];then
    docker rmi ${IMAGE_ID}
fi

# dockerfile 构建镜像并启动容器
docker build -f dockerfile -t ${REPOSITORIES}:${TAG} .
docker run -itd --name=${DOCKERNAME} -p 8081:80 -v /opt/docker-logs/${DOCKERNAME}:/opt/platform/logs ${REPOSITORIES}:${TAG}
```



## jenkins 停止指定服务进程

```shell script
# 先定义需要查找的进程
SERVERNAME='servername.jar'
# 查找删除
pid=$(ps -ef | grep ${SERVERNAME} | grep -v grep | awk '{print $2}')
if [ -n "$pid" ]
then
   kill -9 $pid
fi
```
