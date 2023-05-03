terraform {
  backend "gcs" {
    bucket = "pine-terraform-backend-state"
    prefix = "core-service/ops/jobs/prod"
  }
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
  required_version = ">= 1.3"
}

provider "google" {
  project = local.project
  region  = local.location
}

locals {
  project      = "pinedefi"
  location     = "us-central1"
  env          = "prod"
  job_location = "us-central1"
}
