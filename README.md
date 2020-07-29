# SURVEY-MARKET-PLACE-DAPP-II-WINTER-2020

![Survey Marketplace Install, Test and Build](https://github.com/GeorgeBrownCollege-Toronto/SURVEY-MARKET-PLACE-DAPP-II-WINTER-2020/workflows/Survey%20Marketplace%20Install,%20Test%20and%20Build/badge.svg?branch=master)

## Generating ssh key for dapp deployment

```bash
$ ssh-keygen -t rsa -b 4096 -C "youremailhere@example.com" -N ""
```

## SSH private key format
If the private key is not in the PEM format, you will see an `Error loading key "(stdin)": invalid format message`.

Use `ssh-keygen -p -f path/to/your/key -m pem` to convert your key file to PEM, but be sure to make a backup of the file first. 

- Public key (extension with `.pub`) ()
- Private key   (deployment secret)

## Build docker image

```bash
docker build -t survey-dapp .
```
## Run docker image locally

```bash
$ docker run -p 8000:5000 --rm survey-dapp:latest
```
