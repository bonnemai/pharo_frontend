name=dashboard
docker stop $name
docker rm $name
docker build -t $name .
docker run --name $name -p 3001:80 $name