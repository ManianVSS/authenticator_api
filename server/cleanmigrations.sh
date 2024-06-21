#!/bin/bash

timestamp=$(date +%F-%H:%M)
mkdir -p data/dbbackup/$timestamp/migrations

mv authenticator/migrations data/dbbackup/$timestamp/migrations/api