VITE_API_HOST=https://mfzznc3aac4ed2sjkrvm2ctqje0iukdd.lambda-url.eu-west-2.on.aws
npm run build
aws s3 sync dist/ s3://pharo-ui/ --delete