#!/bin/bash

docker run -d --name pequod-registry \
  -v `pwd`:/auth \
  -e "REGISTRY_AUTH=htpasswd" \
  -e "REGISTRY_AUTH_HTPASSWD_REALM=localhost" \
  -e "REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd" \
  -p 5080:5000 \
  registry:2
