FROM node:20.5.1-slim
RUN apt-get update && apt-get install -y curl gnupg
USER node
WORKDIR /home/node/app
CMD [".docker/start.sh"]
