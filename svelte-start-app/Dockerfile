FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .
# 앱을 빌드합니다.
RUN npm run build
 
 
# 앱 실행을 위한 명령어를 지정합니다.
CMD ["npm", "run", "start", "--", "--host", "floread.store"]